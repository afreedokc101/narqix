// Shared browser helpers (no framework). Kept small: lesson pages load only what they use.
export type ApiError = { error: string; fields?: Record<string, string>; [k: string]: unknown };

export async function api<T = any>(path: string, body?: unknown): Promise<{ ok: boolean; status: number; data: T & Partial<ApiError> }> {
  const res = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  });
  let data: any = {};
  try {
    data = await res.json();
  } catch {}
  if (res.status === 401) document.cookie = 'nq_auth=; Path=/; Max-Age=0';
  return { ok: res.ok, status: res.status, data };
}

export const loggedIn = () => /(?:^|;\s*)nq_auth=1/.test(document.cookie);

export function $(sel: string, root: ParentNode = document) {
  return root.querySelector(sel) as HTMLElement | null;
}

export function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function fmtDate(ms: number, withTime = false): string {
  return new Date(ms).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    timeZone: 'Asia/Dhaka',
  });
}

let configPromise: Promise<{ turnstileSiteKey: string | null; emailLogin: boolean }> | null = null;
export function siteConfig() {
  configPromise ??= api('/api/config').then((r) => (r.ok ? r.data : { turnstileSiteKey: null, emailLogin: false }));
  return configPromise;
}

declare global {
  interface Window { turnstile?: any }
}

/** Render a Turnstile widget into `el` (if a site key is configured). Returns a token getter. */
export async function mountTurnstile(el: HTMLElement): Promise<() => Promise<string | null>> {
  const { turnstileSiteKey } = await siteConfig();
  if (!turnstileSiteKey) return async () => null;
  if (!window.turnstile) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Turnstile failed to load'));
      document.head.appendChild(s);
    });
  }
  const id = window.turnstile.render(el, { sitekey: turnstileSiteKey, theme: 'dark', 'refresh-expired': 'auto', size: 'flexible' });
  return async () => {
    for (let i = 0; i < 40; i++) {
      const t = window.turnstile.getResponse(id);
      if (t) return t;
      await new Promise((r) => setTimeout(r, 250));
    }
    return null;
  };
}

export function resetTurnstile() {
  try {
    window.turnstile?.reset();
  } catch {}
}

export function showFieldErrors(form: HTMLFormElement, fields: Record<string, string> = {}) {
  form.querySelectorAll('[data-err]').forEach((e) => ((e as HTMLElement).textContent = ''));
  form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
  for (const [name, msg] of Object.entries(fields)) {
    const input = form.elements.namedItem(name) as HTMLElement | null;
    input?.setAttribute('aria-invalid', 'true');
    const err = form.querySelector(`[data-err="${name}"]`);
    if (err) err.textContent = msg;
  }
}
