import { Request, Response } from 'express';

export const getRaceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(200).send({});
};
