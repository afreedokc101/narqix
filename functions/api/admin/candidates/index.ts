import type { Ctx } from '../../../_lib/env';
import { json } from '../../../_lib/http';
import { loadCandidates } from '../../../_lib/admin';

export const onRequestGet = async ({ env, data }: Ctx) => json({ admin: data.adminEmail, candidates: await loadCandidates(env) });
