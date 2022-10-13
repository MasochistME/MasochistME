import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "seasons".
 * A single object describes a single race season.
 * @category  Seasons
 */
export type Season = WithId<{
	/**
	 * Name of the season.
	 */
	name: string;
	/**
	 * Description of the season.
	 */
	description: string;
	/**
	 * URL of the season's icon.
	 */
	icon: string;
	/**
	 * If the season has started, the date of starting is stored in this field.
	 */
	startDate: Date | null;
	/**
	 * If the season has ended, the date of ending is stored in this field.
	 */
	endDate: Date | null;
}>;
