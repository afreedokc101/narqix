import type { Ctx } from '../../../../_lib/env';
import { error, json, readJson, sameOrigin, str } from '../../../../_lib/http';
import { latestNda, type AccessStatus } from '../../../../_lib/nda';
import { emails, sendEmail } from '../../../../_lib/email';

/** Body: { decision: 'approve' | 'reject', note?: string }. A rejection needs a note, which is emailed to the candidate. */
export const onRequestPost = async ({ request, env, params, data, waitUntil }: Ctx<'id'>) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const id = String(params.id);
  const b = await readJson(request);
  const decision = str(b.decision, 10);
  const note = str(b.note, 500);
  if (decision !== 'approve' && decision !== 'reject') return error(400, 'Unknown decision');
  if (decision === 'reject' && note.length < 3) return error(400, 'Tell the candidate what to fix.');

  const c = await env.DB.prepare('SELECT id, full_name, email, access_status FROM candidates WHERE id = ?').bind(id).first<{ id: string; full_name: string; email: string; access_status: AccessStatus }>();
  if (!c) return error(404, 'Candidate not found');
  if (!(await latestNda(env, id))) return error(409, 'This candidate has not uploaded an NDA yet.');

  const status: AccessStatus = decision === 'approve' ? 'approved' : 'rejected';
  if (c.access_status === status) return json({ ok: true, accessStatus: status, unchanged: true });
  const now = Date.now();
  const admin = String(data.adminEmail);
  await env.DB.batch([
    env.DB.prepare('UPDATE candidates SET access_status = ?, access_note = ?, access_reviewed_by = ?, access_reviewed_at = ?, updated_at = ? WHERE id = ?')
      .bind(status, decision === 'reject' ? note : null, admin, now, now, id),
    env.DB.prepare('INSERT INTO status_history (candidate_id, status, changed_by, changed_at) VALUES (?, ?, ?, ?)').bind(id, `access:${status}`, admin, now),
  ]);
  const [subject, text] = decision === 'approve' ? emails.approved(env, c.full_name) : emails.rejected(env, c.full_name, note);
  waitUntil(sendEmail(env, [c.email], subject, text));
  return json({ ok: true, accessStatus: status });
};
