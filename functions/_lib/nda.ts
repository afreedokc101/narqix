// NDA gate: storage of uploaded NDA files and the access rules that depend on them.
import type { Env } from './env';
import type { Candidate } from './auth';
import { error } from './http';

export type AccessStatus = 'pending_nda' | 'nda_submitted' | 'approved' | 'rejected';
export const ACCESS_LABELS: Record<AccessStatus, string> = {
  pending_nda: 'Waiting for NDA',
  nda_submitted: 'NDA to review',
  approved: 'Approved',
  rejected: 'NDA rejected',
};

export const MAX_NDA_BYTES = 10 * 1024 * 1024;
const CHUNK = 1_500_000; // D1 values are limited to about 2 MB

/** Detect the file type from its first bytes; the browser-supplied type is not trusted. */
export function sniffType(bytes: Uint8Array): 'application/pdf' | 'image/jpeg' | 'image/png' | null {
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return 'application/pdf'; // %PDF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  return null;
}

export async function storeNda(env: Env, candidateId: string, filename: string, type: string, bytes: Uint8Array): Promise<string> {
  const id = crypto.randomUUID();
  const now = Date.now();
  const stmts = [
    env.DB.prepare('INSERT INTO nda_files (id, candidate_id, filename, content_type, size, uploaded_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, candidateId, filename, type, bytes.length, now),
  ];
  for (let i = 0, n = 0; i < bytes.length; i += CHUNK, n++) {
    stmts.push(env.DB.prepare('INSERT INTO nda_chunks (file_id, idx, data) VALUES (?, ?, ?)').bind(id, n, bytes.subarray(i, i + CHUNK)));
  }
  stmts.push(
    env.DB.prepare(`UPDATE candidates SET access_status = 'nda_submitted', access_note = NULL, updated_at = ? WHERE id = ?`).bind(now, candidateId),
    env.DB.prepare('INSERT INTO status_history (candidate_id, status, changed_by, changed_at) VALUES (?, ?, ?, ?)').bind(candidateId, 'access:nda_submitted', 'candidate', now),
  );
  await env.DB.batch(stmts);
  return id;
}

export interface NdaFile { id: string; candidate_id: string; filename: string; content_type: string; size: number; uploaded_at: number }

export async function latestNda(env: Env, candidateId: string): Promise<NdaFile | null> {
  return env.DB.prepare('SELECT * FROM nda_files WHERE candidate_id = ? ORDER BY uploaded_at DESC LIMIT 1').bind(candidateId).first<NdaFile>();
}

export async function readNda(env: Env, fileId: string): Promise<Uint8Array> {
  const rows = (await env.DB.prepare('SELECT data FROM nda_chunks WHERE file_id = ? ORDER BY idx').bind(fileId).all<{ data: ArrayBuffer | number[] }>()).results;
  const parts = rows.map((r) => (r.data instanceof ArrayBuffer ? new Uint8Array(r.data) : Uint8Array.from(r.data as number[])));
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) (out.set(p, o), (o += p.length));
  return out;
}

/** For candidate APIs that need full Academy access. Returns a 403 response, or null when allowed. */
export function needsApproval(me: Candidate): Response | null {
  if (me.access_status === 'approved') return null;
  return error(403, 'Your Academy access opens once the hiring team approves your signed NDA.', { accessStatus: me.access_status, next: '/welcome/' });
}
