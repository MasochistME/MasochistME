import { Request, Response } from 'express';

export const createRace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(200).send({});
};
