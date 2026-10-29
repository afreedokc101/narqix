// Cloudflare Access verification for the hiring-team dashboard.
// Access blocks unauthenticated visitors at the edge; this checks the signed JWT again in code
// (in case a route is ever left outside the Access application) and enforces the email allow-list.
import type { Env } from './env';
import { fromB64url } from './crypto';
import { getCookie } from './auth';

const DEFAULT_ADMINS = 'afreed@narqix.com,ayman@narqix.com,sakib@narqix.com,hiring@narqix.com';
let jwksCache: { at: number; keys: JsonWebKey[] } | null = null;

async function jwks(team: string): Promise<JsonWebKey[]> {
  if (jwksCache && Date.now() - jwksCache.at < 3600_000) return jwksCache.keys;
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
  const data = (await res.json()) as { keys: JsonWebKey[] };
  jwksCache = { at: Date.now(), keys: data.keys };
  return data.keys;
}

export function adminEmails(env: Env): string[] {
  return (env.ADMIN_EMAILS || DEFAULT_ADMINS).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

/** Returns the admin's email, or null when the request is not from an allowed Access user. */
export async function adminEmail(env: Env, request: Request): Promise<string | null> {
  const url = new URL(request.url);
  if (env.DEV_ADMIN_EMAIL && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) return env.DEV_ADMIN_EMAIL;
  const team = (env.ACCESS_TEAM_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!team || !env.ACCESS_AUD) return null;
  const token = request.headers.get('cf-access-jwt-assertion') || getCookie(request, 'CF_Authorization');
  if (!token) return null;
  const [h, p, s] = token.split('.');
  if (!h || !p || !s) return null;
  try {
    const header = JSON.parse(new TextDecoder().decode(fromB64url(h)));
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(p)));
    const jwk = (await jwks(team)).find((k: any) => k.kid === header.kid);
    if (!jwk || header.alg !== 'RS256') return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, fromB64url(s), new TextEncoder().encode(`${h}.${p}`));
    if (!ok) return null;
    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!aud.includes(env.ACCESS_AUD)) return null;
    if (payload.iss !== `https://${team}`) return null;
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
    const email = String(payload.email || '').toLowerCase();
    return adminEmails(env).includes(email) ? email : null;
  } catch {
    return null;
  }
}
