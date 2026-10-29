import type { Ctx } from '../_lib/env';
import { error, json, sameOrigin } from '../_lib/http';
import { currentCandidate, rateLimit } from '../_lib/auth';
import { MAX_NDA_BYTES, sniffType, storeNda } from '../_lib/nda';
import { emails, notifyList, sendEmail } from '../_lib/email';
import { adminEmails } from '../_lib/access';
import { trackTitle } from '../_lib/exams';

const EXT = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' } as const;

/** Multipart body with one field, "file": the signed NDA as PDF, JPG or PNG, up to 10 MB. */
export const onRequestPost = async ({ request, env, waitUntil }: Ctx) => {
  if (!sameOrigin(request)) return error(403, 'Bad origin');
  const me = await currentCandidate(env, request);
  if (!me) return error(401, 'Not logged in');
  if (me.access_status === 'approved') return error(409, 'Your NDA is already approved.');
  if (!(await rateLimit(env, `nda:${me.id}`, 10, 3600))) return error(429, 'Too many uploads. Try again in an hour.');

  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get('file');
    if (f && typeof f !== 'string') file = f;
  } catch {}
  if (!file || file.size === 0) return error(400, 'Choose your signed NDA file to upload.');
  if (file.size > MAX_NDA_BYTES) return error(413, 'That file is larger than 10 MB. Upload a smaller PDF or photo.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffType(bytes);
  if (!type) return error(415, 'Upload a PDF, JPG or PNG file.');

  const base = (file.name || 'nda').replace(/\.[^.]*$/, '').replace(/[^\w\- ]+/g, '').trim().slice(0, 80) || 'nda';
  await storeNda(env, me.id, `${base}.${EXT[type]}`, type, bytes);

  waitUntil(
    Promise.all([
      sendEmail(env, [me.email], ...emails.ndaReceived(env, me.full_name)),
      sendEmail(env, notifyList(env, adminEmails(env)), ...emails.ndaForReview(env, me.full_name, me.email, trackTitle(me.track))),
    ]),
  );
  return json({ ok: true, accessStatus: 'nda_submitted' }, 201);
};
