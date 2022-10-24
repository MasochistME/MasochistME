/**
 * @module Update
 */

/**
 * Enum representing curator update status.
 */
export enum UpdateStatus {
	IDLE = 'idle',
	ONGOING = 'ongoing',
	ERROR = 'error',
}

/**
 * Data about the current status of the curator update.
 */
export type Update = {
	/**
	 * Date of the last update.
	 */
	lastUpdate: Date;
	/**
	 * Flag indicating if the update is currently ongoing.
	 */
	isUpdating: boolean;
	/**
	 * Percentage of the update (if it runs).
	 */
	updateProgress: number;
	/**
	 * Status of the update.
	 */
	updateStatus: UpdateStatus;
};
