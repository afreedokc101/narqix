import type { Ctx } from '../_lib/env';
import { json } from '../_lib/http';
import { emailLoginEnabled } from '../_lib/auth';

export const onRequestGet = async ({ env }: Ctx) =>
  json({
    turnstileSiteKey: env.TURNSTILE_SITE_KEY || null,
    emailLogin: emailLoginEnabled(env),
  });
