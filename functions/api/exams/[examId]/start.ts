import type { Ctx } from '../../../_lib/env';
import { error, json, readJson, sameOrigin, str } from '../../../_lib/http';
import { currentCandidate } from '../../../_lib/auth';
import { attemptsFor, eligibility, expireIfNeeded, getExam, newLayout } from '../../../_lib/exams';

export const onRequestPost = async ({ request, env, params }: Ctx<'examId'>) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const me = await currentCandidate(env, request);
  if (!me) return error(401, 'Log in to take an exam.');
  const exam = getExam(String(params.examId));
  if (!exam) return error(404, 'Unknown exam');
  const b = await readJson(request);

  let role: string | null = null;
  if (exam.roles) {
    role = str(b.role, 40);
    if (!exam.roles.some((r) => r.id === role)) return error(400, 'Choose the role you are training for.');
  }

  const attempts = await Promise.all((await attemptsFor(env, me.id, exam.id)).map((a) => expireIfNeeded(env, a)));
  const el = eligibility(attempts);
  if (el.status === 'in_progress') return json({ attemptId: el.attemptId, resumed: true });
  if (el.status === 'passed') return error(409, 'You have already passed this exam.', { eligibility: el });
  if (el.status === 'locked') return error(423, el.reason, { eligibility: el });

  const id = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO exam_attempts (id, candidate_id, exam_id, role, status, started_at, deadline_at, layout_json, total)
     VALUES (?, ?, ?, ?, 'in_progress', ?, ?, ?, ?)`,
  )
    .bind(id, me.id, exam.id, role, now, now + exam.timeLimitMinutes * 60_000, JSON.stringify(newLayout(exam)), exam.total)
    .run();
  return json({ attemptId: id, resumed: false }, 201);
};
