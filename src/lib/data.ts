import lessonsData from '../data/lessons.json';
import examsData from '../data/exams.json';

export interface LessonMeta {
  id: string;
  title: string;
  section: string;
  slug: string;
  order: number;
  summary: string;
  duration?: string;
  url: string;
  isRoot: boolean;
  scriptTrack?: string;
  scriptId?: string;
  role?: string;
  stage?: string;
}
export interface TrackPath {
  key: string;
  title: string;
  summary: string;
  steps: { key: string; title: string; lessonIds: string[] }[];
  lessonIds: string[];
}

export const sections = lessonsData.sections as { key: string; title: string; group: string }[];
export const lessons = lessonsData.lessons as LessonMeta[];
export const tracks = lessonsData.tracks as unknown as Record<string, TrackPath>;
export const trackList = Object.values(tracks);
export const exams = examsData as {
  id: string; title: string; track: string | null; total: number; passMark: number; passPercent: number;
  gateCount: number; timeLimitMinutes: number; calculator: boolean;
  parts: { n: number; name: string; count: number }[];
  roles: { id: string; label: string }[] | null;
  partRules: { part: number; min: number; roles: string[]; label: string }[];
}[];

export const lessonById = new Map(lessons.map((l) => [l.id, l]));
export const sectionLessons = (key: string) => lessons.filter((l) => l.section === key);
export const sectionTitle = (key: string) => sections.find((s) => s.key === key)?.title ?? key;

/** Tracks whose learning path includes this lesson. */
export const tracksForLesson = (id: string) => trackList.filter((t) => t.lessonIds.includes(id)).map((t) => t.key);

export const TRACK_BLURBS: Record<string, string> = {
  'real-estate': 'Cold calling, lead management, acquisitions and dispositions for US investors.',
  'transaction-coordination': 'Keep every deal on track from contract to closing table.',
  solar: 'Set, confirm and protect appointments for US solar installers.',
  'hvac-home-services': 'Book, dispatch and follow up for HVAC, plumbing and roofing companies.',
  'property-preservation': 'Work orders, photo QC, bids and vendor networks.',
  'strategic-funding': 'Qualify business owners and keep funding files moving.',
  'back-office': 'Inbox, calendar, data, CRM, research and reports.',
  'customer-support': 'Email, chat and phone support that protects the brand.',
};
