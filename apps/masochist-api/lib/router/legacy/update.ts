import axios from 'axios';
import { connectToDb, getDataFromDB } from 'helpers/db';
import { log } from 'helpers/log';
import { getCuratorMembers, updateCuratorGames } from 'router/legacy/curator';
import {
    TMemberJoinedEvent,
    TMemberLeftEvent,
} from 'router/legacy/types/events';

const updateDelay = Number(process.env.BIG_DELAY);
const shortDelay = Number(process.env.DELAY);

export const updateStatus = (db: any, percent: number) => {
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
    (err: any) => {
      if (err) {
        log.ERROR(err.message);
      }
    },
  );
};

export const getStatus = async (_req?: any, res?: any): Promise<void> => {
  let lastUpdated;
  try {
    lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' });
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send(err);
    return;
  }
  res.status(200).send({
    lastUpdated: lastUpdated[0].timestamp,
    status: lastUpdated[0].status,
  });
  return;
};

export const initiateMainUpdate = async (
  req?: any,
  res?: any,
): Promise<void> => {
  const { db } = await connectToDb();
  const usersFromDB = await getDataFromDB('users');
  let members: any;

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
  } catch (err: unknown) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.ERROR(err);
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
  } catch (err: unknown) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.ERROR(err);
    return;
  }
  try {
    updateStatus(db, 20);
    await updateCuratorGames();
  } catch (err: unknown) {
    log.WARN('--> [UPDATE] main update [ERR]');
    log.ERROR(err);
    return;
  }

  log.INFO('--> [UPDATE] checking if any members left...');

  usersFromDB.map((userFromDB: any) => {
    if (
      userFromDB.member &&
      !members.find((member: any) => userFromDB.id === member.id) &&
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
            log.ERROR(err.message);
          }
        },
      );
      db.collection('events').insertOne(eventDetails, err => {
        if (err) {
          log.ERROR(err.message);
        }
      });
    }
  });

  log.INFO('--> [UPDATE] checking if any members joined...');

  // TODO This should be first filtered before going thru all users again

  const iterateMembers = async (index: number) => {
    log.INFO(
      `--> [${index + 1}/${members.length}] member ${members[index].id} (${
        members[index].name ?? '?'
      })`,
    );
    const percentage = 80 + (20 / members.length) * (index + 1);
    updateStatus(db, percentage);

    if (
      !usersFromDB.find(
        (userFromDB: any) => userFromDB?.id === members[index]?.id,
      )
    ) {
      const userUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${members[index].id}`;
      let userData;

      try {
        userData = await axios.get(userUrl);
        const user = userData.data.response.players[0];
        members[index].name = user.personaname;
        members[index].avatar = user.avatarfull;
      } catch (err: unknown) {
        log.WARN(`--> [UPDATE] member ${members[index].id} [ERROR]`);
        log.ERROR(err);
      }
      const eventDetails: TMemberJoinedEvent = {
        date: Date.now(),
        type: 'memberJoined',
        member: members[index].id,
      };
      db.collection('events').insertOne(eventDetails, err => {
        if (err) {
          log.ERROR(err.message);
        }
      });
      db.collection('users').insertOne(members[index], err => {
        if (err) {
          log.ERROR(err.message);
        }
      });

      if (members[index + 1]) {
        setTimeout(() => iterateMembers(index + 1), shortDelay);
      } else {
        finalize();
        return;
      }
    } else {
      if (members[index + 1]) {
        setTimeout(() => iterateMembers(index + 1), shortDelay);
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
  };
};
