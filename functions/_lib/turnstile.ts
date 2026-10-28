import type { Env } from './env';

/**
 * Verify a Cloudflare Turnstile token. When TURNSTILE_SECRET_KEY is not set (local development)
 * verification is skipped; production must always have the secret configured.
 */
export async function verifyTurnstile(env: Env, token: unknown, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (typeof token !== 'string' || !token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}
