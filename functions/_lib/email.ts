// Automated emails, sent through Resend. When RESEND_API_KEY or EMAIL_FROM is not set, nothing is sent
// (the site still works; the hiring team just isn't notified).
import type { Env } from './env';

const SIGN_OFF = '\n\nThe Narqix Academy hiring team\n\n© Narqix Academy';

export function emailEnabled(env: Env): boolean {
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

export async function sendEmail(env: Env, to: string[], subject: string, text: string): Promise<boolean> {
  if (!emailEnabled(env) || !to.length) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, text }),
    });
    if (!res.ok) console.log(`email "${subject}" failed: HTTP ${res.status}`);
    return res.ok;
  } catch (e) {
    console.log(`email "${subject}" failed: ${e}`);
    return false;
  }
}

const site = (env: Env) => (env.SITE_URL || 'https://academy.narqix.com').replace(/\/$/, '');
const first = (name: string) => name.split(/\s+/)[0] || name;

/** Where "a new NDA is waiting" alerts go: NDA_NOTIFY_EMAILS, or every admin email. */
export function notifyList(env: Env, admins: string[]): string[] {
  return (env.NDA_NOTIFY_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean).concat(env.NDA_NOTIFY_EMAILS ? [] : admins);
}

export const emails = {
  ndaReceived: (env: Env, name: string) => [
    'We received your signed NDA',
    `Hi ${first(name)},\n\nThanks for uploading your signed NDA. Our hiring team will review it, usually within 1 to 2 working days.\n\nWe will email you again as soon as your Narqix Academy access is approved.${SIGN_OFF}`,
  ] as const,
  ndaForReview: (env: Env, name: string, email: string, track: string) => [
    `New NDA to review: ${name}`,
    `${name} (${email}, ${track} track) uploaded a signed NDA.\n\nReview and approve it in the admin dashboard:\nhttps://narqix-academy.pages.dev/admin/?access=nda_submitted`,
  ] as const,
  approved: (env: Env, name: string) => [
    'You are in: your Narqix Academy access is approved',
    `Hi ${first(name)},\n\nGood news: we reviewed your NDA and your Narqix Academy access is now open.\n\nLog in and start with your learning path:\n${site(env)}/login/\n\nWork through Start Here, Narqix Standards and Core Skills, then your track, and take the Foundation and Track exams when you are ready.${SIGN_OFF}`,
  ] as const,
  rejected: (env: Env, name: string, note: string) => [
    'Action needed: please upload your NDA again',
    `Hi ${first(name)},\n\nWe could not approve the NDA you uploaded.\n\nReason: ${note}\n\nPlease log in and upload a corrected copy:\n${site(env)}/welcome/${SIGN_OFF}`,
  ] as const,
};
