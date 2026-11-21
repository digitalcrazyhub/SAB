# COMPLETE PROJECT AUDIT REPORT: SRI AMMA INDUSTRIAL DEVELOPERS PVT LTD

**Project**: Sri Amma Builder / Sri Amma Industrial Developers Pvt. Ltd.  
**Workspace**: `c:\xampp\htdocs\SAB`  
**Date of Audit**: October 31, 2026  
**Auditor**: Senior UI/UX Designer, Lead Frontend Engineer & Backend Systems Architect  

---

## 1. PROJECT INVENTORY & ROUTE MAP

| Page File | Route URL | Purpose & Scope | Rebuild Status |
|:---|:---|:---|:---|
| `index.html` | `/index.html` | Corporate homepage establishing 35-year civil heritage, core services, video process, testimonials, and lead funnel | **Completed** |
| `about.html` | `/about.html` | Corporate heritage, MD message with authentic photo, 35-year timeline, core values, 4 genuine awards, client grid | **Completed** |
| `services.html` | `/services.html` | Master services catalog presenting 4 core sectors, technical specs, and 4-phase turnkey delivery framework | **Completed** |
| `industrial-building-construction.html` | `/industrial-building-construction.html` | Heavy industrial civil engineering: manufacturing plants, PEB steel sheds, Trimix flooring, vibration-isolated machine bases | **Completed** |
| `residential_building_construction.html` | `/residential_building_construction.html` | Architect-designed custom homes, luxury villas, gated communities, multi-storey residential apartments | **Completed** |
| `commercial_building_construction.html` | `/commercial_building_construction.html` | Turnkey commercial towers, retail showrooms, enterprise business hubs, modern healthcare medical centers | **Completed** |
| `godown_building_construction.html` | `/godown_building_construction.html` | Clear-span PEB warehouses, agricultural bulk commodity storage, logistics cross-dock hubs, cold chain facilities | **Completed** |
| `projects.html` | `/projects.html` | Interactive architectural portfolio: 23 genuine client projects with category filtering and accessible modal lightbox | **Completed** |
| `team.html` | `/team.html` | Technical leadership directory: 9 genuine staff profiles (`team0.png`–`team8.png`) and operational quality standards | **Completed** |
| `contact.html` | `/contact.html` | Dual-slide hero banner, 4 direct contact cards, validated lead intake form, CSRF token auto-fetch, reCAPTCHA v3 fallback | **Completed** |
| `404.html` | `/404.html` | Custom corporate 404 error page with quick links to core services and homepage | **Completed** |
| `project.html` | `/project.html` | Canonical 301/meta-refresh backward compatibility redirect to `projects.html` | **Completed** |
| `service.html` | `/service.html` | Canonical 301/meta-refresh backward compatibility redirect to `services.html` | **Completed** |
| `asset/page/contact.html` | `/asset/page/contact.html` | Errant legacy commit artifact converted into clean HTML/JS redirect to root `contact.html` | **Completed** |

---

## 2. AUDIT FINDINGS BY SEVERITY CATEGORY

### 2.1 CRITICAL FINDINGS (Resolved)

1. **Unresolved Git Merge Conflict Markers Across Codebase**:
   - *Finding*: Prior to rebuild, multiple files contained Git merge conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`).
   - *Impact*: In `backend/contact-submit.php`, an unresolved conflict on line 2 caused an immediate fatal syntax error: `PHP Parse error: syntax error, unexpected token "<<" in contact-submit.php on line 2`. In `backend/.htaccess`, conflict markers broke Apache directives. In `asset/js/contact.js`, 10 conflict markers broke form validation. In `index.html`, 14 conflict markers broke HTML rendering.
   - *Resolution*: All conflict markers were systematically inspected, merged with the intended logic, and completely eliminated. An automated repository scan verified **zero merge conflict markers** across all source files.

2. **Rogue CSS Rule in `asset/css/main.css` Breaking Hero Layout**:
   - *Finding*: Line 248 of `asset/css/main.css` declared `.btn-accent { margin-top: 115px; }`.
   - *Impact*: This rule pushed primary CTA buttons 115px down into subsequent sections, causing layout shifts and overlapping headers.
   - *Resolution*: Removed the rogue property; standardized all button styles in `asset/css/global.css`.

3. **Backend Public Access to Sensitive Data**:
   - *Finding*: `backend/credentials/google-service-account.json`, `.env`, and SQL dump files existed in directories potentially accessible over HTTP.
   - *Impact*: Potential exposure of Google Service Account keys and database connection parameters.
   - *Resolution*: Hardened `backend/.htaccess` to return HTTP 403 Forbidden on all requests to `.env`, `.sql`, `.log`, `.json`, `composer.*`, `credentials/`, and module subdirectories, while whitelisting only `backend/api/contact.php`.

---

### 2.2 HIGH FINDINGS (Resolved)

1. **Duplicate `:root` Declarations with Competing Hex Codes**:
   - *Finding*: Duplicate `:root` declarations were present in `main.css`, `about.css`, `service.css`, `team.css`, `project.css`, `contact.css`, `navbar.css`, `footer.css`, `float.css`, and `industrial-building-construction.css`.
   - *Impact*: CSS cascade conflicts made global color changes impossible; brand consistency was broken across pages.
   - *Resolution*: Established [`asset/css/root.css`](file:///c:/xampp/htdocs/SAB/asset/css/root.css) as the single source of truth for all brand tokens (`#A5000D`, `#5F5F5F`), supporting architectural neutrals, typography tokens, layout scales, and elevations. All duplicate `:root` blocks were removed from page stylesheets.

2. **Copy-Paste Text Blunders in Commercial & Residential Pages**:
   - *Finding*: In `commercial_building_construction.html`, the lead text read: *"Building strong, modern, and comfortable Commercial homes designed for quality living and lasting value... whether it's a luxurious villa, a cozy apartment"*. In all 3 service pages, image `alt` attributes were copied from the industrial page ("Manufacturing Units Facility", "Industrial Sheds").
   - *Impact*: Highly unprofessional corporate presentation; eroded client credibility; severely hurt search engine ranking.
   - *Resolution*: Rebuilt all 4 service detail pages with sector-specific engineering content, verified capabilities, and accurate descriptive image `alt` attributes.

3. **Third-Party External Hotlink in `about.html`**:
   - *Finding*: Line 432 of `about.html` loaded an image from an external staging website (`https://demo.awaikenthemes.com/builtup/wp-content/uploads/2024/02/team-1.jpg`).
   - *Impact*: External dependency vulnerability, potential 404 if external theme demo is deleted, layout shift, and privacy violation.
   - *Resolution*: Replaced with local high-resolution asset `./asset/img/Heavy Machinery Factories.jpg`.

---

### 2.3 MEDIUM FINDINGS (Resolved)

1. **Floating Action Button Class Inconsistency**:
   - *Finding*: `float.js` dynamically toggled the CSS class `.saidpl-show`, whereas `asset/css/float.css` only provided styles for `.is-visible`.
   - *Impact*: The floating contact button remained invisible or failed to fade in reliably on scroll.
   - *Resolution*: Updated `asset/css/float.css` to support both `.saidpl-show` and `.is-visible`.

2. **Corrupted UTF-8 Quotes and Dashes**:
   - *Finding*: Multiple HTML files contained corrupted character sequences such as `”“` where an em-dash (`—`) or en-dash (`–`) was intended.
   - *Impact*: Visual artifacts and typography bugs in modern browsers.
   - *Resolution*: Replaced all corrupted entities with clean HTML entities (`&mdash;`, `&ndash;`, `&bull;`).

3. **Missing Canonical and OpenGraph Meta Tags**:
   - *Finding*: Several internal pages lacked canonical URL references and Open Graph social cards.
   - *Impact*: Search engine crawling ambiguity and poor link previews when shared on messaging platforms.
   - *Resolution*: Implemented unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph, and Twitter Card metadata across all 10 pages.

---

### 2.4 LOW FINDINGS (Resolved)

1. **Errant File `asset/page/contact.html`**:
   - *Finding*: A duplicate contact page file with broken relative paths (`../css/`) existed inside `asset/page/`.
   - *Resolution*: Converted into a clean, instant HTML meta-refresh and JavaScript redirect to root `contact.html`.

2. **Missing Corporate 404 Page**:
   - *Finding*: No dedicated 404 error page existed in the repository.
   - *Resolution*: Built [`404.html`](file:///c:/xampp/htdocs/SAB/404.html) with architectural error messaging, navigation options, and links to core services.

---

### 2.5 IMPROVEMENT RECOMMENDATIONS IMPLEMENTED

1. **Central Design Token System**: Unified `--primary-color: #A5000D`, `--secondary-color: #5F5F5F`, and neutral architectural tokens into `asset/css/root.css`.
2. **Schema.org JSON-LD Structured Data**: Embedded structured data across all pages (`GeneralContractor`, `AboutPage`, `Service`, `ProfilePage`, `CollectionPage`, `ContactPage`, `BreadcrumbList`).
3. **Resilient Asynchronous Component Loading**: Updated `nav-call.js` using `Promise.allSettled()` to guarantee that navbar, footer, and floating buttons render without layout shift.
4. **Enhanced Portfolio Lightbox**: Added keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`) and swipe gestures to the image lightbox in `projects.html`.
5. **Backend Contact API Architecture**: Delegated `backend/contact-submit.php` to `backend/api/contact.php`, providing PDO MySQL storage, CSRF validation, Google reCAPTCHA v3 verification, PHPMailer SMTP alerts, and Google Sheets fallback logging.

