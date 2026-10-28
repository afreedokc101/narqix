// Autosave answers while the exam is running. Rejected after the deadline (plus a short network grace).
import type { Ctx } from '../../../_lib/env';
import { error, json, readJson, sameOrigin } from '../../../_lib/http';
import { loadOwnAttempt, sanitizeAnswers } from '../../../_lib/attempt';

export const onRequestPost = async ({ request, env, params }: Ctx<'id'>) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const r = await loadOwnAttempt(env, request, String(params.id));
  if (r instanceof Response) return r;
  const { attempt } = r;
  if (attempt.status !== 'in_progress') return error(409, 'Time is up. Your saved answers were graded.', { closed: true });
  const b = await readJson(request);
  const answers = sanitizeAnswers(b.answers, attempt.total);
  await env.DB.prepare(`UPDATE exam_attempts SET answers_json = ? WHERE id = ? AND status = 'in_progress'`).bind(JSON.stringify(answers), attempt.id).run();
  return json({ ok: true, saved: Object.keys(answers).length, serverNow: Date.now() });
};
