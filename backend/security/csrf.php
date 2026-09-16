<?php
declare(strict_types=1);

function startSecureSession(): void
{
    ini_set('session.use_strict_mode', '1');

    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443);

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function csrfToken(): string
{
    startSecureSession();
    if (empty($_SESSION['contact_csrf'])) {
        $_SESSION['contact_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['contact_csrf'];
}

function verifyCsrf(string $token): bool
{
    startSecureSession();
    return $token !== '' && isset($_SESSION['contact_csrf'])
        && hash_equals($_SESSION['contact_csrf'], $token);
}
