import type { Ctx } from '../../_lib/env';
import { loadCandidates, toCsv } from '../../_lib/admin';

export const onRequestGet = async ({ env, request }: Ctx) => {
  const url = new URL(request.url);
  let rows = await loadCandidates(env);
  const track = url.searchParams.get('track');
  const status = url.searchParams.get('status');
  if (track) rows = rows.filter((r) => r.track === track);
  if (status) rows = rows.filter((r) => r.hiringStatus === status);
  rows.sort((a, b) => Number(b.preCertified) - Number(a.preCertified) || b.createdAt - a.createdAt);
  return new Response(toCsv(rows), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="narqix-academy-candidates-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  });
};
