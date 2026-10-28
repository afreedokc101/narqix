import type { Ctx } from '../../../../_lib/env';
import { error, json, readJson, sameOrigin, str } from '../../../../_lib/http';
import { HIRING_STATUSES } from '../../../../_lib/admin';

export const onRequestPost = async ({ request, env, params, data }: Ctx<'id'>) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const b = await readJson(request);
  const status = str(b.status, 20);
  if (!(HIRING_STATUSES as readonly string[]).includes(status)) return error(400, 'Unknown status');
  const now = Date.now();
  const r = await env.DB.prepare('UPDATE candidates SET hiring_status = ?, updated_at = ? WHERE id = ?').bind(status, now, String(params.id)).run();
  if (!r.meta.changes) return error(404, 'Candidate not found');
  await env.DB.prepare('INSERT INTO status_history (candidate_id, status, changed_by, changed_at) VALUES (?, ?, ?, ?)')
    .bind(String(params.id), status, String(data.adminEmail), now)
    .run();
  return json({ ok: true, status });
};
