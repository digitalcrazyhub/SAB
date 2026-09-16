<?php
declare(strict_types=1);

function loadEnvFile(string $file): void
{
    if (!is_readable($file)) {
        return;
    }

    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        if ($value !== '' && (($value[0] ?? '') === '"' || ($value[0] ?? '') === "'")) {
            $value = trim($value, "\"'");
        }
        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . $value);
        }
    }
}

loadEnvFile(dirname(__DIR__, 2) . '/.env');
loadEnvFile(dirname(__DIR__, 3) . '/.env');

function env(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    return $value === false ? $default : $value;
}

function requiredEnv(string $key): string
{
    $value = env($key);
    if ($value === null || $value === '') {
        throw new RuntimeException('Missing required application configuration.');
    }
    return $value;
}

date_default_timezone_set(env('APP_TIMEZONE', 'Asia/Kolkata') ?? 'Asia/Kolkata');

define('APP_ORIGIN', rtrim(requiredEnv('APP_ORIGIN'), '/'));
define('APP_SECRET', requiredEnv('APP_SECRET'));

define('DB_HOST', requiredEnv('DB_HOST'));
define('DB_NAME', requiredEnv('DB_NAME'));
define('DB_USER', requiredEnv('DB_USER'));
define('DB_PASS', env('DB_PASS', '') ?? '');

define('SMTP_HOST', requiredEnv('SMTP_HOST'));
define('SMTP_PORT', (int) (env('SMTP_PORT', '587') ?? '587'));
define('SMTP_ENCRYPTION', strtolower(env('SMTP_ENCRYPTION', 'tls') ?? 'tls'));
define('SMTP_USERNAME', requiredEnv('SMTP_USERNAME'));
define('SMTP_PASSWORD', requiredEnv('SMTP_PASSWORD'));
define('SMTP_FROM_EMAIL', requiredEnv('SMTP_FROM_EMAIL'));
define('SMTP_FROM_NAME', env('SMTP_FROM_NAME', 'Sri Amma Industrial Developers Pvt. Ltd.') ?? 'Sri Amma Industrial Developers Pvt. Ltd.');
define('BUSINESS_EMAIL', requiredEnv('BUSINESS_EMAIL'));
define('BUSINESS_PHONE', env('BUSINESS_PHONE', '') ?? '');
define('WEBSITE_URL', rtrim(env('WEBSITE_URL', APP_ORIGIN) ?? APP_ORIGIN, '/'));

define('RECAPTCHA_SITE_KEY', requiredEnv('RECAPTCHA_SITE_KEY'));
define('RECAPTCHA_SECRET_KEY', requiredEnv('RECAPTCHA_SECRET_KEY'));

define('GOOGLE_SHEET_ID', env('GOOGLE_SHEET_ID', '') ?? '');
define('GOOGLE_SERVICE_ACCOUNT_JSON', env('GOOGLE_SERVICE_ACCOUNT_JSON', '') ?? '');
define('GOOGLE_SHEET_RANGE', env('GOOGLE_SHEET_RANGE', 'Enquiries!A:H') ?? 'Enquiries!A:H');
