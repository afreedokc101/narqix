import type { Env } from './env';
import { b64url, randomBytes, sha256 } from './crypto';

const SESSION_DAYS = 30;

export interface Candidate {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  district: string;
  track: string;
  cv_url: string | null;
  email_verified: number;
  hiring_status: string;
  created_at: number;
}

function cookies(request: Request): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (request.headers.get('cookie') || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function getCookie(request: Request, name: string): string | undefined {
  return cookies(request)[name];
}

export async function createSession(env: Env, candidateId: string): Promise<string[]> {
  const token = b64url(randomBytes(32));
  const now = Date.now();
  await env.DB.prepare('INSERT INTO sessions (token_hash, candidate_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256(token), candidateId, now, now + SESSION_DAYS * 864e5)
    .run();
  const maxAge = SESSION_DAYS * 86400;
  return [
    `nq_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
    // Readable flag so static pages can show "Dashboard" instead of "Log in" without an API call.
    `nq_auth=1; Path=/; Secure; SameSite=Lax; Max-Age=${maxAge}`,
  ];
}

export function clearSessionCookies(): string[] {
  return ['nq_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0', 'nq_auth=; Path=/; Secure; SameSite=Lax; Max-Age=0'];
}

export async function destroySession(env: Env, request: Request): Promise<void> {
  const token = getCookie(request, 'nq_session');
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run();
}

export async function currentCandidate(env: Env, request: Request): Promise<Candidate | null> {
  const token = getCookie(request, 'nq_session');
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT c.* FROM sessions s JOIN candidates c ON c.id = s.candidate_id WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256(token), Date.now())
    .first<Candidate>();
  return row ?? null;
}

/** Normalize a Bangladesh mobile number to +8801XXXXXXXXX, or return null if invalid. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, '');
  const m = digits.match(/^(?:\+?880|0088|88)?0?(1[3-9]\d{8})$/);
  return m ? `+880${m[1]}` : null;
}

export function validEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254;
}

/** Fixed-window rate limit. Returns false when the limit is exceeded. */
export async function rateLimit(env: Env, key: string, limit: number, windowSec: number): Promise<boolean> {
  const now = Date.now();
  const row = await env.DB.prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?').bind(key).first<{ count: number; reset_at: number }>();
  if (!row || row.reset_at <= now) {
    await env.DB.prepare('INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)').bind(key, now + windowSec * 1000).run();
    return true;
  }
  if (row.count >= limit) return false;
  await env.DB.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run();
  return true;
}

export function emailLoginEnabled(env: Env): boolean {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

export async function sendLoginCode(env: Env, to: string, code: string): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [to],
      subject: `Your Narqix Academy code: ${code}`,
      text: `Your Narqix Academy login code is ${code}\n\nIt expires in 10 minutes. If you did not ask for it, ignore this email.\n\n© Narqix Academy`,
    }),
  });
  return res.ok;
}
