import { GamesListParams } from '@masochistme/sdk/dist/v1/api/games';
import { Game } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

/**
 * Returns a list of all games stored in the database.
 */
export const getGamesList = async (
  req: Request<any, any, GamesListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { isCurated, sale, ...restFilter } = filter;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Game>('games');
    const games: Game[] = [];

    const cursor = collection
      .find({
        ...restFilter,
        ...(sale && { sale: { $gt: 0, $ne: null } }),
        ...(isCurated !== undefined && {
          $or: [{ isCurated }, { isProtected: isCurated }],
        }),
      })
      .sort({
        ...(sort.tier && { tier: sortCollection(sort.tier) }),
        ...(sort.title && { title: sortCollection(sort.title) }),
        ...(sort.sale && { sale: sortCollection(sort.sale) }),
        ...(sort.achievementsTotal && {
          achievementsTotal: sortCollection(sort.achievementsTotal),
        }),
      })
      .limit(limit);

    await cursor.forEach((el: Game) => {
      games.push(el);
    });

    res.status(200).send(games);
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
