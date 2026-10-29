// Automated emails. They go out through the narqix.com mailbox on Hostinger (SMTP) when SMTP_PASSWORD is set,
// otherwise through Resend when RESEND_API_KEY is set. With neither, nothing is sent: the site still works,
// and the hiring team checks the dashboard.
import { WorkerMailer } from 'worker-mailer';
import type { Env } from './env';

const SIGN_OFF = '\n\nThe Narqix Academy hiring team\n\n© Narqix Academy';

export function emailEnabled(env: Env): boolean {
  return Boolean(env.EMAIL_FROM && (env.SMTP_PASSWORD || env.RESEND_API_KEY));
}

/** "Narqix Academy <hiring@narqix.com>" -> { name, email } */
function parseFrom(from: string): { name?: string; email: string } {
  const m = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1] || undefined, email: m[2] } : { email: from.trim() };
}

async function sendSmtp(env: Env, to: string[], subject: string, text: string): Promise<boolean> {
  const from = parseFrom(env.EMAIL_FROM!);
  const port = Number(env.SMTP_PORT || 465);
  await WorkerMailer.send(
    {
      host: env.SMTP_HOST || 'smtp.hostinger.com',
      port,
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
      startTls: port === 587,
      credentials: { username: env.SMTP_USER || from.email, password: env.SMTP_PASSWORD! },
      authType: ['plain', 'login'],
    },
    { from, to: to.map((email) => ({ email })), subject, text },
  );
  return true;
}

export async function sendEmail(env: Env, to: string[], subject: string, text: string): Promise<boolean> {
  if (!emailEnabled(env) || !to.length) return false;
  try {
    if (env.SMTP_PASSWORD) return await sendSmtp(env, to, subject, text);
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
