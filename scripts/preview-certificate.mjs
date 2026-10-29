#!/usr/bin/env node
// Makes a sample certificate PDF with made-up data, to check the design without the site.
// Usage: node scripts/preview-certificate.mjs [output.pdf]
import fs from 'node:fs';
import path from 'node:path';
import { buildSync } from 'esbuild';
import { jsPDF } from 'jspdf';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.resolve(process.argv[2] || 'certificate-sample.pdf');
const tmp = path.join(ROOT, 'node_modules/.cache/certificate-pdf.mjs');
fs.mkdirSync(path.dirname(tmp), { recursive: true });
buildSync({ entryPoints: [path.join(ROOT, 'src/scripts/certificate-pdf.ts')], outfile: tmp, format: 'esm', bundle: true, external: ['jspdf'], platform: 'node', logLevel: 'error' });
const { renderCertificate } = await import(tmp);
const mark = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'public/logo-mark.png')).toString('base64');
const doc = renderCertificate(jsPDF, {
  id: 'NQX-7K3M-Q9TD', name: 'Rahima Khatun', trackTitle: 'Customer Support', title: 'Narqix Academy Pre-Certified: Customer Support',
  issuedAt: Date.UTC(2026, 9, 30), foundationScore: '37/40', trackScore: '28/30', status: 'valid',
}, { mark, origin: 'https://academy.narqix.com' });
fs.writeFileSync(out, Buffer.from(doc.output('arraybuffer')));
console.log('Wrote', path.relative(process.cwd(), out));
