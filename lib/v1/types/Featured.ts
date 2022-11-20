/**
 * @module Featured
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * Varions types of featured objects.
 */
export enum FeaturedType {
	VIDEO = 'video',
	IMAGE = 'image',
	NEWS = 'news',
	STREAM = 'stream',
	CUSTOM = 'custom',
}

export enum StreamPlatform {
	TWITCH = 'twitch',
	YOUTUBE = 'youtube',
	BILIBILI = 'bilibili',
}

/**
 * This is a type of a single object within the collection "featured".
 * A single object describes a single featured object.
 */
export type Featured =
	| FeaturedVideo
	| FeaturedImage
	| FeaturedNews
	| FeaturedStream
	| FeaturedCustom;

/**
 * Fields which are common for all types of featured objects.
 */
export interface BaseFeatured extends WithId {
	/**
	 * Date of posting the featured object.
	 */
	date: Date;
	/**
	 * Type of the feature.
	 */
	type: FeaturedType;
	/**
	 * Flag indicating if the featured post has been approved by a moderator.
	 */
	isApproved: boolean;
	/**
	 * Flag indicating if the featured post should be visible on the website.
	 */
	isVisible: boolean;
	/**
	 * If this flag is set to true, featured news does not disappear after its time runs out.
	 */
	isSticky: boolean;
	/**
	 * Steam or Discord ID of the member who posted featured object.
	 */
	memberId: string;
	/**
	 * Description of the featured object.
	 */
	description: string | null;
	/**
	 * ID of the game in the featured video (if it's a Steam game).
	 */
	gameId: number | null;
	/**
	 * Title of the game in the featured video (used for non-Steam/non curated games).
	 */
	gameTitle: string | null;
	/**
	 * Link to the game page (used for non-Steam games).
	 */
	gameLink: string | null;
}

/**
 * Featured object of type VIDEO (usually a YouTube link).
 */
export interface FeaturedVideo extends Omit<BaseFeatured, 'type'> {
	/**
	 * Featured type: video.
	 */
	type: FeaturedType.VIDEO;
	/**
	 * Link to the featured video.
	 */
	link: string;
}

/**
 * Featured object of type IMAGE (for example artwork, screenshot etc.)
 */
export interface FeaturedImage extends Omit<BaseFeatured, 'type'> {
	/**
	 * Featured type: image.
	 */
	type: FeaturedType.IMAGE;
	/**
	 * Link to the featured image.
	 */
	link: string;
	/**
	 * Link to the social media where the image is posted.
	 */
	socialMediaLink: string | null;
}

/**
 * Featured object of type NEWS.
 */
export interface FeaturedNews extends Omit<BaseFeatured, 'type'> {
	/**
	 * Featured type: video.
	 */
	type: FeaturedType.NEWS;
}

/**
 * Featured object of type STREAM.
 */
export interface FeaturedStream extends Omit<BaseFeatured, 'type'> {
	/**
	 * Featured type: stream.
	 */
	type: FeaturedType.STREAM;
	/**
	 * Link to the stream.
	 */
	link: string;
	/**
	 * Information about the streaming platform.
	 */
	platform: StreamPlatform | string | null;
}

/**
 * Featured object of type CUSTOM.
 */
export interface FeaturedCustom extends Omit<BaseFeatured, 'type'> {
	/**
	 * Featured type: custom.
	 */
	type: FeaturedType.CUSTOM;
	/**
	 * Title of the featured custom.
	 */
	title: string;
	/**
	 * Optional link.
	 */
	link: string | null;
}
