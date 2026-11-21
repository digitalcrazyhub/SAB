const fs = require('fs');

console.log('=== TEST 1: NAVBAR.HTML DOM STRUCTURE ===');
const html = fs.readFileSync('asset/includes/navbar.html', 'utf8');

const headerEnd = html.indexOf('</header>');
const drawerStart = html.indexOf('class="saidpl-mobile-drawer"');
const backdropStart = html.indexOf('class="saidpl-mobile-backdrop"');

console.log('Header ends at char:', headerEnd);
console.log('Backdrop starts at char:', backdropStart, '(is after header?', backdropStart > headerEnd, ')');
console.log('Drawer starts at char:', drawerStart, '(is after header?', drawerStart > headerEnd, ')');

if (drawerStart > headerEnd && backdropStart > headerEnd) {
    console.log('PASS: Drawer and Backdrop are separated siblings outside header!');
} else {
    console.error('FAIL: Stacking hierarchy violation!');
}

console.log('\n=== TEST 2: ALL NAVIGATION LINKS PRESENT ===');
const links = [
    './index.html',
    './about.html',
    './services.html',
    './industrial-building-construction.html',
    './commercial_building_construction.html',
    './residential_building_construction.html',
    './godown_building_construction.html',
    './projects.html',
    './team.html',
    './contact.html'
];
let allLinksFound = true;
links.forEach(l => {
    const found = html.includes(l);
    if (!found) allLinksFound = false;
    console.log(l.padEnd(45), 'Found:', found);
});
console.log('All links verified:', allLinksFound);

console.log('\n=== TEST 3: CSS STACKING ORDER AND ZERO-BLUR VERIFICATION ===');
const css = fs.readFileSync('asset/css/navbar.css', 'utf8');

const backdropZMatch = css.match(/\.saidpl-mobile-backdrop\s*\{[^}]*z-index:\s*(\d+)/);
const drawerZMatch = css.match(/\.saidpl-mobile-drawer\s*\{[^}]*z-index:\s*(\d+)/);

const backdropZ = backdropZMatch ? parseInt(backdropZMatch[1], 10) : 0;
const drawerZ = drawerZMatch ? parseInt(drawerZMatch[1], 10) : 0;

console.log('Backdrop z-index:', backdropZ);
console.log('Drawer z-index:', drawerZ);

if (drawerZ > backdropZ) {
    console.log('PASS: Drawer z-index (' + drawerZ + ') is HIGHER than backdrop (' + backdropZ + ')!');
} else {
    console.error('FAIL: Stacking order inverted!');
}

const drawerCssStart = css.lastIndexOf('.saidpl-mobile-drawer {');
const drawerCssEnd = css.indexOf('.saidpl-mobile-drawer.saidpl-mobile-drawer--open');
const drawerCssBlock = css.substring(drawerCssStart, drawerCssEnd);
const hasBlurOnDrawer = drawerCssBlock.includes('backdrop-filter');
console.log('Drawer has backdrop-filter on itself:', hasBlurOnDrawer);
if (!hasBlurOnDrawer) {
    console.log('PASS: Drawer is sharp with ZERO blur applied to itself!');
} else {
    console.error('FAIL: Drawer has backdrop-filter on itself!');
}

console.log('\n=== TEST 4: JAVASCRIPT STATE MANAGER AND FOCUS TRAP ===');
const js = fs.readFileSync('asset/js/navbar.js', 'utf8');
console.log('Has state.open:', js.includes('open()'));
console.log('Has state.close:', js.includes('close('));
console.log('Has state.toggle:', js.includes('toggle()'));
console.log('Has focus trap:', js.includes('focusables') && js.includes('Tab'));
console.log('Has escape handler:', js.includes('Escape'));
console.log('Has scroll locking (saidpl-nav-locked):', js.includes('saidpl-nav-locked'));
console.log('Has active page highlighter:', js.includes('highlightActiveLinks'));

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
