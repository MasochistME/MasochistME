import { log } from 'helpers/log';
import { connectToDb, getDataFromDB } from 'helpers/db';
import config from '../../../config.json';

/**
 * Get all events.
 */
export const getEvents = async (req, res) => {
  const events = await getDataFromDB('events');

  if (events) {
    res.status(200).send(events);
  } else {
    res.sendStatus(404);
  }
};
