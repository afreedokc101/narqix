import type { Ctx } from '../../_lib/env';
import { error, json } from '../../_lib/http';
import { findCertificate } from '../../_lib/certs';

export const onRequestGet = async ({ env, params }: Ctx<'id'>) => {
  const cert = await findCertificate(env, String(params.id));
  return cert ? json(cert) : error(404, 'No certificate with this ID.');
};
