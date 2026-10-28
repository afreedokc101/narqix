import type { Ctx } from '../../_lib/env';
import { clearSessionCookies, destroySession } from '../../_lib/auth';
import { withCookies } from '../../_lib/respond';

export const onRequestPost = async ({ request, env }: Ctx) => {
  await destroySession(env, request);
  return withCookies({ ok: true }, clearSessionCookies());
};
