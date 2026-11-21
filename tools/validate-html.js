const fs = require('fs');
const path = require('path');

const corePages = [
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
    '404.html'
];

let totalIssues = 0;

corePages.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    const issues = [];

    // Check lang="en"
    if (!/<html[^>]*lang=\"en\"/i.test(html)) issues.push('Missing lang="en"');

    // Check charset
    if (!/<meta[^>]*charset=/i.test(html)) issues.push('Missing charset meta');

    // Check viewport
    if (!/<meta[^>]*name=\"viewport\"/i.test(html)) issues.push('Missing viewport meta');

    // Check h1 count
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1Count === 0) issues.push('Missing <h1>');
    else if (h1Count > 1) issues.push(`Multiple <h1> tags (${h1Count})`);

    // Check <main>
    if (!/<main[\s>]/i.test(html)) issues.push('Missing <main> landmark');

    // Check duplicate IDs
    const idSet = new Set();
    const idMatches = html.matchAll(/id=\"([^\"]+)\"/gi);
    for (const m of idMatches) {
        if (idSet.has(m[1])) issues.push(`Duplicate ID: ${m[1]}`);
        idSet.add(m[1]);
    }

    // Check images missing alt
    const imgMatches = html.matchAll(/<img\s+([^>]*?)>/gi);
    for (const m of imgMatches) {
        if (!/alt=\"[^\"]*\"/i.test(m[1])) {
            issues.push(`Image missing alt attribute: ${m[0].substring(0, 50)}...`);
        }
    }

    // Check target="_blank" without noopener noreferrer
    const blankMatches = html.matchAll(/<a\s+[^>]*target=\"_blank\"[^>]*>/gi);
    for (const m of blankMatches) {
        if (!/rel=\"[^\"]*noopener[^\"]*\"/i.test(m[0])) {
            issues.push(`target="_blank" missing rel="noopener noreferrer": ${m[0].substring(0, 50)}...`);
        }
    }

    console.log(`[${file}]: ${issues.length === 0 ? 'VALID' : issues.join(', ')}`);
    if (issues.length > 0) totalIssues += issues.length;
});

console.log(`\nTotal Validation Issues: ${totalIssues}`);
process.exit(totalIssues === 0 ? 0 : 1);
