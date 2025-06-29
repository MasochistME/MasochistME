import axios, { AxiosResponse } from 'axios';
import { RaceRating, ResponseError } from 'v1/types';

/**
 * Creates/updates a race rating.
 *
 * ### Updatable fields
 * - `rating`
 * - `difficulty`
 *
 * ## Usage
 * ```ts
 * const raceId: string = "5f5e555d5a578b6";
 * const raceRating: Partial<RaceRating> = {
 * 		discordId: "123",
 * 		raceId: "5f5e555d5a578b6",
 * 		fun: 1,
 * 		difficulty: 3
 * };
 *
 * const {
 * 	acknowledged,
 * 	matchedCount,
 * 	modifiedCount,
 * 	upsertedCount,
 * 	upsertedId,
 * } = await sdk.updateRaceRatingById({ raceId, raceRating });
 * ```
 *
 * @param params.raceId     - ID of the race to update.
 * @param params.raceRating - Fields to update in the chosen race.
 */
export const updateRaceRatingById = async (
  params: { raceId: string; raceRating: Partial<Omit<RaceRating, '_id'>> },
  /** @ignore */
  BASE_URL: string,
): Promise<RaceRating> => {
  const { raceId, raceRating } = params;
  const url = `${BASE_URL}/races/race/${raceId}/rate`;

  const response = await axios.put<
    RaceRating | ResponseError,
    AxiosResponse<RaceRating | ResponseError>,
    Partial<Omit<RaceRating, '_id'>>
  >(url, raceRating, { validateStatus: () => true });

  const { status, data } = response;

  if (status !== 200) throw new Error((data as ResponseError).error);
  return data as RaceRating;
};
