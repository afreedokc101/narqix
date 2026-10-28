#!/usr/bin/env node
// Converts the Notion Markdown export in ./academy-export into:
//   src/content/lessons/<section>/<slug>.md   public lesson pages
//   src/data/lessons.json                      lesson index + per-track learning paths (public)
//   src/data/exams.json                        exam metadata only (public, no questions)
//   exam-data/<exam>.json                      questions + answer keys (SERVER ONLY)
//
// Usage: npm run import  (or: node scripts/import-notion.mjs [path-to-export])
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const EXPORT_DIR = path.resolve(process.argv[2] || path.join(ROOT, 'academy-export'));
const LESSON_DIR = path.join(ROOT, 'src/content/lessons');
const DATA_DIR = path.join(ROOT, 'src/data');
const EXAM_DIR = path.join(ROOT, 'exam-data');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Top-level Notion pages -> site sections, in learning-path order.
const SECTIONS = [
  { folder: 'Start Here', key: 'start-here', title: 'Start Here', group: 'foundation' },
  { folder: 'Narqix Standards', key: 'standards', title: 'Narqix Standards', group: 'foundation' },
  { folder: 'Core Skills', key: 'core-skills', title: 'Core Skills', group: 'foundation' },
  { folder: 'Real Estate Track', key: 'real-estate', title: 'Real Estate', group: 'track' },
  { folder: 'Transaction Coordination', key: 'transaction-coordination', title: 'Transaction Coordination', group: 'track' },
  { folder: 'Solar Track', key: 'solar', title: 'Solar', group: 'track' },
  { folder: 'HVAC & Home Services Track', key: 'hvac-home-services', title: 'HVAC & Home Services', group: 'track' },
  { folder: 'Property Preservation Track', key: 'property-preservation', title: 'Property Preservation', group: 'track' },
  { folder: 'Strategic Funding Track', key: 'strategic-funding', title: 'Strategic Funding', group: 'track' },
  { folder: 'Back Office & Admin Track', key: 'back-office', title: 'Back Office & Admin', group: 'track' },
  { folder: 'Customer Support Track', key: 'customer-support', title: 'Customer Support', group: 'track' },
  { folder: 'Specialist Standards', key: 'specialist-standards', title: 'Specialist Standards', group: 'specialist' },
  { folder: 'Script Library', key: 'scripts', title: 'Script Library', group: 'scripts', database: true },
  { folder: 'Templates & Tools', key: 'templates', title: 'Templates & Tools', group: 'resources' },
];
const SKIP_FOLDERS = ['Quizzes & Certification'];

// Script Library "Track" column -> track key. "Core" scripts belong to every track.
const SCRIPT_TRACKS = {
  'Real Estate': 'real-estate',
  'Transaction Coordination': 'transaction-coordination',
  Solar: 'solar',
  'HVAC & Home Services': 'hvac-home-services',
  'Property Preservation': 'property-preservation',
  'Strategic Funding': 'strategic-funding',
  'Back Office': 'back-office',
  'Customer Support': 'customer-support',
  Core: '*',
};

// Pages that are internal and never published (matched on page title).
const EXCLUDED_TITLES = new Set([
  'New VA First Week Checklist',
  'New Client Launch Checklist',
]);

// Exam rules. These are the official rules; the importer checks the Notion page agrees.
const EXAMS = [
  { id: 'foundation', file: 'Foundation Exam', title: 'Foundation Exam', track: null, total: 40, gates: 12 },
  {
    id: 'real-estate', file: 'Real Estate Track Exam', title: 'Real Estate Track Exam', track: 'real-estate', total: 50, gates: 7,
    roles: [
      { id: 'cold-caller', label: 'Cold Caller' },
      { id: 'sms-agent', label: 'SMS Agent' },
      { id: 'lead-manager', label: 'Lead Manager' },
      { id: 'acquisitions', label: 'Acquisitions Manager' },
      { id: 'dispositions', label: 'Dispositions Manager' },
      { id: 'data-list', label: 'Data and List Team' },
    ],
    partRules: [{ part: 6, min: 12, roles: ['acquisitions', 'dispositions'], label: 'Acquisitions and Dispositions candidates need at least 12 of 15 in Part 6' }],
  },
  { id: 'transaction-coordination', file: 'Transaction Coordination Track Exam', title: 'Transaction Coordination Track Exam', track: 'transaction-coordination', total: 40, gates: 4 },
  { id: 'solar', file: 'Solar Track Exam', title: 'Solar Track Exam', track: 'solar', total: 35, gates: 7 },
  { id: 'hvac-home-services', file: 'HVAC and Home Services Track Exam', title: 'HVAC & Home Services Track Exam', track: 'hvac-home-services', total: 35, gates: 9 },
  { id: 'property-preservation', file: 'Property Preservation Track Exam', title: 'Property Preservation Track Exam', track: 'property-preservation', total: 35, gates: 5 },
  {
    id: 'strategic-funding', file: 'Strategic Funding Track Exam', title: 'Strategic Funding Track Exam', track: 'strategic-funding', total: 35, gates: 6,
    roles: [
      { id: 'lead-qualifier', label: 'Lead Qualifier' },
      { id: 'application-assistant', label: 'Application Assistant and Document Chaser' },
      { id: 'processor', label: 'Funding Processor and File Analyst' },
      { id: 'renewal-rep', label: 'Renewal and Follow-Up Rep' },
    ],
    partRules: [{ part: 4, min: 5, roles: ['processor'], label: 'Processors need at least 5 of 6 in Part 4' }],
  },
  { id: 'back-office', file: 'Back Office Track Exam', title: 'Back Office Track Exam', track: 'back-office', total: 30, gates: 6 },
  { id: 'customer-support', file: 'Customer Support Track Exam', title: 'Customer Support Track Exam', track: 'customer-support', total: 30, gates: 5 },
];
const PASS_PERCENT = 80;

// Content that must never be published. Applied to every lesson page.
const STAFF_PLACEHOLDER = /\s*\((?:TRAINER|TRAINER OR CAMPAIGN LEAD|CAMPAIGN LEAD|QA SPECIALIST|OPERATIONS MANAGER|HIRING MANAGER) NAME\)/g;
const STRIP_LINE_PATTERNS = [
  /confidentiality agreement \(NDA\)/i, // "Your First Week": agreements
  /login details/i, // "Your First Week": login steps
  /^\s*\*\*Pay:\*\*/, // pay bands
  /^\s*\*\*Program size( \(internal reference\))?:\*\*/i, // internal funding program sizes
];
const STRIP_TEXT = [
  [/ ?Program sizes on this page are internal reference only\./g, ''],
];
// After stripping, nothing matching these may remain in published lessons.
const FORBIDDEN = [
  /\((?:TRAINER|CAMPAIGN LEAD|QA SPECIALIST|OPERATIONS MANAGER)[A-Z ]* NAME\)/,
  /PAY BAND/,
  /\bNDA\b/,
  /internal reference/i,
  /Confidential · v1\.0/,
  /Answer key \(examiners only\)/,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ID_RE = /([0-9a-f]{32})/;
const warnings = [];
const warn = (m) => warnings.push(m);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}
function normTitle(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
function findBangladeshDir(dir) {
  // The export nests pages under "Private & Shared/Bangladesh" (or similar). Find the folder holding "Start Here *.md".
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    const entries = fs.readdirSync(d, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && /^Start Here [0-9a-f]{32}\.md$/.test(e.name))) return d;
    for (const e of entries) if (e.isDirectory()) stack.push(path.join(d, e.name));
  }
  throw new Error(`Could not find "Start Here" in ${dir}. Unzip the Notion export (Markdown & CSV) into academy-export/.`);
}

function parsePageFile(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
  const lines = raw.split('\n');
  const title = (lines[0] || '').replace(/^#\s+/, '').trim();
  const id = (path.basename(file).match(ID_RE) || [])[1];
  // Database rows have "Key: value" properties directly under the title.
  const props = {};
  let i = 1;
  while (i < lines.length && lines[i].trim() === '') i++;
  const propStart = i;
  while (i < lines.length && /^[A-Z][A-Za-z ]{1,30}: .+$/.test(lines[i])) {
    const [k, ...v] = lines[i].split(': ');
    props[k.trim()] = v.join(': ').trim();
    i++;
  }
  const body = Object.keys(props).length >= 3 ? lines.slice(i).join('\n') : lines.slice(propStart).join('\n');
  return { id, title, props: Object.keys(props).length >= 3 ? props : {}, body, file };
}

// Ordered list of linked page ids in a markdown body (used for ordering children).
function linkedIds(md) {
  const ids = [];
  for (const m of md.matchAll(/\]\(([^)]+\.md)\)/g)) {
    const id = (decodeURIComponent(m[1]).match(ID_RE) || [])[1];
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

// ---------------------------------------------------------------------------
// Block conversion: Notion <aside> callouts and toggles
// ---------------------------------------------------------------------------

const CALLOUTS = {
  '🟣': 'intro',
  '🎯': 'coach',
  '⛔': 'never',
  '💡': 'tip',
  '📝': 'note',
  '⚠️': 'warning',
  '📄': 'note',
};

function inline(md) {
  return marked.parseInline(md.trim());
}

function convertBlocks(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '<aside>') {
      let depth = 1;
      let j = i + 1;
      for (; j < lines.length; j++) {
        if (lines[j].trim() === '<aside>') depth++;
        if (lines[j].trim() === '</aside>') depth--;
        if (depth === 0) break;
      }
      const inner = lines.slice(i + 1, j);
      while (inner.length && inner[0].trim() === '') inner.shift();
      let icon = '';
      if (inner.length && [...inner[0].trim()].length <= 2 && !/[A-Za-z0-9]/.test(inner[0])) icon = inner.shift().trim();
      const kind = CALLOUTS[icon] || 'note';
      out.push('', `<div class="callout callout-${kind}">`, '', convertBlocks(inner.join('\n')).trim(), '', '</div>', '');
      i = j + 1;
      continue;
    }
    // Toggle: a top-level bullet whose children are indented by 4 spaces.
    const t = line.match(/^- (?!\[[ x]\])(.+)$/);
    if (t && i + 1 < lines.length && /^ {4}/.test(lines[i + 1])) {
      let j = i + 1;
      const kids = [];
      while (j < lines.length && (/^ {4}/.test(lines[j]) || (lines[j].trim() === '' && j + 1 < lines.length && /^ {4}/.test(lines[j + 1])))) {
        kids.push(lines[j].replace(/^ {4}/, ''));
        j++;
      }
      const summary = t[1].trim();
      const cls = /^answers?\b/i.test(summary) ? ' class="toggle toggle-answers"' : ' class="toggle"';
      out.push('', `<details${cls}><summary>${inline(summary)}</summary>`, '', convertBlocks(kids.join('\n')).trim(), '', '</details>', '');
      i = j;
      continue;
    }
    out.push(line);
    i++;
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

function sanitize(md, title) {
  let lines = md.split('\n');
  lines = lines.filter((l) => !/^!\[\]\(https:\/\/narqix\.com\/HomeLogo\.png\)\s*$/.test(l.trim()));
  lines = lines.filter((l) => !STRIP_LINE_PATTERNS.some((re) => re.test(l)));
  let text = lines.join('\n');
  for (const [re, rep] of STRIP_TEXT) text = text.replace(re, rep);
  text = text.replace(STAFF_PLACEHOLDER, '');
  text = text.replace(/(Signed off by:)\s*$/gm, '$1 your Trainer or Campaign Lead');
  // Footer
  text = text.replace(/\*Narqix Academy · Confidential · v1\.0\*/g, '*© Narqix Academy*');
  text = text.replace(/Narqix Academy · Confidential · v1\.0/g, '© Narqix Academy');
  for (const re of FORBIDDEN) {
    const m = text.match(re);
    if (m) throw new Error(`Forbidden content "${m[0]}" left in "${title}". Add a strip rule in scripts/import-notion.mjs.`);
  }
  return text;
}

// Remove trailing navigation sections ("In this section", "Scripts for this track"): the site builds its own nav.
function stripNavSections(md) {
  return md.replace(/\n## (In this section|Scripts for this track|Pages in this section)\n[\s\S]*?(?=\n## |\s*$)/g, (block) => {
    // Keep the section if it holds more than just links (e.g. a table with descriptions).
    const content = block.split('\n').slice(2).filter((l) => l.trim());
    const allLinks = content.every((l) => /^\[[^\]]+\]\([^)]+\)\s*$/.test(l.trim()));
    return allLinks ? '\n' : block;
  });
}

function main() {
  const base = findBangladeshDir(EXPORT_DIR);
  console.log(`Reading export from ${path.relative(ROOT, base)}`);

  const pages = new Map(); // id -> page
  const sectionPages = {}; // key -> [page]

  for (const sec of SECTIONS) {
    const rootFile = fs.readdirSync(base).find((f) => f.startsWith(sec.folder + ' ') && ID_RE.test(f) && f.endsWith('.md'));
    const children = fs.existsSync(path.join(base, sec.folder))
      ? walk(path.join(base, sec.folder)).filter((f) => f.endsWith('.md'))
      : [];
    const list = [];
    if (rootFile && !sec.database) {
      const p = parsePageFile(path.join(base, rootFile));
      p.isRoot = true;
      list.push(p);
    }
    let rootLinks = rootFile ? linkedIds(fs.readFileSync(path.join(base, rootFile), 'utf8')) : [];
    for (const f of children) list.push(parsePageFile(f));
    for (const p of list) p.section = sec.key;
    // Order: root first, then children in the order the root page links them, then by script ID / title.
    const scriptNum = (p) => parseInt((p.props['Script ID'] || '').replace(/\D/g, '') || '9999', 10);
    list.sort((a, b) => {
      if (a.isRoot) return -1;
      if (b.isRoot) return 1;
      const ia = rootLinks.indexOf(a.id), ib = rootLinks.indexOf(b.id);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 1e6 : ia) - (ib === -1 ? 1e6 : ib);
      if (sec.database) return scriptNum(a) - scriptNum(b);
      return a.title.localeCompare(b.title);
    });
    sectionPages[sec.key] = list.filter((p) => {
      if (EXCLUDED_TITLES.has(p.title)) {
        console.log(`  excluded (internal): ${p.title}`);
        return false;
      }
      return true;
    });
    for (const p of sectionPages[sec.key]) pages.set(p.id, p);
  }

  // Slugs (unique per section).
  for (const sec of SECTIONS) {
    const used = new Set();
    for (const p of sectionPages[sec.key]) {
      let s = p.isRoot ? 'overview' : slugify(p.title);
      if (used.has(s) && p.props.Track) s = `${s}-${slugify(p.props.Track)}`;
      let n = 2;
      while (used.has(s)) s = `${slugify(p.title)}-${n++}`;
      used.add(s);
      p.slug = s;
      p.url = p.isRoot ? `/learn/${sec.key}/` : `/learn/${sec.key}/${s}/`;
    }
  }

  // Exam pages are linked as /exams/.
  const examIds = new Set();
  const quizDir = path.join(base, 'Quizzes & Certification');
  for (const f of [...walk(quizDir), ...fs.readdirSync(base).map((f) => path.join(base, f))]) {
    if (/Quizzes & Certification|Exam/.test(f)) {
      const id = (path.basename(f).match(ID_RE) || [])[1];
      if (id) examIds.add(id);
    }
  }

  function rewriteLinks(md) {
    return md.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (all, text, href) => {
      if (/^(https?:|mailto:)/.test(href)) return all;
      const id = (decodeURIComponent(href).match(ID_RE) || [])[1];
      if (id && pages.has(id)) return `[${text}](${pages.get(id).url})`;
      if (id && examIds.has(id)) return `[${text}](/exams/)`;
      return text; // unpublished page: keep the words, drop the link
    });
  }

  // Write lessons.
  fs.rmSync(LESSON_DIR, { recursive: true, force: true });
  const index = [];
  let order = 0;
  for (const sec of SECTIONS) {
    for (const p of sectionPages[sec.key]) {
      let md = stripNavSections(p.body);
      md = sanitize(md, p.title);
      md = rewriteLinks(md);
      md = convertBlocks(md).trim() + '\n';
      // Summary: first paragraph of the intro callout.
      const intro = md.match(/<div class="callout callout-intro">\n\n([^\n]+)/);
      const summary = intro ? intro[1].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').slice(0, 200) : '';
      const meta = md.match(/Time to complete: ([^\n<]+)/);
      const scriptTrack = p.props.Track ? SCRIPT_TRACKS[p.props.Track] : undefined;
      if (p.props.Track && !scriptTrack) warn(`Unknown script track "${p.props.Track}" on ${p.title}`);
      const fm = {
        id: p.id,
        title: p.title,
        section: sec.key,
        page: p.slug, // not "slug": Astro's glob loader would use that as the entry id
        order: order++,
        summary,
        ...(meta ? { duration: meta[1].trim() } : {}),
        ...(scriptTrack ? { scriptTrack, scriptId: p.props['Script ID'], role: p.props.Role, stage: p.props.Stage } : {}),
      };
      const dir = path.join(LESSON_DIR, sec.key);
      fs.mkdirSync(dir, { recursive: true });
      const front = Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');
      fs.writeFileSync(path.join(dir, `${p.slug}.md`), `---\n${front}\n---\n\n${md}`);
      index.push({ ...fm, slug: p.slug, url: p.url, isRoot: !!p.isRoot });
    }
  }

  // Learning paths: Start Here -> Standards -> Core Skills -> Track -> Track scripts (+ Core scripts) -> Exams.
  const foundationIds = index.filter((l) => ['start-here', 'standards', 'core-skills'].includes(l.section)).map((l) => l.id);
  const tracks = {};
  for (const sec of SECTIONS.filter((s) => s.group === 'track')) {
    const trackRoot = sectionPages[sec.key].find((p) => p.isRoot);
    const scriptOrder = trackRoot ? linkedIds(trackRoot.body) : [];
    const scripts = index
      .filter((l) => l.section === 'scripts' && (l.scriptTrack === sec.key || l.scriptTrack === '*'))
      .sort((a, b) => {
        const ia = scriptOrder.indexOf(a.id), ib = scriptOrder.indexOf(b.id);
        if (a.scriptTrack === '*' && b.scriptTrack !== '*') return -1;
        if (b.scriptTrack === '*' && a.scriptTrack !== '*') return 1;
        return (ia === -1 ? 1e6 + a.order : ia) - (ib === -1 ? 1e6 + b.order : ib);
      });
    tracks[sec.key] = {
      key: sec.key,
      title: sec.title,
      summary: index.find((l) => l.section === sec.key && l.isRoot)?.summary || '',
      steps: [
        { key: 'start-here', title: 'Start Here', lessonIds: index.filter((l) => l.section === 'start-here').map((l) => l.id) },
        { key: 'standards', title: 'Narqix Standards', lessonIds: index.filter((l) => l.section === 'standards').map((l) => l.id) },
        { key: 'core-skills', title: 'Core Skills', lessonIds: index.filter((l) => l.section === 'core-skills').map((l) => l.id) },
        { key: sec.key, title: `${sec.title} Track`, lessonIds: index.filter((l) => l.section === sec.key).map((l) => l.id) },
        { key: 'scripts', title: 'Script Library', lessonIds: scripts.map((l) => l.id) },
      ],
    };
    tracks[sec.key].lessonIds = tracks[sec.key].steps.flatMap((s) => s.lessonIds);
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, 'lessons.json'),
    JSON.stringify({ sections: SECTIONS.map(({ key, title, group }) => ({ key, title, group })), foundationIds, tracks, lessons: index }, null, 1),
  );

  // -------------------------------------------------------------------------
  // Exams
  // -------------------------------------------------------------------------
  const byTitle = new Map(); // normalized title -> [lessons]
  for (const l of index) byTitle.set(normTitle(l.title), [...(byTitle.get(normTitle(l.title)) || []), l]);
  byTitle.set(normTitle('Welcome to Narqix Academy'), [index.find((l) => l.section === 'start-here' && l.isRoot)]);
  let examTrack = null; // prefer lessons from the exam's own track when titles repeat
  const pick = (list) => list.find((l) => l.section === examTrack) || list.find((l) => tracksFoundation.includes(l.section)) || list[0];
  const tracksFoundation = ['start-here', 'standards', 'core-skills', 'scripts'];
  const lookupSource = (name) => {
    const n = normTitle(name.replace(/\(.*?\)/g, '').replace(/^(the )?script:?\s*/i, ''));
    if (byTitle.has(n)) return pick(byTitle.get(n));
    // Section overview names such as "Narqix Standards (section overview)" or "Solar Track".
    const sec = SECTIONS.find((s) => normTitle(s.folder) === n || normTitle(s.title) === n || normTitle(s.title + ' track') === n);
    if (sec) return index.find((l) => l.section === sec.key && l.isRoot) || index.find((l) => l.section === sec.key);
    // Loose match: lesson title starts with the cited name.
    for (const [t, l] of byTitle) if (t.startsWith(n) || n.startsWith(t)) return pick(l);
    return null;
  };

  fs.rmSync(EXAM_DIR, { recursive: true, force: true });
  fs.mkdirSync(EXAM_DIR, { recursive: true });
  const publicExams = [];
  for (const cfg of EXAMS) {
    const file = walk(quizDir).find((f) => path.basename(f).startsWith(cfg.file + ' '));
    if (!file) throw new Error(`Exam page "${cfg.file}" not found in export`);
    examTrack = cfg.track;
    const exam = parseExam(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'), cfg, lookupSource);
    fs.writeFileSync(path.join(EXAM_DIR, `${cfg.id}.json`), JSON.stringify(exam, null, 1));
    publicExams.push({
      id: exam.id,
      title: exam.title,
      track: exam.track,
      total: exam.total,
      passMark: exam.passMark,
      passPercent: PASS_PERCENT,
      gateCount: exam.gateCount,
      timeLimitMinutes: exam.timeLimitMinutes,
      parts: exam.parts.map((p) => ({ n: p.n, name: p.name, count: p.questionNumbers.length })),
      roles: exam.roles || null,
      partRules: (exam.partRules || []).map(({ part, min, roles, label }) => ({ part, min, roles, label })),
      calculator: exam.calculator,
    });
    console.log(`  exam ${cfg.id}: ${exam.total} Q, pass ${exam.passMark}, ${exam.gateCount} gates, ${exam.timeLimitMinutes} min`);
  }
  fs.writeFileSync(path.join(DATA_DIR, 'exams.json'), JSON.stringify(publicExams, null, 1));
  fs.writeFileSync(path.join(EXAM_DIR, 'index.js'), `// Generated by scripts/import-notion.mjs. Server-only: imported by Pages Functions, never shipped to the browser.\n${EXAMS.map((e, i) => `import e${i} from './${e.id}.json';`).join('\n')}\nexport const EXAMS = { ${EXAMS.map((e, i) => `${JSON.stringify(e.id)}: e${i}`).join(', ')} };\n`);

  fs.writeFileSync(path.join(EXAM_DIR, 'index.d.ts'), 'export declare const EXAMS: Record<string, unknown>;\n');

  console.log(`\nWrote ${index.length} lessons, ${Object.keys(tracks).length} track paths, ${EXAMS.length} exams.`);
  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log('  - ' + w);
  }
}

function parseExam(raw, cfg, lookupSource) {
  const lines = raw.split('\n');
  const timeM = raw.match(/Time limit:?\**:?\s*(\d+)\s*minutes/i);
  const passM = raw.match(/which is (\d+) correct answers/i);
  const keyStart = lines.findIndex((l) => /^## Answer key/i.test(l));
  if (keyStart < 0) throw new Error(`${cfg.file}: no "Answer key" section`);

  const parts = [];
  const questions = [];
  let part = null;
  let pendingContext = [];
  let i = 0;
  while (i < keyStart) {
    const line = lines[i];
    const pm = line.match(/^## Part (\d+):\s*(.+?)\s*\((\d+) questions?\)/i);
    if (pm) {
      part = { n: +pm[1], name: pm[2], declared: +pm[3], questionNumbers: [], contextHtml: '' };
      parts.push(part);
      pendingContext = [];
      i++;
      continue;
    }
    if (/^## /.test(line)) {
      part = part && part.questionNumbers.length ? part : part; // non-part heading (e.g. "How this exam works")
      i++;
      continue;
    }
    if (part && line.trim() === '<aside>' && part.questionNumbers.length === 0) {
      // Shared data for the part (e.g. the bank statement problem).
      let j = i + 1;
      while (j < keyStart && lines[j].trim() !== '</aside>') j++;
      pendingContext.push(lines.slice(i, j + 1).join('\n'));
      part.contextHtml = marked.parse(convertBlocks(pendingContext.join('\n\n')));
      i = j + 1;
      continue;
    }
    const qm = line.match(/^\*\*Q(\d+)\.\s*/);
    if (qm) {
      if (!part) throw new Error(`${cfg.file}: Q${qm[1]} before any Part heading`);
      const n = +qm[1];
      const stem = [];
      let j = i;
      while (j < keyStart && !/^- A\. /.test(lines[j])) stem.push(lines[j++]);
      const options = [];
      while (j < keyStart && /^- [A-D]\. /.test(lines[j])) {
        const om = lines[j].match(/^- ([A-D])\. (.*)$/);
        options.push({ letter: om[1], html: marked.parseInline(om[2].trim()) });
        j++;
      }
      if (!/^- Answer Q\d+/.test(lines[j] || '')) throw new Error(`${cfg.file}: Q${n} has no answer toggle`);
      j++;
      const ans = [];
      while (j < keyStart && (/^ {4}/.test(lines[j]) || lines[j].trim() === '')) {
        if (lines[j].trim() === '' && !/^ {4}/.test(lines[j + 1] || '')) break;
        ans.push(lines[j].replace(/^ {4}/, ''));
        j++;
      }
      const ansText = ans.join('\n');
      const correct = (ansText.match(/\*\*Correct:\s*([A-D])\.?\*\*/) || [])[1];
      if (!correct) throw new Error(`${cfg.file}: Q${n} no "Correct:" letter`);
      const srcLine = ans.map((l) => l.trim()).reverse().find((l) => /^Source:/.test(l));
      if (!srcLine) warn(`${cfg.file}: Q${n} has no Source line`);
      const sourceNames = srcLine ? srcLine.replace(/^Source:\s*/, '').replace(/\.\s*$/, '').split(/;\s*/).map((s) => s.trim()).filter(Boolean) : [];
      const sources = sourceNames.map((name) => {
        const l = lookupSource(name);
        if (!l) warn(`${cfg.file}: Q${n} source "${name}" does not match a published lesson`);
        return l ? { title: l.title, url: l.url, lessonId: l.id } : { title: name, url: null };
      });
      let stemMd = stem.join('\n').trim();
      const gate = stemMd.includes('🔒');
      stemMd = stemMd.replace(/🔒\s*/g, '').replace(/^\*\*Q\d+\.\s*/, '**');
      // A fully bold one-line question reads better unbolded.
      if (/^\*\*[^*]+\*\*$/.test(stemMd)) stemMd = stemMd.slice(2, -2);
      if (options.length !== 4) throw new Error(`${cfg.file}: Q${n} has ${options.length} options`);
      questions.push({ n, part: part.n, gate, stemHtml: marked.parse(stemMd).trim(), options, correct, sources });
      part.questionNumbers.push(n);
      i = j;
      continue;
    }
    i++;
  }

  // Answer key cross-check.
  const keyText = lines.slice(keyStart).join('\n');
  const keyMap = {};
  for (const row of keyText.split('\n')) {
    if (!/^\s*\|\s*\d+/.test(row)) continue;
    const cells = row.split('|').map((c) => c.trim()).slice(1, -1);
    const width = cells.length % 3 === 0 && /^[A-D]$/.test(cells[1]) && !/^\d+$/.test(cells[2]) ? 3 : 2;
    for (let c = 0; c + 1 < cells.length; c += width) if (/^\d+$/.test(cells[c])) keyMap[+cells[c]] = cells[c + 1];
  }
  const gateLine = keyText.match(/Gate questions \((\d+)[^)]*\):\s*([\d,\s]+)/);
  const keyGates = gateLine ? gateLine[2].split(/[,\s]+/).filter(Boolean).map(Number) : [];
  const errors = [];
  if (questions.length !== cfg.total) errors.push(`expected ${cfg.total} questions, parsed ${questions.length}`);
  questions.forEach((q, idx) => {
    if (q.n !== idx + 1) errors.push(`question numbering gap at Q${q.n}`);
    if (keyMap[q.n] && keyMap[q.n] !== q.correct) errors.push(`Q${q.n}: toggle says ${q.correct}, answer key says ${keyMap[q.n]}`);
    if (!keyMap[q.n]) warn(`${cfg.file}: Q${q.n} missing from answer key table`);
  });
  const gates = questions.filter((q) => q.gate).map((q) => q.n);
  if (gates.length !== cfg.gates) errors.push(`expected ${cfg.gates} gate questions, found ${gates.length} marked 🔒`);
  if (keyGates.length && keyGates.join(',') !== gates.join(',')) errors.push(`gate list in key (${keyGates}) differs from 🔒 marks (${gates})`);
  for (const p of parts) if (p.declared !== p.questionNumbers.length) errors.push(`Part ${p.n} declares ${p.declared} questions, parsed ${p.questionNumbers.length}`);
  const passMark = Math.ceil((cfg.total * PASS_PERCENT) / 100);
  if (passM && +passM[1] !== passMark) errors.push(`page pass mark ${passM[1]} differs from ${passMark}`);
  for (const r of cfg.partRules || []) {
    const p = parts.find((x) => x.n === r.part);
    if (!p) errors.push(`part rule refers to missing Part ${r.part}`);
  }
  if (!timeM) errors.push('no time limit found');
  if (errors.length) throw new Error(`${cfg.file}:\n  ${errors.join('\n  ')}`);

  return {
    id: cfg.id,
    title: cfg.title,
    track: cfg.track,
    total: cfg.total,
    passMark,
    gateCount: gates.length,
    timeLimitMinutes: +timeM[1],
    calculator: /calculator/i.test(lines.slice(0, keyStart).join('\n')),
    roles: cfg.roles || null,
    partRules: cfg.partRules || [],
    parts: parts.map(({ n, name, questionNumbers, contextHtml }) => ({ n, name, questionNumbers, contextHtml })),
    questions,
  };
}

main();
