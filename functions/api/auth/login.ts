// Phone + password login (always available; the fallback when email codes are not configured).
import type { Ctx } from '../../_lib/env';
import { clientIp, error, readJson, sameOrigin, str } from '../../_lib/http';
import { createSession, normalizePhone, rateLimit } from '../../_lib/auth';
import { verifyPassword } from '../../_lib/crypto';
import { withCookies } from '../../_lib/respond';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const b = await readJson(request);
  const phone = normalizePhone(str(b.phone, 30));
  const password = typeof b.password === 'string' ? b.password : '';
  const ip = clientIp(request);
  if (!(await rateLimit(env, `login-ip:${ip}`, 30, 900))) return error(429, 'Too many attempts. Wait 15 minutes and try again.');
  if (!phone) return error(400, 'Enter the Bangladesh mobile number you signed up with.');
  if (!(await rateLimit(env, `login:${phone}`, 8, 900))) return error(429, 'Too many attempts for this number. Wait 15 minutes and try again.');
  const row = await env.DB.prepare('SELECT id, password_hash FROM candidates WHERE phone = ?').bind(phone).first<{ id: string; password_hash: string | null }>();
  if (!row || !(await verifyPassword(password, row.password_hash))) return error(401, 'Phone number or password is incorrect.');
  return withCookies({ ok: true }, await createSession(env, row.id));
};
