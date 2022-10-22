import { hash } from 'helpers/hash';
import { log } from 'helpers/log';

export const apiLegacyAuth = (req: any, res: any, next: any) => {
  const authorizationHeader = req.headers.authorization;
  const url = String(req.url ?? '<UNKNOWN>');
  const fakeToken = String(authorizationHeader ?? 'NONE');

  if (
    !authorizationHeader ||
    hash('sha256', authorizationHeader) !==
      process.env.HASH_TEMP_ACCESS_TOKEN_LEGACY
  ) {
    log.CRITICAL(
      'An unauthorized attempt to access protected legacy endpoint!',
    );
    log.CRITICAL(`-- Endpoint: ${url}`);
    log.CRITICAL(`-- Fake token: ${fakeToken}`);
    return res.sendStatus(401);
  }

  next();
};

export const apiV1Auth = (req: any, res: any, next: any) => {
  const authorizationHeader = req.headers.authorization;
  const url = String(req.url ?? '<UNKNOWN>');
  const fakeToken = String(authorizationHeader ?? 'NONE');

  if (
    !authorizationHeader ||
    hash('sha256', authorizationHeader) !==
      process.env.HASH_TEMP_ACCESS_TOKEN_V1
  ) {
    log.CRITICAL('An unauthorized attempt to access protected V1 endpoint!');
    log.CRITICAL(`-- Endpoint: ${url}`);
    log.CRITICAL(`-- Fake token: ${fakeToken}`);
    return res.sendStatus(401);
  }

  next();
};
