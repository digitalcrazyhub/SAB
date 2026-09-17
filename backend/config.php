<?php
declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| WEBSITE
|--------------------------------------------------------------------------
*/

const SITE_NAME = 'Sri Amma Industrial Developer PVT LTD';
const SITE_URL  = 'https://www.sriammaindustrial.com';


/*
|--------------------------------------------------------------------------
| BUSINESS EMAIL
|--------------------------------------------------------------------------
*/

const BUSINESS_EMAIL = 'digitalcrazyhub2020@gmail.com';
const BUSINESS_NAME  = 'Sri Amma Industrial Developer PVT LTD';

const SMTP_HOST = 'smtp.yourdomain.com';
const SMTP_PORT = 587;
const SMTP_USERNAME = 'digitalcrazyhub2020@gmail.com';
const SMTP_PASSWORD = 'pgwawcvcxhayhbrd';

const SMTP_ENCRYPTION = 'tls';


/*
|--------------------------------------------------------------------------
| CUSTOMER EMAIL
|--------------------------------------------------------------------------
*/

const CUSTOMER_EMAIL_FROM = 'digitalcrazyhub2020@gmail.com';
const CUSTOMER_EMAIL_NAME = 'Sri Amma Industrial Developer PVT LTD';


/*
|--------------------------------------------------------------------------
| MYSQL
|--------------------------------------------------------------------------
*/

const DB_HOST = 'localhost';
const DB_NAME = 'your_database';
const DB_USER = 'your_database_user';
const DB_PASSWORD = '';
const DB_CHARSET = 'utf8mb4';


/*
|--------------------------------------------------------------------------
| GOOGLE SHEETS
|--------------------------------------------------------------------------
*/

const GOOGLE_SHEET_ID = '1oYzmYTWzrPzLuP8Iv0aL23i1q_ZQLt9Y-uLQVLg-tJ0';

const GOOGLE_SHEET_NAME = 'Leads';

const GOOGLE_SERVICE_ACCOUNT_FILE =
    __DIR__ . '/credentials/google-service-account.json';


/*
|--------------------------------------------------------------------------
| GOOGLE reCAPTCHA v3
|--------------------------------------------------------------------------
*/

const RECAPTCHA_SITE_KEY = '6LeIXsAtAAAAAPRGpzxI9bmuhZ1JnWo0jhZX5AaQ';
const RECAPTCHA_SECRET_KEY = '6LeIXsAtAAAAAPEGNWl4faeycLd80ucUPu8vL3rJ';

const RECAPTCHA_MIN_SCORE = 0.5;
const RECAPTCHA_ACTION = 'contact_form';


/*
|--------------------------------------------------------------------------
| SECURITY
|--------------------------------------------------------------------------
*/

const CSRF_SESSION_NAME = 'sab_contact_session';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 190;
const MAX_PHONE_LENGTH = 20;
const MAX_SERVICE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 3000;


/*
|--------------------------------------------------------------------------
| APPLICATION
|--------------------------------------------------------------------------
*/

date_default_timezone_set('Asia/Kolkata');

ini_set('session.name', CSRF_SESSION_NAME);