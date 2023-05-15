import { Request, Response } from 'express';

import { mongoInstance } from 'api';
import { statusCurator } from '.';

export const getUpdateCuratorStatus = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const { db } = mongoInstance.getDb();
  const collectionUpdate = db.collection('update');
  const { lastUpdate } = (await collectionUpdate.findOne({
    id: 'status',
  })) ?? { lastUpdate: new Date(0) };

  res.status(200).send({
    lastUpdate,
    isUpdating: statusCurator.isUpdating,
    updateProgress: statusCurator.updateProgress,
    updateStatus: statusCurator.updateStatus,
  });
};
