import { Request, Response } from 'express';
import { Game } from '@masochistme/sdk/dist/v1/types';
import { GamesListParams } from '@masochistme/sdk/dist/v1/api/games';

import { log } from 'helpers/log';
import { connectToDb, sortCollection } from 'helpers/db';

/**
 * Returns a list of all games stored in the database.
 */
export const getGamesList = async (
  req: Request<any, any, GamesListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { client, db } = await connectToDb();
    const collection = db.collection<Game>('games');
    const games: Game[] = [];

    const cursor = collection
      .find(filter)
      .sort({
        ...(sort.title && { title: sortCollection(sort.title) }),
        ...(sort.tier && { tier: sortCollection(sort.tier) }),
        ...(sort.achievementsTotal && {
          achievementsTotal: sortCollection(sort.achievementsTotal),
        }),
      })
      .limit(limit);

    await cursor.forEach((el: Game) => {
      games.push(el);
    });

    client.close();

    res.status(200).send(games);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
