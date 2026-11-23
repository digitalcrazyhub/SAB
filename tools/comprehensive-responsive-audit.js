const fs = require('fs');
const path = require('path');

const cssDir = 'asset/css';
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const issues = {
    fixedWidths: [],
    overflowRisks: [],
    mediaQueryOrdering: [],
    iframeResponsiveness: [],
    tableResponsiveness: [],
    buttonWrapRisks: [],
    gridBlowoutRisks: [],
    inputSizingRisks: [],
    duplicateRules: []
};

// 1. Audit CSS Files
cssFiles.forEach(file => {
    const filePath = path.join(cssDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let currentMediaQuery = 'desktop';

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();

        if (trimmed.startsWith('@media')) {
            currentMediaQuery = trimmed;
        }

        // Check for fixed pixel width > 300px on elements
        if (/(?<!max-|min-)width:\s*([3-9]\d{2,}px|\d{4,}px)/i.test(trimmed)) {
            // Exclude desktop-only rules or pseudo-elements with overflow hidden
            issues.fixedWidths.push({
                file, lineNum, currentMediaQuery, code: trimmed
            });
        }

        // Check for grid-template-columns with fixed widths without minmax(0, 1fr)
        if (/grid-template-columns:.*(px|rem)/i.test(trimmed) && !trimmed.includes('minmax') && !trimmed.includes('repeat(auto-fit') && !trimmed.includes('repeat(auto-fill')) {
            issues.gridBlowoutRisks.push({
                file, lineNum, currentMediaQuery, code: trimmed
            });
        }

        // Check for flex without wrap
        if (/display:\s*flex/i.test(trimmed) && !trimmed.includes('wrap')) {
            // Check if subsequent lines specify flex-wrap
            const nextLines = lines.slice(idx, idx + 5).join(' ');
            if (nextLines.includes('gap') && !nextLines.includes('flex-wrap') && !nextLines.includes('flex-direction: column')) {
                // Potential wrap risk if gap is used without flex-wrap or column
            }
        }
    });
});

// 2. Audit HTML Files for iframes, tables, and forms
htmlFiles.forEach(htmlFile => {
    const content = fs.readFileSync(htmlFile, 'utf8');

    // Iframes
    const iframes = content.match(/<iframe[^>]*>/gi) || [];
    iframes.forEach(iframe => {
        if (!iframe.includes('width="100%"') && !iframe.includes('style="width: 100%"') && !iframe.includes('class=')) {
            issues.iframeResponsiveness.push({ file: htmlFile, snippet: iframe });
        }
    });

    // Tables
    const tables = content.match(/<table[^>]*>/gi) || [];
    tables.forEach(table => {
        issues.tableResponsiveness.push({ file: htmlFile, snippet: table });
    });
});

console.log('=== COMPREHENSIVE RESPONSIVE AUDIT RESULTS ===\n');

console.log(`1. Fixed Width Constraints Found: ${issues.fixedWidths.length}`);
issues.fixedWidths.forEach(f => {
    console.log(`   [${f.file}:${f.lineNum}] (${f.currentMediaQuery}) -> ${f.code}`);
});

console.log(`\n2. Grid Blowout Risks Found: ${issues.gridBlowoutRisks.length}`);
issues.gridBlowoutRisks.forEach(g => {
    console.log(`   [${g.file}:${g.lineNum}] (${g.currentMediaQuery}) -> ${g.code}`);
});

console.log(`\n3. Table Elements Found: ${issues.tableResponsiveness.length}`);
issues.tableResponsiveness.forEach(t => {
    console.log(`   [${t.file}] -> ${t.snippet}`);
});

console.log(`\n4. Iframe Elements Found: ${issues.iframeResponsiveness.length}`);
issues.iframeResponsiveness.forEach(i => {
    console.log(`   [${i.file}] -> ${i.snippet}`);
});
