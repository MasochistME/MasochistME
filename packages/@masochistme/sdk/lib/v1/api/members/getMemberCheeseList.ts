import axios, { AxiosResponse } from 'axios';

import { MemberCheese, MemberIdEither, ResponseError } from 'v1/types';

/**
 * Returns a list of all cheese badges belonging to a member.
 * Member can be identified by either Discord ID or Steam ID, but at least one of those values **must** be provided.
 *
 * ### Filter options
 *
 * - none for now
 *
 * ### Sort options
 *
 * - none for now
 *
 * ## Usage
 *
 * ```ts
 * const steamId: string = "567876545678";
 * const cheeseBadges: MemberCheese[] = await sdk.getMemberCheeseList({ steamId });
 * ```
 *
 * @param params.steamId   - (Optional) Steam ID of the requested member.
 * @param params.discordId - (Optional) Discord ID of the requested member.
 */
export const getMemberCheeseList = async (
  params: MemberCheeseListParams,
  /** @ignore */
  BASE_URL: string,
): Promise<MemberCheese[]> => {
  const { steamId, discordId } = params;
  const memberId = steamId ?? discordId;
  const url = `${BASE_URL}/members/member/${memberId}/cheese/list`;

  const memberCheeseListResponse = await axios.post<
    MemberCheese[] | ResponseError,
    AxiosResponse<MemberCheese[] | ResponseError>
  >(url, {}, { validateStatus: () => true });

  const { status, data } = memberCheeseListResponse;

  if (status !== 200) throw new Error((data as ResponseError).error);
  return data as MemberCheese[];
};

export type MemberCheeseListParams = MemberIdEither;
