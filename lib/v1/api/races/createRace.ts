import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { Race, ResponseError } from 'v1/types';

/**
 * Creates a new race.
 *
 * ## Usage
 * ```ts
 * const race: Omit<Race, "_id"> = {
 * 	name: "The best race ever!",
 *  instructions: "You will need a controller, so prepare.",
 *  objectives: "Get 100 starts in the shortest time possible.",
 *  type: RaceType.TIME,
 *  startDate: new Date(),
 *  endDate: new Date(16893846783483),
 *  downloadLink: "http://masochist.me",
 *  downloadGrace: "30",
 *  uploadGrace: "30",
 *  owner: "738927465878329",
 *  season: "5eda7778c87dd9a7",
 *  icon: "http://http.cat/404.jpg",
 * };
 *
 * const {
 * 	acknowledged,
 *  insertedId,
 * } = await sdk.createRace({ race });
 * ```
 *
 * @param params.race - Object with the data of the new race.
 */
export const createRace = async (
	params: { race: Omit<Race, '_id' | 'isActive' | 'isDone'> },
	/** @ignore */
	BASE_URL: string,
): Promise<InsertOneResult<Race>> => {
	const { race } = params;
	const url = `${BASE_URL}/races`;

	const raceResponse = await axios.post<
		InsertOneResult<Race> | ResponseError,
		AxiosResponse<InsertOneResult<Race> | ResponseError>,
		Omit<Race, '_id' | 'isActive' | 'isDone'>
	>(url, race, { validateStatus: () => true });

	const { status, data } = raceResponse;

	if (status !== 201) throw new Error((data as ResponseError).error);
	return data as InsertOneResult<Race>;
};
