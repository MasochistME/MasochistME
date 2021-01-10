import { Request, Response } from 'express';
import { getDataFromDB } from 'helpers/db';

/**
 * Get user's steam ID.
 * @param req.params.vanityid
 */
export const getSteamID = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const users = await getDataFromDB('users');
  const steamID = users.find(user => user.name === req.params.vanityid);

  if (steamID) {
    res.status(200).send(steamID);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Get all the rating tiers.
 * @param req
 */
export const getRating = async (req: Request, res: Response): Promise<void> => {
  const points = await getDataFromDB('points');

  if (points) {
    res.status(200).send(points);
  } else {
    res.sendStatus(404);
  }
};
