const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const failed = [];
  const allResources = [];
  page.on('response', res => {
    const url = res.url();
    const status = res.status();
    if (!url.startsWith('data:')) allResources.push(`${status} ${url}`);
    if (status >= 400) failed.push(`${status} ${url}`);
  });
  page.on('requestfailed', req => {
    failed.push(`FAILED ${req.url()} — ${req.failure()?.errorText}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  for (const id of ['#about', '#skills', '#projects', '#experience', '#contact']) {
    await page.locator(id).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }

  // Trigger contact form submit (valid data → fetch to backend)
  await page.locator('#contact-name').fill('Test');
  await page.locator('#contact-email').fill('test@test.com');
  await page.locator('#contact-message').fill('Test message long enough here');
  await page.getByRole('button', { name: /send message/i }).click();
  await page.waitForTimeout(3000);

  console.log('\nFailed / 4xx resources:');
  if (failed.length === 0) console.log('  (none)');
  else failed.forEach(f => console.log(' ', f));

  console.log('\nAll resources loaded:');
  allResources.forEach(r => console.log(' ', r));

  await browser.close();
})().catch(e => console.error('ERROR:', e.message));
