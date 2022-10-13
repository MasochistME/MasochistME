import { Request, Response } from 'express';
import { Game } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all games stored in the database.
 * @param _req Request
 * @param res Response
 * @return void
 */
export const getGamesList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Game>('games');
    const cursor = collection.find();
    const games: Game[] = [];

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
