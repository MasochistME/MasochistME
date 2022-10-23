import { Request, Response } from 'express';
import { log } from 'helpers/log';

import { updateCuratorLogic } from './logic';

export const updateCurator = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const forceUpdate = false; // TODO add an option to force update
    // updateCuratorLogic(forceUpdate); // TODO temporarily disabled
    res.sendStatus(202);
  } catch (err: any) {
    log.INFO(`--> [UPDATE] curator update [ERROR]`);
    log.WARN(err.message ?? err);
    res.sendStatus(500);
  }
};
