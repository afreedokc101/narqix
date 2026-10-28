import type { Ctx } from '../../../_lib/env';
import { clientIp, error, json, readJson, sameOrigin } from '../../../_lib/http';
import { loadOwnAttempt, sanitizeAnswers } from '../../../_lib/attempt';
import { verifyTurnstile } from '../../../_lib/turnstile';
import { finalizeAttempt } from '../../../_lib/exams';

export const onRequestPost = async ({ request, env, params }: Ctx<'id'>) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const r = await loadOwnAttempt(env, request, String(params.id));
  if (r instanceof Response) return r;
  let { attempt } = r;
  // Already closed (submitted, or time ran out and the saved answers were graded): just report it.
  if (attempt.status === 'in_progress') {
    const b = await readJson(request);
    if (!(await verifyTurnstile(env, b.turnstileToken, clientIp(request)))) return error(400, 'Please complete the security check, then submit again.');
    attempt = await finalizeAttempt(env, attempt, sanitizeAnswers(b.answers, attempt.total));
  }
  return json({ id: attempt.id, status: attempt.status, result: JSON.parse(attempt.result_json || 'null') });
};
