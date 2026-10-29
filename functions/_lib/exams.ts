// Server-side exam engine. Exam data (with answers) is imported here and never sent to the browser:
// only `clientView` output leaves the server, and it carries no answer letters or original option order.
import { EXAMS } from '../../exam-data/index.js';
import lessonsData from '../../src/data/lessons.json';
import type { Env } from './env';
import { certificateId, shuffle } from './crypto';

export interface Source { title: string; url: string | null; lessonId?: string }
export interface Question {
  n: number;
  part: number;
  gate: boolean;
  stemHtml: string;
  options: { letter: string; html: string }[];
  correct: string;
  sources: Source[];
}
export interface Exam {
  id: string;
  title: string;
  track: string | null;
  total: number;
  passMark: number;
  gateCount: number;
  timeLimitMinutes: number;
  calculator: boolean;
  roles: { id: string; label: string }[] | null;
  partRules: { part: number; min: number; roles: string[]; label: string }[];
  parts: { n: number; name: string; questionNumbers: number[]; contextHtml: string }[];
  questions: Question[];
}
/** Per attempt: question order and, for each question, the order its options are shown in. */
export type Layout = { n: number; perm: number[] }[];
export type Answers = Record<string, number>; // display question index -> display option index

export const RETAKE_WAIT_MS = 2 * 864e5; // earliest retake: 2 days after a fail
export const WINDOW_MS = 30 * 864e5; // rolling window for the attempt cap
export const MAX_ATTEMPTS = 3; // per exam per 30 days
export const GRACE_MS = 30_000; // network grace after the deadline

export function getExam(id: string): Exam | null {
  return (EXAMS as Record<string, Exam>)[id] ?? null;
}
export function allExams(): Exam[] {
  return Object.values(EXAMS as Record<string, Exam>);
}

export function newLayout(exam: Exam): Layout {
  return shuffle(exam.questions).map((q) => ({ n: q.n, perm: shuffle(q.options.map((_, i) => i)) }));
}

/** What the browser receives: no answers, no letters, no original numbering. */
export function clientView(exam: Exam, layout: Layout) {
  const byN = new Map(exam.questions.map((q) => [q.n, q]));
  return layout.map((l, i) => {
    const q = byN.get(l.n)!;
    const part = exam.parts.find((p) => p.n === q.part);
    return {
      i,
      gate: q.gate,
      part: part ? `Part ${part.n}: ${part.name}` : '',
      contextHtml: part?.contextHtml || undefined,
      stemHtml: q.stemHtml,
      options: l.perm.map((o) => q.options[o].html),
    };
  });
}

export interface GradeResult {
  score: number;
  total: number;
  passMark: number;
  passed: boolean;
  gatesTotal: number;
  gatesMissed: number;
  reasons: string[];
  parts: { n: number; name: string; right: number; count: number }[];
  partRules: { label: string; applies: boolean; met: boolean; right: number; min: number }[];
  missed: { number: number; part: string; gate: boolean; stemHtml: string; sources: Source[] }[];
  reread: Source[];
}

export function grade(exam: Exam, layout: Layout, answers: Answers, role: string | null): GradeResult {
  const byN = new Map(exam.questions.map((q) => [q.n, q]));
  let score = 0;
  let gatesMissed = 0;
  const partCorrect = new Map<number, number>();
  const missed: GradeResult['missed'] = [];
  layout.forEach((l, i) => {
    const q = byN.get(l.n)!;
    const chosen = answers[String(i)];
    const ok = Number.isInteger(chosen) && chosen >= 0 && chosen < l.perm.length && q.options[l.perm[chosen]].letter === q.correct;
    if (ok) {
      score++;
      partCorrect.set(q.part, (partCorrect.get(q.part) || 0) + 1);
    } else {
      if (q.gate) gatesMissed++;
      const part = exam.parts.find((p) => p.n === q.part);
      missed.push({ number: i + 1, part: part ? `Part ${part.n}: ${part.name}` : '', gate: q.gate, stemHtml: q.stemHtml, sources: q.sources });
    }
  });
  const parts = exam.parts.map((p) => ({ n: p.n, name: p.name, right: partCorrect.get(p.n) || 0, count: p.questionNumbers.length }));
  const partRules = exam.partRules.map((r) => {
    const right = partCorrect.get(r.part) || 0;
    const applies = !!role && r.roles.includes(role);
    return { label: r.label, applies, met: !applies || right >= r.min, right, min: r.min };
  });
  const reasons: string[] = [];
  if (score < exam.passMark) reasons.push(`Total ${score}/${exam.total} is below the pass mark of ${exam.passMark}.`);
  if (gatesMissed) reasons.push(`${gatesMissed} gate question${gatesMissed > 1 ? 's' : ''} missed. Every gate question must be correct.`);
  for (const r of partRules) if (!r.met) reasons.push(`${r.label}. You scored ${r.right}.`);
  const reread = new Map<string, Source>();
  for (const m of missed) for (const s of m.sources) reread.set(s.title, s);
  return {
    score,
    total: exam.total,
    passMark: exam.passMark,
    passed: reasons.length === 0,
    gatesTotal: exam.gateCount,
    gatesMissed,
    reasons,
    parts,
    partRules,
    missed,
    reread: [...reread.values()],
  };
}

export interface AttemptRow {
  id: string;
  candidate_id: string;
  exam_id: string;
  role: string | null;
  status: 'in_progress' | 'passed' | 'failed';
  started_at: number;
  deadline_at: number;
  submitted_at: number | null;
  layout_json: string;
  answers_json: string;
  score: number | null;
  total: number;
  gates_missed: number | null;
  result_json: string | null;
}

export type Eligibility =
  | { status: 'available'; attemptsInWindow: number }
  | { status: 'in_progress'; attemptId: string; deadlineAt: number }
  | { status: 'passed'; attemptId: string; score: number | null }
  | { status: 'locked'; until: number; reason: string; attemptsInWindow: number };

/** Retake rules: earliest 2 days after a fail; at most 3 attempts per exam in any 30 days. */
export function eligibility(attempts: AttemptRow[], now = Date.now()): Eligibility {
  const passed = attempts.find((a) => a.status === 'passed');
  if (passed) return { status: 'passed', attemptId: passed.id, score: passed.score };
  const open = attempts.find((a) => a.status === 'in_progress' && now <= a.deadline_at + GRACE_MS);
  if (open) return { status: 'in_progress', attemptId: open.id, deadlineAt: open.deadline_at };
  const inWindow = attempts.filter((a) => a.started_at > now - WINDOW_MS).sort((a, b) => a.started_at - b.started_at);
  const locks: { until: number; reason: string }[] = [];
  if (inWindow.length >= MAX_ATTEMPTS) {
    locks.push({ until: inWindow[inWindow.length - MAX_ATTEMPTS].started_at + WINDOW_MS, reason: `You have used ${MAX_ATTEMPTS} attempts in 30 days.` });
  }
  const lastFail = attempts
    .filter((a) => a.status === 'failed')
    .sort((a, b) => (b.submitted_at ?? b.deadline_at) - (a.submitted_at ?? a.deadline_at))[0];
  if (lastFail) {
    const until = (lastFail.submitted_at ?? lastFail.deadline_at) + RETAKE_WAIT_MS;
    if (until > now) locks.push({ until, reason: 'You can retake an exam 2 days after a fail. Use the time to reread the pages listed in your results.' });
  }
  if (locks.length) {
    const l = locks.sort((a, b) => b.until - a.until)[0];
    return { status: 'locked', until: l.until, reason: l.reason, attemptsInWindow: inWindow.length };
  }
  return { status: 'available', attemptsInWindow: inWindow.length };
}

export async function attemptsFor(env: Env, candidateId: string, examId?: string): Promise<AttemptRow[]> {
  const q = examId
    ? env.DB.prepare('SELECT * FROM exam_attempts WHERE candidate_id = ? AND exam_id = ? ORDER BY started_at DESC').bind(candidateId, examId)
    : env.DB.prepare('SELECT * FROM exam_attempts WHERE candidate_id = ? ORDER BY started_at DESC').bind(candidateId);
  return (await q.all<AttemptRow>()).results;
}

/** Grade and close an attempt. Safe to call twice: only an in-progress attempt is updated. */
export async function finalizeAttempt(env: Env, attempt: AttemptRow, answers: Answers, now = Date.now()): Promise<AttemptRow> {
  const exam = getExam(attempt.exam_id)!;
  const result = grade(exam, JSON.parse(attempt.layout_json), answers, attempt.role);
  const status = result.passed ? 'passed' : 'failed';
  const submittedAt = Math.min(now, attempt.deadline_at + GRACE_MS);
  const upd = await env.DB.prepare(
    `UPDATE exam_attempts SET status = ?, submitted_at = ?, answers_json = ?, score = ?, gates_missed = ?, result_json = ?
     WHERE id = ? AND status = 'in_progress'`,
  )
    .bind(status, submittedAt, JSON.stringify(answers), result.score, result.gatesMissed, JSON.stringify(result), attempt.id)
    .run();
  if (upd.meta.changes && result.passed) await issueCertificates(env, attempt.candidate_id);
  const row = await env.DB.prepare('SELECT * FROM exam_attempts WHERE id = ?').bind(attempt.id).first<AttemptRow>();
  return row!;
}

/** Close any attempt whose time ran out, grading the answers saved before the deadline. */
export async function expireIfNeeded(env: Env, attempt: AttemptRow, now = Date.now()): Promise<AttemptRow> {
  if (attempt.status === 'in_progress' && now > attempt.deadline_at + GRACE_MS) {
    return finalizeAttempt(env, attempt, JSON.parse(attempt.answers_json || '{}'), now);
  }
  return attempt;
}

/** Foundation + a Track exam passed => "Narqix Academy Pre-Certified: <Track>". */
export async function issueCertificates(env: Env, candidateId: string): Promise<void> {
  const passed = (
    await env.DB.prepare(`SELECT * FROM exam_attempts WHERE candidate_id = ? AND status = 'passed' ORDER BY submitted_at`).bind(candidateId).all<AttemptRow>()
  ).results;
  const foundation = passed.find((a) => a.exam_id === 'foundation');
  if (!foundation) return;
  for (const a of passed) {
    const exam = getExam(a.exam_id);
    if (!exam?.track) continue;
    for (let tries = 0; tries < 3; tries++) {
      const r = await env.DB.prepare(
        `INSERT OR IGNORE INTO certificates (id, candidate_id, track, foundation_attempt_id, track_attempt_id, foundation_score, track_score, status, issued_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'valid', ?)`,
      )
        .bind(certificateId(), candidateId, exam.track, foundation.id, a.id, `${foundation.score}/${foundation.total}`, `${a.score}/${a.total}`, Date.now())
        .run();
      // Ignored because the (candidate, track) certificate already exists, or an ID collision: check which.
      if (r.meta.changes) break;
      const exists = await env.DB.prepare('SELECT 1 FROM certificates WHERE candidate_id = ? AND track = ?').bind(candidateId, exam.track).first();
      if (exists) break;
    }
  }
}

type LessonsData = { tracks: Record<string, { title: string; lessonIds: string[] }> };
const lessons = lessonsData as unknown as LessonsData;

export function trackTitle(key: string): string {
  return lessons.tracks[key]?.title ?? key;
}
export function trackLessonIds(key: string): string[] {
  return lessons.tracks[key]?.lessonIds ?? [];
}
export function isTrack(key: string): boolean {
  return key in lessons.tracks;
}
export function trackKeys(): string[] {
  return Object.keys(lessons.tracks);
}
