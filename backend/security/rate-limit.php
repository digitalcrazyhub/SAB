<?php
declare(strict_types=1);

require_once __DIR__ . '/../database/database.php';

function clientIp(): string
{
    // Do not trust X-Forwarded-For on shared hosting unless a trusted proxy is configured.
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function rateLimitExceeded(PDO $pdo, string $ip): bool
{
    $ipHash = hash_hmac('sha256', $ip, APP_SECRET);
    $cutoff = (new DateTimeImmutable('-15 minutes'))->format('Y-m-d H:i:s');

    $cleanup = $pdo->prepare('DELETE FROM contact_rate_limits WHERE created_at < :cutoff');
    $cleanup->execute(['cutoff' => (new DateTimeImmutable('-1 day'))->format('Y-m-d H:i:s')]);

    $query = $pdo->prepare('SELECT COUNT(*) FROM contact_rate_limits WHERE ip_hash = :ip_hash AND created_at >= :cutoff');
    $query->execute(['ip_hash' => $ipHash, 'cutoff' => $cutoff]);

    return (int) $query->fetchColumn() >= 5;
}

function recordRateLimitAttempt(PDO $pdo, string $ip): void
{
    $ipHash = hash_hmac('sha256', $ip, APP_SECRET);
    $query = $pdo->prepare('INSERT INTO contact_rate_limits (ip_hash) VALUES (:ip_hash)');
    $query->execute(['ip_hash' => $ipHash]);
}
