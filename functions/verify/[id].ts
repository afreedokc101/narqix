// Public verification page /verify/<id>: server-rendered into the static shell built from src/pages/cert-shell.astro.
import type { Ctx } from '../_lib/env';
import { findCertificate } from '../_lib/certs';

export const onRequestGet = async ({ request, env, params }: Ctx<'id'>) => {
  const shell = await env.ASSETS.fetch(new URL('/cert-shell/', request.url));
  const cert = await findCertificate(env, String(params.id));
  const date = cert ? new Date(cert.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }) : '';
  const set = (text: string) => ({ element: (el: Element) => void el.setInnerContent(text) });
  let rw = new HTMLRewriter()
    .on('title', set(cert ? `${cert.name} · Verified certificate · Narqix Academy` : 'Certificate not found · Narqix Academy'));
  if (cert) {
    const valid = cert.status === 'valid';
    rw = rw
      .on('[data-cert="found"]', { element: (el) => void el.removeAttribute("hidden") })
      .on('[data-cert="missing"]', { element: (el) => void el.remove() })
      .on('[data-f="status"]', {
        element: (el) => {
          el.setInnerContent(valid ? 'Valid' : 'Revoked');
          el.setAttribute('class', valid ? 'badge badge-pass' : 'badge badge-fail');
        },
      })
      .on('[data-f="name"]', set(cert.name))
      .on('[data-f="title"]', set(cert.title))
      .on('[data-f="track"]', set(cert.trackTitle))
      .on('[data-f="date"]', set(date))
      .on('[data-f="foundation"]', set(cert.foundationScore))
      .on('[data-f="trackScore"]', set(cert.trackScore))
      .on('[data-f="id"]', set(cert.id))
      .on('script#cert-data', { element: (el) => void el.setInnerContent(JSON.stringify({ ...cert, date }).replace(/</g, '\\u003c'), { html: true }) });
  } else {
    rw = rw.on('[data-f="query"]', set(String(params.id).slice(0, 40)));
  }
  const res = rw.transform(shell);
  const headers = new Headers(res.headers);
  headers.set('cache-control', 'no-store');
  headers.set('content-type', 'text/html; charset=utf-8');
  return new Response(res.body, { status: cert ? 200 : 404, headers });
};
