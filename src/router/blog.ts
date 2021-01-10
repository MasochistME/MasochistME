import { Request, Response } from 'express';
import { orderBy } from 'lodash';
import { getDataFromDB } from 'helpers/db';
import { Blog } from './types/blog';

/**
 * Get all blog entries.
 */
export const getBlog = async (_req: Request, res: Response): Promise<void> => {
  const blog: Blog = await getDataFromDB('blog');

  if (blog) {
    const sortedBlog = orderBy(blog, [(post: any) => post.date], ['desc']);
    res.status(200).send(sortedBlog);
  } else {
    res.sendStatus(404);
  }
};
