<?php
/**
 * Contact Form API Endpoint
 * Handles lead submission, server-side validation, honeypot protection,
 * rate limiting, MySQL database storage, and authenticated SMTP email delivery.
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

// 1. Honeypot check (hidden field bot trap)
$honeypotField = $config['security']['honeypot_field'] ?? 'website_url';
if (check_honeypot($data, $honeypotField)) {
    record_audit_event($pdo, 'bot_detected', 'warning', '/api/contact.php', $ipHash, [
        'reason' => 'honeypot_triggered',
    ]);
    // Silent drop to fool automated bot scripts
    send_json_response(200, [
        'success' => true,
        'message' => 'Your request has been received.',
    ]);
}

// 2. Per-IP Rate Limiting (5 requests per hour)
$hourlyLimit = (int)($config['security']['contact_rate_limit_per_hour'] ?? 5);
if (!check_rate_limit('contact_submit', $ipHash, $hourlyLimit, 3600, $pdo)) {
    record_audit_event($pdo, 'rate_limit_exceeded', 'warning', '/api/contact.php', $ipHash, [
        'limit' => $hourlyLimit,
    ]);
    send_json_response(429, [
        'success' => false,
        'error'   => 'Too many submissions. Please wait a while or reach out directly at hello@uniqueamaze.com.',
    ]);
}

// 3. Strict Server-Side Validation
$name = sanitize_string($data['name'] ?? '', 150);
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = sanitize_string($data['phone'] ?? '', 50);
$businessName = sanitize_string($data['business_name'] ?? $data['company'] ?? '', 150);
$serviceInterest = sanitize_string($data['service_interest'] ?? $data['service'] ?? '', 100);
$projectTier = sanitize_string($data['project_tier'] ?? $data['package'] ?? '', 100);
$budgetRange = sanitize_string($data['budget_range'] ?? $data['budget'] ?? '', 100);
$timeline = sanitize_string($data['timeline'] ?? '', 100);
$message = sanitize_string($data['message'] ?? $data['notes'] ?? '', 3000);
$market = in_array($data['market'] ?? '', ['ca', 'mw'], true) ? $data['market'] : 'ca';
$consent = !empty($data['consent']);

$errors = [];
if (mb_strlen($name, 'UTF-8') < 2) {
    $errors['name'] = 'Please enter your full name (minimum 2 characters).';
}
if (!$email) {
    $errors['email'] = 'Please enter a valid work email address.';
}
if (mb_strlen($message, 'UTF-8') < 10) {
    $errors['message'] = 'Please provide a brief description of your project (minimum 10 characters).';
}

if (!empty($errors)) {
    send_json_response(422, [
        'success' => false,
        'errors'  => $errors,
        'error'   => 'Please correct the highlighted fields before submitting.',
    ]);
}

// 4. Generate Unique Lead Identifier
$leadUuid = generate_uuid_v4();
$now = date('Y-m-d H:i:s');
$consentTimestamp = $consent ? $now : null;

// 5. Store Lead in MySQL
$insertedId = null;
if ($pdo !== null) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO leads (
                lead_uuid, name, email, phone, business_name, website_url,
                market, service_interest, project_tier, budget_range, timeline,
                message, lead_status, ip_hash, consent_given, consent_timestamp,
                source, created_at, updated_at
            ) VALUES (
                :uuid, :name, :email, :phone, :business_name, :website_url,
                :market, :service, :tier, :budget, :timeline,
                :message, 'new', :ip_hash, :consent, :consent_time,
                'contact_form', :now, :now
            )
        ");

        $stmt->execute([
            ':uuid'          => $leadUuid,
            ':name'          => $name,
            ':email'         => $email,
            ':phone'         => $phone ?: null,
            ':business_name' => $businessName ?: null,
            ':website_url'   => null,
            ':market'        => $market,
            ':service'       => $serviceInterest ?: null,
            ':tier'          => $projectTier ?: null,
            ':budget'        => $budgetRange ?: null,
            ':timeline'      => $timeline ?: null,
            ':message'       => $message,
            ':ip_hash'       => $ipHash,
            ':consent'       => $consent ? 1 : 0,
            ':consent_time'  => $consentTimestamp,
            ':now'           => $now,
        ]);

        $insertedId = $pdo->lastInsertId();

        record_audit_event($pdo, 'lead_created', 'info', '/api/contact.php', $ipHash, [
            'lead_uuid' => $leadUuid,
            'market'    => $market,
            'service'   => $serviceInterest,
        ]);
    } catch (PDOException $e) {
        error_log('Database insert lead failed: ' . $e->getMessage());
        // Do not die; proceed to email notification so client lead is never lost
    }
}

// 6. Send Authenticated SMTP Notification to Studio
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

    $subject = "⚡ New Discovery Request: {$name} (" . strtoupper($market) . " Market)";
    $notifyTo = $smtpConfig['notify_to'] ?? $smtpConfig['from_email'];

    $htmlBody = "
    <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0F172A;'>
        <div style='border-bottom: 2px solid #008280; padding-bottom: 16px; margin-bottom: 24px;'>
            <h2 style='margin: 0; color: #008280; font-size: 20px;'>UNIQUE AMAZE // INQUIRY DISPATCH</h2>
            <p style='margin: 4px 0 0; font-size: 12px; color: #64748B;'>Reference UUID: {$leadUuid}</p>
        </div>

        <table style='width: 100%; border-collapse: collapse; margin-bottom: 24px;'>
            <tr><td style='padding: 8px 0; color: #64748B; width: 140px;'>Client Name:</td><td style='padding: 8px 0; font-weight: 600;'>{$name}</td></tr>
            <tr><td style='padding: 8px 0; color: #64748B;'>Email:</td><td style='padding: 8px 0;'><a href='mailto:{$email}'>{$email}</a></td></tr>
            <tr><td style='padding: 8px 0; color: #64748B;'>Phone:</td><td style='padding: 8px 0;'>" . ($phone ?: 'Not provided') . "</td></tr>
            <tr><td style='padding: 8px 0; color: #64748B;'>Business / Brand:</td><td style='padding: 8px 0;'>" . ($businessName ?: 'Not specified') . "</td></tr>
            <tr><td style='padding: 8px 0; color: #64748B;'>Market:</td><td style='padding: 8px 0; text-transform: uppercase; font-weight: bold;'>" . strtoupper($market) . "</td></tr>
            <tr><td style='padding: 8px 0; color: #64748B;'>Service Interest:</td><td style='padding: 8px 0;'>" . ($serviceInterest ?: 'Custom consultation') . "</td></tr>
            <tr><td style='padding: 8px 0; color: #64748B;'>Budget Range:</td><td style='padding: 8px 0;'>" . ($budgetRange ?: 'To be discussed') . "</td></tr>
            <tr><td style='padding: 8px 0; color: #64748B;'>Desired Timeline:</td><td style='padding: 8px 0;'>" . ($timeline ?: 'Standard') . "</td></tr>
        </table>

        <div style='background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin-bottom: 24px;'>
            <h4 style='margin: 0 0 8px; font-size: 13px; color: #008280; text-transform: uppercase;'>Project Overview:</h4>
            <p style='margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;'>" . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "</p>
        </div>

        <div style='font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 12px;'>
            Submitted at {$now} UTC. Consent granted: " . ($consent ? 'YES' : 'NO') . ".
        </div>
    </div>";

    $mailDelivered = $smtp->send(
        (string)$smtpConfig['from_email'],
        (string)($smtpConfig['from_name'] ?? 'Unique Amaze Dispatch'),
        (string)$notifyTo,
        $subject,
        $htmlBody,
        '',
        $email
    );

    // Also send an automated confirmation receipt to the client
    if ($mailDelivered) {
        $clientSubject = "We received your inquiry — Unique Amaze";
        $clientBody = "
        <div style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #0F172A;'>
            <div style='border-bottom: 2px solid #008280; padding-bottom: 16px; margin-bottom: 20px;'>
                <h2 style='margin: 0; color: #008280;'>UNIQUE AMAZE</h2>
                <p style='margin: 4px 0 0; font-size: 13px; color: #64748B;'>Architectural Web Engineering</p>
            </div>
            <p>Hello {$name},</p>
            <p>Thank you for reaching out to Unique Amaze. We have received your project inquiry and our technical lead is reviewing your brief.</p>
            <p>You can expect a direct response within 24 hours with strategic notes and next steps for a free discovery call.</p>
            <div style='background: #F1F5F9; border-radius: 6px; padding: 14px; margin: 20px 0; font-size: 12px;'>
                <strong>Your Reference ID:</strong> {$leadUuid}<br>
                <strong>Market:</strong> " . strtoupper($market) . "
            </div>
            <p style='color: #64748B; font-size: 13px;'>Warm regards,<br>The Unique Amaze Studio Team<br><a href='https://uniqueamaze.com'>uniqueamaze.com</a></p>
        </div>";

        @$smtp->send(
            (string)$smtpConfig['from_email'],
            (string)($smtpConfig['from_name'] ?? 'Unique Amaze'),
            $email,
            $clientSubject,
            $clientBody
        );
    }
}

// 7. Successful Response Only After Accepted
send_json_response(200, [
    'success'    => true,
    'message'    => 'Thank you! Your project inquiry has been securely received. A specialist will review your goals and reach out within 24 hours.',
    'lead_uuid'  => $leadUuid,
    'delivered'  => $mailDelivered,
]);
