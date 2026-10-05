<?php
/**
 * Gemini AI Studio Concierge API Endpoint (PHP + cURL)
 * Provides server-side proxying for Gemini with strict validation, rate limiting,
 * timeouts, and safe error masking.
 */

declare(strict_types=1);

require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/db.php';
require_once __DIR__ . '/inc/security.php';

apply_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(405, [
        'success' => false,
        'error'   => 'Method not allowed. Use POST.',
    ]);
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!is_array($data)) {
    $data = $_POST;
}

$config = load_unique_amaze_config();
$pdo = get_db_connection();
$ipHash = get_client_ip_hash();

// 1. Strict Request Validation
$userMessage = trim((string)($data['message'] ?? ''));
$market = in_array($data['market'] ?? '', ['ca', 'mw'], true) ? $data['market'] : 'ca';
$history = is_array($data['history'] ?? null) ? $data['history'] : [];

$maxPromptLen = (int)($config['gemini']['max_prompt_len'] ?? 1000);

if (empty($userMessage)) {
    send_json_response(400, [
        'success' => false,
        'error'   => 'Message cannot be empty.',
    ]);
}

if (mb_strlen($userMessage, 'UTF-8') > $maxPromptLen) {
    send_json_response(413, [
        'success' => false,
        'error'   => "Prompt exceeds maximum allowed length of {$maxPromptLen} characters.",
    ]);
}

// 2. Per-IP Rate Limiting (15 requests per 10 minutes) & Daily Limits (50/day)
$limit10m = (int)($config['gemini']['rate_limit_10m'] ?? 15);
$dailyLimit = (int)($config['gemini']['daily_limit'] ?? 50);

if (!check_rate_limit('gemini_chat_10m', $ipHash, $limit10m, 600, $pdo)) {
    record_audit_event($pdo, 'rate_limit_exceeded', 'warning', '/api/gemini.php', $ipHash, [
        'action' => 'gemini_10m_burst',
    ]);
    send_json_response(429, [
        'success' => false,
        'error'   => 'You have reached the chat rate limit for this session. Please wait a few minutes or reach out via our contact page.',
    ]);
}

if (!check_rate_limit('gemini_chat_daily', $ipHash, $dailyLimit, 86400, $pdo)) {
    record_audit_event($pdo, 'rate_limit_exceeded', 'warning', '/api/gemini.php', $ipHash, [
        'action' => 'gemini_daily_limit',
    ]);
    send_json_response(429, [
        'success' => false,
        'error'   => 'Daily AI concierge conversation limit reached. Our human team is happy to assist you directly at hello@uniqueamaze.com.',
    ]);
}

// 3. Check Gemini API Key
$apiKey = (string)($config['gemini']['api_key'] ?? '');
$model = (string)($config['gemini']['model'] ?? 'gemini-2.5-flash');
$timeoutSec = (int)($config['gemini']['timeout_sec'] ?? 15);

// Fallback message if key is unconfigured in development/shared host
if (empty($apiKey)) {
    record_audit_event($pdo, 'gemini_unconfigured', 'warning', '/api/gemini.php', $ipHash, []);
    send_json_response(200, [
        'success' => true,
        'reply'   => "Hello! I am the Unique Amaze studio concierge. We design and engineer high-performance websites, web applications, and digital platforms with verified sub-800ms speed and architectural precision. You can explore our services, review our packages on the Pricing page, test your project with our AI Planner, or connect with our founders directly for a free discovery consultation.",
    ]);
}

// 4. Construct Safe Prompt & System Instructions
$marketContext = ($market === 'mw')
    ? "Current user context: Malawi & Southern African market. Highlight pricing in MWK (Starter MWK 800,000, Business MWK 2,500,000, Intelligent MWK 5,000,000), local Airtel Money/TNM Mpamba integrations, high mobile data efficiency, and local SEO."
    : "Current user context: Canadian & International market. Highlight pricing in CAD (Starter $950, Business $2,400, Intelligent $4,800), enterprise performance, modern stack, Interac / Stripe integration, and North American conversion architecture.";

$systemPrompt = "You are the Unique Amaze Studio Concierge, an architectural AI assistant for Unique Amaze (https://uniqueamaze.com).
Unique Amaze is a premier web engineering studio specializing in high-performance websites, custom web applications, AI integrations, and brand design.
Key facts:
- Performance guarantee: Every build achieves 95+ Google PageSpeed and sub-800ms load times.
- Zero boilerplate: Architectural React, TypeScript, and robust engineering.
- Turnarounds: Starter (5-7 days), Business (10-14 days), Intelligent Platform (3-4 weeks).
- Tone: Professional, sophisticated, concise, knowledgeable, helpful. Never hype-filled, never pushy.
{$marketContext}
Direct the user to the Interactive Planner (/ai-planner) or Contact consultation (/contact) when they ask about hiring or getting started.";

// Prepare contents payload from sanitized conversation history
$contents = [];
$sanitizedHistory = array_slice($history, -6); // Keep last 6 exchanges

foreach ($sanitizedHistory as $entry) {
    if (!is_array($entry)) continue;
    $role = ($entry['role'] ?? '') === 'model' || ($entry['role'] ?? '') === 'assistant' ? 'model' : 'user';
    $text = mb_substr(strip_tags((string)($entry['text'] ?? $entry['content'] ?? '')), 0, 800, 'UTF-8');
    if (!empty($text)) {
        $contents[] = [
            'role'  => $role,
            'parts' => [['text' => $text]],
        ];
    }
}

// Append latest user message
$contents[] = [
    'role'  => 'user',
    'parts' => [['text' => $userMessage]],
];

$postData = [
    'contents' => $contents,
    'systemInstruction' => [
        'parts' => [['text' => $systemPrompt]],
    ],
    'generationConfig' => [
        'temperature'     => 0.7,
        'maxOutputTokens' => 800,
    ],
];

// 5. Server-Side cURL Execution to Gemini REST API
$apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . urlencode($apiKey);

$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($postData, JSON_UNESCAPED_UNICODE),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'User-Agent: UniqueAmazeStudio/2.0',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => $timeoutSec,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);

$responseBody = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($responseBody === false || !empty($curlError)) {
    error_log("Gemini cURL failure: {$curlError}");
    record_audit_event($pdo, 'gemini_curl_error', 'error', '/api/gemini.php', $ipHash, [
        'error' => 'curl_timeout_or_network',
    ]);
    send_json_response(200, [
        'success' => true,
        'reply'   => "Our AI assistant is temporarily synchronizing. In the meantime, you can explore our project pricing, run the AI Website Planner, or message our engineering directors directly through our Contact form.",
    ]);
}

$decoded = json_decode($responseBody, true);

if ($httpCode !== 200 || !is_array($decoded)) {
    error_log("Gemini upstream returned status {$httpCode}: " . substr($responseBody, 0, 300));
    record_audit_event($pdo, 'gemini_upstream_error', 'warning', '/api/gemini.php', $ipHash, [
        'http_code' => $httpCode,
    ]);
    // Safe response - NEVER expose upstream API error message or key
    send_json_response(200, [
        'success' => true,
        'reply'   => "I'd love to assist with your project! Feel free to ask about our packages (Starter, Business, or Intelligent), our architectural web design approach, or book a free discovery call with our team.",
    ]);
}

$replyText = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? '';
if (empty($replyText)) {
    $replyText = "Thank you for inquiring with Unique Amaze. How can I assist with your web development or design requirements today?";
}

// Log successful AI interaction
record_audit_event($pdo, 'gemini_chat_success', 'info', '/api/gemini.php', $ipHash, [
    'model' => $model,
]);

send_json_response(200, [
    'success' => true,
    'reply'   => trim($replyText),
]);
