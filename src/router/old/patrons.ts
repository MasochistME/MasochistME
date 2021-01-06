import axios from 'axios';
import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';
import { hash } from 'helpers/hash';
import config from '../../../config.json';

/**
 * Returns all patrons no matter the tier.
 */
export const getAllPatrons = async (req, res) => {
  const { client, db } = await connectToDb();

  db.collection('patreonTiers')
    .find({})
    .toArray((err, tiers) => {
      if (err) {
        log.WARN(err);
        res.status(err.code).send(err);
      } else {
        db.collection('patrons')
          .find({})
          .toArray((err, patrons) => {
            if (err) {
              log.WARN(err);
              res.status(err.code).send(err);
            } else {
              tiers
                .map(
                  tier =>
                    (tier.list = patrons.filter(
                      patron => patron.tier === tier.tier,
                    )),
                )
                .map(
                  patron =>
                    (patron = {
                      steamid: patron.steamid,
                      name: patron.name,
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
export const getPatronsByTier = async (req, res) => {
  const { client, db } = await connectToDb();

  db.collection('patrons')
    .find({ tier: req.params.tier })
    .toArray((err, tier) => {
      if (err) {
        log.WARN(err);
        res.status(err.code).send(err);
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
export const getPatron = async (req, res) => {
  const { client, db } = await connectToDb();

  db.collection('patrons').findOne(
    { steamid: req.params.steamid },
    (err, tier) => {
      if (err) {
        log.WARN(err);
        res.status(err.code).send(err);
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
 * @param req.auth
 */
export const addPatron = async (req, res) => {
  if (!req.headers.auth) {
    res.sendStatus(401);
    return;
  }
  if (hash('sha256', req.headers.auth) !== config.AUTH) {
    log.WARN(
      `An unauthorized attempt to add badge noted with ${req.headers.auth} credentials.`,
    );
    res.sendStatus(403);
    return;
  }

  const { client, db } = await connectToDb();
  const urlVanity =
    'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001';
  const paramsVanity = {
    key: config.STEAM_KEY,
    vanityurl: req.params.vanityid,
  };
  const userVanity = await axios.get(urlVanity, { params: paramsVanity }); // TODO add trycatch

  const urlSummary =
    'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002';
  const paramsSummary = {
    key: config.STEAM_KEY,
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

  db.collection('patrons').insertOne(patron, (err, data) => {
    if (err) {
      log.WARN(err);
      res.status(err.code).send(err);
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
 * @param req.auth
 */
export const updatePatron = async (req, res) => {
  if (!req.headers.auth) {
    res.sendStatus(401);
    return;
  }
  if (hash('sha256', req.headers.auth) !== config.AUTH) {
    log.WARN(
      `An unauthorized attempt to add badge noted with ${req.headers.auth} credentials.`,
    );
    res.sendStatus(403);
    return;
  }

  const { client, db } = await connectToDb();
  const urlSummary = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_KEY}&steamids=${req.params.steamid}`;
  let userSummary;
  try {
    userSummary = await axios.get(urlSummary);
  } catch (err) {
    log.WARN(urlSummary);
    log.WARN(err);
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
    (err, data) => {
      if (err) {
        log.WARN(err);
        res.status(err.code).send(err);
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
 * @param req.auth
 */
export const deletePatron = async (req, res) => {
  const { client, db } = await connectToDb();

  if (!req.headers.auth) {
    res.sendStatus(401);
    return;
  }
  if (hash('sha256', req.headers.auth) !== config.AUTH) {
    log.WARN(
      `An unauthorized attempt to add badge noted with ${req.headers.auth} credentials.`,
    );
    res.sendStatus(403);
    return;
  }

  db.collection('patrons').deleteOne(
    { steamid: req.params.steamid },
    (err, patron) => {
      if (err) {
        log.WARN(err);
        res.status(err.code).send(err);
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
