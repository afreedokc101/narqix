import { esc, fmtDate } from './client';

/** HTML for an exam's status and action button, from /api/me exam data. */
export function examAction(e: any): string {
  const el = e.eligibility;
  const last = e.attempts[0];
  const lastLine = last && last.status !== 'in_progress'
    ? `<p class="text-sm text-muted mt-1">Last attempt: ${last.score}/${last.total} · ${last.status === 'passed' ? '<span class="text-success">passed</span>' : '<span class="text-alert">not passed</span>'} · <a href="/exams/take/?attempt=${esc(last.id)}">see results</a></p>`
    : '';
  switch (el.status) {
    case 'passed':
      return `<span class="badge badge-pass">Passed ${esc(el.score)}/${esc(e.attempts.find((a: any) => a.id === el.attemptId)?.total ?? '')}</span>
        <p class="text-sm mt-2"><a href="/exams/take/?attempt=${esc(el.attemptId)}">See results</a></p>`;
    case 'in_progress':
      return `<span class="badge badge-accent">In progress</span>
        <p class="mt-3"><a class="btn btn-primary btn-sm" href="/exams/take/?attempt=${esc(el.attemptId)}">Resume exam</a></p>
        <p class="text-xs text-muted mt-1">Time runs out ${fmtDate(el.deadlineAt, true)}</p>`;
    case 'locked':
      return `<span class="badge badge-fail">Locked until ${fmtDate(el.until, true)}</span>
        <p class="text-sm text-muted mt-2">${esc(el.reason)}</p>${lastLine}`;
    default:
      return `<p><a class="btn btn-primary btn-sm" href="/exams/take/?exam=${esc(e.id)}">${e.attempts.length ? 'Retake exam' : 'Start exam'}</a></p>
        <p class="text-xs text-muted mt-1">Attempts in the last 30 days: ${el.attemptsInWindow} of 3</p>${lastLine}`;
  }
}
