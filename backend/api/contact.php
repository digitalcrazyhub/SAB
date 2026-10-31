<?php
/**
 * SRI AMMA BUILDER PVT LTD — PRIMARY CONTACT & LEAD INTAKE API
 * File: /backend/api/contact.php
 * Handles GET (CSRF token issuance) and POST (form validation, MySQL storage, email notification).
 */

declare(strict_types=1);

namespace SAB\Api;

// Ensure pure JSON responses by suppressing HTML error display
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Output buffering to prevent unexpected whitespace or headers from breaking JSON
ob_start();

// Load modules
require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/database/database.php';
require_once dirname(__DIR__) . '/security/csrf.php';
require_once dirname(__DIR__) . '/security/rate_limit.php';
require_once dirname(__DIR__) . '/security/recaptcha.php';
require_once dirname(__DIR__) . '/mail/mailer.php';
require_once dirname(__DIR__) . '/google/sheets.php';

use Throwable;
use function SAB\Config\config;
use function SAB\Config\jsonResponse;
use function SAB\Config\logSystemError;
use function SAB\Database\getDb;
use function SAB\Security\startSession;
use function SAB\Security\getCsrfToken;
use function SAB\Security\verifyCsrfToken;
use function SAB\Security\rotateCsrfToken;
use function SAB\Security\checkRateLimit;
use function SAB\Security\verifyRecaptcha;
use function SAB\Mail\sendLeadEmails;
use function SAB\Google\appendLeadToSheet;

// Global Uncaught Exception Handler
set_exception_handler(function (Throwable $e) {
    logSystemError('Uncaught API Exception', $e);
    jsonResponse(
        false,
        'An unexpected server error occurred. Please try again or call us directly at +91 94444 05505.',
        [],
        500
    );
});

// Global Fatal Error Shutdown Handler
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        logSystemError("API Fatal Error: [{$error['type']}] {$error['message']} in {$error['file']}:{$error['line']}");
        jsonResponse(
            false,
            'An unexpected server error occurred. Please try again or call us directly at +91 94444 05505.',
            [],
            500
        );
    }
});

// Security & Browser Headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Restrictive CORS Origin Configuration
$appCfg = config()['app'];
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
$allowedOrigins = [
    $appCfg['url'],
    'https://sriammabuilders.com',
    'https://www.sriammabuilders.com',
    'http://localhost',
    'http://127.0.0.1',
];

$isLocalOrigin = (bool)preg_match('#^https?://(?:localhost|127\.0\.0\.1)(?::\d+)?$#i', $origin);
if ($origin !== '' && (in_array(rtrim($origin, '/'), $allowedOrigins, true) || $isLocalOrigin)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With, X-CSRF-Token');
    header('Access-Control-Allow-Credentials: true');
}

// Handle CORS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ==============================================================================
// 1. GET REQUEST: Serve fresh CSRF Token to Frontend
// ==============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = getCsrfToken();
    jsonResponse(true, $token, [
        'csrf_token' => $token,
    ]);
}

// Enforce POST method for submissions
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST, OPTIONS');
    jsonResponse(false, 'Method not allowed. Only POST is accepted for submissions.', [], 405);
}

// ==============================================================================
// 2. PARSE POST INPUT
// ==============================================================================
$contentType = (string)($_SERVER['CONTENT_TYPE'] ?? '');
$data = [];

if (str_contains($contentType, 'application/json')) {
    $rawInput = (string)file_get_contents('php://input');
    $decoded = json_decode($rawInput, true);
    if (!is_array($decoded)) {
        jsonResponse(false, 'Invalid JSON payload received.', [], 400);
    }
    $data = $decoded;
} else {
    $data = $_POST;
}

// Client IP & User Agent
$clientIp = (string)($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
$userAgent = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');

// ==============================================================================
// 3. CSRF TOKEN VALIDATION
// ==============================================================================
$submittedCsrf = (string)($data['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
if (!verifyCsrfToken($submittedCsrf)) {
    rotateCsrfToken();
    jsonResponse(
        false,
        'Your security session expired or is invalid. Please refresh the page and try again.',
        [],
        403
    );
}

// ==============================================================================
// 4. HONEYPOT SPAM VALIDATION
// ==============================================================================
$website = trim((string)($data['website'] ?? ''));
if ($website !== '') {
    // Return stealth success without recording spam or sending emails
    jsonResponse(true, 'Thank you! Your enquiry has been submitted successfully.');
}

// ==============================================================================
// 5. DATABASE CONNECTION & RATE LIMITING
// ==============================================================================
try {
    $pdo = getDb();
} catch (Throwable $e) {
    logSystemError('Database connection unavailable for enquiry submission', $e);
    jsonResponse(
        false,
        'We encountered a database error while recording your enquiry. Please call us directly at +91 94444 05505.',
        [],
        500
    );
}

if (!checkRateLimit($pdo, $clientIp, 'contact')) {
    jsonResponse(
        false,
        'Too many enquiries submitted from this network. Please wait a few minutes or call us directly at +91 94444 05505.',
        [],
        429
    );
}

// ==============================================================================
// 6. GOOGLE reCAPTCHA v3 VERIFICATION
// ==============================================================================
$recaptchaToken = (string)($data['recaptcha_token'] ?? $data['g-recaptcha-response'] ?? '');
$recaptchaResult = verifyRecaptcha($recaptchaToken, $clientIp);
if (!$recaptchaResult['success']) {
    jsonResponse(
        false,
        $recaptchaResult['error'] ?? 'Security verification failed. Please refresh and try again.',
        [],
        400
    );
}

// ==============================================================================
// 7. INPUT VALIDATION & SANITIZATION
// ==============================================================================
$errors = [];

// Name handling (Supports separate firstName + lastName OR unified name)
$firstName = trim((string)($data['firstName'] ?? ''));
$lastName = trim((string)($data['lastName'] ?? ''));
$fullName = trim((string)($data['name'] ?? ''));

if ($firstName !== '' || $lastName !== '') {
    if ($firstName === '') {
        $errors['firstName'] = 'First name is required.';
    } elseif (mb_strlen($firstName) < 2) {
        $errors['firstName'] = 'First name must contain at least 2 characters.';
    } elseif (mb_strlen($firstName) > 100) {
        $errors['firstName'] = 'First name must not exceed 100 characters.';
    } elseif (!preg_match("/^[A-Za-zÀ-ÿ\s.'-]+$/u", $firstName)) {
        $errors['firstName'] = 'First name contains invalid characters.';
    }

    if ($lastName === '') {
        $errors['lastName'] = 'Last name is required.';
    } elseif (mb_strlen($lastName) > 100) {
        $errors['lastName'] = 'Last name must not exceed 100 characters.';
    }

    $sanitizedFirstName = strip_tags($firstName);
    $sanitizedLastName = strip_tags($lastName);
    $sanitizedFullName = trim($sanitizedFirstName . ' ' . $sanitizedLastName);
} else {
    if ($fullName === '') {
        $errors['name'] = 'Please enter your name.';
    } elseif (mb_strlen($fullName) < 2) {
        $errors['name'] = 'Name must be at least 2 characters.';
    } elseif (mb_strlen($fullName) > 150) {
        $errors['name'] = 'Name must not exceed 150 characters.';
    } elseif (!preg_match("/^[A-Za-zÀ-ÿ\s.'-]+$/u", $fullName)) {
        $errors['name'] = 'Name contains invalid characters.';
    }

    $sanitizedFullName = strip_tags($fullName);
    $parts = explode(' ', $sanitizedFullName, 2);
    $sanitizedFirstName = $parts[0] ?? $sanitizedFullName;
    $sanitizedLastName = $parts[1] ?? '';
}

// Phone validation (Accepts 10 digits or +91 format)
$phoneRaw = trim((string)($data['phone'] ?? ''));
$normalizedPhone = preg_replace('/[\s()\-]/', '', $phoneRaw);
$phoneDigits = '';

if (str_starts_with($normalizedPhone, '+91') && strlen($normalizedPhone) === 13) {
    $phoneDigits = substr($normalizedPhone, 3);
} elseif (str_starts_with($normalizedPhone, '91') && strlen($normalizedPhone) === 12) {
    $phoneDigits = substr($normalizedPhone, 2);
} else {
    $phoneDigits = $normalizedPhone;
}

if ($phoneRaw === '') {
    $errors['phone'] = 'Please enter your phone number.';
} elseif (!preg_match('/^[6-9][0-9]{9}$/', $phoneDigits)) {
    $errors['phone'] = 'Enter a valid 10-digit mobile number.';
}
$sanitizedPhone = '+91' . $phoneDigits;

// Email validation
$email = trim((string)($data['email'] ?? ''));
if ($email === '') {
    $errors['email'] = 'Please provide your email address.';
} elseif (strlen($email) > 190) {
    $errors['email'] = 'Email must not exceed 190 characters.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Enter a valid email address.';
}
$sanitizedEmail = strtolower($email);

// Service Category
$service = trim((string)($data['service'] ?? ''));
$sanitizedService = ($service === '' || $service === 'Select a service')
    ? 'Other'
    : substr(strip_tags($service), 0, 100);

// Location
$location = trim((string)($data['location'] ?? ''));
$sanitizedLocation = $location !== '' ? substr(strip_tags($location), 0, 150) : 'Chennai';

// Message (10 to 3000 chars)
$message = trim((string)($data['message'] ?? ''));
if ($message === '') {
    $errors['message'] = 'Please describe your project requirements.';
} elseif (mb_strlen($message) < 10) {
    $errors['message'] = 'Message must be at least 10 characters.';
} elseif (mb_strlen($message) > 3000) {
    $errors['message'] = 'Message must not exceed 3000 characters.';
}
$sanitizedMessage = strip_tags($message);

// Form source
$source = trim((string)($data['source'] ?? 'contact_page'));
$sanitizedSource = in_array($source, ['contact_page', 'homepage_contact'], true) ? $source : 'contact_page';

// Header injection prevention
if (preg_match('/[\r\n]/', $sanitizedFullName . $sanitizedEmail . $sanitizedPhone)) {
    $errors['general'] = 'Invalid characters detected in input fields.';
}

if (!empty($errors)) {
    $firstError = reset($errors) ?: 'Please fill in all required fields accurately.';
    jsonResponse(false, $firstError, ['errors' => $errors], 422);
}

// ==============================================================================
// 8. PERSIST LEAD TO MYSQL (Authoritative Source of Truth)
// ==============================================================================
$leadRefId = sprintf('SAB-%s-%s', date('Ymd'), strtoupper(bin2hex(random_bytes(3))));
$now = date('Y-m-d H:i:s');

try {
    $insert = $pdo->prepare('
        INSERT INTO `leads` (
            `lead_id`, `source`, `name`, `first_name`, `last_name`, `email`,
            `phone`, `service`, `location`, `message`, `ip_address`, `user_agent`,
            `processing_status`, `google_sheet_status`, `company_email_status`,
            `customer_email_status`, `last_attempt_at`, `created_at`
        ) VALUES (
            :lead_id, :source, :name, :first_name, :last_name, :email,
            :phone, :service, :location, :message, :ip_address, :user_agent,
            "processing", "pending", "pending", "pending", :last_attempt_at, :created_at
        )
    ');

    $insert->execute([
        ':lead_id' => $leadRefId,
        ':source' => $sanitizedSource,
        ':name' => $sanitizedFullName,
        ':first_name' => $sanitizedFirstName,
        ':last_name' => $sanitizedLastName,
        ':email' => $sanitizedEmail,
        ':phone' => $sanitizedPhone,
        ':service' => $sanitizedService,
        ':location' => $sanitizedLocation,
        ':message' => $sanitizedMessage,
        ':ip_address' => substr($clientIp, 0, 45),
        ':user_agent' => substr($userAgent, 0, 500),
        ':last_attempt_at' => $now,
        ':created_at' => $now,
    ]);

    $insertedDbId = (int)$pdo->lastInsertId();
} catch (Throwable $dbErr) {
    logSystemError('Failed to save lead record into MySQL', $dbErr);
    jsonResponse(
        false,
        'We encountered a database error while recording your enquiry. Please call us directly at +91 94444 05505.',
        [],
        500
    );
}

// Rotate CSRF token for next submission
rotateCsrfToken();

// Prepare lead record for email and external integrations
$leadRecord = [
    'id' => $insertedDbId,
    'lead_id' => $leadRefId,
    'name' => $sanitizedFullName,
    'first_name' => $sanitizedFirstName,
    'last_name' => $sanitizedLastName,
    'email' => $sanitizedEmail,
    'phone' => $sanitizedPhone,
    'service' => $sanitizedService,
    'location' => $sanitizedLocation,
    'message' => $sanitizedMessage,
    'source' => $sanitizedSource,
    'created_at' => $now,
];

// ==============================================================================
// 9. EMAIL DISPATCH & EXTERNAL INTEGRATIONS
// ==============================================================================
$mailResults = sendLeadEmails($leadRecord);
$sheetResults = appendLeadToSheet($leadRecord);

// Update database lead status flags
$companyEmailStatus = $mailResults['company_mail'] ? 'success' : 'failed';
$customerEmailStatus = $mailResults['customer_mail'] ? 'success' : 'failed';
$googleSheetStatus = $sheetResults['status'] ?? 'skipped';
$processingStatus = ($companyEmailStatus === 'success' || $customerEmailStatus === 'success')
    ? 'completed'
    : 'completed'; // Lead is safely in DB

try {
    $updateStmt = $pdo->prepare('
        UPDATE `leads` SET
            `company_email_status` = :company_email,
            `customer_email_status` = :customer_email,
            `google_sheet_status` = :sheet_status,
            `processing_status` = :proc_status,
            `last_attempt_at` = :now
        WHERE `id` = :id
    ');
    $updateStmt->execute([
        ':company_email' => $companyEmailStatus,
        ':customer_email' => $customerEmailStatus,
        ':sheet_status' => $googleSheetStatus,
        ':proc_status' => $processingStatus,
        ':now' => date('Y-m-d H:i:s'),
        ':id' => $insertedDbId,
    ]);
} catch (Throwable $updateErr) {
    logSystemError('Failed to update lead status flags in MySQL', $updateErr);
}

// ==============================================================================
// 10. RETURN CLEAN SUCCESS RESPONSE
// ==============================================================================
jsonResponse(
    true,
    'Thank you! Your enquiry has been submitted successfully.',
    [
        'lead_id' => $leadRefId,
    ],
    200
);
