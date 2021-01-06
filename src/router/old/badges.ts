import { ObjectId } from 'mongodb';
import { log } from 'helpers/log';
import { connectToDb, getDataFromDB } from 'helpers/db';
import { hash } from 'helpers/hash';
import config from '../../../config.json';

/**
 * Returns all badges
 */
export const getAllBadges = async (req, res) => {
  const { client, db } = await connectToDb();
  const data = db.collection('badges');

  data.find({}).toArray((err, badges) => {
    if (err) {
      log.WARN(err);
      res.status(err.code).send(err);
    } else {
      res.status(200).send(badges);
    }
    client.close();
  });
};

/**
 * Returns a specific badge by its id
 * @param res.params.id
 */
export const getBadge = async (req, res) => {
  const { client, db } = await connectToDb();
  const data = db.collection('badges');

  data.findOne({ _id: ObjectId(req.params.id) }, (err, badge) => {
    if (err) {
      log.WARN(err);
      res.status(err.code).send(err);
    } else if (!badge) {
      res.sendStatus(404);
    } else {
      res.status(200).send(badge);
    }
    client.close();
  });
};

/**
 * Adds a badge
 */
export const addBadge = async (req, res) => {
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
  if (!req.body) {
    // validation!!!
    res.sendStatus(400);
    return;
  }

  const { client, db } = await connectToDb();
  const data = db.collection('badges');

  data.insertOne(req.body, (err, badge) => {
    if (err) {
      log.WARN(err);
      res.status(err.code).send(err);
    } else if (!badge) {
      res.sendStatus(404);
    } else {
      log.INFO(`Badge ${req.params.id} added.`);
      res.status(201).send(badge);
    }
    client.close();
  });
};

/**
 * Updates badge by its id
 * @param req.params.id
 */
export const updateBadge = async (req, res) => {
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
  if (!req.body) {
    // validation!!!
    res.sendStatus(400);
    return;
  }

  const { client, db } = await connectToDb();
  const data = db.collection('badges');

  data.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: req.body },
    { upsert: true },
    (err, badge) => {
      if (err) {
        log.WARN(err);
        res.status(err.code).send(err);
      } else if (!badge) {
        res.sendStatus(404);
      } else {
        log.INFO(`Badge ${req.params.id} updated.`);
        res.status(200).send(badge);
      }
      client.close();
    },
  );
};

/**
 * Deletes badge by its id
 * @param req.params.id
 */
export const deleteBadge = async (req, res) => {
  // TODO handle badges assigned to people after being deleted
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
  const data = db.collection('badges');

  data.deleteOne({ _id: ObjectId(req.params.id) }, (err, badge) => {
    if (err) {
      log.WARN(err);
      res.status(err.code).send(err);
    } else if (!badge) {
      res.sendStatus(404);
    } else {
      log.INFO(`Badge ${req.params.id} deleted.`);
      res.sendStatus(204);
    }
    client.close();
  });
};

/**
 * Gives badge to user by its id and user's steam id
 * @param req.params.badgeid
 * @param req.params.steamid
 */
export const giveBadge = async (req, res) => {
  const { client, db } = await connectToDb();
  const newBadge = {
    id: req.params.badgeid,
    unlocked: Date.now(),
  };
  let badge;
  let user;

  try {
    user = await getDataFromDB('users', { id: req.params.steamid });
    badge = await getDataFromDB('badges', {
      _id: ObjectId(req.params.badgeid),
    });
  } catch (err) {
    res.status(500).send(err);
    return;
  }
  if (badge.length === 0 || user.length === 0) {
    res.sendStatus(404);
    return;
  }

  user = user[0];

  if (user.badges) {
    if (user.badges.find(badge => badge.id === req.params.badgeid)) {
      res
        .status(202)
        .send(
          `User ${req.params.steamid} already has badge ${req.params.badgeid}`,
        );
      return;
    }
    user.badges.push(newBadge);
  } else {
    user.badges = [newBadge];
  }

  db.collection('users').updateOne(
    { id: req.params.steamid },
    { $set: user },
    { upsert: true },
    (err, data) => {
      if (err) {
        log.WARN(
          `--> [ADD] badge ${req.params.badgeid} => user ${req.params.steamid} [ERROR]`,
        );
        log.WARN(err);
      } else {
        log.INFO(
          `--> [ADD] badge ${req.params.badgeid} => user ${req.params.steamid} [DONE]`,
        );
      }
    },
  );
  client.close();

  res.status(200).send(newBadge);
};

/**
 * Takes badge from user by its id and user's steam id
 * @param req.params.badgeid
 * @param req.params.steamid
 */
export const takeBadge = async (req, res) => {
  const { client, db } = await connectToDb();
  const badgeId = req.params.badgeid;
  let user;

  try {
    user = await getDataFromDB('users', { id: req.params.steamid });
  } catch (err) {
    res.status(500).send(err);
    return;
  }

  user = user[0];

  if (user.badges) {
    const badgeIndex = user.badges.findIndex(
      badge => badge.id === req.params.badgeid,
    );
    if (badgeIndex === -1) {
      res
        .status(202)
        .send(
          `User ${req.params.steamid} doesn't have badge ${req.params.badgeid}`,
        );
      return;
    } else {
      user.badges.splice(badgeIndex, 1);
    }
  }

  db.collection('users').updateOne(
    { id: req.params.steamid },
    { $set: user },
    { upsert: true },
    (err, data) => {
      if (err) {
        log.WARN(
          `--> [DELETE] badge ${req.params.badgeid} => user ${req.params.steamid} [ERROR]`,
        );
        log.WARN(err);
      } else {
        log.INFO(
          `--> [DELETE] badge ${req.params.badgeid} => user ${req.params.steamid} [DONE]`,
        );
      }
    },
  );
  client.close();

  res.sendStatus(200);
};
