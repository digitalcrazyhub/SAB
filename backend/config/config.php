<?php
/**
 * SRI AMMA BUILDER PVT LTD — MASTER APPLICATION CONFIGURATION
 * File: /backend/config/config.php
 * Standalone modular environment loader and configuration registry.
 */

declare(strict_types=1);

namespace SAB\Config;

// Prevent multiple declarations
if (defined('SAB_CONFIG_LOADED')) {
    return;
}
define('SAB_CONFIG_LOADED', true);

// Suppress HTML display of PHP errors so API responses are always pure JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

/**
 * Safe, quote-aware .env file parser
 */
function loadEnvFile(string $filePath): void
{
    if (!is_file($filePath) || !is_readable($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }

        $key = trim(substr($line, 0, $pos));
        $val = trim(substr($line, $pos + 1));

        // Strip matching outer quotes
        if (
            (str_starts_with($val, '"') && str_ends_with($val, '"')) ||
            (str_starts_with($val, "'") && str_ends_with($val, "'"))
        ) {
            $val = substr($val, 1, -1);
        }

        // Populate environment variables
        if (!array_key_exists($key, $_ENV) && !array_key_exists($key, $_SERVER)) {
            putenv("{$key}={$val}");
            $_ENV[$key] = $val;
            $_SERVER[$key] = $val;
        }
    }
}

// Load .env from backend directory or project root
loadEnvFile(dirname(__DIR__) . '/.env');
loadEnvFile(dirname(__DIR__, 2) . '/.env');

/**
 * Safe environment getter with type casting
 */
function env(string $key, mixed $default = null): mixed
{
    $val = getenv($key);
    if ($val === false) {
        $val = $_ENV[$key] ?? $_SERVER[$key] ?? $default;
    }

    if ($val === null) {
        return $default;
    }

    return match (strtolower((string)$val)) {
        'true', '(true)' => true,
        'false', '(false)' => false,
        'null', '(null)' => null,
        'empty', '(empty)' => '',
        default => $val,
    };
}

/**
 * Retrieve complete application configuration array
 */
function config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }

    $timezone = (string)env('TIMEZONE', 'Asia/Kolkata');
    date_default_timezone_set($timezone);

    $cfg = [
        'app' => [
            'name' => 'Sri Amma Builder Pvt Ltd',
            'env' => (string)env('APP_ENV', 'production'),
            'debug' => (bool)env('APP_DEBUG', false),
            'url' => rtrim((string)env('APP_URL', 'http://localhost/SAB'), '/'),
            'timezone' => $timezone,
        ],
        'db' => [
            'host' => (string)env('DB_HOST', 'localhost'),
            'port' => (int)env('DB_PORT', 3306),
            'name' => (string)env('DB_NAME', 'testmail_db'),
            'user' => (string)env('DB_USER', 'root'),
            'pass' => (string)env('DB_PASSWORD', ''),
            'charset' => (string)env('DB_CHARSET', 'utf8mb4'),
        ],
        'mail' => [
            'smtp_host' => (string)env('SMTP_HOST', 'smtp.gmail.com'),
            'smtp_port' => (int)env('SMTP_PORT', 465),
            'smtp_user' => (string)env('SMTP_USERNAME', ''),
            'smtp_pass' => (string)env('SMTP_PASSWORD', ''),
            'smtp_encryption' => strtolower((string)env('SMTP_ENCRYPTION', 'ssl')), // 'ssl' or 'tls'
            'from_email' => (string)env('MAIL_FROM', 'digitalcrazyhub2020@gmail.com'),
            'from_name' => (string)env('MAIL_FROM_NAME', 'Sri Amma Builder Pvt Ltd'),
            'company_email' => (string)env('COMPANY_EMAIL', 'mkrishsab@gmail.com'),
            'company_name' => (string)env('COMPANY_NAME', 'Sri Amma Builder Pvt Ltd Management'),
            'timeout' => 8,
        ],
        'recaptcha' => [
            'enabled' => (bool)env('RECAPTCHA_ENABLED', false),
            'site_key' => (string)env('RECAPTCHA_SITE_KEY', ''),
            'secret_key' => (string)env('RECAPTCHA_SECRET_KEY', ''),
            'min_score' => (float)env('RECAPTCHA_MIN_SCORE', 0.5),
            'expected_action' => (string)env('RECAPTCHA_EXPECTED_ACTION', 'contact_form'),
            'timeout' => 5,
        ],
        'rate_limit' => [
            'enabled' => true,
            'max_hits' => (int)env('RATE_LIMIT_MAX_HITS', 5),
            'window_seconds' => (int)env('RATE_LIMIT_WINDOW_SECONDS', 600),
        ],
        'google_sheets' => [
            'enabled' => (bool)env('GOOGLE_SHEETS_ENABLED', false),
            'sheet_id' => (string)env('GOOGLE_SHEET_ID', ''),
            'range' => (string)env('GOOGLE_SHEET_RANGE', 'Leads!A:M'),
            'service_account_path' => (string)env('GOOGLE_SERVICE_ACCOUNT_PATH', ''),
        ],
    ];

    return $cfg;
}

/**
 * Standardized JSON response helper (terminates execution cleanly)
 */
function jsonResponse(bool $success, string $message, array $extra = [], int $status = 200): never
{
    // Clean any prior output buffer to prevent corrupting JSON
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');

    $payload = array_merge([
        'success' => $success,
        'message' => $message,
    ], $extra);

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Private system audit and error logger
 */
function logSystemError(string $message, ?\Throwable $exception = null): void
{
    $dir = dirname(__DIR__) . '/logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }

    $timestamp = date('Y-m-d H:i:s');
    $details = $exception !== null
        ? sprintf(" | Exception: %s in %s:%d\nStack Trace: %s", $exception->getMessage(), $exception->getFile(), $exception->getLine(), $exception->getTraceAsString())
        : '';

    $logEntry = "[{$timestamp}] {$message}{$details}\n" . str_repeat('-', 80) . "\n";
    @file_put_contents($dir . '/contact.log', $logEntry, FILE_APPEND | LOCK_EX);
}
