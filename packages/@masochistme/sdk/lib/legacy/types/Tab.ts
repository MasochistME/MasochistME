import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "tabs".
 * A single object describes a single tab.
 */
export type Tab = WithId<{
	text: string; // Label of the tab.
	icon: string; // A FontAwesome icon classname (for example `fas fa-star`).
	link: string; // An internal route to which the tab redirects upon clicking.
	visible: boolean; // If false, the tab will be hidden from view.
	external: boolean; // Indicates if the tab redirects to an external website.
}>;
