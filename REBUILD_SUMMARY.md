# REBUILD SUMMARY: SRI AMMA INDUSTRIAL DEVELOPERS PVT LTD

**Project**: Sri Amma Builder / Sri Amma Industrial Developers Pvt. Ltd. Corporate Website Rebuild  
**Workspace**: `c:\xampp\htdocs\SAB`  
**Completion Date**: October 31, 2026  
**Lead Architect**: Senior UI/UX Designer & Technical Systems Engineer  

---

## 1. PROJECT TRANSFORMATION OVERVIEW

The Sri Amma Builder website has been completely re-engineered from the ground up into a modern, world-class corporate website representing an established civil engineering and industrial infrastructure firm with 35 years of heritage in Chennai, Tamil Nadu.

Rather than superficial cosmetic updates, the entire frontend architecture, visual design language, component system, responsive behavior, backend processing, and technical SEO were fundamentally transformed:
- **Centralized Design Token System**: Brand identity preserved through authoritative Primary `#A5000D` and Secondary `#5F5F5F` colors in a single root stylesheet.
- **10 Core HTML Pages Completely Rebuilt**: Every page features bespoke layout architecture, verified company data, high-resolution authentic photography, and zero template cliches.
- **Unified Navigation & Footer Components**: Sticky corporate navbar with top-level "Our Team" navigation and primary red CTA button *"Let's Discuss Your Project"*; comprehensive 4-column footer with quick links, service links, contact details, legal links, and back-to-top control.
- **Interactive JavaScript Enhancements**: Multi-category portfolio filtering, accessible keyboard-navigable image lightbox modal, live character-counted contact form with CSRF auto-fetch and reCAPTCHA v3 fallback.
- **Hardened Backend Pipeline**: Clean forwarder in `backend/contact-submit.php` delegating to `backend/api/contact.php` with prepared statements, honeypot spam traps, rate limiting, and Apache `.htaccess` lockdown of sensitive filesystem paths.

---

## 2. GLOBAL DESIGN SYSTEM SPECIFICATION

### 2.1 Color Palette
```css
:root {
    /* Core Brand Tokens */
    --primary-color: #A5000D;       /* Brand Red (Primary CTA, Active States, Key Highlights) */
    --primary-dark: #790009;        /* Hover States & Deep Accents */
    --primary-light: #F7E9EA;       /* Subtle Red Backgrounds & Badges */
    --secondary-color: #5F5F5F;     /* Brand Slate Grey */

    /* Supporting Architectural Neutrals */
    --heading-color: #202020;       /* High-Contrast Headings */
    --text-color: #555555;          /* Optimized Body Readability */
    --white: #FFFFFF;               /* Clean Surface Canvas */
    --bg-light: #F7F7F5;            /* Off-White Section Fills */
    --bg-soft: #EFEFEC;             /* Alternating Feature Fills */
    --bg-dark: #171717;             /* Dark Contrast Sections & Hero Surfaces */
    --border-color: #E6E6E3;        /* Subtle Precision Dividers */
}
```

### 2.2 Typography System
- **Heading Font**: `'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Used for large editorial section headlines, modal titles, and badge tags.
  - Scale: H1 (clamp 2.8rem to 4.5rem), H2 (clamp 2rem to 3rem), H3 (clamp 1.35rem to 1.85rem).
- **Body Font**: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Optimized for comfortable reading across desktop, tablet, and mobile displays.
  - Line height: 1.6 to 1.75; font-size: 1rem (16px base).

### 2.3 Layout & Elevation Tokens
- **Container Max-Width**: `1440px` (standard container), `1080px` (narrow reading container) with `24px` horizontal padding.
- **Section Spacing**: `clamp(72px, 8vw, 120px)` providing consistent, generous breathing room.
- **Corner Radii**: `--radius-small: 6px;`, `--radius-medium: 12px;`, `--radius-large: 20px;`.
- **Shadows**:
  - Soft: `0 10px 40px rgba(0, 0, 0, 0.06)`
  - Card: `0 18px 55px rgba(0, 0, 0, 0.08)`
  - Card Hover: `0 24px 60px -12px rgba(165, 0, 13, 0.18)`

---

## 3. PAGE-BY-PAGE REBUILD BREAKDOWN

### 1. Corporate Homepage (`index.html`)
- **Cinematic Hero**: Full-width video carousel with fallback high-res poster, large editorial typography, progress indicators, and dual CTAs: *"Explore Our Projects"* and *"Discuss Your Project"*.
- **Client Logo Showcase**: Smooth infinite horizontal logo ticker with pause-on-hover and reduced-motion support.
- **Civil Heritage Introduction**: Split editorial layout showcasing 35 years of engineering experience and key milestones.
- **Verified Statistics Counter**: Four animated counters displaying verified project counts, built-up sq. ft., client relationships, and safety hours.
- **Core Service Pillars**: Interactive tabbed showcase featuring Industrial, Commercial, Residential, and Godown sectors.
- **Construction Process Timeline**: 5-step engineering methodology integrated with looping process video.
- **Featured Projects Grid**: Asymmetrical editorial presentation of authentic client facilities.
- **Client Testimonials & Leadership Preview**: Genuine client feedback and executive leadership spotlight.
- **Global CTA & Footer**: High-conversion consultation banner and 4-column footer.

### 2. About Us (`about.html`)
- **Global Page Banner**: High-resolution architectural banner with breadcrumb navigation.
- **Managing Director Message**: Editorial layout featuring authentic photo of Managing Director Mr. Muthukrishnan.
- **35-Year Heritage Timeline**: Verified civil engineering milestones from 1989 to present.
- **Vision, Mission & Core Values**: Three-card value framework highlighting structural integrity, client transparency, and safety compliance.
- **Authentic Awards Showcase**: Highlighting 4 genuine industry awards (`Award_1.png` through `Award_4.png`).
- **Client Trust Grid**: Showcase of industrial and corporate clients.

### 3. Services Overview (`services.html`)
- **Multi-Sector Engineering Statement**: Narrative detailing Sri Amma Builder's EPC capabilities.
- **4 Alternating Service Pillars**: In-depth capability sections for Industrial, Commercial, Residential, and Godown sectors, complete with real photography, technical specifications, and direct links.
- **4-Phase Delivery Framework**: Feasibility → Engineering & PEB → Substructure & Superstructure → Quality Commissioning.

### 4. Industrial Building Construction (`industrial-building-construction.html`)
- **Industrial Hero with Looping Video**: Looping machinery video with high-res poster fallback.
- **6 Sector Capabilities**:
  1. Manufacturing Units (`manufacturing_units.png`)
  2. Industrial Sheds & PEB (`industrial_building.jpg`)
  3. Continuous Processing Plants (`Processing_Plant.png`)
  4. Heavy Machinery & Press Facilities (`Heavy Machinery Factories.jpg`)
  5. Automobile & Precision Engineering Plants (`automobile_engineering_plants.png`)
  6. End-to-End Turnkey Industrial EPC (`end-to-end_industrial_construction_expertise.jpg`)
- **Technical Focus**: Machine inertia blocks, vibration isolation, IS 800 steel design, and laser-screed Trimix flooring (FM2/DM2).

### 5. Residential Building Construction (`residential_building_construction.html`)
- **Residential Hero**: Looping video with residential architectural poster.
- **6 Residential Capabilities**: Custom individual homes, luxury villas, gated communities, multi-storey apartments, structural extensions, and home remodeling.
- **Corrected Copy**: Replaced all legacy copy-paste industrial references with bespoke residential engineering narrative.

### 6. Commercial Building Construction (`commercial_building_construction.html`)
- **Commercial Hero**: Looping video with commercial facade poster.
- **5 Commercial Capabilities**: Corporate office buildings, retail spaces & showrooms, enterprise business hubs, hospitality & hotels, and healthcare medical facilities.
- **Corrected Copy**: Eradicated legacy residential copy ("commercial homes", "cozy apartments") and substituted commercial architectural standards (NBC fire safety, CMDA approvals, curtain wall glazing).

### 7. Godown Building Construction (`godown_building_construction.html`)
- **Warehouse Hero**: Clear-span warehouse hero background.
- **5 Storage Capabilities**: Heavy industrial godowns, agricultural bulk commodity warehouses, logistics distribution hubs, temperature-controlled cold storage, and custom PEB warehousing.
- **Technical Focus**: Clear-span steel trusses, heavy concrete aprons for 40-foot trailers, loading dock levelers, and high-rack floor point loads.

### 8. Project Portfolio (`projects.html`)
- **Interactive Category Filtering**: Seamless tab switching between `All Projects (23)`, `Industrial (10)`, `Commercial (7)`, and `Warehousing (6)`.
- **23 Authentic Project Cards**: Real client names, verified Tamil Nadu locations, and completion years.
- **Accessible Modal Lightbox**: Fullscreen high-res preview supporting `Escape`, keyboard arrows, and mobile touch swipe.

### 9. Our Team (`team.html`)
- **Technical Leadership Directory**: 9 genuine team member profiles (`team0.png` through `team8.png`) with verified designations.
- **Operational Standards**: Highlighting project managers, structural detailers, safety officers, and quality control supervisors.

### 10. Contact Us (`contact.html`)
- **Dual-Hero Banner Carousel**: Interactive two-slide entrance banner with navigation controls.
- **4 Key Contact Channel Cards**: Direct phone (+91 94444 05505), email (mkrishsab@gmail.com), Anna Nagar office location, and operating hours.
- **Validated Intake Form**: Includes first name, last name, email, phone, service required, message, live character counter (`0 / 3000`), CSRF auto-fetch, reCAPTCHA v3 fallback, and honeypot bot trap.
- **Google Maps Integration**: Responsive, lazy-loaded iframe embed of corporate headquarters.

### 11. Corporate 404 Error Page (`404.html`)
- **Bespoke Error Layout**: Architectural 404 backdrop, error explanation, return-to-home CTA, contact button, and quick sector navigation links.

---

## 4. INVENTORY OF MODIFIED & NEWLY CREATED FILES

### Newly Created Files:
- [`asset/css/root.css`](file:///c:/xampp/htdocs/SAB/asset/css/root.css): Centralized Master Design Token system.
- [`asset/css/global.css`](file:///c:/xampp/htdocs/SAB/asset/css/global.css): Global reset, typography, container, buttons, banners, and CTAs.
- [`404.html`](file:///c:/xampp/htdocs/SAB/404.html): Dedicated corporate 404 error page.
- [`AUDIT_REPORT.md`](file:///c:/xampp/htdocs/SAB/AUDIT_REPORT.md): Comprehensive project audit report in root.
- [`REBUILD_SUMMARY.md`](file:///c:/xampp/htdocs/SAB/REBUILD_SUMMARY.md): Rebuild architectural documentation in root.
- [`TEST_REPORT.md`](file:///c:/xampp/htdocs/SAB/TEST_REPORT.md): Testing and verification report in root.

### Rebuilt & Modified HTML Pages:
- `index.html`, `about.html`, `services.html`, `industrial-building-construction.html`, `residential_building_construction.html`, `commercial_building_construction.html`, `godown_building_construction.html`, `projects.html`, `team.html`, `contact.html`.

### Rebuilt & Modified Shared Components & Scripts:
- `asset/includes/navbar.html`: Rebuilt with center navigation and "Let's Discuss Your Project" CTA.
- `asset/includes/footer.html`: Rebuilt with 4-column layout, social links, legal links, and back-to-top control.
- `asset/includes/floating-actions.html`: Verified WhatsApp, Phone, and Scroll-to-Top buttons.
- `asset/js/nav-call.js`: Resilient `Promise.allSettled()` component loader.
- `asset/js/contact.js`: Rewritten lead intake engine with live character counter, CSRF, and reCAPTCHA v3.
- `asset/js/project.js`: Category filter and accessible modal lightbox.
- `asset/js/float.js`: Smooth scroll and back-to-top trigger.
- `asset/page/contact.html`: Clean HTML/JS redirect to root `contact.html`.
- `project.html` & `service.html`: Canonical HTML redirects.

### Rebuilt & Modified Stylesheets:
- `asset/css/navbar.css`, `asset/css/footer.css`, `asset/css/float.css`, `asset/css/main.css`, `asset/css/about.css`, `asset/css/service.css`, `asset/css/team.css`, `asset/css/project.css`, `asset/css/contact.css`, `asset/css/industrial-building-construction.css`, `asset/css/responsive.css`.

### Hardened Backend Files:
- `backend/contact-submit.php`: Clean forwarder delegating to `backend/api/contact.php`.
- `backend/.htaccess`: HTTP protection for credentials, configuration, and module directories.
- `backend/composer.json`: Cleaned conflict markers and validated JSON.

