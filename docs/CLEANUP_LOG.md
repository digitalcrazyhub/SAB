# Project Cleanup & File Migration Log

Per Rule 3 (No Destructive Deletes), no files have been permanently removed using `rm`. All candidates for removal have been moved to `/_review_trash/` with their original directory structure preserved.

---

| Original Path | Destination Path in `_review_trash/` | Reason for Movement | Replacement / Active Implementation | Date Moved |
|:---|:---|:---|:---|:---|
| `terms-and-condition.html` | `_review_trash/terms-and-condition.html` | Exact byte-for-byte SHA256 duplicate of `terms-and-conditions.html`. | `terms-and-conditions.html` (Canonical). 301 redirect added to `.htaccess`. | 2026-11-21 |
| `service.html` | `_review_trash/service.html` | Legacy unreferenced duplicate of `services.html`. | `services.html` (Master services page). 301 redirect added to `.htaccess`. | 2026-11-21 |
| `project.html` | `_review_trash/project.html` | Legacy unreferenced duplicate of `projects.html`. | `projects.html` (Portfolio gallery page). 301 redirect added to `.htaccess`. | 2026-11-21 |
| `asset/page/contact.html` | `_review_trash/asset/page/contact.html` | Errant legacy commit artifact in subfolder with broken relative paths. | `contact.html` in root. | 2026-11-21 |
| `backend/test.php` | `_review_trash/backend/test.php` | Testing / debug echo script leftover (`echo "PHP BACKEND WORKING"`). | None needed in production. | 2026-11-21 |
| `backend/hello.php` | `_review_trash/backend/hello.php` | Testing / debug echo script leftover (`echo "HELLO PHP"`). | None needed in production. | 2026-11-21 |
| `backend/helpers.php` | `_review_trash/backend/helpers.php` | Redundant helper script. Unreferenced. | Functions consolidated into `backend/config/config.php` under `namespace SAB\Config`. | 2026-11-21 |
| `backend/config.php` | `_review_trash/backend/config.php` | Root duplicate of organized config module. | `backend/config/config.php` (Single source of truth). | 2026-11-21 |
| `backend/database.php` | `_review_trash/backend/database.php` | Root duplicate of organized database module. | `backend/database/database.php` (PDO prepared statements). | 2026-11-21 |
| `backend/mailer.php` | `_review_trash/backend/mailer.php` | Root duplicate of organized mailer module. | `backend/mail/mailer.php` (PHPMailer SMTP). | 2026-11-21 |
| `backend/csrf.php` | `_review_trash/backend/csrf.php` | Root duplicate of organized CSRF module. | `backend/security/csrf.php` (Session-bound token verification). | 2026-11-21 |
| `backend/recaptcha.php` | `_review_trash/backend/recaptcha.php` | Root duplicate of organized reCAPTCHA module. | `backend/security/recaptcha.php` (reCAPTCHA v3 verification). | 2026-11-21 |
| `backend/google-sheets.php` | `_review_trash/backend/google-sheets.php` | Root duplicate of organized Google Sheets module. | `backend/google/sheets.php` (Google Sheets client). | 2026-11-21 |
