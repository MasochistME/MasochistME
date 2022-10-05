import { Request, Response } from 'express';

import { log } from 'helpers/log';
import { connectToDb, getDataFromDB } from 'helpers/db';
import { Member } from 'router/types/user';

/**
 * Returns basic users' data.
 */
export const connectUserWithDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const members = await getDataFromDB('users');

    const { steamid, discordid: discordId } = req.params;
    const rawMember = members.find((user: Member) => user.id === steamid);
    if (!rawMember) {
      res
        .status(404)
        .send('Member with this steam ID does not exist in the database.');
      return;
    }

    db.collection('users').updateOne(
      { id: steamid },
      { $set: { discordId } },
      { upsert: true },
      err => {
        if (err) {
          log.WARN(
            `--> [UPDATE] Steam User ${steamid} connected to Discord User ${discordId} [ERROR]`,
          );
          log.WARN(err);
          res.status(400).send('Could not update member in the database.');
          return;
        }
        log.INFO(
          `--> [UPDATE] Steam User ${steamid} connected to Discord User ${discordId} [DONE]`,
        );
        res.sendStatus(200);
        client.close();
      },
    );
  } catch (err) {
    log.WARN(err);
    res.status(500).send(err);
  }
};
