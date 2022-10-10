import { Request, Response } from 'express';
import { getDataFromDB, findOption, Options } from 'helpers/db';

/**
 * Get user's steam ID.
 * @param req.params.vanityid
 */
export const getSteamID = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const users = await getDataFromDB('users');
  const steamID = users.find((user: any) => user.name === req.params.vanityid);

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
export const getRating = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const points = await getDataFromDB('points');

  if (points) {
    res.status(200).send(points);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Get all settings.
 * @param req
 * @param res
 */
export const getAllSettings = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const settings = await getDataFromDB('settings');

  if (settings) {
    res.status(200).send(settings);
  } else {
    res.sendStatus(404);
  }
};

/**
 * Get one specific setting.
 * @param :setting - desired setting's name
 */
export const getSetting = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const settingName = req.params.setting as keyof Options;
  if (!settingName) {
    res.sendStatus(404);
    return;
  }
  const setting = await findOption(settingName);
  if (setting) {
    res.status(200).send({ [setting]: setting });
  } else {
    res.sendStatus(404);
  }
};

/**
 * Get front end tabs.
 * @param req
 */
export const getTabs = async (_req: Request, res: Response): Promise<void> => {
  const tabs = await getDataFromDB('tabs');

  if (tabs) {
    res.status(200).send(tabs);
  } else {
    res.sendStatus(404);
  }
};
