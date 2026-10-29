#!/usr/bin/env node
// Renders docs/nda/nda.html to public/narqix-academy-nda.pdf with the preinstalled Chromium.
// Usage: node scripts/build-nda.mjs [output.pdf]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.resolve(process.argv[2] || path.join(ROOT, 'public/narqix-academy-nda.pdf'));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(ROOT, 'docs/nda/nda.html'));
await page.pdf({
  path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: '<div style="width:100%;text-align:center;font:7.5pt Arial,sans-serif;color:#8a8a9c">Narqix Academy Non-Disclosure Agreement · Narqix Solutions Ltd · Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
});
await browser.close();
console.log('Wrote', path.relative(process.cwd(), out));
