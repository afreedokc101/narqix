#!/usr/bin/env node
// End-to-end tests against a running local stack:
//   npm run build && npm run db:migrate:local && npx wrangler pages dev dist --persist-to .wrangler/state
//   (with DEV_ADMIN_EMAIL=you@example.com in .dev.vars)
//   npm test            # or: BASE=http://localhost:8788 node scripts/test-api.mjs
//
// The test plays a candidate. To pick right or wrong answers it uses the server-only exam data
// (exam-data/*.json), matching each shuffled question it receives back to the answer key.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = process.env.BASE || 'http://localhost:8788';
const ROOT = new URL('..', import.meta.url).pathname;
const exams = Object.fromEntries(
  fs.readdirSync(ROOT + 'exam-data').filter((f) => f.endsWith('.json')).map((f) => [f.replace('.json', ''), JSON.parse(fs.readFileSync(ROOT + 'exam-data/' + f, 'utf8'))]),
);

let passed = 0, failed = 0;
function check(name, cond, extra) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`, extra !== undefined ? JSON.stringify(extra).slice(0, 400) : ''); }
}

function sql(command) {
  return execFileSync('npx', ['wrangler', 'd1', 'execute', 'narqix-academy', '--local', '--persist-to', '.wrangler/state', '--command', command], { cwd: ROOT, stdio: 'pipe' }).toString();
}

class Client {
  constructor() { this.cookies = {}; }
  async req(path, body, method) {
    const res = await fetch(BASE + path, {
      method: method || (body === undefined ? 'GET' : 'POST'),
      headers: { ...(body !== undefined ? { 'content-type': 'application/json', origin: BASE } : {}), cookie: Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join('; ') },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'manual',
    });
    for (const c of res.headers.getSetCookie?.() || []) {
      const [kv] = c.split(';');
      const i = kv.indexOf('=');
      this.cookies[kv.slice(0, i)] = kv.slice(i + 1);
    }
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, data, text, headers: res.headers };
  }
  async upload(path, bytes, filename, type) {
    const body = new FormData();
    body.append('file', new Blob([bytes], { type }), filename);
    const res = await fetch(BASE + path, { method: 'POST', body, headers: { origin: BASE, cookie: Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join('; ') } });
    let data;
    try { data = await res.json(); } catch { data = null; }
    return { status: res.status, data };
  }
}

const PDF = new TextEncoder().encode('%PDF-1.4\n% signed NDA test file\n%%EOF\n');

/** Upload a signed NDA and approve it as the hiring team, so the candidate can use the Academy. */
async function approve(c) {
  await c.upload('/api/nda', PDF, 'nda.pdf', 'application/pdf');
  const me = await c.req('/api/me');
  await new Client().req(`/api/admin/candidates/${me.data.candidate.id}/access`, { decision: 'approve' });
}

const uniq = Date.now().toString().slice(-7);
let phoneSeq = 0;
const phone = () => `017${uniq}${String(phoneSeq++).padStart(1, '0')}`.slice(0, 11);

async function signup(name, track, { approved = true } = {}) {
  const c = new Client();
  const p = `01${String(3 + (phoneSeq % 7))}${uniq}${phoneSeq++}`.slice(0, 11);
  const r = await c.req('/api/signup', { fullName: name, phone: p, email: `${name.toLowerCase().replace(/\W/g, '')}.${uniq}@example.com`, district: 'Dhaka', track, password: 'correct horse 1' });
  c.phone = p;
  if (approved && r.status === 201) await approve(c);
  return { c, r };
}

/** Build an answer map for a running attempt. `wrong` = set of original question numbers to answer wrongly. */
function answersFor(examId, questions, wrong = new Set()) {
  const exam = exams[examId];
  const out = {};
  const usedN = new Set();
  for (const q of questions) {
    // Identify the original question by stem + option set (stems can repeat across a part's shared data).
    const orig = exam.questions.find((x) => !usedN.has(x.n) && x.stemHtml === q.stemHtml && x.options.map((o) => o.html).sort().join('|') === [...q.options].sort().join('|'));
    if (!orig) throw new Error('could not match question');
    usedN.add(orig.n);
    const correctHtml = orig.options.find((o) => o.letter === orig.correct).html;
    const correctIdx = q.options.indexOf(correctHtml);
    out[q.i] = wrong.has(orig.n) ? (correctIdx + 1) % 4 : correctIdx;
  }
  return out;
}

async function sit(c, examId, { wrong = new Set(), role } = {}) {
  const s = await c.req(`/api/exams/${examId}/start`, { role });
  if (s.status >= 300) return { start: s };
  const a = await c.req(`/api/attempts/${s.data.attemptId}`);
  const answers = answersFor(examId, a.data.questions, wrong);
  const sub = await c.req(`/api/attempts/${s.data.attemptId}/submit`, { answers });
  return { start: s, attempt: a, submit: sub, attemptId: s.data.attemptId };
}

const gates = (id) => exams[id].questions.filter((q) => q.gate).map((q) => q.n);
const nonGates = (id) => exams[id].questions.filter((q) => !q.gate).map((q) => q.n);

async function main() {
  console.log(`Testing ${BASE}\n`);

  console.log('Sign-up and login');
  const bad = await new Client().req('/api/signup', { fullName: 'A', phone: '12345', email: 'nope', district: '', track: 'x', password: 'short' });
  check('rejects invalid sign-up with field errors', bad.status === 400 && bad.data.fields?.phone && bad.data.fields?.email && bad.data.fields?.track && bad.data.fields?.password, bad.data);
  const { c: alice, r: ar } = await signup('Alice Rahman', 'solar');
  check('sign-up creates account and session', ar.status === 201 && alice.cookies.nq_session, ar.data);
  const dup = await new Client().req('/api/signup', { fullName: 'Alice Again', phone: '+880 ' + alice.phone.slice(1), email: `other.${uniq}@example.com`, district: 'Dhaka', track: 'solar', password: 'correct horse 1' });
  check('duplicate phone (different format) is rejected', dup.status === 409, dup.data);
  const wrongPw = await new Client().req('/api/auth/login', { phone: alice.phone, password: 'wrong password' });
  check('wrong password is rejected', wrongPw.status === 401);
  const login = new Client();
  const lr = await login.req('/api/auth/login', { phone: '880' + alice.phone.slice(1), password: 'correct horse 1' });
  check('phone + password login works (880 prefix)', lr.status === 200 && login.cookies.nq_session);
  const xsite = await alice.req('/api/progress', { lessonId: 'x' });
  check('unknown lesson id rejected', xsite.status === 400);

  console.log('\nNDA gate');
  const { c: nina } = await signup('Nina Gate', 'solar', { approved: false });
  const m0 = await nina.req('/api/me');
  check('new account starts as pending_nda, with no exams or progress', m0.data.access?.status === 'pending_nda' && !m0.data.exams, m0.data);
  check('progress is blocked before approval', (await nina.req('/api/progress')).status === 403);
  check('exam start is blocked before approval', (await nina.req('/api/exams/foundation/start', {})).status === 403);
  const gatedPage = await nina.req('/learn/');
  check('lesson pages redirect to /welcome/ before approval', gatedPage.status === 302 && gatedPage.headers.get('location') === '/welcome/', gatedPage.status);
  const anonPage = await new Client().req('/dashboard/');
  check('logged-out visitors are sent to log in', anonPage.status === 302 && anonPage.headers.get('location').startsWith('/login/?next='), anonPage.headers.get('location'));
  check('home page stays public', (await new Client().req('/')).status === 200);
  check('welcome page loads', (await nina.req('/welcome/')).status === 200);
  check('non-PDF/image upload is rejected', (await nina.upload('/api/nda', new TextEncoder().encode('<script>alert(1)</script>'), 'nda.pdf', 'application/pdf')).status === 415);
  check('upload over 10 MB is rejected', (await nina.upload('/api/nda', new Uint8Array(10 * 1024 * 1024 + 1).fill(0x25), 'big.pdf', 'application/pdf')).status === 413);
  const big = new Uint8Array(3_200_000);
  big.set([0xff, 0xd8, 0xff]);
  for (let i = 3; i < big.length; i++) big[i] = i % 251;
  const up = await nina.upload('/api/nda', big, 'my nda scan.jpeg', 'image/jpeg');
  check('signed NDA upload (3.2 MB photo, stored in chunks) => nda_submitted', up.status === 201 && (await nina.req('/api/me')).data.access.status === 'nda_submitted', up.data);
  const list0 = await new Client().req('/api/admin/candidates');
  const ninaRow = list0.data.candidates.find((r) => r.fullName === 'Nina Gate');
  check('admin sees NDA to review with the file', ninaRow?.accessStatus === 'nda_submitted' && ninaRow.nda?.filename === 'my nda scan.jpg' && ninaRow.nda.size === big.length, ninaRow);
  const file = await fetch(`${BASE}/api/admin/candidates/${ninaRow.id}/nda`);
  const got = new Uint8Array(await file.arrayBuffer());
  check('admin can open the NDA, byte for byte', file.headers.get('content-type') === 'image/jpeg' && got.length === big.length && got.every((v, i) => v === big[i]));
  check('rejecting without a reason is refused', (await new Client().req(`/api/admin/candidates/${ninaRow.id}/access`, { decision: 'reject' })).status === 400);
  await new Client().req(`/api/admin/candidates/${ninaRow.id}/access`, { decision: 'reject', note: 'Page 2 is not signed.' });
  const m1 = await nina.req('/api/me');
  check('rejected candidate sees the reason', m1.data.access.status === 'rejected' && m1.data.access.note === 'Page 2 is not signed.', m1.data.access);
  check('rejected candidate is still blocked', (await nina.req('/api/progress')).status === 403);
  await nina.upload('/api/nda', PDF, 'nda-fixed.pdf', 'application/pdf');
  check('re-upload goes back to review', (await nina.req('/api/me')).data.access.status === 'nda_submitted');
  const ok = await new Client().req(`/api/admin/candidates/${ninaRow.id}/access`, { decision: 'approve' });
  check('hiring team approves', ok.status === 200 && ok.data.accessStatus === 'approved', ok.data);
  check('approved candidate can use progress and lessons', (await nina.req('/api/progress')).status === 200 && (await nina.req('/learn/')).status === 200);
  check('approved candidate cannot upload again', (await nina.upload('/api/nda', PDF, 'x.pdf', 'application/pdf')).status === 409);
  const hist = sql(`SELECT status FROM status_history WHERE candidate_id='${ninaRow.id}' ORDER BY id`);
  check('every access change is logged', ['access:nda_submitted', 'access:rejected', 'access:approved'].every((s) => hist.includes(s)));

  console.log('\nProgress');
  const lessons = JSON.parse(fs.readFileSync(ROOT + 'src/data/lessons.json', 'utf8'));
  const solarIds = lessons.tracks.solar.lessonIds;
  for (const id of solarIds.slice(0, 5)) await alice.req('/api/progress', { lessonId: id, read: true });
  const pr = await alice.req('/api/progress');
  check('mark-as-read is stored and counted per track', pr.data.trackRead === 5 && pr.data.trackTotal === solarIds.length, pr.data);
  await alice.req('/api/progress', { lessonId: solarIds[0], read: false });
  check('un-marking works', (await alice.req('/api/progress')).data.trackRead === 4);

  console.log('\nNo answers reach the browser');
  const st = await alice.req('/api/exams/foundation/start', {});
  const at = await alice.req(`/api/attempts/${st.data.attemptId}`);
  const raw = at.text;
  check('attempt JSON has no "correct" field', !/"correct"/i.test(raw));
  check('attempt JSON has no option letters', !/"letter"/.test(raw));
  check('attempt JSON has no answer explanations', !/Correct:|Source:/.test(raw));
  check('attempt JSON has no original question numbers', !/"n":/.test(raw));
  const order = at.data.questions.map((q) => exams.foundation.questions.findIndex((x) => x.stemHtml === q.stemHtml));
  check('question order is shuffled', order.some((v, i) => v !== i), order.slice(0, 10));
  const optShuffled = at.data.questions.some((q) => {
    const orig = exams.foundation.questions.find((x) => x.stemHtml === q.stemHtml);
    return orig.options.map((o) => o.html).join('|') !== q.options.join('|');
  });
  check('option order is shuffled', optShuffled);
  const save = await alice.req(`/api/attempts/${st.data.attemptId}/save`, { answers: { 0: 1, 1: 2 } });
  check('autosave works', save.status === 200 && save.data.saved === 2);
  const again = await alice.req('/api/exams/foundation/start', {});
  check('starting again resumes the open attempt', again.data.attemptId === st.data.attemptId && again.data.resumed);

  console.log('\nPass (Foundation)');
  const fAnswers = answersFor('foundation', at.data.questions);
  const fsub = await alice.req(`/api/attempts/${st.data.attemptId}/submit`, { answers: fAnswers });
  check('all correct => passed 40/40', fsub.data.status === 'passed' && fsub.data.result.score === 40, fsub.data.result);
  check('result JSON reveals no correct letters', !/"correct"|"letter"|Correct:/.test(JSON.stringify(fsub.data)));
  const resub = await alice.req(`/api/attempts/${st.data.attemptId}/submit`, { answers: {} });
  check('re-submitting a graded attempt does not change it', resub.data.result.score === 40);
  const after = await alice.req('/api/exams/foundation/start', {});
  check('cannot retake a passed exam', after.status === 409);

  console.log('\nFail on total (Solar 27/35, every gate correct)');
  const solarWrong = new Set(nonGates('solar').slice(0, 8));
  const s1 = await sit(alice, 'solar', { wrong: solarWrong });
  const r1 = s1.submit.data.result;
  check('27/35 => failed', s1.submit.data.status === 'failed' && r1.score === 27, r1);
  check('reason names the pass mark', r1.reasons.some((x) => x.includes('below the pass mark of 28')), r1.reasons);
  check('no gate missed', r1.gatesMissed === 0);
  check('each missed question lists a lesson to reread', r1.missed.length === 8 && r1.missed.every((m) => m.sources.length && m.sources.every((s) => s.url?.startsWith('/learn/'))), r1.missed.map((m) => m.sources));
  check('missed list has no correct answer', !/"correct"|"letter"|Correct:/.test(JSON.stringify(r1)));

  console.log('\nRetake lock');
  const lock = await alice.req('/api/exams/solar/start', {});
  check('retake inside 2 days is locked (423)', lock.status === 423 && lock.data.eligibility?.status === 'locked', lock.data);
  const unlockAt = lock.data.eligibility.until;
  check('lock lasts 2 days from the fail', Math.abs(unlockAt - (s1.submit.data.result && Date.now()) - 2 * 864e5) < 120_000, { unlockAt });
  // Move the fail 3 days into the past: retake becomes available (attempt 2 of 3).
  sql(`UPDATE exam_attempts SET started_at = started_at - 259200000, deadline_at = deadline_at - 259200000, submitted_at = submitted_at - 259200000 WHERE id = '${s1.attemptId}'`);
  const s2 = await sit(alice, 'solar', { wrong: solarWrong });
  check('after 2 days a retake is allowed', s2.start.status === 201, s2.start.data);
  sql(`UPDATE exam_attempts SET started_at = started_at - 259200000, deadline_at = deadline_at - 259200000, submitted_at = submitted_at - 259200000 WHERE id = '${s2.attemptId}'`);
  const s3 = await sit(alice, 'solar', { wrong: solarWrong });
  check('third attempt in 30 days allowed', s3.start.status === 201);
  sql(`UPDATE exam_attempts SET started_at = started_at - 259200000, deadline_at = deadline_at - 259200000, submitted_at = submitted_at - 259200000 WHERE id = '${s3.attemptId}'`);
  const s4 = await alice.req('/api/exams/solar/start', {});
  check('fourth attempt in 30 days is locked', s4.status === 423 && /3 attempts in 30 days/.test(s4.data.error), s4.data);

  console.log('\nFail on one gate question (Foundation 39/40)');
  const { c: bob } = await signup('Bob Hossain', 'back-office');
  const b1 = await sit(bob, 'foundation', { wrong: new Set([gates('foundation')[0]]) });
  const br = b1.submit.data.result;
  check('39/40 with one gate missed => failed', b1.submit.data.status === 'failed' && br.score === 39 && br.gatesMissed === 1, br);
  check('reason names the gate question', br.reasons.length === 1 && /gate question/.test(br.reasons[0]), br.reasons);
  check('missed question is flagged as a gate', br.missed.length === 1 && br.missed[0].gate);

  console.log('\nPart rules (Real Estate)');
  const part6 = exams['real-estate'].questions.filter((q) => q.part === 6 && !q.gate).map((q) => q.n).slice(0, 4);
  const { c: acq } = await signup('Carol Acq', 'real-estate');
  const ra = await sit(acq, 'real-estate', { role: 'acquisitions', wrong: new Set(part6) });
  check('Acquisitions with 46/50 but 11/15 in Part 6 => failed', ra.submit.data.status === 'failed' && ra.submit.data.result.score === 46, ra.submit.data.result?.reasons);
  const { c: cc } = await signup('Dan Caller', 'real-estate');
  const rc = await sit(cc, 'real-estate', { role: 'cold-caller', wrong: new Set(part6) });
  check('Cold Caller with the same answers => passed', rc.submit.data.status === 'passed', rc.submit.data.result?.reasons);
  const norole = await cc.req('/api/exams/real-estate/start', {});
  check('Real Estate exam requires a role', norole.status === 400 || norole.status === 409);

  console.log('\nTimer (server-side)');
  const { c: eve } = await signup('Eve Timer', 'customer-support');
  const ts = await eve.req('/api/exams/customer-support/start', {});
  const ta = await eve.req(`/api/attempts/${ts.data.attemptId}`);
  const saved = answersFor('customer-support', ta.data.questions);
  await eve.req(`/api/attempts/${ts.data.attemptId}/save`, { answers: saved });
  sql(`UPDATE exam_attempts SET started_at = started_at - 3600000, deadline_at = ${Date.now() - 60_000} WHERE id = '${ts.data.attemptId}'`);
  const late = await eve.req(`/api/attempts/${ts.data.attemptId}/save`, { answers: {} });
  check('saving after the deadline is refused', late.status === 409);
  const tg = await eve.req(`/api/attempts/${ts.data.attemptId}`);
  check('expired attempt is auto-graded from saved answers', tg.data.status === 'passed' && tg.data.result.score === 30, tg.data);
  const lateSubmit = await eve.req(`/api/attempts/${ts.data.attemptId}/submit`, { answers: {} });
  check('late submit cannot overwrite the graded answers', lateSubmit.data.result.score === 30);

  console.log('\nCertificate');
  const me0 = await bob.req('/api/me');
  check('no certificate before passing both exams', me0.data.certificates.length === 0);
  sql(`UPDATE exam_attempts SET submitted_at = submitted_at - 259200000, started_at = started_at - 259200000, deadline_at = deadline_at - 259200000 WHERE id = '${b1.attemptId}'`);
  const b2 = await sit(bob, 'foundation');
  const b3 = await sit(bob, 'back-office', { wrong: new Set(nonGates('back-office').slice(0, 6)) });
  check('Bob passes Foundation and Back Office (24/30)', b2.submit.data.status === 'passed' && b3.submit.data.status === 'passed' && b3.submit.data.result.score === 24, b3.submit.data.result);
  const me1 = await bob.req('/api/me');
  const cert = me1.data.certificates[0];
  check('certificate issued for Back Office', me1.data.certificates.length === 1 && cert.track === 'back-office' && /^NQX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cert.id), me1.data.certificates);
  const v = await new Client().req(`/api/verify/${cert.id}`);
  check('public verify API returns name, track, date, scores, status', v.data.name === 'Bob Hossain' && v.data.title === 'Narqix Academy Pre-Certified — Back Office & Admin' && v.data.foundationScore === '40/40' && v.data.trackScore === '24/30' && v.data.status === 'valid', v.data);
  const vp = await new Client().req(`/verify/${cert.id}`);
  check('/verify/<id> page renders the certificate', vp.status === 200 && vp.text.includes('Bob Hossain') && vp.text.includes('Valid') && !vp.text.includes('data-cert="missing"'));
  check('/verify/<id> shows the pre-certification small print', vp.text.includes('Role-play and live certification are completed after hiring.'));
  const vlow = await new Client().req(`/verify/${cert.id.toLowerCase()}`);
  check('verify accepts a lowercase ID', vlow.status === 200);
  const vx = await new Client().req('/verify/NQX-0000-0000');
  check('unknown ID shows "not found" with 404', vx.status === 404 && vx.text.includes('Certificate not found'));
  const vxss = await new Client().req('/verify/%3Cscript%3Ealert(1)%3C%2Fscript%3E');
  check('verify page escapes the requested ID', !vxss.text.includes('<script>alert(1)</script>'));
  check('Alice (Foundation passed, Solar failed) has no certificate', (await alice.req('/api/me')).data.certificates.length === 0);

  console.log('\nHiring team dashboard');
  const adm = await new Client().req('/api/admin/candidates');
  check('admin list loads (local dev admin)', adm.status === 200 && Array.isArray(adm.data.candidates), adm.data);
  const bobRow = adm.data.candidates.find((r) => r.fullName === 'Bob Hossain');
  check('admin row has progress, attempts, certificate', bobRow && bobRow.preCertified && bobRow.certificateStatus === 'Pre-Certified' && bobRow.exams.find((e) => e.id === 'foundation').attempts.length === 2, bobRow);
  const setS = await new Client().req(`/api/admin/candidates/${bobRow.id}/status`, { status: 'interview' });
  check('mark candidate Interview', setS.status === 200);
  const badS = await new Client().req(`/api/admin/candidates/${bobRow.id}/status`, { status: 'fired' });
  check('unknown status rejected', badS.status === 400);
  const csv = await new Client().req('/api/admin/export?track=back-office');
  check('CSV export filtered by track', csv.headers.get('content-type').includes('text/csv') && csv.text.includes('Bob Hossain') && !csv.text.includes('Alice Rahman') && csv.text.includes('interview'));

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
