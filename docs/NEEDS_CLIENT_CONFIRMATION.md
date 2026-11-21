# Items Requiring Client / Owner Confirmation

This document tracks items that require explicit owner decision, clarification, or external actions that cannot be performed autonomously.

---

## 1. Primary Phone Number Incomplete (CRITICAL)
- **Current Value Provided**: `+91 94444 0505`
- **Issue**: Indian mobile numbers require 10 digits after the `+91` country code. The provided primary number contains only 9 digits (`94444 0505`).
- **Temporary Handling in Place**:
  - The number is rendered as plain text (no broken `tel:` or `wa.me:` links).
  - Floating call and WhatsApp action buttons route to the verified secondary number: `+91 93802 43013` (`tel:+919380243013`, `https://wa.me/919380243013`).
  - Constant `PRIMARY_PHONE_TEL = ""` is set in `asset/js/company-config.js` and `backend/config/company.php`.
- **Action Required by Client**: Confirm the exact 10-digit primary mobile number. Once confirmed, update `PRIMARY_PHONE_TEL` in the central config files.

---

## 2. Leaked Google Cloud Service Account Key (SECURITY CRITICAL)
- **Compromised Asset**: `backend/credentials/google-service-account.json`
- **Compromised Identity**: `sriamma@sriamma.iam.gserviceaccount.com` (Project: `sriamma`)
- **Git Commit of Exposure**: `f2473969` ("add backend file")
- **Action Required by Owner**:
  1. Open [Google Cloud Console](https://console.cloud.google.com/) &rarr; **IAM & Admin** &rarr; **Service Accounts**.
  2. Select `sriamma@sriamma.iam.gserviceaccount.com` &rarr; **Keys** tab.
  3. **Delete / Revoke** the compromised key immediately.
  4. Create a fresh key JSON and store it outside the public web root (configured via `GOOGLE_SERVICE_ACCOUNT_PATH`).
  5. Rotate all secrets in `.env` (DB password, SMTP app password, reCAPTCHA secret key).

---

## 3. Git History Rewrite & Force Push Authorization
- **Issue**: Even after untracking `backend/credentials/google-service-account.json` from the working tree, the secret remains in Git commit history.
- **Rule**: Per Rule 3b, rewriting Git history (`git filter-repo`) and force-pushing requires explicit written owner authorization.
- **Action Required by Owner**:
  - Confirm all collaborators are notified and a backup clone is saved.
  - Authorize running `git filter-repo` to permanently purge `backend/credentials/google-service-account.json` from history.

---

## 4. Missing Project Site Photography
- **Issue**: The following image references were missing on disk from previous template commits:
  - `Heavy Machinery Factories.jpg` (referenced in `index.html` line 498 and `about.html` line 260)
  - `Commercial_building.jpg` (referenced in `commercial_building_construction.html`)
  - `godown_building.jpg` (referenced in `godown_building_construction.html`)
  - `industrial_banner1.png` (referenced in `industrial-building-construction.html`)
  - `residential-banner1.jpg` (referenced in `residential_building_construction.html`)
- **Temporary Handling in Place**: Mapped to verified authentic site photos from `asset/img/sitephotos/` (`img01.png`–`img06.png`).
- **Action Required by Client**: Review replacement banner images or provide custom high-resolution photography for each construction sector.
