<?php
/**
 * Configuration Loader for Unique Amaze PHP Endpoints
 * Locates the private configuration file outside public_html.
 */

declare(strict_types=1);

function load_unique_amaze_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $possiblePaths = [
        // 1. Explicit environment variable
        getenv('UNIQUE_AMAZE_CONFIG_PATH') ?: '',
        // 2. Standard Bluehost cPanel: /home/username/private/unique-amaze-config.php
        // (Assuming this file is at /home/username/public_html/api/inc/config.php)
        dirname(__DIR__, 3) . '/private/unique-amaze-config.php',
        // 3. Alternative 1-level up private directory
        dirname(__DIR__, 2) . '/private/unique-amaze-config.php',
        // 4. Project workspace root /private/unique-amaze-config.php
        dirname(__DIR__, 2) . '/../private/unique-amaze-config.php',
    ];

    foreach ($possiblePaths as $path) {
        if (!empty($path) && file_exists($path) && is_readable($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                $config = $loaded;
                return $config;
            }
        }
    }

    // Fallback to environment variables if no config file was found
    $config = [
        'db' => [
            'host'     => getenv('DB_HOST') ?: '127.0.0.1',
            'port'     => (int)(getenv('DB_PORT') ?: 3306),
            'database' => getenv('DB_NAME') ?: 'uniqueamaze',
            'username' => getenv('DB_USER') ?: 'root',
            'password' => getenv('DB_PASS') ?: '',
            'charset'  => 'utf8mb4',
        ],
        'gemini' => [
            'api_key'       => getenv('GEMINI_API_KEY') ?: '',
            'model'         => getenv('GEMINI_MODEL') ?: 'gemini-2.5-flash',
            'timeout_sec'   => 15,
            'max_prompt_len'=> 1000,
            'rate_limit_10m'=> 15,
            'daily_limit'   => 50,
        ],
        'smtp' => [
            'host'       => getenv('SMTP_HOST') ?: 'mail.uniqueamaze.com',
            'port'       => (int)(getenv('SMTP_PORT') ?: 465),
            'encryption' => getenv('SMTP_ENCRYPTION') ?: 'ssl',
            'username'   => getenv('SMTP_USER') ?: 'hello@uniqueamaze.com',
            'password'   => getenv('SMTP_PASS') ?: '',
            'from_email' => getenv('SMTP_FROM_EMAIL') ?: 'hello@uniqueamaze.com',
            'from_name'  => 'Unique Amaze Web Studio',
            'notify_to'  => getenv('NOTIFY_EMAIL') ?: 'hello@uniqueamaze.com',
        ],
        'app' => [
            'name'        => 'Unique Amaze',
            'url'         => getenv('APP_URL') ?: 'https://uniqueamaze.com',
            'environment' => getenv('APP_ENV') ?: 'production',
            'hash_salt'   => getenv('HASH_SALT') ?: 'unique-amaze-production-salt-2026',
            'allowed_origins' => [
                'https://uniqueamaze.com',
                'https://www.uniqueamaze.com',
            ],
        ],
        'security' => [
            'contact_rate_limit_per_hour' => 5,
            'planner_rate_limit_per_hour' => 5,
            'honeypot_field'              => 'website_url',
        ],
    ];

    return $config;
}
