<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

function makeMailer(): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->Port = SMTP_PORT;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = SMTP_ENCRYPTION === 'ssl'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->isHTML(true);
    return $mail;
}

function sendBusinessLead(array $lead): void
{
    $mail = makeMailer();
    $mail->addAddress(BUSINESS_EMAIL);
    $mail->addReplyTo($lead['email'], $lead['name']);
    $mail->Subject = 'New Website Enquiry - Sri Amma Industrial Developers';

    $name = htmlspecialchars($lead['name'], ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($lead['phone'], ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($lead['email'], ENT_QUOTES, 'UTF-8');
    $message = nl2br(htmlspecialchars($lead['message'], ENT_QUOTES, 'UTF-8'));

    $mail->Body = <<<HTML
<!doctype html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
<h2>New Website Enquiry</h2>
<hr>
<h3>Customer Details</h3>
<p><strong>Name:</strong> {$name}</p>
<p><strong>Phone:</strong> {$phone}</p>
<p><strong>Email:</strong> {$email}</p>
<p><strong>Message:</strong><br>{$message}</p>
</body></html>
HTML;

    $mail->AltBody = "New Website Enquiry\n\nName: {$lead['name']}\nPhone: {$lead['phone']}\nEmail: {$lead['email']}\nMessage: {$lead['message']}";
    $mail->send();
}

function sendCustomerConfirmation(array $lead): void
{
    $mail = makeMailer();
    $mail->addAddress($lead['email'], $lead['name']);
    $mail->Subject = 'Thank You for Contacting Sri Amma Industrial Developers';

    $firstName = htmlspecialchars($lead['first_name'], ENT_QUOTES, 'UTF-8');
    $name = htmlspecialchars($lead['name'], ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($lead['phone'], ENT_QUOTES, 'UTF-8');
    $message = nl2br(htmlspecialchars($lead['message'], ENT_QUOTES, 'UTF-8'));
    $website = htmlspecialchars(WEBSITE_URL, ENT_QUOTES, 'UTF-8');
    $businessPhone = htmlspecialchars(BUSINESS_PHONE, ENT_QUOTES, 'UTF-8');

    $mail->Body = <<<HTML
<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#222">
<div style="max-width:640px;margin:30px auto;background:#fff;padding:32px">
<h2 style="margin-top:0">Thank You for Your Enquiry</h2>
<p>Dear {$firstName},</p>
<p>Thank you for contacting Sri Amma Industrial Developers Pvt. Ltd.</p>
<p>We have received your enquiry successfully. Our team will review your requirements and get back to you shortly.</p>
<h3>Your enquiry details</h3>
<p><strong>Name:</strong> {$name}<br><strong>Phone:</strong> {$phone}</p>
<p><strong>Message:</strong><br>{$message}</p>
<p>Regards,<br><strong>Sri Amma Industrial Developers Pvt. Ltd.</strong></p>
<p><a href="{$website}">{$website}</a><br>{$businessPhone}</p>
</div></body></html>
HTML;

    $mail->AltBody = "Dear {$lead['first_name']},\n\nThank you for contacting Sri Amma Industrial Developers Pvt. Ltd.\n\nWe have received your enquiry successfully. Our team will review your requirements and get back to you shortly.\n\nName: {$lead['name']}\nPhone: {$lead['phone']}\nMessage: {$lead['message']}\n\nRegards,\nSri Amma Industrial Developers Pvt. Ltd.\n" . WEBSITE_URL . "\n" . BUSINESS_PHONE;
    $mail->send();
}
