import { orderBy } from 'lodash';
import { getDataFromDB } from 'helpers/db';

/**
 * Get all blog entries.
 */
export const getBlog = async (req, res) => {
  const blog = await getDataFromDB('blog');

  if (blog) {
    res.status(200).send(blog);
  } else {
    res.sendStatus(404);
  }
};
