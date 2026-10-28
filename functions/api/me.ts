import type { Ctx } from '../_lib/env';
import { error, json } from '../_lib/http';
import { currentCandidate } from '../_lib/auth';
import { allExams, attemptsFor, eligibility, expireIfNeeded, trackLessonIds, trackTitle } from '../_lib/exams';

export const onRequestGet = async ({ request, env }: Ctx) => {
  const me = await currentCandidate(env, request);
  if (!me) return error(401, 'Not logged in');
  const read = (await env.DB.prepare('SELECT lesson_id FROM lesson_progress WHERE candidate_id = ?').bind(me.id).all<{ lesson_id: string }>()).results.map((r) => r.lesson_id);
  const readSet = new Set(read);
  let attempts = await attemptsFor(env, me.id);
  attempts = await Promise.all(attempts.map((a) => expireIfNeeded(env, a)));
  const exams = allExams().map((e) => {
    const mine = attempts.filter((a) => a.exam_id === e.id);
    return {
      id: e.id,
      title: e.title,
      track: e.track,
      eligibility: eligibility(mine),
      attempts: mine.map((a) => ({ id: a.id, status: a.status, score: a.score, total: a.total, startedAt: a.started_at, submittedAt: a.submitted_at })),
    };
  });
  const certificates = (
    await env.DB.prepare('SELECT id, track, issued_at, foundation_score, track_score, status FROM certificates WHERE candidate_id = ? ORDER BY issued_at').bind(me.id).all()
  ).results.map((c: any) => ({ ...c, trackTitle: trackTitle(c.track) }));
  const ids = trackLessonIds(me.track);
  return json({
    candidate: { id: me.id, fullName: me.full_name, phone: me.phone, email: me.email, district: me.district, track: me.track, trackTitle: trackTitle(me.track), cvUrl: me.cv_url },
    progress: { read, trackRead: ids.filter((id) => readSet.has(id)).length, trackTotal: ids.length },
    exams,
    certificates,
  });
};
