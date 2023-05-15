/**
 * @module Awards
 */
import { WithId } from 'mongodb';

/**
 * Fields which are common for all types of awards.
 */
export type AwardCategory = WithId<{
  /**
   * Additional, human readable ID which is used to put award categories in order.
   */
  humanReadableId: string;
  /**
   * Name of the award category.
   */
  name: string;
  /**
   * Description of the award category.
   */
  description: string;
}>;
