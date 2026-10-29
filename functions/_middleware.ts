// Page gate: lessons, tracks, exams and the dashboard open only for candidates whose signed NDA
// the hiring team has approved. Everyone else is sent to log in, or to the NDA upload page.
// The candidate APIs enforce the same rule themselves (see needsApproval in _lib/nda.ts).
import type { Ctx } from './_lib/env';
import { currentCandidate } from './_lib/auth';

const GATED = /^\/(learn|tracks|exams|dashboard)(\/|$)/;

export const onRequest = async (ctx: Ctx) => {
  const url = new URL(ctx.request.url);
  if (!GATED.test(url.pathname)) return ctx.next();
  const me = await currentCandidate(ctx.env, ctx.request);
  const to = !me ? `/login/?next=${encodeURIComponent(url.pathname + url.search)}` : me.access_status !== 'approved' ? '/welcome/' : null;
  if (!to) {
    const res = await ctx.next();
    // Gated pages are personal: keep them out of shared caches.
    const out = new Response(res.body, res);
    out.headers.set('cache-control', 'private, no-store');
    return out;
  }
  return new Response(null, { status: 302, headers: { location: to, 'cache-control': 'no-store' } });
};
