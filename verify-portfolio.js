const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5173';
const SS_DIR = path.join(__dirname, 'verify-screenshots');
fs.mkdirSync(SS_DIR, { recursive: true });

const findings = [];
const steps = [];

function log(icon, msg, detail = '') {
  const line = `${icon} ${msg}${detail ? ': ' + detail : ''}`;
  steps.push(line);
  console.log(line);
}

function find(icon, msg) {
  findings.push({ icon, msg });
  console.log(`[FINDING] ${icon} ${msg}`);
}

async function ss(page, name) {
  await page.screenshot({ path: path.join(SS_DIR, `${name}.png`), fullPage: false });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', e => consoleErrors.push(`PAGE ERROR: ${e.message}`));

  // ─── LOAD ───────────────────────────────────────────────────────────────────
  const res = await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  log('✅', 'Page loaded', `HTTP ${res.status()}`);
  await ss(page, '01-initial');

  const title = await page.title();
  log(title.includes('Ian Ngure') ? '✅' : '❌', 'Title', title);
  if (!title.includes('Ian Ngure')) find('❌', `Wrong page title: "${title}"`);

  // ─── HERO ───────────────────────────────────────────────────────────────────
  const h1Text = await page.locator('h1').first().textContent().catch(() => '');
  log(h1Text.includes('Ian') ? '✅' : '❌', 'Hero h1', h1Text.trim().slice(0, 60));
  if (!h1Text.includes('Ian')) find('❌', `Hero h1: "${h1Text}"`);

  // Typewriter cursor
  const cursorVisible = await page.locator('.animate-pulse').first().isVisible().catch(() => false);
  log(cursorVisible ? '✅' : '⚠️', 'Typewriter cursor visible');
  if (!cursorVisible) find('⚠️', 'Hero: typewriter cursor not visible on load');

  // Wait for typewriter to type
  await page.waitForTimeout(2000);
  const roleLabel = await page.locator('[aria-label^="Role:"]').getAttribute('aria-label').catch(() => null);
  log(roleLabel ? '✅' : '⚠️', 'Typewriter aria-label', roleLabel || 'not found');

  // "View My Work" is a <button> (uses onClick, no href)
  const viewWorkBtn = page.getByRole('button', { name: /view my work/i });
  const vwVisible = await viewWorkBtn.isVisible().catch(() => false);
  log(vwVisible ? '✅' : '❌', '"View My Work" button', vwVisible ? 'visible' : 'MISSING');
  if (!vwVisible) find('❌', 'Hero: "View My Work" button not visible');

  // GitHub is an <a> (has href)
  const githubLink = page.getByRole('link', { name: /github/i }).first();
  const ghVisible = await githubLink.isVisible().catch(() => false);
  log(ghVisible ? '✅' : '❌', '"GitHub" link', ghVisible ? 'visible' : 'MISSING');
  if (!ghVisible) find('❌', 'Hero: "GitHub" link not visible');

  // LinkedIn + email social links
  const linkedinLink = page.getByRole('link', { name: /linkedin/i }).first();
  const liVisible = await linkedinLink.isVisible().catch(() => false);
  log(liVisible ? '✅' : '⚠️', 'LinkedIn social link', liVisible ? 'visible' : 'not found');

  await ss(page, '02-hero');

  // ─── NAVBAR ─────────────────────────────────────────────────────────────────
  const navEl = page.locator('nav').first();
  const navVisible = await navEl.isVisible().catch(() => false);
  log(navVisible ? '✅' : '❌', 'Navbar visible');
  if (!navVisible) find('❌', 'Navbar not rendered');

  // Nav links are <button> elements (onClick-based scroll)
  const navBtns = await page.locator('nav[aria-label="Primary navigation"] button').count();
  log(navBtns >= 5 ? '✅' : '⚠️', 'Desktop nav buttons', `${navBtns} found (expected 5)`);
  if (navBtns < 5) find('⚠️', `Navbar: only ${navBtns} nav buttons, expected 5`);

  // Theme toggle — label is "Switch to light mode" when dark, "Switch to dark mode" when light
  const themeToggle = page.locator('button[aria-label^="Switch to"]').first();
  const ttVisible = await themeToggle.isVisible().catch(() => false);
  log(ttVisible ? '✅' : '❌', 'Theme toggle button', ttVisible ? 'visible' : 'MISSING');
  if (!ttVisible) find('❌', 'Navbar: theme toggle button not found');

  if (ttVisible) {
    const beforeLabel = await themeToggle.getAttribute('aria-label');
    await themeToggle.click();
    await page.waitForTimeout(400);
    const afterClass = await page.locator('html').getAttribute('class');
    const afterLabel = await page.locator('button[aria-label^="Switch to"]').first().getAttribute('aria-label').catch(() => '');
    log('✅', 'Theme toggle works', `before="${beforeLabel}" → html.class="${afterClass}", new label="${afterLabel}"`);
    await ss(page, '03-theme-toggled');
    // Toggle back
    await page.locator('button[aria-label^="Switch to"]').first().click();
    await page.waitForTimeout(400);
  }

  // ─── ABOUT ──────────────────────────────────────────────────────────────────
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const aboutVisible = await page.locator('#about').isVisible().catch(() => false);
  log(aboutVisible ? '✅' : '❌', 'About section renders');
  if (!aboutVisible) find('❌', 'About section not rendered');

  const profileImg = page.locator('#about img').first();
  const imgInDom = await profileImg.count() > 0;
  if (imgInDom) {
    const imgLoaded = await profileImg.evaluate(el => el.naturalWidth > 0).catch(() => false);
    const imgSrc = await profileImg.getAttribute('src');
    const imgAlt = await profileImg.getAttribute('alt');
    log(imgLoaded ? '✅' : '❌', 'Profile photo loaded', `src=${imgSrc}`);
    if (!imgLoaded) find('❌', `About: profile photo failed to load (src="${imgSrc}")`);
    log(imgAlt && imgAlt.length > 0 ? '✅' : '❌', 'Profile photo has alt text', imgAlt || '(empty)');
    if (!imgAlt) find('❌', 'About: profile photo missing alt text');
  } else {
    log('❌', 'Profile photo: no <img> found in #about');
    find('❌', 'About: no img element found in #about section');
  }

  const statDts = await page.locator('#about dl dt').allTextContents();
  log(statDts.length >= 3 ? '✅' : '❌', 'About stats', statDts.join(', ') || '(none)');
  if (statDts.length < 3) find('❌', `About: ${statDts.length}/3 stat values rendered`);

  const availText = await page.getByText(/available for work/i).first().isVisible().catch(() => false);
  log(availText ? '✅' : '⚠️', '"Available for work" badge visible');
  if (!availText) find('⚠️', 'About: "Available for work" text not visible');

  await ss(page, '04-about');

  // ─── SKILLS ─────────────────────────────────────────────────────────────────
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const skillH3s = await page.locator('#skills h3').allTextContents();
  log(skillH3s.length >= 3 ? '✅' : '❌', 'Skills categories', skillH3s.join(', '));
  if (skillH3s.length < 3) find('❌', `Skills: ${skillH3s.length} categories rendered, expected 3`);

  const pbCount = await page.locator('#skills [role="progressbar"]').count();
  log(pbCount > 0 ? '✅' : '❌', 'Progress bars (role=progressbar)', `${pbCount}`);
  if (pbCount === 0) find('❌', 'Skills: no [role="progressbar"] found');

  if (pbCount > 0) {
    const firstInner = page.locator('#skills [role="progressbar"] > div').first();
    const w = await firstInner.evaluate(el => el.style.width).catch(() => '');
    log(w && w !== '0%' && w !== '' ? '✅' : '⚠️', 'Skill bar animated', `width="${w}"`);
    if (!w || w === '0%') find('⚠️', `Skills: first bar width="${w}" — animation may not have fired`);
  }

  await ss(page, '05-skills');

  // ─── PROJECTS ───────────────────────────────────────────────────────────────
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Count cards that contain an h3 (project title)
  const allProjectH3s = await page.locator('#projects .rounded-2xl h3').count();
  log(allProjectH3s >= 4 ? '✅' : '❌', 'Project cards with title', `${allProjectH3s}`);
  if (allProjectH3s < 4) find('❌', `Projects: only ${allProjectH3s} cards with h3, expected 4`);

  // Live demo links
  const allProjLinks = await page.locator('#projects a').all();
  let liveDemoCount = 0;
  for (const a of allProjLinks) {
    const t = await a.textContent().catch(() => '');
    if (t.toLowerCase().includes('live')) liveDemoCount++;
  }
  log(liveDemoCount >= 2 ? '✅' : '⚠️', '"Live Demo" links', `${liveDemoCount} found`);
  if (liveDemoCount < 2) find('⚠️', `Projects: only ${liveDemoCount} "Live Demo" links found`);

  // Filter tags
  const filterBtns = page.locator('#projects [role="group"] span[role="button"]');
  const filterCount = await filterBtns.count();
  log(filterCount > 1 ? '✅' : '⚠️', 'Filter tag buttons', `${filterCount}`);

  if (filterCount > 1) {
    // Click second filter
    const f2 = filterBtns.nth(1);
    const f2Label = await f2.textContent();
    await f2.click();
    await page.waitForTimeout(700);
    const filteredH3s = await page.locator('#projects .rounded-2xl h3').count();
    log('🔍', `Filter "${f2Label}" clicked`, `${filteredH3s} cards shown`);
    await ss(page, '06-projects-filtered');
    // Reset
    await filterBtns.first().click();
    await page.waitForTimeout(700);
    const resetH3s = await page.locator('#projects .rounded-2xl h3').count();
    log(resetH3s >= 4 ? '✅' : '❌', 'Filter reset to All', `${resetH3s} cards`);
    if (resetH3s < 4) find('❌', `Projects: after All filter, only ${resetH3s} cards`);
  }

  await ss(page, '07-projects-all');

  // ─── EXPERIENCE ─────────────────────────────────────────────────────────────
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const expLis = await page.locator('#experience ol li').count();
  log(expLis >= 1 ? '✅' : '❌', 'Experience timeline items', `${expLis}`);
  if (expLis === 0) find('❌', 'Experience: no <li> items in <ol>');

  const currBadge = await page.getByText('Current').first().isVisible().catch(() => false);
  log(currBadge ? '✅' : '⚠️', '"Current" badge', currBadge ? 'visible' : 'not visible');
  if (!currBadge) find('⚠️', 'Experience: "Current" badge not visible');

  // Pulse dot
  const pulseDot = await page.locator('#experience .animate-pulse').first().isVisible().catch(() => false);
  log(pulseDot ? '✅' : '⚠️', 'Timeline pulse dot on current role');

  await ss(page, '08-experience');

  // ─── CONTACT ────────────────────────────────────────────────────────────────
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const formVisible = await page.locator('#contact form').isVisible().catch(() => false);
  log(formVisible ? '✅' : '❌', 'Contact form visible');
  if (!formVisible) find('❌', 'Contact: form not visible');

  if (formVisible) {
    // Empty submit
    const sendBtn = page.getByRole('button', { name: /send message/i });
    await sendBtn.click();
    await page.waitForTimeout(400);
    const nameErr = await page.locator('#name-error').isVisible().catch(() => false);
    const emailErr = await page.locator('#email-error').isVisible().catch(() => false);
    const msgErr = await page.locator('#message-error').isVisible().catch(() => false);
    log(nameErr ? '✅' : '❌', 'Empty submit → name error');
    log(emailErr ? '✅' : '❌', 'Empty submit → email error');
    log(msgErr ? '✅' : '❌', 'Empty submit → message error');
    if (!nameErr) find('❌', 'Contact: name validation error missing on empty submit');
    if (!emailErr) find('❌', 'Contact: email validation error missing on empty submit');
    if (!msgErr) find('❌', 'Contact: message validation error missing on empty submit');

    await ss(page, '09-contact-empty-errors');

    // 🔍 Invalid email format
    await page.locator('#contact-name').fill('Test User');
    await page.locator('#contact-email').fill('notanemail');
    await page.locator('#contact-message').fill('Valid message long enough');
    await sendBtn.click();
    await page.waitForTimeout(400);
    const invalidEmailErr = await page.locator('#email-error').isVisible().catch(() => false);
    const invalidEmailTxt = await page.locator('#email-error').textContent().catch(() => '');
    log(invalidEmailErr ? '✅' : '❌', '🔍 Invalid email → error', invalidEmailTxt);
    if (!invalidEmailErr) find('❌', 'Contact: invalid email not rejected by validation');

    // 🔍 Short message (<10 chars)
    await page.locator('#contact-email').fill('valid@test.com');
    await page.locator('#contact-message').fill('short');
    await sendBtn.click();
    await page.waitForTimeout(400);
    const shortMsgErr = await page.locator('#message-error').isVisible().catch(() => false);
    const shortMsgTxt = await page.locator('#message-error').textContent().catch(() => '');
    log(shortMsgErr ? '✅' : '⚠️', '🔍 Short message → error', shortMsgTxt);
    if (!shortMsgErr) find('⚠️', 'Contact: short message (<10 chars) not caught');

    await ss(page, '10-contact-validations');

    // 🔍 Valid submit (no backend → should get error or loading)
    await page.locator('#contact-message').fill('This is a proper message, at least ten chars.');
    await sendBtn.click();
    await page.waitForTimeout(3000);
    const loadingShown = await page.getByRole('button', { name: /sending/i }).isVisible().catch(() => false);
    const errorShown = await page.getByText(/something went wrong/i).isVisible().catch(() => false);
    log('🔍', 'Valid submit without backend', loadingShown ? '⏳ stuck on "Sending…"' : errorShown ? '"Something went wrong" shown ✅' : '⚠️ no feedback');
    if (!loadingShown && !errorShown) find('⚠️', 'Contact: valid submit shows no loading or error state');
  }

  await ss(page, '11-contact-final');

  // ─── MOBILE 375px ───────────────────────────────────────────────────────────
  await ctx.close();
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mPage = await mCtx.newPage();
  mPage.on('pageerror', e => consoleErrors.push(`MOBILE: ${e.message}`));

  await mPage.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await mPage.waitForTimeout(1000);

  const mH1 = await mPage.locator('h1').first().isVisible().catch(() => false);
  log(mH1 ? '✅' : '❌', 'Mobile 375px: hero h1 visible');
  if (!mH1) find('❌', 'Mobile: hero h1 not visible at 375px');

  // Hamburger button
  const hamburger = mPage.locator('button[aria-label="Open menu"]');
  const hamVisible = await hamburger.isVisible().catch(() => false);
  log(hamVisible ? '✅' : '⚠️', 'Mobile: hamburger "Open menu" button', hamVisible ? 'visible' : 'not found');
  if (!hamVisible) find('⚠️', 'Mobile: hamburger button with aria-label="Open menu" not visible at 375px');

  // Open hamburger and check menu
  if (hamVisible) {
    await hamburger.click();
    await mPage.waitForTimeout(400);
    const mobileNav = mPage.locator('nav[aria-label="Mobile navigation"]');
    const mNavVisible = await mobileNav.isVisible().catch(() => false);
    log(mNavVisible ? '✅' : '❌', 'Mobile: navigation menu opens', mNavVisible ? 'yes' : 'no');
    if (!mNavVisible) find('❌', 'Mobile: clicking hamburger does not show mobile navigation');
    await mPage.screenshot({ path: path.join(SS_DIR, '12-mobile-nav-open.png') });
    // Close it
    const closeBtn = mPage.locator('button[aria-label="Close menu"]');
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
      await mPage.waitForTimeout(300);
    }
  }

  await mPage.screenshot({ path: path.join(SS_DIR, '12-mobile-hero.png') });

  // About on mobile
  await mPage.locator('#about').scrollIntoViewIfNeeded();
  await mPage.waitForTimeout(600);
  const mProfileImg = await mPage.locator('#about img').first().isVisible().catch(() => false);
  log(mProfileImg ? '✅' : '❌', 'Mobile: profile photo visible in About');
  if (!mProfileImg) find('❌', 'Mobile: profile photo not visible at 375px');
  await mPage.screenshot({ path: path.join(SS_DIR, '13-mobile-about.png') });

  // Skills on mobile — should stack to single column
  await mPage.locator('#skills').scrollIntoViewIfNeeded();
  await mPage.waitForTimeout(600);
  const mSkillsGrid = mPage.locator('#skills .grid');
  const mGridCols = await mSkillsGrid.evaluate(el => window.getComputedStyle(el).gridTemplateColumns).catch(() => '');
  log('🔍', 'Mobile: skills grid columns', mGridCols);
  await mPage.screenshot({ path: path.join(SS_DIR, '14-mobile-skills.png') });

  // Contact on mobile
  await mPage.locator('#contact').scrollIntoViewIfNeeded();
  await mPage.waitForTimeout(600);
  const mForm = await mPage.locator('#contact form').isVisible().catch(() => false);
  log(mForm ? '✅' : '❌', 'Mobile: contact form visible');
  if (!mForm) find('❌', 'Mobile: contact form not visible at 375px');
  await mPage.screenshot({ path: path.join(SS_DIR, '15-mobile-contact.png') });

  await mCtx.close();
  await browser.close();

  // ─── CONSOLE ERRORS ─────────────────────────────────────────────────────────
  const uniqueErrors = [...new Set(consoleErrors)];
  if (uniqueErrors.length === 0) {
    log('✅', 'No JS console errors');
  } else {
    uniqueErrors.forEach(e => {
      const short = e.slice(0, 200);
      log('❌', 'Console error', short);
      find('❌', `Console error: ${short}`);
    });
  }

  // ─── REPORT ─────────────────────────────────────────────────────────────────
  console.log('\n\n══════════════════════════════════════════════');
  console.log('STEPS:\n' + steps.map(s => '  ' + s).join('\n'));
  console.log('\nFINDINGS:');
  if (findings.length === 0) console.log('  (none)');
  else findings.forEach(f => console.log(`  ${f.icon} ${f.msg}`));
  console.log(`\nScreenshots: ${SS_DIR}`);
  const hasFail = findings.some(f => f.icon === '❌');
  const hasWarn = findings.some(f => f.icon === '⚠️');
  console.log(`\nVERDICT: ${hasFail ? '❌ FAIL' : hasWarn ? '⚠️ PASS WITH WARNINGS' : '✅ PASS'}`);

})().catch(e => {
  console.error('\nSCRIPT CRASHED:', e.message);
  process.exit(1);
});
