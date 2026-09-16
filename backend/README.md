# Contact enquiry backend

## Requirements

- PHP 8.1+
- MySQL 5.7+/8.x (InnoDB, utf8mb4)
- Composer 2.x for dependencies
- PHP cURL extension recommended
- OpenSSL extension
- PDO MySQL
- HTTPS in production

## Install

From the repository root:

```bash
composer install --no-dev --optimize-autoloader
cp .env.example .env
```

Set every value in `.env`. Generate `APP_SECRET` with:

```bash
php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
```

Never commit `.env`.

## MySQL

Create the database, then import:

`backend/database/contact_enquiries.sql`

The application expects the database/table to exist before submissions.

## reCAPTCHA v2 Checkbox

1. Create a reCAPTCHA v2 Checkbox site in the Google reCAPTCHA admin console.
2. Register the production hostname.
3. Put the site key in `RECAPTCHA_SITE_KEY`.
4. Put the secret in `RECAPTCHA_SECRET_KEY`.
5. The site key is placed in `asset/page/contact.html`; the secret remains server-side only.

The endpoint verifies `g-recaptcha-response` with Google's server-side verification endpoint before the enquiry is stored.

## SMTP / PHPMailer

Configure the SMTP host, port, encryption, username and password in `.env`.

The project uses PHPMailer through Composer and never calls PHP's `mail()` function.

`SMTP_FROM_EMAIL` must be an address permitted by the SMTP provider. The business lead uses the customer's validated email as Reply-To.

## Google Sheets

1. Create a Google Cloud project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Download its JSON key.
5. Store the JSON outside the public web root where possible (for example under a Hostinger private/home directory).
6. Share the target Google Sheet with the service-account email as Editor.
7. Put the spreadsheet ID in `GOOGLE_SHEET_ID`.
8. Put the absolute JSON path in `GOOGLE_SERVICE_ACCOUNT_JSON`.
9. Set `GOOGLE_SHEET_RANGE`, for example `Enquiries!A:H`.
10. Create a header row: ID, Date, Time, First Name, Last Name, Phone, Email, Message.

Google Sheets is secondary logging. A Sheets outage is logged server-side and does not erase a successfully stored MySQL enquiry.

## Hostinger

If Composer is not available on the Hostinger account, run `composer install --no-dev --optimize-autoloader` on a local PHP/Composer machine using this repository, then upload the generated `vendor/` directory with the site. Do not manually mix individual PHPMailer/Google client class files; Composer's generated autoloader keeps their dependencies consistent.

1. Upload the repository to the site's document root.
2. Keep `.env` out of Git and preferably outside the public document root.
3. Run Composer on the server or deploy the generated `vendor/` directory from a trusted build environment.
4. Import the SQL file into the Hostinger MySQL database.
5. Set PHP to 8.1 or newer and enable PDO MySQL, cURL and OpenSSL.
6. Set all `.env` values.
7. Keep Google service-account JSON outside the public document root if possible.
8. Ensure `backend/logs/` is not publicly readable; the included `.htaccess` blocks log/config formats on Apache.
9. Use HTTPS.
10. Submit a real test enquiry and verify MySQL, the business mailbox, the customer mailbox and Google Sheets.

The frontend submits to `/backend/contact-submit.php`, matching the existing site's root-relative asset path strategy.

## Security notes

- PDO prepared statements are used for database writes and reads.
- Server-side validation is mandatory.
- reCAPTCHA is verified server-side.
- A honeypot and IP-based 5-per-15-minute limit are enforced.
- CSRF tokens are issued by the same-origin backend and checked on POST.
- Origin/Referer checks reject cross-site POSTs.
- Customer email is validated before being used as Reply-To.
- User content is HTML-escaped before insertion into email templates.
- Secrets are never returned in JSON.
- Detailed failures are written only to `backend/logs/contact-errors.log`.
