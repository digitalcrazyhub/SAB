<?php
/**
 * SRI AMMA BUILDER PVT LTD — GOOGLE reCAPTCHA v3 VERIFICATION
 * File: /backend/security/recaptcha.php
 * Server-side risk evaluation for Google reCAPTCHA v3.
 */

declare(strict_types=1);

namespace SAB\Security;

use function SAB\Config\config;
use function SAB\Config\logSystemError;

/**
 * Verify reCAPTCHA token with Google API
 *
 * @return array{success: bool, score: float, action: string, error: ?string}
 */
function verifyRecaptcha(?string $token, string $clientIp): array
{
    $cfg = config()['recaptcha'];

    // If disabled in config (e.g. during local development), bypass gracefully
    if (!$cfg['enabled']) {
        return [
            'success' => true,
            'score' => 1.0,
            'action' => 'bypassed',
            'error' => null,
        ];
    }

    $secretKey = $cfg['secret_key'];
    if (empty($secretKey)) {
        logSystemError('reCAPTCHA is enabled but RECAPTCHA_SECRET_KEY is empty.');
        return [
            'success' => true,
            'score' => 1.0,
            'action' => 'missing_secret_key',
            'error' => null,
        ];
    }

    $cleanToken = trim((string)$token);
    if ($cleanToken === '') {
        return [
            'success' => false,
            'score' => 0.0,
            'action' => '',
            'error' => 'Please complete the spam security verification and try again.',
        ];
    }

    $postData = http_build_query([
        'secret' => $secretKey,
        'response' => $cleanToken,
        'remoteip' => $clientIp,
    ]);

    $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    $rawResponse = false;

    // Use cURL if available
    if (function_exists('curl_init')) {
        $ch = curl_init($verifyUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $cfg['timeout'] ?? 5,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $rawResponse = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($rawResponse === false && !empty($curlError)) {
            logSystemError("reCAPTCHA cURL Error: {$curlError}");
        }
    }

    // Fallback to file_get_contents stream context
    if ($rawResponse === false) {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'content' => $postData,
                'timeout' => $cfg['timeout'] ?? 5,
            ],
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
            ],
        ]);
        $rawResponse = @file_get_contents($verifyUrl, false, $context);
    }

    if ($rawResponse === false) {
        logSystemError('reCAPTCHA verification API is currently unreachable.');
        // If Google API fails to respond, allow submission so legitimate clients aren't blocked
        return [
            'success' => true,
            'score' => 0.5,
            'action' => 'network_fallback',
            'error' => null,
        ];
    }

    $result = json_decode((string)$rawResponse, true);
    if (!is_array($result)) {
        return [
            'success' => false,
            'score' => 0.0,
            'action' => '',
            'error' => 'Invalid security verification response. Please try again.',
        ];
    }

    $isSuccess = (bool)($result['success'] ?? false);
    $score = (float)($result['score'] ?? 0.0);
    $action = (string)($result['action'] ?? '');
    $minScore = (float)$cfg['min_score'];

    if (!$isSuccess || $score < $minScore) {
        return [
            'success' => false,
            'score' => $score,
            'action' => $action,
            'error' => 'Automated activity detected. Please try submitting again or call us directly.',
        ];
    }

    return [
        'success' => true,
        'score' => $score,
        'action' => $action,
        'error' => null,
    ];
}
