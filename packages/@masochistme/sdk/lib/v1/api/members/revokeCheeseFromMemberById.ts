import axios, { AxiosResponse } from 'axios';
import { DeleteResult } from 'mongodb';

import { ResponseError } from 'v1/types';

/**
 * Removes a cheese badge from an existing member.
 *
 * Cheese badge is identified by the Steam ID of the game it belongs to.
 * Member is identified by their Discord ID.
 *
 * ## Usage
 *
 * ```ts
 * const gameId: number = 65300;
 * const memberId: string = "2938274356793";
 *
 * const {
 * 	acknowledged,
 * 	deletedCount,
 * } = await sdk.revokeBadgeFromMemberById({ gameId, memberId });
 * ```
 *
 * @param params.gameId   - Steam ID of the game to which cheese badge belongs..
 * @param params.memberId - ID of member which is supposed to have cheese revoked.
 */
export const revokeCheeseFromMemberById = async (
  params: { memberId: string; gameId: number },
  /** @ignore */
  BASE_URL: string,
): Promise<DeleteResult> => {
  const { gameId, memberId } = params;
  const url = `${BASE_URL}/members/member/${memberId}/cheese/${gameId}`;

  const memberCheeseResponse = await axios.delete<
    DeleteResult | ResponseError,
    AxiosResponse<DeleteResult | ResponseError>
  >(url, { validateStatus: () => true });

  const { status, data } = memberCheeseResponse;

  if (status !== 200) throw new Error((data as ResponseError).error);
  return data as DeleteResult;
};
