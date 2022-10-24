import axios from "axios";
import { APIEmbed } from "discord.js";
import { DiscordInteraction } from "arcybot";
import { Member } from "@masochistme/sdk/dist/v1/types";

import { cache, sdk } from "fetus";
import { createError, ErrorAction } from "utils";

import { API_URL, UNKNOWN, USER_NO_DESCRIPTION } from "consts";

type PartialMember = Pick<
  Member,
  "name" | "avatar" | "description" | "steamId"
> & {
  url: string;
  tierCompletion: string;
  badges: string;
  rank: string;
};

export const profile = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const userId = interaction.user.id;
  await interaction.deferReply();

  try {
    const member = await sdk.getMemberById({
      discordId: userId,
    });
    if (!member)
      throw `Your Discord account is not connected to the Masochist.ME profile.
      \nTo be able to use \`/profile\` command, please register first with the \`/register\` command.`;

    const rankingUrl = `${API_URL}/ranking`;
    const fullRanking = await axios.get(rankingUrl);
    if (fullRanking.status !== 200) throw fullRanking.data;

    const usefulMemberInfo: PartialMember = {
      steamId: member.steamId,
      name: member.name,
      avatar: member.avatar,
      url: `https://steamcommunity.com/profiles/${member.steamId}`,
      description: member.description,
      tierCompletion: "", // getMemberTierCompletion(member),
      badges: getMemberBadges(member, fullRanking),
      rank: getMemberRank(member, fullRanking),
    };
    const embed = getMemberEmbed(usefulMemberInfo);
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

/**
 * Creates an embed for the mod review of user registration
 * @param interaction DiscordInteraction
 * @param steamId string - user's Steam ID
 * @return APIEmbed
 */
const getMemberEmbed = (member: PartialMember) => {
  const embed: APIEmbed = {
    title: member.name?.toUpperCase() ?? UNKNOWN,
    thumbnail: { url: member.avatar },
    fields: [
      {
        name: "Description",
        value: member.description ?? USER_NO_DESCRIPTION,
      },
      {
        name: "Steam profile",
        value: `https://steamcommunity.com/profiles/${
          member.steamId ?? UNKNOWN
        }`,
      },
      {
        name: "Masochist.ME link",
        value: `http://masochist.me/profile/${member.steamId ?? UNKNOWN}`,
      },
      {
        name: "Rank:",
        value: member.rank,
        inline: true,
      },
      {
        name: "Badges unlocked:",
        value: member.badges,
        inline: true,
      },
      {
        name: "Tier completion:",
        value: member.tierCompletion,
        inline: true,
      },
    ],
  };

  return embed;
};

/**
 * Returns member's MasochistME rank.
 * @param member Member
 * @return string
 */
const getMemberRank = (member: Member, fullRanking: any) => {
  const memberRanking =
    fullRanking.data.find((r: any) => r.id === member.steamId)?.points?.sum ??
    "0";
  const memberPosition = fullRanking.data.findIndex(
    (r: any) => r.id === member.steamId,
  );
  const fixedMemberPosition =
    memberPosition === -1
      ? "Not present in ranking"
      : `\`\`#${Number(memberPosition) + 1}\`\``;
  return `${fixedMemberPosition}\n\n**Total points:**\n\`\`${memberRanking}\`\``;
};

/**
 * Returns the summary of member's tier completion statistics.
 * @param member Member
 * @return string
 */
// TODO FIX!
// const getMemberTierCompletion = (member: Member) => {
//   const memberTierCompletionSummary = cache.tiers
//     .map(tier => {
//       const memberTierCompletion = member[tier.id] ?? "0";
//       return `\`\`Tier ${tier.id} - ${memberTierCompletion}\`\``;
//     })
//     .join("\n");
//   return memberTierCompletionSummary;
// };

/**
 * Returns a number of badges that the member earned.
 * @param member Member
 * @return string
 */
const getMemberBadges = (member: Member, fullRanking: any) => {
  const memberBadges =
    fullRanking.data.find((r: any) => r.id === member.steamId)?.points
      ?.badges ?? {};
  const { points = "0", total = "0" } = memberBadges;

  return `\`\`${total}\`\`\n\n**Badges points:**\n\`\`${points}\`\``;
};
