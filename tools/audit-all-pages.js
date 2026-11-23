const fs = require('fs');
const path = require('path');

const pages = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('=== HTML PAGES AND STYLESHEET INVENTORY ===');
const stylesheetMap = {};

pages.forEach(p => {
    const html = fs.readFileSync(p, 'utf8');
    const matches = html.match(/<link[^>]+href=["']([^"']+\.css[^"']*)["'][^>]*>/gi) || [];
    const cssFiles = matches.map(m => {
        const href = m.match(/href=["']([^"']+)["']/i);
        return href ? href[1] : null;
    }).filter(Boolean);

    stylesheetMap[p] = cssFiles;
    console.log(`\nPage: ${p} (${cssFiles.length} stylesheets)`);
    cssFiles.forEach(f => console.log(`  - ${f}`));
});

// Check viewport meta tag on all pages
console.log('\n=== VIEWPORT META TAG AUDIT ===');
pages.forEach(p => {
    const html = fs.readFileSync(p, 'utf8');
    const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i);
    if (!viewportMatch) {
        console.error(`[FAIL] ${p}: Missing viewport meta tag!`);
    } else {
        const content = viewportMatch[0].match(/content=["']([^"']+)["']/i);
        const val = content ? content[1] : '';
        const isValid = val.includes('width=device-width') && val.includes('initial-scale=1');
        if (!isValid) {
            console.warn(`[WARN] ${p}: Viewport meta tag content may be non-standard: ${val}`);
        } else {
            console.log(`[PASS] ${p}: Standard viewport tag (${val})`);
        }
    }
});
