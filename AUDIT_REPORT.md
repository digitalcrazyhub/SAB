# Master Website Audit & Production Readiness Report: Sri Amma Builder Pvt Ltd

**Client Name**: Sri Amma Builder Pvt Ltd  
**Website URL**: https://www.sriammabuilders.com  
**Audit Date**: November 2026  
**Auditor**: Lead Full-Stack Engineer, Security Auditor & QA Lead  
**Audit Status**: Phase 1 Complete (Checks 1, 2, 3, 4, 5, 6, 7, 8, 14 Fixed)  

---

## Executive Summary & Stack Detection

- **Frontend Architecture**: Static HTML5, Vanilla JavaScript (ES6+), Modular CSS (14 stylesheets), Font Awesome 6.5.1, Google Fonts.
- **Backend Architecture**: PHP 8+ (Apache / XAMPP on Windows), Composer (`google/apiclient`, `phpmailer/phpmailer`, `firebase/php-jwt`, `vlucas/phpdotenv`, `guzzlehttp/guzzle`).
- **Database**: MySQL / MariaDB (Schema at `backend/database/schema.sql`).
- **Hosting / Server Config**: Apache `.htaccess` (Root `.htaccess` with 301 redirects, `backend/.htaccess`, `backend/logs/.htaccess`, `backend/credentials/.htaccess`).
- **Critical Alert Handled**: Real Google Cloud Service Account private key (`sriamma@sriamma.iam.gserviceaccount.com`) was committed into git repository in commit `f2473969`. **Key untracked from git cache**, added to `.gitignore`, and logged in `docs/NEEDS_CLIENT_CONFIRMATION.md` for immediate revocation by the owner.

---

## 30 Master Audit Checks & Progress Matrix

| # | Audit Check Name | Status | Severity | Notes & Proof |
|---|---|---|---|---|
| 1 | File Inventory & Review A to Z | **Fixed** | High | Complete tree mapped in `docs/FILE_INVENTORY.md` (178 files cataloged with purpose & status). |
| 2 | File Paths & URL Scheme Consistency | **Fixed** | Medium | Uniform `./asset/...` scheme. Link verification tool `tools/check-links.js` passed with 0 missing. |
| 3 | Broken Links, Anchors & Missing Assets | **Fixed** | High | 6 missing banner/video poster references mapped to authentic project photos (`sitephotos/img01-img05.png`). `tools/check-links.js` reports 0 missing. |
| 4 | Duplicate Files Removal (`_review_trash`) | **Fixed** | Medium | 13 unreferenced/duplicate files moved non-destructively to `/_review_trash/`, documented in `docs/CLEANUP_LOG.md`. 301 redirects added to `.htaccess`. |
| 5 | Duplicate Code, Selectors & Inline Blocks | **Fixed** | Medium | Consolidated duplicate root PHP scripts into modular `backend/` packages. Semantic `<main id="mainContent">` added to 5 pages. |
| 6 | Testing & Debug Leftovers Cleanup | **Fixed** | High | `backend/test.php` and `backend/hello.php` moved to `_review_trash/`. Grep scan confirms 0 `console.log`, `alert()`, `var_dump`, `TODO` in active files. |
| 7 | Unused Packages & Dependencies | **Fixed** | Medium | 37,200+ vendor files untracked from Git staging cache via `git rm -r --cached backend/vendor`, permanently added to `.gitignore`. |
| 8 | Complete Incomplete HTML/CSS/JS & Lint | **Fixed** | Low | Automated validator `tools/validate-html.js` passes with 0 issues across all 13 core pages. |
| 9 | Form Testing & Submission Integrity | Pending (Phase 4) | High | Contact & enquiry forms to be tested against edge cases, SQLi, XSS, and spam. |
| 10 | Database Security & Prepared Statements | Pending (Phase 4) | Critical | Verify PDO prepared statements, schema.sql validity, and credential isolation. |
| 11 | Environment Variables & Secrets Isolation | **Blocked on Owner** | Critical | Service account JSON untracked from Git. Awaiting owner key revocation in Google Cloud Console. |
| 12 | Performance Optimization (Images, Cache, WebP) | Pending (Phase 6) | Medium | Optimize images, implement WebP/AVIF, lazy loading, font-display, and caching headers. |
| 13 | Company Details Single Source of Truth | Pending (Phase 2) | High | Central config files (`company-config.js` and `company.php`) to be created matching exact Company Data. |
| 14 | HTML Semantic Validation & Landmarks | **Fixed** | Low | `<main id="mainContent">` verified on all 13 core pages. Heading hierarchy and landmark structure validated. |
| 15 | Form Sanitization, Validation & CSRF | Pending (Phase 4) | Critical | Server-side validation, CSRF tokens, output escaping, and email header sanitization. |
| 16 | Server Hardening (`.htaccess` / Nginx) | **In Progress** | Critical | Root `.htaccess` deployed with 301 redirects, directory indexing disabled, sensitive files denied. |
| 17 | Spam Protection (Honeypot, Time-trap, reCAPTCHA) | Pending (Phase 4) | High | Implement honeypot, time-trap, and reCAPTCHA v3 / Turnstile fallback. |
| 18 | Rate Limiting & Abuse Prevention | Pending (Phase 4) | High | Per-IP submission throttling (5 requests per 10 mins) returning HTTP 429. |
| 19 | Email Verification & SMTP Architecture | Pending (Phase 4) | High | PHPMailer SMTP integration, MX domain validation, auto-reply, SPF/DKIM guidance. |
| 20 | API Keys & Secrets Off Frontend | Pending (Phase 4) | High | Ensure no private API keys, webhook URLs, or tokens are exposed on client side. |
| 21 | Full Security Audit & Git History Secrets Scan | **Blocked on Owner** | Critical | Untracked leaked key from cache. History scan to be documented; awaiting owner authorization for history rewrite. |
| 22 | Meta Tags, SEO Titles & Descriptions | Pending (Phase 7) | Medium | Unique titles, meta descriptions, canonical URLs, OG and Twitter tags per page. |
| 23 | Robots.txt & Sitemap.xml | Pending (Phase 7) | Medium | Validate robots.txt and verify sitemap.xml contains only live canonical URLs. |
| 24 | Schema Markup (JSON-LD) | Pending (Phase 7) | Medium | Verify `LocalBusiness` / `GeneralContractor` JSON-LD adheres strictly to Company Data. |
| 25 | Loading States, Empty States & Error Pages | Pending (Phase 7) | Medium | Verify `404.html`, `500.html`, form loading spinner, and empty state messaging. |
| 26 | Error Tracking, Logging & Debug Mode | Pending (Phase 4) | High | Implement centralized error logger to non-public `logs/` directory; `APP_DEBUG=false` in production. |
| 27 | Authentication & Admin Panel Security | Pending (Phase 4) | High | Audit any admin or login scripts for session security, password hashing, and brute-force lockout. |
| 28 | File Upload Security | Pending (Phase 4) | High | Validate MIME types, extension allowlist, file size limits, and non-executable storage. |
| 29 | Console Cleanliness (Desktop & Mobile) | Pending (Phase 7) | Low | Ensure zero console errors, zero failed requests, and zero uncaught exceptions. |
| 30 | Navbar, Footer, Floating Actions & Mobile Responsive | Pending (Phase 3) | High | Cross-device testing (320px–1440px), touch targets >= 44px, no overflow, keyboard accessibility. |

---

## Detailed Evidence & Verification Logs

### Evidence for Check 2 & Check 3 (Link Verification)
```text
====================================================
 SRI AMMA BUILDER PVT LTD — LINK VERIFICATION AUDIT
====================================================
Pages & Includes Checked: 16
Total References Scanned: 455
Missing References Found: 0

SUCCESS: 0 missing files, 0 broken internal links, 0 broken assets.
```

### Evidence for Check 8 & Check 14 (HTML Semantic & Structure Validation)
```text
[index.html]: VALID
[about.html]: VALID
[services.html]: VALID
[industrial-building-construction.html]: VALID
[commercial_building_construction.html]: VALID
[residential_building_construction.html]: VALID
[godown_building_construction.html]: VALID
[projects.html]: VALID
[team.html]: VALID
[contact.html]: VALID
[privacy-policy.html]: VALID
[terms-and-conditions.html]: VALID
[404.html]: VALID

Total Validation Issues: 0
```
