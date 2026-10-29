import type { Ctx } from '../_lib/env';
import { error, json, readJson, sameOrigin, str } from '../_lib/http';
import { currentCandidate } from '../_lib/auth';
import { trackLessonIds, trackTitle } from '../_lib/exams';
import { needsApproval } from '../_lib/nda';
import lessonsData from '../../src/data/lessons.json';

const LESSON_IDS = new Set((lessonsData as { lessons: { id: string }[] }).lessons.map((l) => l.id));

export const onRequestGet = async ({ request, env }: Ctx) => {
  const me = await currentCandidate(env, request);
  if (!me) return error(401, 'Not logged in');
  const blocked = needsApproval(me);
  if (blocked) return blocked;
  const rows = await env.DB.prepare('SELECT lesson_id FROM lesson_progress WHERE candidate_id = ?').bind(me.id).all<{ lesson_id: string }>();
  const read = rows.results.map((r) => r.lesson_id);
  const set = new Set(read);
  const ids = trackLessonIds(me.track);
  return json({ track: me.track, trackTitle: trackTitle(me.track), trackRead: ids.filter((id) => set.has(id)).length, trackTotal: ids.length, read });
};

/** Body: { lessonId, read: boolean } */
export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const me = await currentCandidate(env, request);
  if (!me) return error(401, 'Not logged in');
  const blocked = needsApproval(me);
  if (blocked) return blocked;
  const b = await readJson(request);
  const lessonId = str(b.lessonId, 64);
  if (!LESSON_IDS.has(lessonId)) return error(400, 'Unknown lesson');
  if (b.read === false) {
    await env.DB.prepare('DELETE FROM lesson_progress WHERE candidate_id = ? AND lesson_id = ?').bind(me.id, lessonId).run();
  } else {
    await env.DB.prepare('INSERT OR IGNORE INTO lesson_progress (candidate_id, lesson_id, read_at) VALUES (?, ?, ?)').bind(me.id, lessonId, Date.now()).run();
  }
  return json({ ok: true });
};
