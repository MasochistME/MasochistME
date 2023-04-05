import { Request, Response } from 'express';
import { Award, AwardCategory } from '@masochistme/sdk/dist/v1/types';
import { AwardsListParams } from '@masochistme/sdk/dist/v1/api/awards';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Returns a list of all awards stored in the database.
 */
export const getAwardsList = async (
  req: Request<any, any, AwardsListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { db } = mongoInstance.getDb();

    /**
     * Get all the award categories
     */
    const collectionAwardCategories =
      db.collection<AwardCategory>('awardCategories');
    const awardCategories: AwardCategory[] = [];
    const cursorCategories = collectionAwardCategories.find();

    await cursorCategories.forEach((category: AwardCategory) => {
      awardCategories.push(category);
    });

    /**
     * Get all the awards and assign them to categories
     */
    const collectionAwards = db.collection<Award>('awards');
    const awards: Record<string, Award[]> = {};
    const cursorAwards = collectionAwards
      .find(filter)
      // .sort(sort) // This is unused atm
      .limit(limit);

    await cursorAwards.forEach((award: Award) => {
      const awardCategory = award.category;
      awards[awardCategory] = [...(awards[awardCategory] ?? []), award];
    });

    const fixedCategories: (AwardCategory & { awards: Award[] })[] =
      awardCategories.map(category => ({
        ...category,
        awards: awards[category.humanReadableId],
      }));

    res.status(200).send(fixedCategories);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
