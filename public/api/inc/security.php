<?php
/**
 * Security, CORS, Rate Limiting, and Validation Helpers
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

function send_json_response(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function apply_cors_headers(): void
{
    $config = load_unique_amaze_config();
    $allowedOrigins = $config['app']['allowed_origins'] ?? [];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!empty($origin)) {
        // Allow configured origins or local development origins
        $isAllowed = in_array($origin, $allowedOrigins, true) ||
            preg_match('/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:[0-9]+)?$/', $origin);

        if ($isAllowed) {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function get_client_ip_hash(): string
{
    $config = load_unique_amaze_config();
    $salt = $config['app']['hash_salt'] ?? 'default-unique-amaze-salt';

    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    // If behind a trusted Cloudflare or reverse proxy, check CF-Connecting-IP
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    }

    return hash_hmac('sha256', $ip, $salt);
}

function check_honeypot(array $input, string $fieldName = 'website_url'): bool
{
    // If the honeypot field is filled out, it's a bot submission
    return !empty($input[$fieldName]);
}

function check_rate_limit(string $action, string $ipHash, int $maxRequests, int $windowSeconds, ?PDO $pdo = null): bool
{
    if ($pdo === null) {
        $pdo = get_db_connection();
    }

    if ($pdo !== null) {
        try {
            $dateBucket = date('Y-m-d');
            $now = date('Y-m-d H:i:s');

            // 1. Check existing record
            $stmt = $pdo->prepare(
                "SELECT request_count, last_request_at, status FROM ai_usage_counters WHERE ip_hash = :ip_hash AND date_bucket = :date_bucket LIMIT 1"
            );
            $stmt->execute([':ip_hash' => $ipHash, ':date_bucket' => $dateBucket]);
            $row = $stmt->fetch();

            if ($row) {
                $count = (int)$row['request_count'];
                $lastRequest = strtotime($row['last_request_at']);

                // If within the active window and count exceeded
                if ($count >= $maxRequests && (time() - $lastRequest) < $windowSeconds) {
                    $upd = $pdo->prepare("UPDATE ai_usage_counters SET status = 'rate_limited' WHERE ip_hash = :ip_hash AND date_bucket = :date_bucket");
                    $upd->execute([':ip_hash' => $ipHash, ':date_bucket' => $dateBucket]);
                    return false;
                }

                // Increment
                $upd = $pdo->prepare(
                    "UPDATE ai_usage_counters SET request_count = request_count + 1, last_request_at = :now WHERE ip_hash = :ip_hash AND date_bucket = :date_bucket"
                );
                $upd->execute([':now' => $now, ':ip_hash' => $ipHash, ':date_bucket' => $dateBucket]);
                return true;
            } else {
                // Insert first record
                $ins = $pdo->prepare(
                    "INSERT INTO ai_usage_counters (ip_hash, date_bucket, request_count, last_request_at, status) VALUES (:ip_hash, :date_bucket, 1, :now, 'ok')"
                );
                $ins->execute([':ip_hash' => $ipHash, ':date_bucket' => $dateBucket, ':now' => $now]);
                return true;
            }
        } catch (Exception $e) {
            error_log('Rate limit DB check error: ' . $e->getMessage());
        }
    }

    // Fallback file-based rate limit if DB is offline or not configured yet
    $cacheDir = sys_get_temp_dir() . '/unique_amaze_ratelimit';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0755, true);
    }

    $file = $cacheDir . '/' . md5($action . '_' . $ipHash) . '.json';
    $data = ['count' => 0, 'first_time' => time()];

    if (file_exists($file)) {
        $content = @file_get_contents($file);
        if ($content) {
            $parsed = json_decode($content, true);
            if (is_array($parsed) && isset($parsed['first_time'])) {
                if (time() - $parsed['first_time'] < $windowSeconds) {
                    $data = $parsed;
                }
            }
        }
    }

    if ($data['count'] >= $maxRequests) {
        return false;
    }

    $data['count']++;
    @file_put_contents($file, json_encode($data));
    return true;
}

function record_audit_event(?PDO $pdo, string $eventType, string $severity, string $endpoint, ?string $ipHash, array $details = []): void
{
    if ($pdo === null) {
        $pdo = get_db_connection();
    }
    if ($pdo === null) {
        return;
    }

    try {
        $stmt = $pdo->prepare(
            "INSERT INTO audit_events (event_type, severity, ip_hash, endpoint, details_json) VALUES (:event_type, :severity, :ip_hash, :endpoint, :details_json)"
        );
        $stmt->execute([
            ':event_type'   => substr($eventType, 0, 100),
            ':severity'     => in_array($severity, ['info', 'warning', 'security', 'error'], true) ? $severity : 'info',
            ':ip_hash'      => $ipHash,
            ':endpoint'     => substr($endpoint, 0, 100),
            ':details_json' => json_encode($details, JSON_UNESCAPED_SLASHES),
        ]);
    } catch (Exception $e) {
        error_log('Failed to log audit event: ' . $e->getMessage());
    }
}

function sanitize_string(?string $val, int $maxLength = 255): string
{
    if ($val === null) return '';
    $trimmed = trim($val);
    $cleaned = strip_tags($trimmed);
    return mb_substr($cleaned, 0, $maxLength, 'UTF-8');
}

function generate_uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // variant RFC 4122
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
