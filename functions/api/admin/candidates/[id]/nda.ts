import type { Ctx } from '../../../../_lib/env';
import { error } from '../../../../_lib/http';
import { latestNda, readNda } from '../../../../_lib/nda';

/** The candidate's latest uploaded NDA, shown in the browser (?download=1 saves it instead). */
export const onRequestGet = async ({ request, env, params }: Ctx<'id'>) => {
  const file = await latestNda(env, String(params.id));
  if (!file) return error(404, 'No NDA uploaded yet');
  const bytes = await readNda(env, file.id);
  const download = new URL(request.url).searchParams.has('download');
  return new Response(bytes, {
    headers: {
      'content-type': file.content_type,
      'content-length': String(bytes.length),
      'content-disposition': `${download ? 'attachment' : 'inline'}; filename="${file.filename.replace(/"/g, '')}"`,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      // Uploads are sniffed to PDF/JPG/PNG on the way in, so they can't be served as HTML. Images also get a
      // sandbox; PDFs can't, because Chrome refuses to show a PDF in a sandboxed document.
      ...(file.content_type === 'application/pdf' ? {} : { 'content-security-policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox" }),
    },
  });
};
