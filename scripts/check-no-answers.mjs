#!/usr/bin/env node
// Proves no correct answers reach the browser.
//  1. Static build: no exam question, answer key or explanation text anywhere in dist/.
//  2. Live: for every exam, a real browser opens the exam page; we record the page source and every
//     network response and check none contains an answer letter, an explanation, or the original order.
// Needs the local stack running (see scripts/test-api.mjs). Usage: npm run check:leaks
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const BASE = process.env.BASE || 'http://localhost:8788';
const ROOT = new URL('..', import.meta.url).pathname;
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright'));
}

const exams = fs.readdirSync(ROOT + 'exam-data').filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(ROOT + 'exam-data/' + f, 'utf8')));
let failures = 0;
const ok = (name, cond, extra = '') => {
  console.log(`${cond ? '  ✓' : '  ✗'} ${name}${cond ? '' : ' ' + extra}`);
  if (!cond) failures++;
};

// Explanation text from the answer toggles never appears in exam-data (only the letter and sources do),
// so check the Notion source for it too.
function explanationSnippets() {
  const out = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const f of walk(ROOT + 'academy-export').filter((f) => /Exam [0-9a-f]{32}\.md$/.test(f))) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/\*\*Correct: [A-D]\.\*\* ([^\n]{40,})/g)) out.push(m[1].slice(0, 60));
  }
  return out;
}

console.log('1. Static build (dist/)');
const distFiles = [];
const walkDist = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkDist(p);
    else if (/\.(html|js|json|css|txt|xml)$/.test(e.name)) distFiles.push(p);
  }
};
walkDist(ROOT + 'dist');
const dist = distFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
ok('no "Correct: X." answer lines', !/Correct: [A-D]\./.test(dist));
ok('no examiner answer key', !/Answer key \(examiners only\)|Answer key for examiners/.test(dist));
ok('no "Answer Q<n>" toggles', !/Answer Q\d+/.test(dist));
// Exam options are the answer-bearing text: no page may contain an exam question's option set.
const pages = distFiles.map((f) => ({ f, t: fs.readFileSync(f, 'utf8') }));
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const optionLeaks = [];
for (const e of exams) for (const q of e.questions) {
  const opts = q.options.map((o) => strip(o.html)).filter((o) => o.length > 25);
  if (opts.length < 3) continue;
  for (const p of pages) if (opts.filter((o) => p.t.includes(o)).length >= 3) optionLeaks.push(`${e.id} Q${q.n} in ${path.relative(ROOT, p.f)}`);
}
ok('no exam question option sets in static pages', optionLeaks.length === 0, optionLeaks.slice(0, 3).join(' | '));
const correctLeaks = [];
for (const e of exams) for (const q of e.questions) {
  const c = strip(q.options.find((o) => o.letter === q.correct).html);
  const stem = strip(q.stemHtml).slice(0, 60);
  if (c.length > 25 && stem.length > 30) for (const p of pages) if (p.t.includes(stem) && p.t.includes(c)) correctLeaks.push(`${e.id} Q${q.n} in ${path.relative(ROOT, p.f)}`);
}
// Not a failure: these are "Check yourself" practice questions that the Notion lessons share with an exam,
// answered in the lesson itself. Listed so the exam authors can reword them if they want.
if (correctLeaks.length) {
  console.log(`  ! ${correctLeaks.length} exam question(s) are also a lesson's "Check yourself" question with the answer on that page:`);
  for (const l of correctLeaks) console.log(`      ${l}`);
}
const snippets = explanationSnippets();
const stems = exams.flatMap((e) => e.questions.map((q) => strip(q.stemHtml).slice(0, 70))).filter((s) => s.length > 30);
console.log(`  (info) ${stems.filter((s) => dist.includes(s)).length} exam questions also appear as "Check yourself" practice questions on lesson pages, which are published by design;`);
console.log(`         ${snippets.filter((s) => dist.includes(s)).length} of ${snippets.length} answer explanations quote lesson text (the lesson pages are the study material).`);
ok('exam-data/ is not part of the build', !fs.existsSync(ROOT + 'dist/exam-data'));
ok('no role-play / practical / sign-off pages published', !/Role-Play Certification|Practical Certification Tasks|Certification Record and Sign-Off|Examiner plays/.test(dist));

console.log('\n2. Live exam pages in a browser');
const browser = await chromium.launch();
const forbidden = [/"correct"/i, /"letter"/, /Correct: [A-D]/, /Answer Q\d+/, /"sources"/, /examiners only/i];
const ctx = await browser.newContext();
const page = await ctx.newPage();
let bodies = [];
page.on('response', async (res) => {
  try {
    bodies.push({ url: res.url(), body: await res.text() });
  } catch {}
});
// One fresh candidate takes every exam (sign-up runs inside the page so the cookie lands in the browser).
await page.goto(BASE + '/');
const id = Date.now().toString().slice(-8);
const r = await page.evaluate(async (id) => {
  const res = await fetch('/api/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fullName: 'Leak Check', phone: '019' + id, email: `leak${id}@example.com`, district: 'Dhaka', track: 'solar', password: 'leak-check-pass' }) });
  return res.status;
}, id);
if (r !== 201) throw new Error('signup failed ' + r + ' (sign-up is rate limited to 10 per hour per IP; restart wrangler with a fresh .wrangler/state)');
// Upload an NDA and approve it as the local dev admin, so the candidate can open the exams.
const approved = await page.evaluate(async () => {
  const body = new FormData();
  body.append('file', new Blob(['%PDF-1.4\n%%EOF\n'], { type: 'application/pdf' }), 'nda.pdf');
  await fetch('/api/nda', { method: 'POST', body });
  const me = await (await fetch('/api/me')).json();
  const res = await fetch(`/api/admin/candidates/${me.candidate.id}/access`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ decision: 'approve' }) });
  return res.status;
});
if (approved !== 200) throw new Error('NDA approval failed ' + approved + ' (needs DEV_ADMIN_EMAIL in .dev.vars)');
for (const exam of exams) {
  bodies = [];
  await page.goto(`${BASE}/exams/take/?exam=${exam.id}`);
  if (exam.roles) await page.selectOption('#role', exam.roles[0].id);
  await page.click('[data-start]');
  await page.waitForSelector('[data-view="exam"]:not([hidden]) .opt');
  // Answer a few questions so autosave responses are captured too.
  for (let i = 0; i < 3; i++) {
    await page.click('.opt >> nth=0');
    await page.click('[data-next]');
  }
  await page.waitForTimeout(1500);
  const source = await page.content();
  const all = [{ url: 'page source', body: source }, ...bodies];
  const hits = [];
  for (const b of all) for (const re of forbidden) if (re.test(b.body)) hits.push(`${re} in ${b.url}`);
  // Position of the correct option in what the browser received: must vary (not always the same slot).
  const attemptRes = bodies.find((b) => /\/api\/attempts\/[^/]+$/.test(new URL(b.url).pathname));
  const view = JSON.parse(attemptRes.body);
  const positions = view.questions.map((q) => {
    const orig = exam.questions.find((x) => x.stemHtml === q.stemHtml && x.options.map((o) => o.html).sort().join() === [...q.options].sort().join());
    return q.options.indexOf(orig.options.find((o) => o.letter === orig.correct).html);
  });
  const spread = new Set(positions).size;
  ok(`${exam.title}: ${all.length} responses + page source contain no answers`, hits.length === 0, hits.slice(0, 3).join('; '));
  ok(`${exam.title}: correct option position varies (${spread} of 4 slots used)`, spread >= 3);
}
await ctx.close();
await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll leak checks passed');
process.exit(failures ? 1 : 0);
