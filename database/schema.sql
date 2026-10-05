-- ============================================================================
-- UNIQUE AMAZE — PRODUCTION MySQL & MariaDB SCHEMA DEFINITION
-- File: database/schema.sql
-- Optimized for: Bluehost Shared / VPS cPanel MySQL 8.0+ & MariaDB 10.4+
-- Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci | Storage Engine: InnoDB
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ----------------------------------------------------------------------------
-- TABLE 1: leads (Contact Inquiries & Strategy Call Requests)
-- Compatible with both direct ContactView submissions and Bluehost PHP backend
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lead_uuid` CHAR(36) NOT NULL COMMENT 'UUIDv4 public client reference token',
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `business_name` VARCHAR(150) DEFAULT NULL,
  `website_url` VARCHAR(255) DEFAULT NULL COMMENT 'Honeypot trap: must be empty on valid submissions',
  `market` ENUM('ca', 'mw') NOT NULL DEFAULT 'ca' COMMENT 'ca = Canada (CAD), mw = Malawi (MWK)',
  `service_interest` VARCHAR(120) DEFAULT NULL COMMENT 'e.g. Starter, Business Flagship, AI Concierge, 3D Spatial, Custom',
  `project_tier` VARCHAR(100) DEFAULT NULL,
  `budget_range` VARCHAR(100) DEFAULT NULL,
  `timeline` VARCHAR(100) DEFAULT NULL COMMENT 'e.g. Immediate / ASAP, 2-4 weeks, Flexible',
  `message` TEXT DEFAULT NULL,
  `lead_status` ENUM('new', 'contacted', 'discovery_scheduled', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost', 'archived') NOT NULL DEFAULT 'new',
  `ip_hash` CHAR(64) DEFAULT NULL COMMENT 'Salted SHA-256 hash of client IP; zero raw PII stored',
  `consent_given` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'GDPR / PIPEDA privacy consent confirmation',
  `consent_timestamp` DATETIME DEFAULT NULL,
  `source` VARCHAR(100) NOT NULL DEFAULT 'contact_form_view',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_lead_uuid` (`lead_uuid`),
  KEY `idx_lead_email` (`email`),
  KEY `idx_lead_market` (`market`),
  KEY `idx_lead_status` (`lead_status`),
  KEY `idx_lead_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Captured customer consultation inquiries';

-- ----------------------------------------------------------------------------
-- TABLE 2: planner_submissions (2-Minute AI Project Planner Intakes)
-- Stores client questionnaires, generated project briefs, and scope estimates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `planner_submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_uuid` CHAR(36) NOT NULL COMMENT 'UUIDv4 reference token for zero-reload dispatch confirmation',
  `lead_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'Optional foreign key linkage to leads',
  `client_name` VARCHAR(150) NOT NULL,
  `client_email` VARCHAR(254) NOT NULL,
  `client_phone` VARCHAR(50) DEFAULT NULL,
  `business_name` VARCHAR(150) DEFAULT NULL,
  `market` ENUM('ca', 'mw') NOT NULL DEFAULT 'ca' COMMENT 'ca = Canada/CAD, mw = Malawi/MWK',
  `answers_json` JSON NOT NULL COMMENT 'Structured answers array (goals, scope, visual aesthetic, integrations, timeline)',
  `recommendation_tier` VARCHAR(100) NOT NULL COMMENT 'Starter Website, Business Website, Intelligent Experience, Custom',
  `recommendation_price` VARCHAR(100) NOT NULL COMMENT 'Localized estimate: CAD $ or MWK',
  `recommendation_timeline` VARCHAR(100) NOT NULL COMMENT 'Delivery duration estimate',
  `recommendation_confidence` INT NOT NULL DEFAULT 95 COMMENT 'Algorithmic confidence percentage (0-100)',
  `generated_brief_text` MEDIUMTEXT NOT NULL COMMENT 'Full plain-text formatted project specification brief',
  `status` ENUM('new', 'reviewed', 'contacted', 'scheduled', 'archived') NOT NULL DEFAULT 'new',
  `ip_hash` CHAR(64) DEFAULT NULL COMMENT 'Salted SHA-256 hash',
  `consent_given` TINYINT(1) NOT NULL DEFAULT 1,
  `consent_timestamp` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_planner_uuid` (`submission_uuid`),
  KEY `idx_planner_email` (`client_email`),
  KEY `idx_planner_market` (`market`),
  KEY `idx_planner_status` (`status`),
  KEY `idx_planner_created_at` (`created_at`),
  KEY `idx_planner_lead_id` (`lead_id`),
  CONSTRAINT `fk_planner_lead` FOREIGN KEY (`lead_id`) 
    REFERENCES `leads` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Completed briefs from 2-minute AI planner';

-- ----------------------------------------------------------------------------
-- TABLE 3: audit_events (API Security & Telemetry Audit Log)
-- Tracks all backend endpoint requests, bot traps, and rate limit triggers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_type` VARCHAR(100) NOT NULL COMMENT 'lead_created, brief_generated, rate_limit_exceeded, honeypot_triggered, gemini_call, error',
  `severity` ENUM('info', 'notice', 'warning', 'security', 'error') NOT NULL DEFAULT 'info',
  `ip_hash` CHAR(64) DEFAULT NULL COMMENT 'Salted SHA-256 hash; no raw IP or PII stored',
  `endpoint` VARCHAR(120) NOT NULL COMMENT 'e.g. /api/contact, /api/planner, /api/chat, /api/health',
  `http_method` VARCHAR(10) NOT NULL DEFAULT 'POST',
  `status_code` SMALLINT UNSIGNED NOT NULL DEFAULT 200,
  `details_json` JSON DEFAULT NULL COMMENT 'Sanitized telemetry metadata (sanitized emails, UUIDs, performance metrics)',
  `execution_time_ms` INT UNSIGNED DEFAULT NULL COMMENT 'Execution latency in milliseconds',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_type` (`event_type`),
  KEY `idx_audit_severity` (`severity`),
  KEY `idx_audit_endpoint` (`endpoint`),
  KEY `idx_audit_created_at` (`created_at`),
  KEY `idx_audit_ip_hash` (`ip_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Security telemetry, rate limit tracking, and API audit trail';

-- ----------------------------------------------------------------------------
-- TABLE 4: ai_usage_counters (Rate Limiting Storage)
-- Enforces per-IP daily/hourly limits for AI Concierge and interactive Planner
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ai_usage_counters` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_hash` CHAR(64) NOT NULL,
  `date_bucket` DATE NOT NULL,
  `request_count` INT UNSIGNED NOT NULL DEFAULT 1,
  `last_request_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('ok', 'rate_limited') NOT NULL DEFAULT 'ok',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ip_date` (`ip_hash`, `date_bucket`),
  KEY `idx_date_bucket` (`date_bucket`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Daily rate limiting counters for AI concierge and planner';

-- ----------------------------------------------------------------------------
-- TABLE 5: communication_notes (Studio Internal CRM & Follow-up Logs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `communication_notes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `lead_id` BIGINT UNSIGNED DEFAULT NULL,
  `planner_id` BIGINT UNSIGNED DEFAULT NULL,
  `author` VARCHAR(100) NOT NULL DEFAULT 'Unique Amaze Dispatch',
  `note_type` ENUM('note', 'email_dispatched', 'phone_call', 'discovery_meeting', 'status_change') NOT NULL DEFAULT 'note',
  `content` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comm_lead_id` (`lead_id`),
  KEY `idx_comm_planner_id` (`planner_id`),
  KEY `idx_comm_created_at` (`created_at`),
  CONSTRAINT `fk_comm_lead` FOREIGN KEY (`lead_id`) 
    REFERENCES `leads` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_comm_planner` FOREIGN KEY (`planner_id`) 
    REFERENCES `planner_submissions` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CRM follow-up notes and discovery log';

-- ----------------------------------------------------------------------------
-- ALIAS VIEWS: Seamless Compatibility for Both Naming Conventions
-- ----------------------------------------------------------------------------

-- View alias: contact_leads -> leads
CREATE OR REPLACE VIEW `contact_leads` AS SELECT * FROM `leads`;

-- View alias: api_audit_logs -> audit_events
CREATE OR REPLACE VIEW `api_audit_logs` AS SELECT * FROM `audit_events`;

-- ----------------------------------------------------------------------------
-- CONVENIENCE VIEW: v_recent_inquiries
-- Unified dashboard overview combining contact leads and AI planner briefs
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_recent_inquiries` AS
SELECT 
  'contact_form' AS inquiry_type,
  l.lead_uuid AS reference_code,
  l.name AS client_name,
  l.email AS client_email,
  l.phone AS client_phone,
  l.business_name AS business_name,
  l.market AS market,
  l.project_tier AS package_tier,
  l.budget_range AS budget_or_price,
  l.lead_status AS status,
  l.created_at AS submitted_at
FROM `leads` l
UNION ALL
SELECT 
  'ai_planner' AS inquiry_type,
  p.submission_uuid AS reference_code,
  p.client_name AS client_name,
  p.client_email AS client_email,
  p.client_phone AS client_phone,
  p.business_name AS business_name,
  p.market AS market,
  p.recommendation_tier AS package_tier,
  p.recommendation_price AS budget_or_price,
  p.status AS status,
  p.created_at AS submitted_at
FROM `planner_submissions` p
ORDER BY submitted_at DESC;

-- ----------------------------------------------------------------------------
-- CONVENIENCE VIEW: v_daily_audit_metrics
-- Daily security and API throughput summary
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_daily_audit_metrics` AS
SELECT 
  DATE(created_at) AS log_date,
  endpoint,
  COUNT(*) AS total_calls,
  SUM(CASE WHEN severity IN ('warning', 'security', 'error') THEN 1 ELSE 0 END) AS issue_count,
  AVG(execution_time_ms) AS avg_latency_ms
FROM `audit_events`
GROUP BY DATE(created_at), endpoint
ORDER BY log_date DESC, total_calls DESC;

SET FOREIGN_KEY_CHECKS = 1;
