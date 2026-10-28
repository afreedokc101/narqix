// GET an attempt: questions (no answers) while in progress, or the graded result once closed.
import type { Ctx } from '../../../_lib/env';
import { json } from '../../../_lib/http';
import { loadOwnAttempt } from '../../../_lib/attempt';
import { clientView, getExam } from '../../../_lib/exams';

export const onRequestGet = async ({ request, env, params }: Ctx<'id'>) => {
  const r = await loadOwnAttempt(env, request, String(params.id));
  if (r instanceof Response) return r;
  const { attempt } = r;
  const exam = getExam(attempt.exam_id)!;
  const base = {
    id: attempt.id,
    examId: exam.id,
    examTitle: exam.title,
    status: attempt.status,
    total: exam.total,
    passMark: exam.passMark,
    gateCount: exam.gateCount,
    timeLimitMinutes: exam.timeLimitMinutes,
    calculator: exam.calculator,
    startedAt: attempt.started_at,
    deadlineAt: attempt.deadline_at,
  };
  if (attempt.status === 'in_progress') {
    return json({
      ...base,
      serverNow: Date.now(),
      questions: clientView(exam, JSON.parse(attempt.layout_json)),
      answers: JSON.parse(attempt.answers_json || '{}'),
    });
  }
  return json({ ...base, submittedAt: attempt.submitted_at, result: JSON.parse(attempt.result_json || 'null') });
};
