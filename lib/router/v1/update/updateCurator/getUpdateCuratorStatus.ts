import { Request, Response } from 'express';

import { connectToDb } from 'helpers/db';
import { statusCurator } from '.';

export const getUpdateCuratorStatus = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { client, db } = await connectToDb();
  const collectionUpdate = db.collection('update');
  const { lastUpdate } = (await collectionUpdate.findOne({
    id: 'status',
  })) ?? { lastUpdate: new Date(0) };

  client.close();
  res.status(200).send({
    lastUpdate,
    isUpdating: statusCurator.isUpdating,
    updateProgress: statusCurator.updateProgress,
    updateStatus: statusCurator.updateStatus,
  });
};
