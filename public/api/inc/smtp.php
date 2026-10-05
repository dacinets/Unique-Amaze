<?php
/**
 * Authenticated SMTP Client (RFC 5321 / RFC 4954)
 * Pure PHP implementation with SSL/TLS socket support.
 * Designed for Bluehost cPanel Mail, SendGrid, Postmark, and standard SMTP hosts.
 * Does NOT rely on PHP mail().
 */

declare(strict_types=1);

class AuthenticatedSmtpClient
{
    private string $host;
    private int $port;
    private string $encryption;
    private string $username;
    private string $password;
    private int $timeout;
    private string $lastError = '';

    public function __construct(
        string $host,
        int $port,
        string $encryption,
        string $username,
        string $password,
        int $timeout = 15
    ) {
        $this->host = $host;
        $this->port = $port;
        $this->encryption = strtolower($encryption);
        $this->username = $username;
        $this->password = $password;
        $this->timeout = $timeout;
    }

    public function getLastError(): string
    {
        return $this->lastError;
    }

    public function send(
        string $fromEmail,
        string $fromName,
        string $toEmail,
        string $subject,
        string $htmlBody,
        string $textBody = '',
        ?string $replyToEmail = null
    ): bool {
        $protocol = '';
        if ($this->encryption === 'ssl' || $this->port === 465) {
            $protocol = 'ssl://';
        }

        $remoteSocket = "{$protocol}{$this->host}:{$this->port}";

        $context = stream_context_create([
            'ssl' => [
                'verify_peer'       => true,
                'verify_peer_name'  => true,
                'allow_self_signed' => false,
            ],
        ]);

        $socket = @stream_socket_client(
            $remoteSocket,
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$socket) {
            $this->lastError = "SMTP connection to {$remoteSocket} failed: {$errstr} ({$errno})";
            error_log($this->lastError);
            return false;
        }

        stream_set_timeout($socket, $this->timeout);

        // Read initial banner
        if (!$this->expectResponse($socket, [220])) {
            fclose($socket);
            return false;
        }

        // EHLO
        $clientHost = gethostname() ?: 'localhost';
        $this->sendCommand($socket, "EHLO {$clientHost}");
        if (!$this->expectResponse($socket, [250])) {
            $this->sendCommand($socket, "HELO {$clientHost}");
            if (!$this->expectResponse($socket, [250])) {
                fclose($socket);
                return false;
            }
        }

        // STARTTLS if port 587 or encryption = tls
        if ($this->encryption === 'tls' && $this->port !== 465) {
            $this->sendCommand($socket, "STARTTLS");
            if (!$this->expectResponse($socket, [220])) {
                fclose($socket);
                return false;
            }

            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $this->lastError = "SMTP STARTTLS cryptographic negotiation failed.";
                fclose($socket);
                return false;
            }

            // Re-send EHLO after TLS handshake
            $this->sendCommand($socket, "EHLO {$clientHost}");
            if (!$this->expectResponse($socket, [250])) {
                fclose($socket);
                return false;
            }
        }

        // AUTH LOGIN
        if (!empty($this->username) && !empty($this->password)) {
            $this->sendCommand($socket, "AUTH LOGIN");
            if (!$this->expectResponse($socket, [334])) {
                fclose($socket);
                return false;
            }

            $this->sendCommand($socket, base64_encode($this->username));
            if (!$this->expectResponse($socket, [334])) {
                fclose($socket);
                return false;
            }

            $this->sendCommand($socket, base64_encode($this->password));
            if (!$this->expectResponse($socket, [235])) {
                $this->lastError = "SMTP Authentication failed for user {$this->username}.";
                fclose($socket);
                return false;
            }
        }

        // MAIL FROM
        $this->sendCommand($socket, "MAIL FROM:<{$fromEmail}>");
        if (!$this->expectResponse($socket, [250])) {
            fclose($socket);
            return false;
        }

        // RCPT TO
        $this->sendCommand($socket, "RCPT TO:<{$toEmail}>");
        if (!$this->expectResponse($socket, [250, 251])) {
            fclose($socket);
            return false;
        }

        // DATA
        $this->sendCommand($socket, "DATA");
        if (!$this->expectResponse($socket, [354])) {
            fclose($socket);
            return false;
        }

        // Build MIME message
        $boundary = '=_uniqueamaze_' . md5(uniqid((string)time(), true));
        $date = date('r');
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

        $messageId = '<' . time() . '.' . bin2hex(random_bytes(8)) . '@' . $this->host . '>';

        $headers = [
            "Date: {$date}",
            "From: {$encodedFromName} <{$fromEmail}>",
            "To: <{$toEmail}>",
            "Subject: {$encodedSubject}",
            "Message-ID: {$messageId}",
            "X-Mailer: Unique Amaze Enterprise Studio",
            "MIME-Version: 1.0",
            "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
        ];

        if ($replyToEmail !== null && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
            $headers[] = "Reply-To: <{$replyToEmail}>";
        }

        if (empty($textBody)) {
            $textBody = strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>'], "\n", $htmlBody));
        }

        $payload = implode("\r\n", $headers) . "\r\n\r\n";
        $payload .= "--{$boundary}\r\n";
        $payload .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $payload .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $payload .= chunk_split(base64_encode($textBody)) . "\r\n";
        $payload .= "--{$boundary}\r\n";
        $payload .= "Content-Type: text/html; charset=UTF-8\r\n";
        $payload .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $payload .= chunk_split(base64_encode($htmlBody)) . "\r\n";
        $payload .= "--{$boundary}--\r\n";
        $payload .= ".\r\n";

        fwrite($socket, $payload);

        if (!$this->expectResponse($socket, [250])) {
            fclose($socket);
            return false;
        }

        $this->sendCommand($socket, "QUIT");
        fclose($socket);
        return true;
    }

    private function sendCommand($socket, string $command): void
    {
        fwrite($socket, $command . "\r\n");
    }

    private function expectResponse($socket, array $expectedCodes): bool
    {
        $response = '';
        while (!feof($socket)) {
            $line = fgets($socket, 1024);
            if ($line === false) break;
            $response .= $line;
            // Standard SMTP multiline continuation check: 4th char is space if final line
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }

        $code = (int)substr($response, 0, 3);
        if (!in_array($code, $expectedCodes, true)) {
            $this->lastError = "SMTP Server rejected command. Code: {$code}, Response: " . trim($response);
            error_log($this->lastError);
            return false;
        }

        return true;
    }
}
