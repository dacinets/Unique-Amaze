-- ============================================================================
-- Unique Amaze — Production MySQL / MariaDB Schema
-- Designed for Bluehost Shared / cPanel MySQL 8.0+ / MariaDB 10.4+
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Table: leads (Contact Form Submissions & Inquiries)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lead_uuid` CHAR(36) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `business_name` VARCHAR(150) DEFAULT NULL,
  `website_url` VARCHAR(255) DEFAULT NULL,
  `market` ENUM('ca', 'mw') NOT NULL DEFAULT 'ca',
  `service_interest` VARCHAR(100) DEFAULT NULL,
  `project_tier` VARCHAR(100) DEFAULT NULL,
  `budget_range` VARCHAR(100) DEFAULT NULL,
  `timeline` VARCHAR(100) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `lead_status` ENUM('new', 'contacted', 'discovery_scheduled', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost', 'archived') NOT NULL DEFAULT 'new',
  `ip_hash` CHAR(64) DEFAULT NULL COMMENT 'SHA-256 with salt; zero PII stored',
  `consent_given` TINYINT(1) NOT NULL DEFAULT 0,
  `consent_timestamp` DATETIME DEFAULT NULL,
  `source` VARCHAR(100) NOT NULL DEFAULT 'contact_form',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_lead_uuid` (`lead_uuid`),
  KEY `idx_lead_email` (`email`),
  KEY `idx_lead_status` (`lead_status`),
  KEY `idx_lead_created` (`created_at`),
  KEY `idx_lead_market` (`market`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Table: planner_submissions (AI Project Planner Submissions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `planner_submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_uuid` CHAR(36) NOT NULL,
  `lead_id` BIGINT UNSIGNED DEFAULT NULL,
  `client_name` VARCHAR(150) NOT NULL,
  `client_email` VARCHAR(254) NOT NULL,
  `client_phone` VARCHAR(50) DEFAULT NULL,
  `business_name` VARCHAR(150) DEFAULT NULL,
  `market` ENUM('ca', 'mw') NOT NULL DEFAULT 'ca',
  `answers_json` JSON NOT NULL COMMENT 'Structured answers to intake questions',
  `recommendation_tier` VARCHAR(100) NOT NULL,
  `recommendation_price` VARCHAR(100) NOT NULL,
  `recommendation_timeline` VARCHAR(100) NOT NULL,
  `recommendation_confidence` INT NOT NULL DEFAULT 95,
  `generated_brief_text` TEXT NOT NULL,
  `status` ENUM('new', 'reviewed', 'contacted', 'scheduled', 'archived') NOT NULL DEFAULT 'new',
  `ip_hash` CHAR(64) DEFAULT NULL,
  `consent_given` TINYINT(1) NOT NULL DEFAULT 1,
  `consent_timestamp` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_planner_uuid` (`submission_uuid`),
  KEY `idx_planner_email` (`client_email`),
  KEY `idx_planner_lead` (`lead_id`),
  KEY `idx_planner_status` (`status`),
  KEY `idx_planner_created` (`created_at`),
  CONSTRAINT `fk_planner_lead` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Table: communication_notes (Follow-up Activity & Discovery Call Logs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `communication_notes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lead_id` BIGINT UNSIGNED DEFAULT NULL,
  `planner_id` BIGINT UNSIGNED DEFAULT NULL,
  `author` VARCHAR(100) NOT NULL DEFAULT 'System',
  `note_type` ENUM('note', 'email_sent', 'call_log', 'meeting_notes', 'status_change') NOT NULL DEFAULT 'note',
  `content` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comm_lead` (`lead_id`),
  KEY `idx_comm_planner` (`planner_id`),
  KEY `idx_comm_created` (`created_at`),
  CONSTRAINT `fk_comm_lead` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comm_planner` FOREIGN KEY (`planner_id`) REFERENCES `planner_submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Table: ai_usage_counters (Per-IP & Daily Rate Limiting for Gemini API)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ai_usage_counters` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_hash` CHAR(64) NOT NULL,
  `date_bucket` DATE NOT NULL,
  `request_count` INT NOT NULL DEFAULT 1,
  `last_request_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('ok', 'rate_limited') NOT NULL DEFAULT 'ok',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ip_date` (`ip_hash`, `date_bucket`),
  KEY `idx_date_bucket` (`date_bucket`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Table: audit_events (Security & System Audit Log; No PII Stored)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_type` VARCHAR(100) NOT NULL COMMENT 'e.g. rate_limit_exceeded, csrf_failure, email_sent, db_error',
  `severity` ENUM('info', 'warning', 'security', 'error') NOT NULL DEFAULT 'info',
  `ip_hash` CHAR(64) DEFAULT NULL,
  `endpoint` VARCHAR(100) NOT NULL,
  `details_json` JSON DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_type` (`event_type`),
  KEY `idx_audit_severity` (`severity`),
  KEY `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
