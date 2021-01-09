import { Request, Response } from 'express';
import { getDataFromDB } from 'helpers/db';

/**
 * Returns all curated games
 */
export const getCuratorGames = async (req: Request, res: Response) => {
  try {
    const games = await getDataFromDB('games');
    if (res) {
      const filteredGames = games.map((game: any) => {
        const { id, desc, rating, title, sale, img, url } = game;
        return {
          id: typeof id !== 'number' ? Number(id) : id,
          desc,
          rating,
          title,
          img,
          url,
          sale,
        };
      });
      res.status(200).send(filteredGames);
    }
  } catch (err) {
    if (res) {
      res.status(500).send(err);
    }
  }
};
