import { Request, Response } from 'express';
import { Award, AwardCategory } from '@masochistme/sdk/dist/v1/types';
import { AwardsListParams } from '@masochistme/sdk/dist/v1/api/awards';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

type AwardWithChildren = Omit<Award, 'children'> & {
  children: (Award | null)[];
};
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
     * Get all the awards
     */
    const collectionAwards = db.collection<Award>('awards');
    const allAwards: Award[] = [];
    const cursorAwards = collectionAwards
      .find(filter)
      // .sort(sort) // This is unused atm
      .limit(limit);
    await cursorAwards.forEach((award: Award) => {
      allAwards.push(award);
    });

    /**
     * Divide all the awards to standalone awards and awards which exist only as children
     */
    const awardChildrenIds = allAwards
      .map((award: Award) => award.children)
      .flat();
    const awardsParents = allAwards
      .filter((award: Award) => !awardChildrenIds.includes(String(award._id)))
      .map((award: Award) => {
        const children =
          award.children
            ?.map(
              (awardId: string) =>
                allAwards.find((a: Award) => String(a._id) === awardId) ?? null,
            )
            .filter(Boolean) ?? [];
        return {
          ...award,
          children,
        };
      });

    /**
     * Assign the parent awards to their respective categories
     */
    const awardsByCategories: Record<string, AwardWithChildren[]> = {};
    awardsParents.map(award => {
      const awardCategory = award.category ?? 'no_category';
      awardsByCategories[awardCategory] = [
        ...(awardsByCategories[awardCategory] ?? []),
        award,
      ];
    });

    const fixedCategories: (AwardCategory & {
      awards: AwardWithChildren[];
    })[] = awardCategories.map(category => ({
      ...category,
      awards: awardsByCategories[category.humanReadableId],
    }));

    res.status(200).send(fixedCategories);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
