import axios, { AxiosResponse } from 'axios';
import { InsertOneResult } from 'mongodb';

import { MemberCheese, ResponseError } from 'v1/types';

/**
 * Gives a cheese badge to an existing member.
 *
 * Award is identified by its stringified `ObjectID`.
 * Member is identified by their Discord ID.
 *
 * ## Usage
 *
 * ```ts
 * const memberId: string = "2938274356793";
 * const gameId: number = 12345;
 * const points: number = -8;
 * const reason: string = "SAM/CE"
 *
 * const {
 * 	acknowledged,
 *  insertedId,
 * } = await sdk.giveCheeseToMemberById({ memberId, gameId, points, reason });
 * ```
 *
 * @param params.awardId  - ID of the award to give to selected member.
 * @param params.memberId - ID of member which is supposed to get an award.
 */
export const giveCheeseToMemberById = async (
  params: { memberId: string; gameId: number; points: number; reason: string },
  /** @ignore */
  BASE_URL: string,
): Promise<InsertOneResult<MemberCheese>> => {
  const { memberId, ...rest } = params;
  const url = `${BASE_URL}/members/member/${memberId}/cheese`;

  const memberAwardResponse = await axios.post<
    InsertOneResult<MemberCheese> | ResponseError,
    AxiosResponse<InsertOneResult<MemberCheese> | ResponseError>
  >(url, { ...rest }, { validateStatus: () => true });

  const { status, data } = memberAwardResponse;

  if (status !== 201) throw new Error((data as ResponseError).error);
  return data as InsertOneResult<MemberCheese>;
};
