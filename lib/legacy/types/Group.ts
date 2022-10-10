import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "groups".
 * A single object describes a single group.
 */
export type Group = WithId<{
	name: string; // Name of the group. It is used like an ID.
	permissions: GroupPermission[]; // List of the group members' permissions.
}>;

export type GroupPermission = {
	name: string; // Name of the permission. It is used like an ID.
	scope: GroupPermissionScope[]; // Scope capabilities of the permission group.
};

/**
 * Warning: currently this is used only for badge permissions.
 */
export type GroupPermissionScope =
	| 'create'
	| 'edit'
	| 'delete'
	| 'give'
	| 'take';
