/**
 * SRI AMMA BUILDER PVT LTD — AUTOMATED LINK & ASSET VERIFICATION TOOL
 * Path: /tools/check-links.js
 * Parses every HTML page and include component, verifying all local references exist on disk.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const targetPages = [
    'index.html',
    'about.html',
    'services.html',
    'industrial-building-construction.html',
    'commercial_building_construction.html',
    'residential_building_construction.html',
    'godown_building_construction.html',
    'projects.html',
    'team.html',
    'contact.html',
    'privacy-policy.html',
    'terms-and-conditions.html',
    '404.html',
    'asset/includes/navbar.html',
    'asset/includes/footer.html',
    'asset/includes/floating-actions.html'
];

let totalChecks = 0;
let missingCount = 0;
const missingItems = [];

targetPages.forEach(relPage => {
    const fullPath = path.join(rootDir, relPage);
    if (!fs.existsSync(fullPath)) {
        console.error(`Page not found: ${relPage}`);
        missingCount++;
        return;
    }

    const html = fs.readFileSync(fullPath, 'utf8');
    const isInclude = relPage.startsWith('asset/includes/');
    // For includes, references like ./asset/img/Nav_logo.png are resolved relative to root
    const pageDir = isInclude ? rootDir : path.dirname(fullPath);

    // Collect IDs for anchor verification
    const pageIds = new Set();
    const idRegex = /id=\"([^\"]+)\"/g;
    let idMatch;
    while ((idMatch = idRegex.exec(html)) !== null) {
        pageIds.add(idMatch[1]);
    }

    // 1. Check Asset Sources: src, href (stylesheets, icons), poster
    const assetRegex = /<(?:img|script|video|audio|source)\s+[^>]*src=\"([^\"]+)\"|<link\s+[^>]*href=\"([^\"]+)\"|<video\s+[^>]*poster=\"([^\"]+)\"/gi;
    let match;
    while ((match = assetRegex.exec(html)) !== null) {
        const url = (match[1] || match[2] || match[3] || '').trim();
        if (!url || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:') || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('javascript:')) {
            continue;
        }

        totalChecks++;
        const cleanUrl = url.split('?')[0].split('#')[0];
        const resolvedPath = path.resolve(pageDir, cleanUrl);

        if (!fs.existsSync(resolvedPath)) {
            missingCount++;
            missingItems.push({
                file: relPage,
                reference: url,
                resolvedPath: path.relative(rootDir, resolvedPath)
            });
        }
    }

    // 2. Check Anchor links and internal page links
    const linkRegex = /<a\s+[^>]*href=\"([^\"]+)\"/gi;
    while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1].trim();
        if (!href || href === '#' || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('whatsapp:')) {
            continue;
        }

        totalChecks++;
        if (href.startsWith('#')) {
            const anchorId = href.substring(1);
            if (!isInclude && !pageIds.has(anchorId)) {
                // Check if anchor is valid
                missingCount++;
                missingItems.push({
                    file: relPage,
                    reference: href,
                    type: 'Missing Anchor ID on same page'
                });
            }
        } else {
            const [pagePart, anchorPart] = href.split('#');
            const resolvedPage = path.resolve(pageDir, pagePart);
            if (!fs.existsSync(resolvedPage)) {
                missingCount++;
                missingItems.push({
                    file: relPage,
                    reference: href,
                    resolvedPath: path.relative(rootDir, resolvedPage)
                });
            } else if (anchorPart && !isInclude) {
                const targetHtml = fs.readFileSync(resolvedPage, 'utf8');
                if (!targetHtml.includes(`id="${anchorPart}"`)) {
                    missingCount++;
                    missingItems.push({
                        file: relPage,
                        reference: href,
                        type: `Missing Anchor ID #${anchorPart} in ${pagePart}`
                    });
                }
            }
        }
    }
});

console.log('====================================================');
console.log(' SRI AMMA BUILDER PVT LTD — LINK VERIFICATION AUDIT');
console.log('====================================================');
console.log(`Pages & Includes Checked: ${targetPages.length}`);
console.log(`Total References Scanned: ${totalChecks}`);
console.log(`Missing References Found: ${missingCount}`);

if (missingCount > 0) {
    console.log('\nMissing References:');
    missingItems.forEach(item => {
        console.log(` - [${item.file}] -> ${item.reference} (${item.resolvedPath || item.type})`);
    });
    process.exit(1);
} else {
    console.log('\nSUCCESS: 0 missing files, 0 broken internal links, 0 broken assets.');
    process.exit(0);
}
