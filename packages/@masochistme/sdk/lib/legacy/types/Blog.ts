import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "blog".
 * A single object describes a single blog post.
 */
export type Blog = WithId<{
	id: string; // An id of a blog post, following the convention of `blog-TIMESTAMP`.
	date: number; // Date in a format of a timestamp.
	author: string;
	title: string;
	content: string; // Can contain HTML.
}>;
