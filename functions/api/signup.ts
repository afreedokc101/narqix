import type { Ctx } from '../_lib/env';
import { clientIp, error, readJson, sameOrigin, str } from '../_lib/http';
import { withCookies } from '../_lib/respond';
import { createSession, emailLoginEnabled, normalizePhone, rateLimit, validEmail } from '../_lib/auth';
import { hashPassword } from '../_lib/crypto';
import { verifyTurnstile } from '../_lib/turnstile';
import { isTrack } from '../_lib/exams';

export const onRequestPost = async ({ request, env }: Ctx) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const ip = clientIp(request);
  if (!(await rateLimit(env, `signup:${ip}`, 10, 3600))) return error(429, 'Too many sign-ups from this network. Try again later.');
  const b = await readJson(request);
  if (!(await verifyTurnstile(env, b.turnstileToken, ip))) return error(400, 'Please complete the security check and try again.');

  const fullName = str(b.fullName, 120);
  const phone = normalizePhone(str(b.phone, 30));
  const email = str(b.email, 254).toLowerCase();
  const district = str(b.district, 80);
  const track = str(b.track, 60);
  const cvUrl = str(b.cvUrl, 500);
  const password = typeof b.password === 'string' ? b.password : '';

  const errors: Record<string, string> = {};
  if (fullName.length < 3) errors.fullName = 'Enter your full name.';
  if (!phone) errors.phone = 'Enter a Bangladesh mobile number, for example 01712345678.';
  if (!validEmail(email)) errors.email = 'Enter a valid email address.';
  if (district.length < 2) errors.district = 'Enter your district or city.';
  if (!isTrack(track)) errors.track = 'Choose a track.';
  if (cvUrl && !/^https:\/\/[^\s]+$/i.test(cvUrl)) errors.cvUrl = 'CV link must start with https://';
  const needPassword = !emailLoginEnabled(env) || password.length > 0;
  if (needPassword && (password.length < 8 || password.length > 200)) errors.password = 'Use at least 8 characters.';
  if (Object.keys(errors).length) return error(400, 'Please fix the highlighted fields.', { fields: errors });

  const existing = await env.DB.prepare('SELECT phone, email FROM candidates WHERE phone = ? OR email = ?').bind(phone, email).first<{ phone: string; email: string }>();
  if (existing) {
    return error(409, 'An account with this phone or email already exists. Log in instead.', {
      fields: existing.phone === phone ? { phone: 'Already registered.' } : { email: 'Already registered.' },
    });
  }

  const id = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO candidates (id, full_name, phone, email, district, track, cv_url, password_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, fullName, phone, email, district, track, cvUrl || null, needPassword ? await hashPassword(password) : null, now, now)
    .run();
  return withCookies({ ok: true }, await createSession(env, id), 201);
};
