import { Request, Response } from 'express';

export const getUpdateCuratorStatus = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  res.status(404).send('TODO');
};
