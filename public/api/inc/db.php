<?php
/**
 * Database Connection Wrapper (PDO MySQL)
 * Enforces UTF-8, strict types, and safe error masking.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

function get_db_connection(): ?PDO
{
    static $pdo = null;
    static $attempted = false;

    if ($pdo !== null) {
        return $pdo;
    }

    if ($attempted) {
        return null;
    }
    $attempted = true;

    $config = load_unique_amaze_config();
    $db = $config['db'] ?? [];

    $host = $db['host'] ?? '127.0.0.1';
    $port = (int)($db['port'] ?? 3306);
    $database = $db['database'] ?? '';
    $username = $db['username'] ?? '';
    $password = $db['password'] ?? '';
    $charset = $db['charset'] ?? 'utf8mb4';

    if (empty($database) || empty($username)) {
        return null;
    }

    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset={$charset}";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE {$charset}_unicode_ci",
        PDO::ATTR_TIMEOUT            => 5,
    ];

    try {
        $pdo = new PDO($dsn, $username, $password, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log locally if possible, but NEVER output raw credentials or DSN
        error_log('Database connection failed: ' . $e->getMessage());
        return null;
    }
}
