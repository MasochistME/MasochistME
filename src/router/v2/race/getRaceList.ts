import { Request, Response } from 'express';

export const getRaceList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(200).send({});
};
