<?php
/**
 * CSRF Token Generator & Validator
 */

declare(strict_types=1);

require_once __DIR__ . '/inc/security.php';

apply_cors_headers();

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'cookie_samesite' => 'Lax',
    ]);
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

send_json_response(200, [
    'csrf_token' => $_SESSION['csrf_token'],
]);
