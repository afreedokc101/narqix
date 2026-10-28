import type { Env } from './env';
import { trackTitle } from './exams';

export interface PublicCertificate {
  id: string;
  name: string;
  track: string;
  trackTitle: string;
  title: string;
  issuedAt: number;
  foundationScore: string;
  trackScore: string;
  status: 'valid' | 'revoked';
}

export async function findCertificate(env: Env, rawId: string): Promise<PublicCertificate | null> {
  const id = rawId.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);
  if (!/^NQX-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(id)) return null;
  const row = await env.DB.prepare(
    `SELECT c.id, c.track, c.issued_at, c.foundation_score, c.track_score, c.status, k.full_name
     FROM certificates c JOIN candidates k ON k.id = c.candidate_id WHERE c.id = ?`,
  )
    .bind(id)
    .first<{ id: string; track: string; issued_at: number; foundation_score: string; track_score: string; status: 'valid' | 'revoked'; full_name: string }>();
  if (!row) return null;
  const t = trackTitle(row.track);
  return {
    id: row.id,
    name: row.full_name,
    track: row.track,
    trackTitle: t,
    title: `Narqix Academy Pre-Certified — ${t}`,
    issuedAt: row.issued_at,
    foundationScore: row.foundation_score,
    trackScore: row.track_score,
    status: row.status,
  };
}
