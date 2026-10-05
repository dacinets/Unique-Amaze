# Unique Amaze — Bluehost Shared / cPanel Production Deployment Guide

This guide details the complete deployment procedure for **Unique Amaze** on traditional Bluehost shared hosting (cPanel environment) running PHP 8.x and MySQL 8.x / MariaDB.

---

## 1. Directory Architecture

To protect database credentials, SMTP passwords, and API keys, private configuration files and backend storage are stored **above** `public_html`.

```text
/home/yourcpaneluser/
├── private/
│   ├── unique-amaze-config.php        <-- MASTER SECRETS (chmod 600, not web accessible)
│   ├── logs/                          <-- Rotated error and audit logs (chmod 700)
│   │   ├── audit.log
│   │   └── mail.log
│   └── cron/
│       └── cleanup-rate-limits.php    <-- Daily maintenance cron runner
│
└── public_html/                       <-- Web Root (served by Apache / LiteSpeed)
    ├── .htaccess                      <-- HTTPS, security headers, SPA rewrites, API routing
    ├── index.html                     <-- Compiled React SPA entry point
    ├── macbook_pro_mock_up.jpg
    ├── assets/                        <-- Built JS, CSS, and hashed static bundles
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── api/                           <-- PHP 8.x Secure Endpoints
        ├── .htaccess                  <-- Hardens JSON headers and blocks PHP directory listings
        ├── contact.php                <-- Lead capture with honeypot & rate limit
        ├── planner.php                <-- Sage AI Project Planner intake & brief storage
        ├── gemini.php                 <-- Server-side proxy for Google Gemini API
        ├── csrf.php                   <-- Token dispatch
        ├── health.php                 <-- System and database status probe
        └── inc/
            ├── config.php             <-- Safe config loader (pulls from /home/yourcpaneluser/private/)
            ├── db.php                 <-- PDO singleton with UTF8mb4 & prepared statements
            ├── security.php           <-- IP hashing, honeypot validation, rate limiter
            └── smtp.php               <-- Authenticated SSL/TLS socket SMTP client
```

---

## 2. Frontend Production Build

1. Build the production bundle locally or in your CI environment:
   ```bash
   npm run build
   ```
2. The output directory is `dist/`.
3. Upload the contents of `dist/` directly into your Bluehost `public_html/` folder via cPanel File Manager, SFTP, or rsync.
4. Ensure `public_html/.htaccess` is present and active (in cPanel File Manager, enable **Show Hidden Files (dotfiles)**).

---

## 3. Database Setup (Bluehost cPanel MySQL & MariaDB)

Follow these step-by-step instructions to create and configure the MySQL instance on Bluehost:

### Option A: Via cPanel Web GUI (phpMyAdmin) — Recommended for Most Users
1. **Access cPanel**: Log into your Bluehost account dashboard, click **Advanced** or **cPanel** from the left navigation bar.
2. **Create Database & User**:
   - In the **Databases** section, click **MySQL® Database Wizard**.
   - **Step 1: Create A Database**: Name it (e.g., `youruser_uniqueamaze`, where `youruser` is your Bluehost cPanel username prefix). Click *Next Step*.
   - **Step 2: Create Database Users**: Enter username (e.g., `youruser_uamaze_admin`) and generate a strong password (at least 24 characters, mix of uppercase, lowercase, numbers, and symbols). Save this password securely. Click *Create User*.
   - **Step 3: Add User to Database**: Check **ALL PRIVILEGES** and click *Make Changes*.
3. **Import `database/schema.sql` via phpMyAdmin**:
   - Return to the cPanel home screen and click **phpMyAdmin** in the Databases section.
   - On the left sidebar, click your newly created database name (`youruser_uniqueamaze`).
   - Click the **Import** tab on the top menu bar.
   - Under **File to import**, click **Choose File** (or Browse) and select `database/schema.sql` from your project download.
   - Verify character set is set to **utf-8** and format is **SQL**.
   - Scroll down and click **Import** (or **Go**).
4. **Verify Schema Generation**:
   - In phpMyAdmin, verify that the following 5 tables and 2 views are generated in InnoDB format with `utf8mb4_unicode_ci`:
     * `contact_leads` (captures consultation inquiries, market preferences, timeline, and honeypot validation)
     * `planner_submissions` (stores completed 2-minute AI project briefs and intake answers)
     * `api_audit_logs` (security telemetry, execution latency, and error auditing)
     * `ai_usage_counters` (rate limiting per IP hash)
     * `communication_notes` (CRM follow-ups and discovery meeting notes)
     * `v_recent_inquiries` (unified dashboard view for incoming leads)
     * `v_daily_audit_metrics` (daily API health and latency analytics)

### Option B: Via SSH Terminal (For Developers / VPS)
If SSH access is enabled in your Bluehost cPanel:
```bash
# 1. Connect to Bluehost over SSH
ssh youruser@yourdomain.com -p 22

# 2. Upload or copy database/schema.sql to your home directory:
#    /home/youruser/database/schema.sql

# 3. Execute the schema file directly into your database:
mysql -u youruser_uamaze_admin -p youruser_uniqueamaze < /home/youruser/database/schema.sql

# 4. Verify installation via CLI:
mysql -u youruser_uamaze_admin -p youruser_uniqueamaze -e "SHOW FULL TABLES;"
```

---

## 4. Private Configuration Setup

1. In cPanel File Manager, navigate to `/home/yourcpaneluser/private/`.
2. Create a file named `unique-amaze-config.php` (copy from `/private/unique-amaze-config.php.example`).
3. Set file permissions to `0600` (read/write only by your cPanel system user).
4. Populate your configuration values:

```php
<?php
// /home/yourcpaneluser/private/unique-amaze-config.php
return [
    'env' => 'production',
    'app_url' => 'https://uniqueamaze.com',

    // cPanel MySQL Credentials
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'youruser_uniqueamaze',
        'username' => 'youruser_uamaze_admin',
        'password' => 'YOUR_STRONG_DB_PASSWORD_HERE',
        'charset' => 'utf8mb4',
    ],

    // Authenticated SMTP (Direct TLS/SSL, no PHP mail())
    'smtp' => [
        'host' => 'mail.uniqueamaze.com', // or smtp.sendgrid.net, smtp.postmarkapp.com
        'port' => 465,                    // 465 for SSL/TLS, or 587 for STARTTLS
        'encryption' => 'ssl',
        'username' => 'notifications@uniqueamaze.com',
        'password' => 'YOUR_SMTP_PASSWORD_HERE',
        'from_email' => 'notifications@uniqueamaze.com',
        'from_name' => 'Unique Amaze Dispatch',
        'recipient_email' => 'hello@uniqueamaze.com',
        'backup_recipient' => 'leadcapture@uniqueamaze.com',
    ],

    // Google Gemini API Server-Side Key
    'gemini' => [
        'api_key' => 'YOUR_GEMINI_API_KEY_HERE',
        'default_model' => 'gemini-3.8-flash',
        'max_tokens' => 800,
        'temperature' => 0.7,
    ],

    // Anti-Spam & Security
    'security' => [
        'ip_salt' => 'random_64_char_secret_salt_here_change_me',
        'contact_rate_limit_per_hour' => 5,
        'planner_rate_limit_per_hour' => 8,
        'chat_rate_limit_per_hour' => 20,
        'allowed_cors_origins' => [
            'https://uniqueamaze.com',
            'https://www.uniqueamaze.com',
        ],
    ],
];
```

---

## 5. cPanel Cron Jobs Configuration

To purge expired rate-limiting counters, run automated cleanup via cPanel:

1. Open **cPanel** -> **Cron Jobs**.
2. Under **Add New Cron Job**, select **Once Per Day** (`0 3 * * *` - 3:00 AM daily).
3. Command:
   ```bash
   /usr/local/bin/php /home/yourcpaneluser/private/cron/cleanup-rate-limits.php >/dev/null 2>&1
   ```

---

## 6. Verification and Health Check

Once uploaded, verify your deployment by loading:
```text
https://uniqueamaze.com/api/health
```
A healthy system will respond with HTTP 200:
```json
{
  "status": "healthy",
  "database": "connected",
  "php_version": "8.2.x",
  "timestamp": 1774189000
}
```

---

## 7. Troubleshooting & Diagnostics

| Symptom | Probable Cause | Action |
|---|---|---|
| **404 on page reload (e.g., /pricing)** | `.htaccess` missing or `mod_rewrite` disabled | Check that `public_html/.htaccess` was uploaded with dotfiles visible. Verify Bluehost Apache `mod_rewrite` is active. |
| **500 on /api/contact or /api/planner** | Database connection failure | Verify credentials in `/private/unique-amaze-config.php`. Verify MySQL user has permissions on database. Check `private/logs/error.log`. |
| **"Email dispatch failed" warning** | SMTP authentication error or port block | Verify SMTP host, user, and password. Switch between port 465 (SSL) and port 587 (TLS). Bluehost cPanel webmail accounts should use `localhost` or `mail.yourdomain.com`. |
| **Chat responds with offline fallback** | Missing or invalid Gemini API key | Enter your Google Gemini API key in `/private/unique-amaze-config.php`. |
| **File Permission Errors** | Incorrect directory permissions | Set all directories to `755`, all `.php` files to `644`, and the private config file to `600`. |
