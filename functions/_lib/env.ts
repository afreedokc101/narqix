export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  SITE_URL?: string;
  /** Local development only (.dev.vars): treat requests from localhost as this admin. */
  DEV_ADMIN_EMAIL?: string;
}

export type Ctx<P extends string = string> = EventContext<Env, P, Record<string, unknown>>;
