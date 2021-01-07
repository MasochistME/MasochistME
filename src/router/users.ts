import { Request, Response } from 'express';
import { getDataFromDB } from 'helpers/db';

/**
 * Returns basic users' data.
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getDataFromDB('users');
    const filteredUsers = users.map(user => {
      const {
        id,
        name,
        url,
        avatar,
        badges,
        updated,
        private: isPrivate,
        member,
        protected: isProtected,
      } = user;
      // const userGames = user.games;
      // delete userGames.achievements;
      return {
        id,
        name,
        url,
        avatar,
        badges,
        // games: userGames,
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
    delete games.achievements;
    res.status(200).send({ id, badges, games });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
