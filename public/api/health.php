<?php
/**
 * Health Check Endpoint
 * Checks PHP version, extensions, database connectivity, and configuration status.
 */

declare(strict_types=1);

require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/db.php';
require_once __DIR__ . '/inc/security.php';

apply_cors_headers();

$config = load_unique_amaze_config();
$pdo = get_db_connection();

$dbStatus = 'unconfigured';
if (!empty($config['db']['database']) && !empty($config['db']['username'])) {
    $dbStatus = ($pdo !== null) ? 'connected' : 'connection_failed';
}

$geminiStatus = !empty($config['gemini']['api_key']) ? 'configured' : 'unconfigured';
$smtpStatus = !empty($config['smtp']['host']) && !empty($config['smtp']['password']) ? 'configured' : 'unconfigured';

$payload = [
    'status'       => 'ok',
    'studio'       => 'Unique Amaze',
    'version'      => '2.0.0-cpanel-php',
    'runtime'      => 'PHP ' . PHP_VERSION,
    'environment'  => $config['app']['environment'] ?? 'production',
    'database'     => $dbStatus,
    'ai_engine'    => $geminiStatus,
    'smtp_mailer'  => $smtpStatus,
    'capabilities' => [
        'gemini-ai-concierge',
        'interactive-planner',
        'portfolio-telemetry',
        'authenticated-smtp',
        'cpanel-optimized',
    ],
    'timestamp'    => date('c'),
];

send_json_response(200, $payload);
