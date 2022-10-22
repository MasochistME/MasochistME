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
}

/**
 * This is a type of a single object within the collection "featured".
 * A single object describes a single featured object.
 */
export type Featured = FeaturedVideo | FeaturedImage;

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
	 * Steam or Discord ID of the member who posted featured object.
	 */
	memberId: string;
	/**
	 * Description of the featured object.
	 */
	description: string | null;
}

/**
 * Featured object of type video - usually a YouTube link.
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
 * Featured object of type image - for example artwork, screenshot etc.
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
	/**
	 * ID of the game in the featured image (if it's a Steam game).
	 */
	gameId: number | null;
	/**
	 * Title of the game in the featured image (used for non-Steam/non curated games).
	 */
	gameTitle: string | null;
	/**
	 * Link to the game page (used for non-Steam games).
	 */
	gameLink: string | null;
}

/**
 * Featured object of type news.
 */
export interface FeaturedNews extends Omit<BaseFeatured, 'type'> {
	/**
	 * Featured type: video.
	 */
	type: FeaturedType.NEWS;
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
