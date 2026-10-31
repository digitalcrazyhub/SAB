<?php
/**
 * SRI AMMA BUILDER PVT LTD — CSRF SECURITY MODULE
 * File: /backend/security/csrf.php
 * Session-based Anti-CSRF token generation and validation.
 */

declare(strict_types=1);

namespace SAB\Security;

/**
 * Initialize secure PHP session with strict cookie flags
 */
function startSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443)
        || ((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

    session_set_cookie_params([
        'lifetime' => 7200, // 2 hours
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    @session_start();
}

/**
 * Retrieve or generate a 64-character cryptographic CSRF token
 */
function getCsrfToken(): string
{
    startSession();

    if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return (string)$_SESSION['csrf_token'];
}

/**
 * Validate incoming token against stored session token
 */
function verifyCsrfToken(?string $token): bool
{
    startSession();

    $sessionToken = (string)($_SESSION['csrf_token'] ?? '');
    if ($sessionToken === '' || empty($token)) {
        return false;
    }

    return hash_equals($sessionToken, (string)$token);
}

/**
 * Generate a fresh token for subsequent submissions
 */
function rotateCsrfToken(): string
{
    startSession();
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf_token'];
}
