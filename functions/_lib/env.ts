export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
  RESEND_API_KEY?: string;
  /** Password of the EMAIL_FROM mailbox. When set, emails go out by SMTP (Hostinger by default) instead of Resend. */
  SMTP_PASSWORD?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_SECURE?: string;
  EMAIL_FROM?: string;
  /** Comma-separated addresses alerted when a candidate uploads an NDA. Defaults to ADMIN_EMAILS. */
  NDA_NOTIFY_EMAILS?: string;
  SITE_URL?: string;
  /** Local development only (.dev.vars): treat requests from localhost as this admin. */
  DEV_ADMIN_EMAIL?: string;
}

export type Ctx<P extends string = string> = EventContext<Env, P, Record<string, unknown>>;
