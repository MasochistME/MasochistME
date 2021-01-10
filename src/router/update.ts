import axios from 'axios';
import { log } from 'helpers/log';
import { connectToDb, getDataFromDB } from 'helpers/db';
import { getCuratorMembers, updateCuratorGames } from 'router/curator';
import { TMemberJoinedEvent, TMemberLeftEvent } from 'router/types/events';
import config from '../../config.json';

const updateDelay = config.BIG_DELAY;

export const getStatus = async (req, res) => {
  let lastUpdated;
  try {
    lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' });
  } catch (err) {
    log.WARN(err);
    res.status(500).send(err);
    return;
  }
  res.status(200).send({ lastUpdated: lastUpdated[0].timestamp });
  return;
};

export const initiateMainUpdate = async (req?, res?) => {
  const { client, db } = await connectToDb();
  const usersFromDB = await getDataFromDB('users');
  let members;

  log.INFO('--> [UPDATE] main update [INITIALIZED]');

  try {
    const lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' }); // don't update too fast
    if (Date.now() - lastUpdated[0].timestamp < updateDelay) {
      if (res && !req.params.forceupdate) {
        res
          .status(202)
          .send(
            `Wait ${
              (updateDelay - (Date.now() - lastUpdated[0].timestamp)) / 60000
            } min before updating`,
          );
      }
      return;
    }
  } catch (err) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.WARN(err);
    if (res) {
      res.status(500).send(err);
    }
  }

  if (res) {
    res.sendStatus(202);
  }

  try {
    members = await getCuratorMembers();
  } catch (err) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.WARN(err);
    return;
  }
  try {
    await updateCuratorGames();
  } catch (err) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.WARN(err);
    return;
  }

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
            log.WARN(err);
          }
        },
      );
      db.collection('events').insertOne(eventDetails, err => {
        if (err) {
          log.WARN(err);
        }
      });
    }
  });

  const finalize = () => {
    db.collection('update').updateOne(
      { id: 'lastUpdated' },
      {
        $set: {
          id: 'lastUpdated',
          timestamp: Date.now(),
        },
      },
      { upsert: true },
      err => {
        if (err) {
          log.WARN(err);
        }
      },
    );
    client.close();
  };

  const iterateMembers = async (index: number) => {
    if (!usersFromDB.find(userFromDB => userFromDB.id === members[index].id)) {
      const userUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_KEY}&steamids=${members[index].id}`;
      let userData;

      log.INFO(`--> [UPDATE] member ${members[index].id}`);

      try {
        userData = await axios.get(userUrl);
        const user = userData.data.response.players[0];
        members[index].name = user.personaname;
        members[index].avatar = user.avatarfull;
      } catch (err) {
        log.WARN(`--> [UPDATE] member ${members[index].id} [ERROR]`);
        log.WARN(err);
      }
      const eventDetails: TMemberJoinedEvent = {
        date: Date.now(),
        type: 'memberJoined',
        member: members[index].id,
      };
      db.collection('events').insertOne(eventDetails, err => {
        if (err) {
          log.WARN(err);
        }
      });
      db.collection('users').insertOne(members[index], err => {
        if (err) {
          log.WARN(err);
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
};
