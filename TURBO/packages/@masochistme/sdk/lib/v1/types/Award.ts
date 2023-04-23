/**
 * @module Awards
 */
import { WithId } from 'v1/types/__Helpers';
import { AwardRequirement } from './AwardRequirement';

/**
 * This is a type of a single object within the collection "awards".
 * A single object describes a single award.
 */
export interface Award extends WithId {
	/**
	 * Name of the award.
	 */
	name: string;
	/**
	 * Description of the award.
	 */
	description: string;
	/**
	 * Image associated with award. Ideally should be 64x64.
	 */
	img: string;
	/**
	 * Ordered list of children of this award (if it has them).
	 * Array is empty or null if no children.
	 */
	children: string[] | null;
	/**
	 * Human readable ID of category that the award belongs to
	 */
	category: string;
	/**
	 * Automatically detected requirements needed to earn that badge.
	 */
	requirements: AwardRequirement[];
	/**
	 * Can the award be unlocked more than once.
	 */
	isStackable: boolean;
	/**
	 * This field determines if the award is being displayed.
	 */
	isEnabled: boolean;
	/**
	 * Awards which will not be assigned anymore.
	 */
	isLegacy: boolean;
}

/**
 * This is a type of a child award, as in one, that exists only in context of its parent.
 */
export interface AwardChild extends Award {
	/**
	 * Tier of the child award. This is so you can have gold, bronze etc. tiers
	 * while still keeping an unique name for the child award.
	 * Null if there is no tier specific name
	 */
	tier: string | null;
	/**
	 * Child awards cannot have their own categories.
	 */
	category: never;
}
