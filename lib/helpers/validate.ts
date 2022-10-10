import { hash } from 'helpers/hash';
import { log } from 'helpers/log';

export const tokenValidation = (req: any, res: any, next: any) => {
  const authorizationHeader = req.headers.authorization;
  const url = String(req.url ?? '<UNKNOWN>');
  const fakeToken = String(authorizationHeader ?? 'NONE');

  if (
    !authorizationHeader ||
    hash('sha256', authorizationHeader) !== process.env.HASH_TEMP_ACCESS_TOKEN
  ) {
    log.CRITICAL('An unauthorized attempt to access protected endpoint!');
    log.CRITICAL(`-- Endpoint: ${url}`);
    log.CRITICAL(`-- Fake token: ${fakeToken}`);
    return res.sendStatus(401);
  }
  log.INFO(`Authorized access to endpoint: ${url}`);

  next();
};
