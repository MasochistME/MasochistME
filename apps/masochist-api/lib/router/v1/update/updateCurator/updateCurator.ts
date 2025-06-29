import { Request, Response } from 'express';
import { hash } from 'helpers/hash';
import { log } from 'helpers/log';
import { updateCuratorLogic } from './logic';

export const updateCurator = async (
  req?: Request,
  res?: Response,
): Promise<void> => {
  try {
    const authorizationHeader = req?.headers?.authorization;
    const forceUpdate = req?.headers?.forceupdate;
    const canForceUpdate =
      Boolean(forceUpdate) &&
      Boolean(authorizationHeader) &&
      hash('sha256', authorizationHeader) ===
        process.env.HASH_TEMP_ACCESS_TOKEN_V1;

    updateCuratorLogic(canForceUpdate, res);
  } catch (err: unknown) {
    log.INFO(`--> [UPDATE] curator update [ERROR]`);
    log.ERROR(err);
    if (res) res?.sendStatus(500);
  }
};
