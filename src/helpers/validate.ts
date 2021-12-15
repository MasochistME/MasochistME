import { log } from 'helpers/log';

export const tokenValidation = (req: any, res: any, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    log.CRITICAL('An unauthorized attempt to access protected endpoint!');
    log.CRITICAL(`-- Endpoint: ${req.url}`);
    log.CRITICAL('-- Fake token: NONE');
    return res.sendStatus(401);
  }
  if (authorizationHeader !== process.env.TEMP_ACCESS_TOKEN) {
    log.CRITICAL('An unauthorized attempt to access protected endpoint!');
    log.CRITICAL(`-- Endpoint: ${req.url}`);
    log.CRITICAL(`-- Fake token: ${authorizationHeader}`);
    return res.sendStatus(401);
  }

  next();
};
