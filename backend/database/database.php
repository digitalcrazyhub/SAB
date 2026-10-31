<?php
/**
 * SRI AMMA BUILDER PVT LTD — DATABASE CONNECTION SERVICE
 * File: /backend/database/database.php
 * Standalone PDO connection manager with auto-initialization for MySQL.
 */

declare(strict_types=1);

namespace SAB\Database;

use PDO;
use PDOException;
use RuntimeException;
use function SAB\Config\config;
use function SAB\Config\logSystemError;

/**
 * Get or initialize persistent PDO connection instance
 */
function getDb(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $cfg = config()['db'];
    if (empty($cfg['name'])) {
        logSystemError('Database configuration error: DB_NAME is missing.');
        throw new RuntimeException('Database configuration is incomplete.');
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $cfg['host'],
        $cfg['port'],
        $cfg['name'],
        $cfg['charset']
    );

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 5,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES '{$cfg['charset']}' COLLATE 'utf8mb4_unicode_ci'",
    ];

    try {
        $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
    } catch (PDOException $e) {
        logSystemError('MySQL Connection Failed', $e);
        throw new RuntimeException('Unable to establish secure database connection.');
    }

    // Auto-verify schema on first run to ensure table readiness
    ensureSchema($pdo);

    return $pdo;
}

/**
 * Ensure `leads` and `rate_limits` tables exist with complete structure
 */
function ensureSchema(PDO $pdo): void
{
    static $verified = false;
    if ($verified) {
        return;
    }

    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `leads` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `lead_id` VARCHAR(32) NOT NULL,
                `source` VARCHAR(50) NOT NULL DEFAULT 'contact_page',
                `name` VARCHAR(150) NOT NULL,
                `first_name` VARCHAR(100) NULL DEFAULT NULL,
                `last_name` VARCHAR(100) NULL DEFAULT NULL,
                `email` VARCHAR(150) NOT NULL,
                `phone` VARCHAR(30) NOT NULL,
                `service` VARCHAR(100) NOT NULL DEFAULT 'Other',
                `location` VARCHAR(150) NULL DEFAULT 'Chennai',
                `message` TEXT NOT NULL,
                `ip_address` VARCHAR(45) NULL DEFAULT NULL,
                `user_agent` TEXT NULL DEFAULT NULL,
                `processing_status` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
                `google_sheet_status` ENUM('pending', 'success', 'failed', 'skipped') NOT NULL DEFAULT 'pending',
                `company_email_status` ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
                `customer_email_status` ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
                `last_attempt_at` DATETIME NULL DEFAULT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                UNIQUE KEY `idx_lead_id` (`lead_id`),
                KEY `idx_created_at` (`created_at`),
                KEY `idx_email` (`email`),
                KEY `idx_phone` (`phone`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `rate_limits` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `ip_address` VARCHAR(45) NOT NULL,
                `endpoint` VARCHAR(50) NOT NULL DEFAULT 'contact',
                `hits` INT UNSIGNED NOT NULL DEFAULT 1,
                `window_start` INT UNSIGNED NOT NULL,
                `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                UNIQUE KEY `idx_ip_endpoint_window` (`ip_address`, `endpoint`, `window_start`),
                KEY `idx_window_cleanup` (`window_start`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        $verified = true;
    } catch (\Throwable $e) {
        logSystemError('Database Schema Verification Warning', $e);
    }
}
