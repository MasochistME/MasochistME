import { Request, Response } from 'express';
import { getDataFromDB } from 'helpers/db';

/**
 * Returns basic users' data.
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getDataFromDB('users');
    const filteredUsers = users
      .filter((user: any) => user.protected || user.member)
      .map((user: any) => {
        const {
          id,
          name,
          url,
          avatar,
          updated,
          private: isPrivate,
          member,
          protected: isProtected,
        } = user;
        return {
          id,
          name,
          url,
          avatar,
          updated,
          private: isPrivate,
          member,
          protected: isProtected,
        };
      });
    res.status(200).send(filteredUsers);
  } catch (err) {
    res.status(err.code).send(err);
  }
};

export const getUserDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const users = await getDataFromDB('users');
    const rawUser = users.find((user: any) => user.id === id);
    if (!rawUser) {
      res.sendStatus(404);
      return;
    }
    const { badges, games } = rawUser;
    const fixedGames = games.map(game => ({
      appid: game.appid,
      playtime_forever: game.playtime_forever,
      completionRate: game.completionRate,
      lastUnlocked: game.lastUnlocked,
    }));
    res.status(200).send({ id, badges, games: fixedGames });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
