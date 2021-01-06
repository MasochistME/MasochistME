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
