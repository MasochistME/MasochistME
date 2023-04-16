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

export const validateSteamUrl = (steamUrl?: string) => {
  const error =
    'Steam profile link must follow one of two formats: https://steamcommunity.com/id/ + your unique ID, which consists of letters, numbers and symbol _; or https://steamcommunity.com/profiles/ + your numeric ID.';

  const steamUrlWithIdValidator = new RegExp(
    /^(https:\/\/steamcommunity.com\/id\/)[a-zA-Z0-9_]*[\/]?$/i,
  );
  const steamUrlWithProfileValidator = new RegExp(
    /^(https:\/\/steamcommunity.com\/profiles\/)[0-9]*[\/]?$/i,
  );

  const hasError =
    !steamUrl ||
    (!steamUrlWithIdValidator.test(steamUrl) &&
      !steamUrlWithProfileValidator.test(steamUrl));

  return { hasError, error };
};
