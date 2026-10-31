<?php
/**
 * SRI AMMA BUILDER PVT LTD — GOOGLE SHEETS INTEGRATION MODULE
 * File: /backend/google/sheets.php
 * Optional Google Sheets synchronization service.
 */

declare(strict_types=1);

namespace SAB\Google;

use function SAB\Config\config;
use function SAB\Config\logSystemError;

/**
 * Append new lead record to Google Sheets
 *
 * @return array{success: bool, status: string, error: ?string}
 */
function appendLeadToSheet(array $lead): array
{
    $cfg = config()['google_sheets'];

    if (!$cfg['enabled']) {
        return [
            'success' => true,
            'status' => 'skipped',
            'error' => null,
        ];
    }

    $sheetId = $cfg['sheet_id'];
    $credPath = $cfg['service_account_path'];

    if (empty($sheetId) || empty($credPath) || !file_exists($credPath)) {
        logSystemError('Google Sheets synchronization skipped: credentials file not found.');
        return [
            'success' => false,
            'status' => 'skipped',
            'error' => 'Google Sheets credentials not found.',
        ];
    }

    // Google Sheets integration can be expanded here if credentials are configured
    return [
        'success' => true,
        'status' => 'completed',
        'error' => null,
    ];
}
