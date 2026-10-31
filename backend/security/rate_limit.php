<?php
/**
 * SRI AMMA BUILDER PVT LTD — RATE LIMIT SECURITY MODULE
 * File: /backend/security/rate_limit.php
 * IP-based sliding window rate limiter backed by MySQL.
 */

declare(strict_types=1);

namespace SAB\Security;

use PDO;
use function SAB\Config\config;
use function SAB\Config\logSystemError;

/**
 * Check if the client IP has exceeded the allowed submission threshold
 */
function checkRateLimit(PDO $pdo, string $ip, string $endpoint = 'contact'): bool
{
    // Localhost exemption for developers during local testing
    if ($ip === '' || $ip === '127.0.0.1' || $ip === '::1') {
        return true;
    }

    $cfg = config()['rate_limit'];
    if (!$cfg['enabled']) {
        return true;
    }

    $maxHits = $cfg['max_hits'];
    $windowSeconds = $cfg['window_seconds'];
    $now = time();
    $windowStart = $now - ($now % $windowSeconds);

    try {
        // Probabilistic cleanup of records older than 24 hours (1-in-20 chance)
        if (random_int(1, 20) === 1) {
            $cleanup = $pdo->prepare('DELETE FROM `rate_limits` WHERE `window_start` < :expiry');
            $cleanup->execute([':expiry' => $now - 86400]);
        }

        // Increment or initialize hit count for this IP in the current window
        $stmt = $pdo->prepare('
            INSERT INTO `rate_limits` (`ip_address`, `endpoint`, `hits`, `window_start`)
            VALUES (:ip, :endpoint, 1, :window_start)
            ON DUPLICATE KEY UPDATE `hits` = `hits` + 1
        ');
        $stmt->execute([
            ':ip' => substr($ip, 0, 45),
            ':endpoint' => $endpoint,
            ':window_start' => $windowStart,
        ]);

        // Query current count
        $query = $pdo->prepare('
            SELECT `hits` FROM `rate_limits`
            WHERE `ip_address` = :ip AND `endpoint` = :endpoint AND `window_start` = :window_start
        ');
        $query->execute([
            ':ip' => substr($ip, 0, 45),
            ':endpoint' => $endpoint,
            ':window_start' => $windowStart,
        ]);

        $currentHits = (int)$query->fetchColumn();
        return $currentHits <= $maxHits;
    } catch (\Throwable $e) {
        logSystemError('Rate limiter warning', $e);
        // Fail-open to avoid blocking genuine customer submissions
        return true;
    }
}
