import type { Ctx } from '../../_lib/env';
import { error, readJson, sameOrigin, str } from '../../_lib/http';
import { createSession, emailLoginEnabled } from '../../_lib/auth';
import { sha256, timingSafeEqual } from '../../_lib/crypto';
import { withCookies } from '../../_lib/respond';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  if (!emailLoginEnabled(env)) return error(400, 'Email login is not available.');
  const b = await readJson(request);
  const email = str(b.email, 254).toLowerCase();
  const code = str(b.code, 6).replace(/\D/g, '');
  const row = await env.DB.prepare('SELECT * FROM login_codes WHERE email = ?').bind(email).first<{ code_hash: string; attempts: number; expires_at: number }>();
  if (!row || row.expires_at < Date.now() || row.attempts >= 5) return error(400, 'This code has expired. Ask for a new one.');
  await env.DB.prepare('UPDATE login_codes SET attempts = attempts + 1 WHERE email = ?').bind(email).run();
  if (!timingSafeEqual(await sha256(`${email}|${code}`), row.code_hash)) return error(400, 'That code is not correct.');
  await env.DB.prepare('DELETE FROM login_codes WHERE email = ?').bind(email).run();
  const cand = await env.DB.prepare('SELECT id FROM candidates WHERE email = ?').bind(email).first<{ id: string }>();
  if (!cand) return error(400, 'No account for this email.');
  await env.DB.prepare('UPDATE candidates SET email_verified = 1 WHERE id = ?').bind(cand.id).run();
  return withCookies({ ok: true }, await createSession(env, cand.id));
};
