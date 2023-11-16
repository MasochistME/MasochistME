import { hash, log } from '@masochistme/utils';
import { Request, Response } from 'express';

import { updateCuratorLogic } from './logic';

export const updateCurator = async (
  req?: Request,
  res?: Response,
): Promise<void> => {
  try {
    const authorizationHeader = req?.headers?.authorization;
    const forceUpdate = req?.headers?.forceupdate;
    const canForceUpdate =
      forceUpdate &&
      authorizationHeader &&
      hash('sha256', authorizationHeader) ===
        process.env.HASH_TEMP_ACCESS_TOKEN_V1;
    if (canForceUpdate) {
      updateCuratorLogic(true, res);
    } else {
      updateCuratorLogic(false, res);
    }
  } catch (err: any) {
    log.INFO(`--> [UPDATE] curator update [ERROR]`);
    log.WARN(err.message ?? err);
    if (res) res?.sendStatus(500);
  }
};
