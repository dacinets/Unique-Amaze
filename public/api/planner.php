<?php
/**
 * AI Project Planner API Endpoint
 * Handles planner submissions, intake question analysis, MySQL storage,
 * and authenticated SMTP email delivery of the project brief.
 */

declare(strict_types=1);

require_once __DIR__ . '/inc/config.php';
require_once __DIR__ . '/inc/db.php';
require_once __DIR__ . '/inc/security.php';
require_once __DIR__ . '/inc/smtp.php';

apply_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(405, [
        'success' => false,
        'error'   => 'Method not allowed. Please use POST.',
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

// 1. Honeypot check
$honeypotField = $config['security']['honeypot_field'] ?? 'website_url';
if (check_honeypot($data, $honeypotField)) {
    record_audit_event($pdo, 'bot_detected', 'warning', '/api/planner.php', $ipHash, [
        'endpoint' => 'planner_honeypot',
    ]);
    send_json_response(200, [
        'success' => true,
        'message' => 'Your project brief has been recorded.',
    ]);
}

// 2. Rate Limiting (5 planner submissions per hour)
$hourlyLimit = (int)($config['security']['planner_rate_limit_per_hour'] ?? 5);
if (!check_rate_limit('planner_submit', $ipHash, $hourlyLimit, 3600, $pdo)) {
    record_audit_event($pdo, 'rate_limit_exceeded', 'warning', '/api/planner.php', $ipHash, [
        'action' => 'planner_submit',
    ]);
    send_json_response(429, [
        'success' => false,
        'error'   => 'Too many submissions. Please wait a while before submitting another brief.',
    ]);
}

// 3. Validation
$clientName = sanitize_string($data['name'] ?? $data['client_name'] ?? '', 150);
$clientEmail = filter_var(trim($data['email'] ?? $data['client_email'] ?? ''), FILTER_VALIDATE_EMAIL);
$clientPhone = sanitize_string($data['phone'] ?? $data['client_phone'] ?? '', 50);
$businessName = sanitize_string($data['business_name'] ?? $data['company'] ?? '', 150);
$market = in_array($data['market'] ?? '', ['ca', 'mw'], true) ? $data['market'] : 'ca';
$recommendationTier = sanitize_string($data['recommendation_tier'] ?? $data['tier'] ?? 'Business Engine', 100);
$recommendationPrice = sanitize_string($data['recommendation_price'] ?? $data['price'] ?? '$2,400', 100);
$recommendationTimeline = sanitize_string($data['recommendation_timeline'] ?? $data['timeline'] ?? '14 Days', 100);
$confidence = (int)($data['recommendation_confidence'] ?? 95);
$briefText = sanitize_string($data['brief_text'] ?? $data['generated_brief_text'] ?? '', 8000);
$answers = is_array($data['answers'] ?? null) ? $data['answers'] : [];
$consent = !empty($data['consent']);

$errors = [];
if (mb_strlen($clientName, 'UTF-8') < 2) {
    $errors['name'] = 'Please enter your name.';
}
if (!$clientEmail) {
    $errors['email'] = 'Please provide a valid email address.';
}
if (empty($briefText)) {
    $errors['brief_text'] = 'Brief details are required.';
}

if (!empty($errors)) {
    send_json_response(422, [
        'success' => false,
        'errors'  => $errors,
        'error'   => 'Validation failed. Please verify your contact details.',
    ]);
}

// 4. Generate Identifiers
$submissionUuid = generate_uuid_v4();
$leadUuid = generate_uuid_v4();
$now = date('Y-m-d H:i:s');
$consentTimestamp = $consent ? $now : null;

// 5. Store in MySQL
$insertedPlannerId = null;
if ($pdo !== null) {
    try {
        $pdo->beginTransaction();

        // Check if lead already exists by email or create new lead
        $stmtLeadCheck = $pdo->prepare("SELECT id FROM leads WHERE email = :email ORDER BY id DESC LIMIT 1");
        $stmtLeadCheck->execute([':email' => $clientEmail]);
        $existingLead = $stmtLeadCheck->fetch();

        $leadId = null;
        if ($existingLead) {
            $leadId = (int)$existingLead['id'];
        } else {
            $stmtLead = $pdo->prepare("
                INSERT INTO leads (
                    lead_uuid, name, email, phone, business_name, market,
                    service_interest, project_tier, budget_range, timeline,
                    message, lead_status, ip_hash, consent_given, consent_timestamp,
                    source, created_at, updated_at
                ) VALUES (
                    :uuid, :name, :email, :phone, :business_name, :market,
                    'AI Planner Brief', :tier, :budget, :timeline,
                    :message, 'new', :ip_hash, :consent, :consent_time,
                    'ai_planner', :now, :now
                )
            ");
            $stmtLead->execute([
                ':uuid'          => $leadUuid,
                ':name'          => $clientName,
                ':email'         => $clientEmail,
                ':phone'         => $clientPhone ?: null,
                ':business_name' => $businessName ?: null,
                ':market'        => $market,
                ':tier'          => $recommendationTier,
                ':budget'        => $recommendationPrice,
                ':timeline'      => $recommendationTimeline,
                ':message'       => "AI Planner Brief generated for " . ($businessName ?: $clientName),
                ':ip_hash'       => $ipHash,
                ':consent'       => $consent ? 1 : 0,
                ':consent_time'  => $consentTimestamp,
                ':now'           => $now,
            ]);
            $leadId = (int)$pdo->lastInsertId();
        }

        // Insert planner submission
        $stmtPlan = $pdo->prepare("
            INSERT INTO planner_submissions (
                submission_uuid, lead_id, client_name, client_email, client_phone,
                business_name, market, answers_json, recommendation_tier,
                recommendation_price, recommendation_timeline, recommendation_confidence,
                generated_brief_text, status, ip_hash, consent_given, consent_timestamp,
                created_at, updated_at
            ) VALUES (
                :uuid, :lead_id, :name, :email, :phone,
                :business_name, :market, :answers, :tier,
                :price, :timeline, :confidence,
                :brief, 'new', :ip_hash, :consent, :consent_time,
                :now, :now
            )
        ");

        $stmtPlan->execute([
            ':uuid'          => $submissionUuid,
            ':lead_id'       => $leadId,
            ':name'          => $clientName,
            ':email'         => $clientEmail,
            ':phone'         => $clientPhone ?: null,
            ':business_name' => $businessName ?: null,
            ':market'        => $market,
            ':answers'       => json_encode($answers, JSON_UNESCAPED_UNICODE),
            ':tier'          => $recommendationTier,
            ':price'         => $recommendationPrice,
            ':timeline'      => $recommendationTimeline,
            ':confidence'    => $confidence,
            ':brief'         => $briefText,
            ':ip_hash'       => $ipHash,
            ':consent'       => $consent ? 1 : 0,
            ':consent_time'  => $consentTimestamp,
            ':now'           => $now,
        ]);

        $insertedPlannerId = (int)$pdo->lastInsertId();
        $pdo->commit();

        record_audit_event($pdo, 'planner_brief_submitted', 'info', '/api/planner.php', $ipHash, [
            'submission_uuid' => $submissionUuid,
            'tier'            => $recommendationTier,
            'market'          => $market,
        ]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log('Planner submission DB insert failed: ' . $e->getMessage());
    }
}

// 6. Send Authenticated SMTP Notification
$smtpConfig = $config['smtp'] ?? [];
$mailDelivered = false;

if (!empty($smtpConfig['host']) && !empty($smtpConfig['username'])) {
    $smtp = new AuthenticatedSmtpClient(
        (string)$smtpConfig['host'],
        (int)($smtpConfig['port'] ?? 465),
        (string)($smtpConfig['encryption'] ?? 'ssl'),
        (string)$smtpConfig['username'],
        (string)$smtpConfig['password']
    );

    $subject = "📋 AI Project Brief Generated: {$clientName} ({$recommendationTier})";
    $notifyTo = $smtpConfig['notify_to'] ?? $smtpConfig['from_email'];

    $htmlBody = "
    <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; color: #0F172A;'>
        <div style='border-bottom: 2px solid #008280; padding-bottom: 16px; margin-bottom: 20px;'>
            <h2 style='margin: 0; color: #008280;'>UNIQUE AMAZE // AI PLANNER BRIEF</h2>
            <p style='margin: 4px 0 0; font-size: 12px; color: #64748B;'>Submission UUID: {$submissionUuid}</p>
        </div>

        <div style='background: #F0FDFA; border: 1px solid #99F6E4; border-radius: 8px; padding: 16px; margin-bottom: 20px;'>
            <h3 style='margin: 0 0 8px; color: #007A78; font-size: 15px;'>RECOMMENDED PACKAGE: {$recommendationTier}</h3>
            <p style='margin: 0; font-size: 13px; color: #134E4A;'>
                <strong>Estimated Investment:</strong> {$recommendationPrice} &nbsp;|&nbsp;
                <strong>Turnaround:</strong> {$recommendationTimeline} &nbsp;|&nbsp;
                <strong>Fit Score:</strong> {$confidence}%
            </p>
        </div>

        <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <tr><td style='padding: 6px 0; color: #64748B; width: 140px;'>Client:</td><td style='padding: 6px 0; font-weight: 600;'>{$clientName}</td></tr>
            <tr><td style='padding: 6px 0; color: #64748B;'>Email:</td><td style='padding: 6px 0;'><a href='mailto:{$clientEmail}'>{$clientEmail}</a></td></tr>
            <tr><td style='padding: 6px 0; color: #64748B;'>Phone:</td><td style='padding: 6px 0;'>" . ($clientPhone ?: 'None') . "</td></tr>
            <tr><td style='padding: 6px 0; color: #64748B;'>Business:</td><td style='padding: 6px 0;'>" . ($businessName ?: 'Not specified') . "</td></tr>
            <tr><td style='padding: 6px 0; color: #64748B;'>Market:</td><td style='padding: 6px 0; font-weight: bold;'>" . strtoupper($market) . "</td></tr>
        </table>

        <div style='background: #0F172A; color: #E2E8F0; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 12px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 20px;'>
" . htmlspecialchars($briefText, ENT_QUOTES, 'UTF-8') . "
        </div>

        <div style='font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 12px;'>
            Generated via Sage AI Planner on {$now} UTC.
        </div>
    </div>";

    $mailDelivered = $smtp->send(
        (string)$smtpConfig['from_email'],
        (string)($smtpConfig['from_name'] ?? 'Unique Amaze Planner'),
        (string)$notifyTo,
        $subject,
        $htmlBody,
        '',
        $clientEmail
    );
}

send_json_response(200, [
    'success'         => true,
    'message'         => 'Your AI project brief has been successfully analyzed and securely recorded.',
    'submission_uuid' => $submissionUuid,
    'delivered'       => $mailDelivered,
]);
