import type { Ctx } from '../../_lib/env';
import { adminEmail } from '../../_lib/access';
import { error } from '../../_lib/http';

export const onRequest = async (ctx: Ctx) => {
  const email = await adminEmail(ctx.env, ctx.request);
  if (!email) return error(403, 'Hiring team access only. Sign in through Cloudflare Access at /admin.');
  ctx.data.adminEmail = email;
  return ctx.next();
};
