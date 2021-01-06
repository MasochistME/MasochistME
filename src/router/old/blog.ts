import { log } from 'helpers/log';
import { connectToDb, getDataFromDB } from 'helpers/db';
import config from '../../../config.json';

/**
 * Get all blog entries.
 */
export const getAllBlogEntries = async (req, res) => {
  const blog = await getDataFromDB('blog');

  if (blog) {
    res.status(200).send(blog);
  } else {
    res.sendStatus(404);
  }
};
