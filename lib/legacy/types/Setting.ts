import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "settings".
 * A single object describes a single setting.
 */
export type Setting<T> = WithId<{
	option: string; // Key by which the setting can be found.
	value: T; // The setting itself.
}>;
