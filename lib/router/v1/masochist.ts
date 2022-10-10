import { Request, Response } from 'express';

import { log } from 'helpers/log';
import { connectToDb, getDataFromDB } from 'helpers/db';
import { Member } from 'router/v1/types/user';

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
          log.WARN(err.message);
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
  } catch (err: any) {
    log.WARN(err.message);
    res.status(500).send(err);
  }
};

/**
 * Allows to update member's fields in database.
 * Editable fields: description
 * @param req
 * @param res
 * @returns
 */
export const updateUserFields = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.body?.description) {
      res
        .status(400)
        .send('This command requires a body with description field.');
      return;
    }

    const { steamid } = req.params;
    const { description } = req.body;
    const { client, db } = await connectToDb();
    const members = db.collection('users');

    members.updateOne(
      { id: steamid },
      { $set: { description } },
      { upsert: true },
      (err, member) => {
        if (err) {
          log.WARN(err.message);
          res.status(500).send(err);
        } else if (!member) {
          res.sendStatus(404);
        } else {
          log.INFO(`Member ${steamid} updated.`);
          res.sendStatus(200);
        }
        client.close();
      },
    );
  } catch (err: any) {
    log.WARN(err.message);
    res.status(500).send(err);
  }
};
