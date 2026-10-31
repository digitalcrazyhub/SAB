-- ==============================================================================
-- SRI AMMA BUILDER PVT LTD — MASTER DATABASE SCHEMA
-- File: /backend/database/schema.sql
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- Storage Engine: InnoDB (Transactional)
-- Compatible with XAMPP MySQL / MariaDB / Hostinger MySQL 8.0+
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- Table structure for `leads`
-- Authoritative persistent storage for all website contact enquiries
-- ------------------------------------------------------------------------------
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
  KEY `idx_phone` (`phone`),
  KEY `idx_source` (`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sri Amma Builder Leads';

-- ------------------------------------------------------------------------------
-- Table structure for `rate_limits`
-- Public endpoint throttling
-- ------------------------------------------------------------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='API Rate Limiting Log';

SET FOREIGN_KEY_CHECKS = 1;
