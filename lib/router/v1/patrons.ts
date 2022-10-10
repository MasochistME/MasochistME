import axios from 'axios';
import { Patron, PatreonTier } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns all patrons no matter the tier.
 */
export const getAllPatrons = async (_req: any, res: any) => {
  const { client, db } = await connectToDb();

  db.collection<PatreonTier>('patreonTiers')
    .find({})
    .toArray((err, tiers) => {
      if (err) {
        log.WARN(err.message);
        res.status(500).send(err);
      } else {
        db.collection<Patron>('patrons')
          .find({})
          .toArray((err, patrons) => {
            if (err) {
              log.WARN(err.message);
              res.status(500).send(err);
            } else {
              (tiers ?? [])
                .map(
                  // @ts-ignore
                  (tier: PatreonTier & { list: any }) =>
                    (tier.list = (patrons ?? []).filter(
                      patron => patron.tier === tier.tier,
                    )),
                )
                .map(
                  patron =>
                    (patron = {
                      // @ts-ignore:next-line
                      steamid: patron.steamid,
                      // @ts-ignore:next-line
                      name: patron.name,
                      // @ts-ignore:next-line
                      avatar: patron.avatar,
                    }),
                );
              res.status(200).send(tiers);
            }
            client.close();
          });
      }
    });
};

/**
 * Returns all patrons from particular tier.
 * @param req.params.tier
 */
export const getPatronsByTier = async (req: any, res: any) => {
  const { client, db } = await connectToDb();

  db.collection('patrons')
    .find({ tier: req.params.tier })
    .toArray((err, tier) => {
      if (err) {
        log.WARN(err.message);
        res.status(500).send(err);
      } else if (!tier) {
        res.sendStatus(404);
      } else {
        res.status(200).send(tier);
      }
      client.close();
    });
};

/**
 * Returns a patron by their steam ID.
 * @param req.params.steamid
 */
export const getPatron = async (req: any, res: any) => {
  const { client, db } = await connectToDb();

  db.collection('patrons').findOne(
    { steamid: req.params.steamid },
    (err, tier) => {
      if (err) {
        log.WARN(err.message);
        res.status(500).send(err);
      } else if (!tier) {
        res.sendStatus(404);
      } else {
        res.status(200).send(tier);
      }
      client.close();
    },
  );
};

/**
 * Adds a patron.
 * @param req.params.tier
 * @param req.params.vanityid
 */
export const addPatron = async (req: any, res: any) => {
  const { client, db } = await connectToDb();
  const urlVanity =
    'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001';
  const paramsVanity = {
    key: process.env.STEAM_KEY,
    vanityurl: req.params.vanityid,
  };
  const userVanity = await axios.get(urlVanity, { params: paramsVanity }); // TODO add trycatch

  const urlSummary =
    'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002';
  const paramsSummary = {
    key: process.env.STEAM_KEY,
    steamids: userVanity.data.response.steamid,
  };
  const userSummary = await axios.get(urlSummary, { params: paramsSummary }); // TODO add trycatch
  const patron = {
    steamid: userVanity.data.response.steamid,
    name: userSummary.data.response.players[0].name || req.params.vanityid,
    avatar:
      userSummary.data.response.players[0].avatarfull ||
      'https://image.flaticon.com/icons/svg/37/37943.svg',
    tier: req.params.tier,
  };

  db.collection('patrons').insertOne(patron, err => {
    if (err) {
      log.WARN(err.message);
      res.status(500).send(err);
    } else {
      log.INFO(
        `Patron ${
          userSummary.data.response.players[0].name || req.params.vanityid
        } added.`,
      );
      res.status(201).send(patron);
    }
    client.close();
  });
};

/**
 * Updates a patron.
 * @param req.params.steamid
 * @param req.params.tier
 */
export const updatePatron = async (req: any, res: any) => {
  const { client, db } = await connectToDb();
  const urlSummary = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${req.params.steamid}`;
  let userSummary: any;
  try {
    // eslint-disable-next-line prefer-const
    userSummary = await axios.get(urlSummary);
  } catch (err: any) {
    log.WARN(urlSummary);
    log.WARN(err.message);
    return;
  }

  const patron = {
    steamid: req.params.steamid,
    name:
      userSummary.data.response.players[0].personaname ||
      userSummary.data.response.players[0].name ||
      'unknown',
    avatar:
      userSummary.data.response.players[0].avatarfull ||
      'https://image.flaticon.com/icons/svg/37/37943.svg',
    tier: req.params.tier,
  };

  db.collection('patrons').updateOne(
    { steamid: req.params.steamid },
    { $set: patron },
    err => {
      if (err) {
        log.WARN(err.message);
        res.status(500).send(err);
      } else {
        log.INFO(
          `Patron ${
            userSummary.data.response.players[0].name || req.params.steamid
          } updated.`,
        );
        res.status(201).send(patron);
      }
      client.close();
    },
  );
};

/**
 * Deletes a patron.
 * @param req.params.steamid
 */
export const deletePatron = async (req: any, res: any) => {
  const { client, db } = await connectToDb();

  db.collection('patrons').deleteOne(
    { steamid: req.params.steamid },
    (err, patron) => {
      if (err) {
        log.WARN(err.message);
        res.status(500).send(err);
      } else if (!patron) {
        res.sendStatus(404);
      } else {
        log.INFO(`Patron ${req.params.steamid} deleted.`);
        res.sendStatus(204);
      }
      client.close();
    },
  );
};
