/**
 * @module Helper
 */
import { ObjectId } from 'mongodb';

/**
 * ResponseError
 */
export type ResponseError = {
	error: string;
};

/**
 * Sort parameters.
 */
export type Sort = 'asc' | 'desc';

/**
 * MongoDB specific ID field.
 */
export type WithId = { _id: ObjectId };
