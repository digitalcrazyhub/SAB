<?php
declare(strict_types=1);

function appendToGoogleSheet(array $lead, int $id): void
{
    if (GOOGLE_SHEET_ID === '' || GOOGLE_SERVICE_ACCOUNT_JSON === '') {
        throw new RuntimeException('Google Sheets is not configured.');
    }

    $credentials = GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!str_starts_with($credentials, DIRECTORY_SEPARATOR)) {
        $credentials = dirname(__DIR__, 2) . '/' . ltrim($credentials, '/');
    }
    if (!is_readable($credentials)) {
        throw new RuntimeException('Google service account file is not readable.');
    }

    $client = new Google\Client();
    $client->setAuthConfig($credentials);
    $client->setScopes([Google\Service\Sheets::SPREADSHEETS]);
    $service = new Google\Service\Sheets($client);

    $now = new DateTimeImmutable();
    $values = [[
        $id,
        $now->format('Y-m-d'),
        $now->format('H:i:s'),
        $lead['first_name'],
        $lead['last_name'],
        $lead['phone'],
        $lead['email'],
        $lead['message'],
    ]];

    $body = new Google\Service\Sheets\ValueRange(['values' => $values]);
    $service->spreadsheets_values->append(
        GOOGLE_SHEET_ID,
        GOOGLE_SHEET_RANGE,
        $body,
        ['valueInputOption' => 'USER_ENTERED', 'insertDataOption' => 'INSERT_ROWS']
    );
}
