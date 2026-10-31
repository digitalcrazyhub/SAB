<?php
/**
 * SRI AMMA BUILDER PVT LTD — STANDALONE SMTP MAILER
 * File: /backend/mail/mailer.php
 * Standalone SMTP email client with responsive HTML email templates.
 * Zero external vendor/composer dependencies required.
 */

declare(strict_types=1);

namespace SAB\Mail;

use function SAB\Config\config;
use function SAB\Config\logSystemError;

/**
 * Dispatch lead notification and client acknowledgement emails
 *
 * @return array{company_mail: bool, customer_mail: bool, error: ?string}
 */
function sendLeadEmails(array $lead): array
{
    $cfg = config()['mail'];

    if (empty($cfg['smtp_host']) || empty($cfg['smtp_user'])) {
        logSystemError('Email dispatch skipped: SMTP credentials not set.');
        return [
            'company_mail' => false,
            'customer_mail' => false,
            'error' => 'SMTP credentials not configured.',
        ];
    }

    $leadId = htmlspecialchars((string)($lead['lead_id'] ?? 'N/A'), ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars((string)($lead['name'] ?? 'Client'), ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars((string)($lead['email'] ?? ''), ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars((string)($lead['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
    $service = htmlspecialchars((string)($lead['service'] ?? 'General Construction'), ENT_QUOTES, 'UTF-8');
    $rawMessage = (string)($lead['message'] ?? '');
    $messageHtml = nl2br(htmlspecialchars($rawMessage, ENT_QUOTES, 'UTF-8'));
    $createdAt = htmlspecialchars((string)($lead['created_at'] ?? date('Y-m-d H:i:s')), ENT_QUOTES, 'UTF-8');

    // 1. Company Notification Email Template
    $companySubject = "New Project Enquiry — Ref: {$leadId} ({$service})";
    $companyHtml = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Website Enquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background: #0f2b48; color: #ffffff; padding: 24px 28px; border-bottom: 4px solid #f59e0b; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
    .header p { margin: 4px 0 0; font-size: 13px; color: #f59e0b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
    .content { padding: 28px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .table th { text-align: left; padding: 10px 12px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 34%; font-weight: 600; }
    .table td { padding: 10px 12px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0; }
    .ref-code { font-family: monospace; font-size: 15px; font-weight: 700; color: #0f2b48; }
    .badge { display: inline-block; padding: 4px 10px; background: #eff6ff; color: #1d4ed8; border-radius: 4px; font-weight: 600; font-size: 12px; }
    .message-box { background: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; }
    .footer { padding: 18px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>SRI AMMA BUILDER PVT LTD</h1>
      <p>Website Enquiry Alert &bull; {$leadId}</p>
    </div>
    <div class="content">
      <table class="table">
        <tr><th>Reference ID:</th><td><span class="ref-code">{$leadId}</span></td></tr>
        <tr><th>Customer Name:</th><td><strong>{$name}</strong></td></tr>
        <tr><th>Phone Number:</th><td><a href="tel:{$phone}" style="color: #0284c7; text-decoration: none; font-weight: bold;">{$phone}</a></td></tr>
        <tr><th>Email Address:</th><td><a href="mailto:{$email}" style="color: #0284c7; text-decoration: none;">{$email}</a></td></tr>
        <tr><th>Service Required:</th><td><span class="badge">{$service}</span></td></tr>
        <tr><th>Received At:</th><td>{$createdAt}</td></tr>
      </table>
      <div style="font-size: 13px; text-transform: uppercase; color: #64748b; font-weight: 600; margin: 20px 0 8px;">Enquiry Message:</div>
      <div class="message-box">
        {$messageHtml}
      </div>
    </div>
    <div class="footer">
      Sri Amma Builder Pvt Ltd &bull; Chennai, Tamil Nadu<br>
      Direct Reply-To enabled ({$email})
    </div>
  </div>
</body>
</html>
HTML;

    // Dispatch company notification with customer Reply-To
    $companySent = sendSmtpMessage(
        cfg: $cfg,
        toEmail: $cfg['company_email'],
        toName: $cfg['company_name'],
        subject: $companySubject,
        htmlBody: $companyHtml,
        replyToEmail: (string)$lead['email'],
        replyToName: (string)$lead['name']
    );

    // 2. Customer Confirmation Email Template
    $customerSubject = "Thank You for Contacting Sri Amma Builder Pvt Ltd [Ref: {$leadId}]";
    $customerHtml = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Enquiry Acknowledged</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background: #0f2b48; color: #ffffff; padding: 28px 24px; text-align: center; border-bottom: 4px solid #f59e0b; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; }
    .header p { margin: 6px 0 0; font-size: 12px; color: #f59e0b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.08em; }
    .content { padding: 28px 24px; line-height: 1.65; color: #334155; font-size: 14px; }
    .ref-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; text-align: center; margin: 20px 0; }
    .ref-title { font-size: 12px; color: #64748b; text-transform: uppercase; margin: 0 0 4px; font-weight: 600; }
    .ref-id { font-size: 20px; font-weight: 800; color: #0f2b48; font-family: monospace; margin: 0; }
    .office-card { background: #f8fafc; border-radius: 6px; padding: 14px 18px; margin-top: 20px; border: 1px solid #e2e8f0; font-size: 13px; }
    .footer { padding: 20px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>SRI AMMA BUILDER PVT LTD</h1>
      <p>Innovative &bull; Durable &bull; Excellence</p>
    </div>
    <div class="content">
      <p>Dear <strong>{$name}</strong>,</p>
      <p>Thank you for reaching out to <strong>Sri Amma Builder Pvt Ltd</strong>. We have received your project enquiry regarding <strong>{$service}</strong>.</p>
      
      <div class="ref-box">
        <div class="ref-title">Your Reference Enquiry ID</div>
        <div class="ref-id">{$leadId}</div>
      </div>

      <p>Our engineering and project estimation team will review your requirements and get in touch with you shortly.</p>
      
      <div class="office-card">
        <strong>Direct Office Contacts:</strong><br>
        &bull; <strong>Phone:</strong> +91 94444 05505 | +91 93802 43013<br>
        &bull; <strong>Email:</strong> mkrishsab@gmail.com<br>
        &bull; <strong>Address:</strong> No. 4/951, 33rd Street, TVS Colony, Anna Nagar West Extn. Chennai - 600 101.
      </div>

      <p style="margin-top: 24px;">Warm regards,<br>
      <strong>Customer Relations Team</strong><br>
      Sri Amma Builder Pvt Ltd</p>
    </div>
    <div class="footer">
      This is an automated confirmation. Please quote reference <strong>{$leadId}</strong> in all future communications.
    </div>
  </div>
</body>
</html>
HTML;

    // Dispatch customer acknowledgement (Reply-To omitted as per requirements)
    $customerSent = sendSmtpMessage(
        cfg: $cfg,
        toEmail: (string)$lead['email'],
        toName: (string)$lead['name'],
        subject: $customerSubject,
        htmlBody: $customerHtml,
        replyToEmail: null,
        replyToName: null
    );

    return [
        'company_mail' => $companySent['success'],
        'customer_mail' => $customerSent['success'],
        'error' => $companySent['error'] ?? $customerSent['error'] ?? null,
    ];
}

/**
 * Send an email via authenticated SMTP socket (SSL port 465 or TLS port 587)
 *
 * @return array{success: bool, error: ?string}
 */
function sendSmtpMessage(
    array $cfg,
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlBody,
    ?string $replyToEmail = null,
    ?string $replyToName = null
): array {
    $hostsToTry = [];

    // Primary host from config
    $hostsToTry[] = [
        'host' => $cfg['smtp_host'],
        'port' => $cfg['smtp_port'],
        'enc' => $cfg['smtp_encryption'],
    ];

    // Smart auto-fallback: If username is @gmail.com and primary host is not smtp.gmail.com,
    // add smtp.gmail.com as a fallback
    if (
        str_contains(strtolower($cfg['smtp_user']), '@gmail.com') &&
        strtolower($cfg['smtp_host']) !== 'smtp.gmail.com'
    ) {
        $hostsToTry[] = [
            'host' => 'smtp.gmail.com',
            'port' => 465,
            'enc' => 'ssl',
        ];
    }

    $lastError = null;

    foreach ($hostsToTry as $target) {
        $result = executeSmtpSocket(
            host: $target['host'],
            port: $target['port'],
            encryption: $target['enc'],
            user: $cfg['smtp_user'],
            pass: $cfg['smtp_pass'],
            fromEmail: $cfg['from_email'],
            fromName: $cfg['from_name'],
            toEmail: $toEmail,
            toName: $toName,
            subject: $subject,
            htmlBody: $htmlBody,
            replyToEmail: $replyToEmail,
            replyToName: $replyToName,
            timeout: (int)($cfg['timeout'] ?? 8)
        );

        if ($result['success']) {
            return $result;
        }

        $lastError = $result['error'];
        logSystemError("SMTP attempt failed on {$target['host']}: {$result['error']}");
    }

    return ['success' => false, 'error' => $lastError];
}

/**
 * Low-level RFC-compliant SMTP socket interaction
 */
function executeSmtpSocket(
    string $host,
    int $port,
    string $encryption,
    string $user,
    string $pass,
    string $fromEmail,
    string $fromName,
    string $toEmail,
    string $toName,
    string $subject,
    string $htmlBody,
    ?string $replyToEmail,
    ?string $replyToName,
    int $timeout
): array {
    $socketHost = ($encryption === 'ssl' ? 'ssl://' : '') . $host;
    $socket = @fsockopen($socketHost, $port, $errno, $errstr, $timeout);

    if (!$socket) {
        return ['success' => false, 'error' => "Cannot connect to {$host}:{$port} ({$errstr})"];
    }

    stream_set_timeout($socket, $timeout);

    $read = function () use ($socket): string {
        $data = '';
        while (!feof($socket)) {
            $line = fgets($socket, 515);
            if ($line === false) {
                break;
            }
            $data .= $line;
            // Multiline responses have '-' after the 3-digit code
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        return $data;
    };

    $write = function (string $cmd) use ($socket, $read): string {
        fputs($socket, $cmd . "\r\n");
        return $read();
    };

    $banner = $read();
    if (!str_starts_with(trim($banner), '220')) {
        fclose($socket);
        return ['success' => false, 'error' => "Invalid greeting banner: {$banner}"];
    }

    $write('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));

    // Handle STARTTLS for port 587
    if ($encryption === 'tls') {
        $tlsRes = $write('STARTTLS');
        if (!str_starts_with(trim($tlsRes), '220')) {
            fclose($socket);
            return ['success' => false, 'error' => "STARTTLS failed: {$tlsRes}"];
        }
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return ['success' => false, 'error' => 'TLS encryption negotiation failed'];
        }
        $write('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
    }

    // Authenticate
    $write('AUTH LOGIN');
    $write(base64_encode($user));
    $authRes = $write(base64_encode($pass));

    if (!str_starts_with(trim($authRes), '235')) {
        fclose($socket);
        return ['success' => false, 'error' => "Authentication rejected: {$authRes}"];
    }

    $mailFromRes = $write("MAIL FROM: <{$fromEmail}>");
    if (!str_starts_with(trim($mailFromRes), '250')) {
        fclose($socket);
        return ['success' => false, 'error' => "MAIL FROM rejected: {$mailFromRes}"];
    }

    $rcptRes = $write("RCPT TO: <{$toEmail}>");
    if (!str_starts_with(trim($rcptRes), '250')) {
        fclose($socket);
        return ['success' => false, 'error' => "RCPT TO rejected: {$rcptRes}"];
    }

    $dataPrompt = $write('DATA');
    if (!str_starts_with(trim($dataPrompt), '354')) {
        fclose($socket);
        return ['success' => false, 'error' => "DATA prompt rejected: {$dataPrompt}"];
    }

    // Build MIME multipart message
    $boundary = '=_boundary_' . bin2hex(random_bytes(16));
    $plainText = strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>'], "\n", $htmlBody));

    $fromHeader = !empty(trim($fromName)) ? "{$fromName} <{$fromEmail}>" : "<{$fromEmail}>";
    $toHeader = !empty(trim($toName)) ? "{$toName} <{$toEmail}>" : "<{$toEmail}>";

    $headers = [
        "From: {$fromHeader}",
        "To: {$toHeader}",
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'MIME-Version: 1.0',
        "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
        'X-Mailer: SriAmmaBuilder/1.0 PHP',
    ];

    if (!empty($replyToEmail)) {
        $replyToHeader = !empty(trim((string)$replyToName)) ? "{$replyToName} <{$replyToEmail}>" : "<{$replyToEmail}>";
        $headers[] = "Reply-To: {$replyToHeader}";
    }

    $body = implode("\r\n", $headers) . "\r\n\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($plainText)) . "\r\n"
        . "--{$boundary}\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($htmlBody)) . "\r\n"
        . "--{$boundary}--\r\n.";

    $sendRes = $write($body);
    $write('QUIT');
    fclose($socket);

    if (str_starts_with(trim($sendRes), '250')) {
        return ['success' => true, 'error' => null];
    }

    return ['success' => false, 'error' => "Message rejected by server: {$sendRes}"];
}
