<?php
declare(strict_types=1);

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/database/database.php';
require_once __DIR__ . '/security/csrf.php';
require_once __DIR__ . '/security/recaptcha.php';
require_once __DIR__ . '/security/rate-limit.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Referrer-Policy: strict-origin-when-cross-origin');

function jsonResponse(bool $success, string $message, int $status = 200): never
{
    http_response_code($status);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

function logError(string $message, Throwable $exception): void
{
    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $line = sprintf(
        "[%s] %s | %s\n",
        (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        $message,
        $exception->getMessage()
    );
    @file_put_contents($dir . '/contact-errors.log', $line, FILE_APPEND | LOCK_EX);
}

function requestOriginAllowed(): bool
{
    $origin = trim($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '') {
        return hash_equals(APP_ORIGIN, rtrim($origin, '/'));
    }

    $referer = trim($_SERVER['HTTP_REFERER'] ?? '');
    if ($referer !== '') {
        $refererOrigin = parse_url($referer, PHP_URL_SCHEME) . '://' . parse_url($referer, PHP_URL_HOST);
        if (($port = parse_url($referer, PHP_URL_PORT)) !== null) {
            $refererOrigin .= ':' . $port;
        }
        return hash_equals(APP_ORIGIN, rtrim($refererOrigin, '/'));
    }

    // Same-origin browsers normally send Origin or Referer. Reject missing provenance
    // for POSTs to avoid making the endpoint a broadly callable cross-site API.
    return false;
}

function cleanText(string $value): string
{
    return trim(preg_replace('/[^\P{C}\r\n\t]/u', '', $value) ?? '');
}

function validName(string $value): bool
{
    return $value !== ''
        && mb_strlen($value) <= 100
        && preg_match("/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u", $value) === 1;
}

function normalizePhone(string $value): ?string
{
    $value = trim($value);
    if (preg_match('/^\+?91[\s-]?([6-9]\d{9})$/', $value, $m) === 1) {
        return '+91' . $m[1];
    }
    if (preg_match('/^([6-9]\d{9})$/', $value, $m) === 1) {
        return '+91' . $m[1];
    }
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        startSecureSession();
        jsonResponse(true, csrfToken());
    } catch (Throwable $e) {
        logError('CSRF initialization failed', $e);
        jsonResponse(false, 'Something went wrong. Please try again later.', 500);
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    jsonResponse(false, 'Method not allowed.', 405);
}

if (!requestOriginAllowed()) {
    jsonResponse(false, 'Invalid submission.', 403);
}

try {
    if (!verifyCsrf((string) ($_POST['csrf_token'] ?? ''))) {
        jsonResponse(false, 'Invalid submission.', 403);
    }

    $website = cleanText((string) ($_POST['website'] ?? ''));
    if ($website !== '') {
        jsonResponse(false, 'Invalid submission.', 400);
    }

    $ip = clientIp();
    $captchaToken = trim((string) ($_POST['g-recaptcha-response'] ?? ''));
    if (!verifyRecaptcha($captchaToken, $ip)) {
        jsonResponse(false, 'Please complete the reCAPTCHA verification.', 400);
    }

    $pdo = db();

    if (rateLimitExceeded($pdo, $ip)) {
        jsonResponse(false, 'Too many requests. Please try again later.', 429);
    }

    $firstName = cleanText((string) ($_POST['firstName'] ?? ''));
    $lastName = cleanText((string) ($_POST['lastName'] ?? ''));
    $phone = normalizePhone((string) ($_POST['phone'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));
    $message = cleanText((string) ($_POST['message'] ?? ''));

    $valid = validName($firstName)
        && validName($lastName)
        && $phone !== null
        && mb_strlen($email) <= 190
        && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
        && mb_strlen($message) >= 10
        && mb_strlen($message) <= 3000;

    if (!$valid) {
        jsonResponse(false, 'Please check the form details and try again.', 400);
    }

    if (preg_match('/(?:\r|\n)(?:to|cc|bcc|subject|content-type)\s*:/i', $email . "\n" . $firstName . "\n" . $lastName) === 1) {
        jsonResponse(false, 'Please check the form details and try again.', 400);
    }

    $bucket = intdiv(time(), 300);
    $submissionHash = hash_hmac(
        'sha256',
        implode('|', [$firstName, $lastName, $phone, strtolower($email), $message, $bucket]),
        APP_SECRET
    );

    $duplicate = $pdo->prepare(
        'SELECT id FROM contact_enquiries WHERE submission_hash = :submission_hash LIMIT 1'
    );
    $duplicate->execute(['submission_hash' => $submissionHash]);
    if ($duplicate->fetchColumn() !== false) {
        jsonResponse(true, 'Thank you! Your enquiry has been submitted successfully.');
    }

    $pdo->beginTransaction();
    try {
        $insert = $pdo->prepare(
            'INSERT INTO contact_enquiries
                (first_name, last_name, phone, email, message, status, submission_hash)
             VALUES
                (:first_name, :last_name, :phone, :email, :message, :status, :submission_hash)'
        );
        $insert->execute([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $phone,
            'email' => $email,
            'message' => $message,
            'status' => 'new',
            'submission_hash' => $submissionHash,
        ]);
        $id = (int) $pdo->lastInsertId();
        recordRateLimitAttempt($pdo, $ip);
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        logError('Database save failed', $e);
        jsonResponse(false, 'Unable to process your enquiry at the moment. Please try again later.', 500);
    }

    require_once __DIR__ . '/mail/mailer.php';
    require_once __DIR__ . '/google/google-sheets.php';

    $lead = [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'name' => $firstName . ' ' . $lastName,
        'phone' => $phone,
        'email' => $email,
        'message' => $message,
    ];

    try {
        sendBusinessLead($lead);
    } catch (Throwable $e) {
        logError('Business lead email failed for enquiry #' . $id, $e);
        jsonResponse(false, 'Unable to process your enquiry at the moment. Please try again later.', 500);
    }

    try {
        sendCustomerConfirmation($lead);
    } catch (Throwable $e) {
        logError('Customer confirmation email failed for enquiry #' . $id, $e);
    }

    try {
        appendToGoogleSheet($lead, $id);
    } catch (Throwable $e) {
        logError('Google Sheets save failed for enquiry #' . $id, $e);
    }

    jsonResponse(true, 'Thank you! Your enquiry has been submitted successfully.');
} catch (Throwable $e) {
    logError('Unhandled contact submission failure', $e);
    jsonResponse(false, 'Something went wrong. Please try again later.', 500);
}
