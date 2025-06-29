import { MembersListParams } from '@masochistme/sdk/dist/v1/api/members';
import { Member } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

/**
 * Returns a list of all members stored in the database.
 */
export const getMembersList = async (
  req: Request<any, any, MembersListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { isPrivate, isMember, ...restFilter } = filter;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<Member>('members');
    const members: Member[] = [];

    const cursor = collection
      .find({
        ...restFilter,
        ...(isPrivate !== undefined && { isPrivate }),
        ...(isMember !== undefined && {
          $or: [{ isMember: true }, { isProtected: true }],
        }),
      })
      .sort({
        ...(sort.name && { name: sortCollection(sort.name) }),
        ...(sort.lastUpdated && {
          lastUpdated: sortCollection(sort.lastUpdated),
        }),
      })
      .limit(limit);

    await cursor.forEach((el: Member) => {
      members.push(el);
    });

    res.status(200).send(members);
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
