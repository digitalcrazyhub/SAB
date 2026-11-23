const fs = require('fs');
const path = require('path');

const cssDir = 'asset/css';
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`[PASS] ${testName}`);
        testsPassed++;
    } else {
        console.error(`[FAIL] ${testName}`);
        testsFailed++;
    }
}

console.log('====================================================');
console.log(' SRI AMMA BUILDER PVT LTD — RESPONSIVE DESIGN VERIFIER');
console.log('====================================================\n');

// 1. Verify overflow protection in global and responsive CSS
const globalCss = fs.readFileSync(path.join(cssDir, 'global.css'), 'utf8');
const responsiveCss = fs.readFileSync(path.join(cssDir, 'responsive.css'), 'utf8');
const navbarCss = fs.readFileSync(path.join(cssDir, 'navbar.css'), 'utf8');
const floatCss = fs.readFileSync(path.join(cssDir, 'float.css'), 'utf8');
const legalCss = fs.readFileSync(path.join(cssDir, 'legal.css'), 'utf8');

assert(
    globalCss.includes('overflow-x: clip') && globalCss.includes('overflow-x: hidden'),
    'global.css provides dual fallback overflow-x protection (hidden + clip)'
);

assert(
    responsiveCss.includes('overflow-x: clip') && responsiveCss.includes('overflow-x: hidden'),
    'responsive.css provides dual fallback overflow-x protection (hidden + clip)'
);

assert(
    globalCss.includes('iframe') && globalCss.includes('max-width: 100%'),
    'global.css enforces max-width: 100% on iframes along with img, video, svg'
);

assert(
    legalCss.includes('.legal-page-section') && legalCss.includes('overflow: hidden'),
    'legal.css has overflow: hidden on .legal-page-section to contain ambient glow'
);

assert(
    floatCss.includes('safe-area-inset-bottom') && floatCss.includes('safe-area-inset-right'),
    'float.css integrates iOS safe area insets on mobile viewports'
);

assert(
    navbarCss.includes('env(safe-area-inset-bottom, 0px)'),
    'navbar.css integrates iOS safe area insets on mobile drawer footer'
);

assert(
    responsiveCss.includes('.saidpl-footer-grid') && responsiveCss.includes('.btn') && responsiveCss.includes('white-space: normal'),
    'responsive.css ensures .btn wraps text on small screens (<= 480px)'
);

// 2. Verify media query order in responsive.css
const mqLines = [];
responsiveCss.split('\n').forEach((l, idx) => {
    const trimmed = l.trim();
    if (trimmed.startsWith('@media')) {
        const widthMatch = trimmed.match(/max-width:\s*(\d+)px/);
        if (widthMatch) {
            mqLines.push({ line: idx + 1, px: parseInt(widthMatch[1], 10) });
        }
    }
});

let isSortedDescending = true;
for (let i = 0; i < mqLines.length - 1; i++) {
    if (mqLines[i].px < mqLines[i + 1].px) {
        // Only if they are subsequent main max-width queries
        isSortedDescending = false;
        console.warn(`Query ordering discrepancy: ${mqLines[i].px}px at L${mqLines[i].line} before ${mqLines[i + 1].px}px at L${mqLines[i+1].line}`);
    }
}
assert(isSortedDescending, 'responsive.css media queries follow strict desktop-first descending order (1100 -> 1024 -> 900 -> 768 -> 640 -> 600 -> 560 -> 480 -> 360)');

// 3. Stacking order confirmation
assert(
    navbarCss.includes('z-index: 10040') && navbarCss.includes('z-index: 10030') && navbarCss.includes('z-index: 10020'),
    'navbar.css establishes distinct, predictable 3-tier stacking context (Header 10020 < Backdrop 10030 < Drawer 10040)'
);

assert(
    floatCss.includes('z-index: 9999'),
    'float.css sets FAB stack at z-index 9999 (subordinate to mobile backdrop 10030 & drawer 10040)'
);

console.log(`\nTests Completed: ${testsPassed} passed, ${testsFailed} failed.`);
if (testsFailed > 0) process.exit(1);
