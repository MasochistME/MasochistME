import axios from 'axios';
import { log } from 'helpers/log';
import { connectToDb, getDataFromDB } from 'helpers/db';
import { getCuratorMembers, updateCuratorGames } from 'router/v1/curator';
import { TMemberJoinedEvent, TMemberLeftEvent } from 'router/v1/types/events';
import config from '../../../config.json';

const updateDelay = config.BIG_DELAY;

export const updateStatus = (db, percent: number) => {
  db.collection('update').updateOne(
    { id: 'lastUpdated' },
    {
      $set: {
        id: 'lastUpdated',
        timestamp: Date.now(),
        status: percent,
      },
    },
    { upsert: true },
    err => {
      if (err) {
        log.WARN(err.message);
      }
    },
  );
};

export const getStatus = async (req?, res?): Promise<void> => {
  let lastUpdated;
  try {
    lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' });
  } catch (err) {
    log.WARN(err.message);
    res.status(500).send(err);
    return;
  }
  res.status(200).send({
    lastUpdated: lastUpdated[0].timestamp,
    status: lastUpdated[0].status,
  });
  return;
};

export const initiateMainUpdate = async (req?, res?): Promise<void> => {
  const { client, db } = await connectToDb();
  const usersFromDB = await getDataFromDB('users');
  let members;

  log.INFO('--> [UPDATE] main update [INITIALIZED]');

  try {
    const lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' }); // don't update too fast
    if (Date.now() - lastUpdated[0].timestamp < updateDelay) {
      if (res && !req.query.forceupdate) {
        res
          .status(202)
          .send(
            `Wait ${
              (updateDelay - (Date.now() - lastUpdated[0].timestamp)) / 60000
            } min before updating`,
          );
        return;
      }
    }
  } catch (err) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.WARN(err.message);
    if (res) {
      res.status(500).send(err);
    }
  }

  if (res) {
    res.sendStatus(202);
  }

  try {
    updateStatus(db, 0);
    members = await getCuratorMembers();
  } catch (err) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.WARN(err.message);
    return;
  }
  try {
    updateStatus(db, 20);
    await updateCuratorGames();
  } catch (err) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.WARN(err.message);
    return;
  }

  log.INFO('--> [UPDATE] checking if any members left...');

  usersFromDB.map(userFromDB => {
    if (
      userFromDB.member &&
      !members.find(member => userFromDB.id === member.id) &&
      !userFromDB.protected
    ) {
      log.INFO(`--> [UPDATE] events - member ${userFromDB.id} left`);
      const eventDetails: TMemberLeftEvent = {
        date: Date.now(),
        type: 'memberLeft',
        member: userFromDB.id,
      };
      db.collection('users').updateOne(
        { id: userFromDB.id },
        { $set: { member: false } },
        err => {
          if (err) {
            log.WARN(err.message);
          }
        },
      );
      db.collection('events').insertOne(eventDetails, err => {
        if (err) {
          log.WARN(err.message);
        }
      });
    }
  });

  log.INFO('--> [UPDATE] checking if any members joined...');

  // TODO this should be first filtered before going thru all users again

  const iterateMembers = async (index: number) => {
    log.INFO(
      `--> [${index + 1}/${members.length}] member ${members[index].id} (${
        members[index].name ?? '?'
      })`,
    );
    const percentage = 80 + (20 / members.length) * (index + 1);
    updateStatus(db, percentage);

    if (
      !usersFromDB.find(userFromDB => userFromDB?.id === members[index]?.id)
    ) {
      const userUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${members[index].id}`;
      let userData;

      try {
        userData = await axios.get(userUrl);
        const user = userData.data.response.players[0];
        members[index].name = user.personaname;
        members[index].avatar = user.avatarfull;
      } catch (err) {
        log.WARN(`--> [UPDATE] member ${members[index].id} [ERROR]`);
        log.WARN(err.message);
      }
      const eventDetails: TMemberJoinedEvent = {
        date: Date.now(),
        type: 'memberJoined',
        member: members[index].id,
      };
      db.collection('events').insertOne(eventDetails, err => {
        if (err) {
          log.WARN(err.message);
        }
      });
      db.collection('users').insertOne(members[index], err => {
        if (err) {
          log.WARN(err.message);
        }
      });

      if (members[index + 1]) {
        setTimeout(() => iterateMembers(index + 1), config.DELAY);
      } else {
        finalize();
        return;
      }
    } else {
      if (members[index + 1]) {
        setTimeout(() => iterateMembers(index + 1), config.DELAY);
      } else {
        finalize();
        return;
      }
    }
  };

  iterateMembers(0);

  const finalize = () => {
    log.INFO('--> [UPDATE] Update successfully finished!');
    updateStatus(db, 100);
    client.close();
  };
};
