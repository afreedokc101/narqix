import type { Env } from './env';
import { allExams, eligibility, trackLessonIds, trackTitle, type AttemptRow } from './exams';
import { ACCESS_LABELS, type AccessStatus } from './nda';

export const HIRING_STATUSES = ['new', 'contacted', 'interview', 'hired'] as const;

export interface CandidateRow {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  district: string;
  track: string;
  trackTitle: string;
  cvUrl: string | null;
  createdAt: number;
  hiringStatus: string;
  accessStatus: AccessStatus;
  accessLabel: string;
  accessNote: string | null;
  accessReviewedBy: string | null;
  accessReviewedAt: number | null;
  nda: { filename: string; size: number; uploadedAt: number } | null;
  progressPct: number;
  lessonsRead: number;
  lessonsTotal: number;
  exams: { id: string; title: string; attempts: { status: string; score: number | null; total: number; at: number }[]; best: number | null; state: string }[];
  certificates: { id: string; track: string; trackTitle: string; issuedAt: number; status: string }[];
  preCertified: boolean;
  certificateStatus: string;
}

export async function loadCandidates(env: Env): Promise<CandidateRow[]> {
  const [cands, progress, attempts, certs, ndas] = await Promise.all([
    env.DB.prepare('SELECT * FROM candidates ORDER BY created_at DESC').all<any>(),
    env.DB.prepare('SELECT candidate_id, lesson_id FROM lesson_progress').all<{ candidate_id: string; lesson_id: string }>(),
    env.DB.prepare('SELECT id, candidate_id, exam_id, status, score, total, started_at, deadline_at, submitted_at FROM exam_attempts ORDER BY started_at').all<AttemptRow>(),
    env.DB.prepare('SELECT id, candidate_id, track, issued_at, status FROM certificates ORDER BY issued_at').all<any>(),
    env.DB.prepare('SELECT candidate_id, filename, size, uploaded_at FROM nda_files ORDER BY uploaded_at').all<{ candidate_id: string; filename: string; size: number; uploaded_at: number }>(),
  ]);
  const latestNda = new Map(ndas.results.map((n) => [n.candidate_id, { filename: n.filename, size: n.size, uploadedAt: n.uploaded_at }]));
  const readBy = new Map<string, Set<string>>();
  for (const r of progress.results) {
    if (!readBy.has(r.candidate_id)) readBy.set(r.candidate_id, new Set());
    readBy.get(r.candidate_id)!.add(r.lesson_id);
  }
  const exams = allExams();
  return cands.results.map((c) => {
    const ids = trackLessonIds(c.track);
    const read = readBy.get(c.id) || new Set();
    const lessonsRead = ids.filter((id) => read.has(id)).length;
    const mine = attempts.results.filter((a) => a.candidate_id === c.id);
    const myCerts = certs.results.filter((x) => x.candidate_id === c.id).map((x) => ({ id: x.id, track: x.track, trackTitle: trackTitle(x.track), issuedAt: x.issued_at, status: x.status }));
    const examRows = exams
      .map((e) => {
        const list = mine.filter((a) => a.exam_id === e.id);
        if (!list.length) return null;
        const el = eligibility(list as AttemptRow[]);
        const scored = list.filter((a) => a.score !== null).map((a) => a.score as number);
        return {
          id: e.id,
          title: e.title,
          attempts: list.map((a) => ({ status: a.status, score: a.score, total: a.total, at: a.submitted_at ?? a.started_at })),
          best: scored.length ? Math.max(...scored) : null,
          state: el.status,
        };
      })
      .filter((x): x is NonNullable<typeof x> => !!x);
    const valid = myCerts.filter((x) => x.status === 'valid');
    const foundationPassed = mine.some((a) => a.exam_id === 'foundation' && a.status === 'passed');
    return {
      id: c.id,
      fullName: c.full_name,
      phone: c.phone,
      email: c.email,
      district: c.district,
      track: c.track,
      trackTitle: trackTitle(c.track),
      cvUrl: c.cv_url,
      createdAt: c.created_at,
      hiringStatus: c.hiring_status,
      accessStatus: c.access_status,
      accessLabel: ACCESS_LABELS[c.access_status as AccessStatus] || c.access_status,
      accessNote: c.access_note,
      accessReviewedBy: c.access_reviewed_by,
      accessReviewedAt: c.access_reviewed_at,
      nda: latestNda.get(c.id) || null,
      progressPct: ids.length ? Math.round((lessonsRead / ids.length) * 100) : 0,
      lessonsRead,
      lessonsTotal: ids.length,
      exams: examRows,
      certificates: myCerts,
      preCertified: valid.length > 0,
      certificateStatus: valid.length ? 'Pre-Certified' : foundationPassed ? 'Foundation passed' : examRows.length ? 'In progress' : 'Not started',
    };
  });
}

function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: CandidateRow[]): string {
  const examIds = allExams().map((e) => e.id);
  const header = ['Name', 'Phone', 'Email', 'District', 'Track', 'CV', 'Signed up', 'Academy access', 'Hiring status', 'Progress %', 'Certificate status', 'Certificate IDs',
    ...examIds.flatMap((id) => [`${id} attempts`, `${id} best score`, `${id} result`])];
  const lines = [header.map(csvCell).join(',')];
  for (const r of rows) {
    const cells: unknown[] = [r.fullName, r.phone, r.email, r.district, r.trackTitle, r.cvUrl, new Date(r.createdAt).toISOString().slice(0, 10), r.accessLabel, r.hiringStatus, r.progressPct, r.certificateStatus,
      r.certificates.map((c) => c.id).join(' ')];
    for (const id of examIds) {
      const e = r.exams.find((x) => x.id === id);
      cells.push(e ? e.attempts.length : 0, e?.best ?? '', e ? e.state : '');
    }
    lines.push(cells.map(csvCell).join(','));
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
