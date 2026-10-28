import type { Env } from './env';
import { currentCandidate, type Candidate } from './auth';
import { error } from './http';
import { expireIfNeeded, type AttemptRow } from './exams';

/** Load an attempt owned by the logged-in candidate, closing it first if its time is up. */
export async function loadOwnAttempt(env: Env, request: Request, id: string): Promise<{ me: Candidate; attempt: AttemptRow } | Response> {
  const me = await currentCandidate(env, request);
  if (!me) return error(401, 'Not logged in');
  const row = await env.DB.prepare('SELECT * FROM exam_attempts WHERE id = ? AND candidate_id = ?').bind(id, me.id).first<AttemptRow>();
  if (!row) return error(404, 'Attempt not found');
  return { me, attempt: await expireIfNeeded(env, row) };
}

export function sanitizeAnswers(raw: unknown, questionCount: number): Record<string, number> {
  const out: Record<string, number> = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const i = Number(k);
    if (Number.isInteger(i) && i >= 0 && i < questionCount && Number.isInteger(v) && (v as number) >= 0 && (v as number) < 4) out[String(i)] = v as number;
  }
  return out;
}
