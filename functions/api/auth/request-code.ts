// Email a 6-digit login code (only when Resend is configured).
import type { Ctx } from '../../_lib/env';
import { clientIp, error, json, readJson, sameOrigin, str } from '../../_lib/http';
import { emailLoginEnabled, rateLimit, sendLoginCode, validEmail } from '../../_lib/auth';
import { sha256, sixDigitCode } from '../../_lib/crypto';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  if (!emailLoginEnabled(env)) return error(400, 'Email login is not available. Log in with your phone and password.');
  const b = await readJson(request);
  const email = str(b.email, 254).toLowerCase();
  if (!validEmail(email)) return error(400, 'Enter a valid email address.');
  if (!(await rateLimit(env, `code-ip:${clientIp(request)}`, 20, 3600))) return error(429, 'Too many requests. Try again later.');
  if (!(await rateLimit(env, `code:${email}`, 5, 3600))) return error(429, 'Too many codes requested. Try again in an hour.');
  const exists = await env.DB.prepare('SELECT 1 FROM candidates WHERE email = ?').bind(email).first();
  // Same response either way so the endpoint cannot be used to discover registered emails.
  if (exists) {
    const code = sixDigitCode();
    const now = Date.now();
    await env.DB.prepare('INSERT OR REPLACE INTO login_codes (email, code_hash, attempts, created_at, expires_at) VALUES (?, ?, 0, ?, ?)')
      .bind(email, await sha256(`${email}|${code}`), now, now + 10 * 60_000)
      .run();
    if (!(await sendLoginCode(env, email, code))) return error(502, 'Could not send the email. Try again or log in with your phone.');
  }
  return json({ ok: true });
};
