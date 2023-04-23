import { APIEmbed } from "discord.js";
import { DiscordInteraction } from "arcybot";
import { Leaderboards, Member } from "@masochistme/sdk/dist/v1/types";

import { cache, sdk } from "fetus";
import { createError, ErrorAction } from "utils";

import { UNKNOWN, USER_NO_DESCRIPTION } from "consts";

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
      \nTo be able to use \`/profile\` command, please register first with the \`/register\` command and wait for the approval from mods.`;

    const fullRanking = await sdk.getLeaderboardsMembersList({
      filter: { isMember: true },
    });
    const memberRanking = fullRanking.find(
      ranking => ranking.memberId === member.steamId,
    );
    const isMember = member.isMember || member.isProtected;

    const usefulMemberInfo: PartialMember = {
      steamId: member.steamId,
      name: `${member.name} (${isMember ? "member" : "guest"})`,
      avatar: member.avatar,
      url: `https://steamcommunity.com/profiles/${member.steamId}`,
      description: member.description,
      tierCompletion: getMemberTierCompletion(memberRanking, isMember),
      badges: getMemberBadges(memberRanking, isMember),
      rank: getMemberRank(memberRanking, isMember),
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
        value: member.rank ?? "-",
        inline: true,
      },
      {
        name: "Badges unlocked:",
        value: member.badges ?? "-",
        inline: true,
      },
      {
        name: "Tier completion:",
        value: member.tierCompletion ?? "-",
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
const getMemberRank = (memberRanking?: Leaderboards, isMember?: boolean) => {
  if (!isMember) return `—\n\n**Total points:**\n—`;
  const memberPointsSum = memberRanking?.sum ?? "—";
  const memberPosition = memberRanking?.position ?? "—";
  return `${memberPosition}\n\n**Total points:**\n\`\`${memberPointsSum}\`\``;
};

/**
 * Returns the summary of member's tier completion statistics.
 * @param member Member
 * @return string
 */
const getMemberTierCompletion = (
  memberRanking?: Leaderboards,
  isMember?: boolean,
) => {
  if (!isMember) return "—";
  const memberTierCompletionSummary = cache.tiers
    .map(tier => {
      const memberTierCompletion =
        memberRanking?.games?.find(rank => rank.tier === tier.id)?.total ?? "0";
      return `\`\`Tier ${tier.id} - ${memberTierCompletion}\`\``;
    })
    .join("\n");
  return memberTierCompletionSummary;
};

/**
 * Returns a number of badges that the member earned.
 * @param member Member
 * @return string
 */
const getMemberBadges = (memberRanking?: Leaderboards, isMember?: boolean) => {
  if (!isMember) return `—\n\n**Badges points:**\n—`;
  const memberBadges: { points: number | "—"; total: number | "—" } =
    memberRanking?.badges ?? {
      points: "—",
      total: "—",
    };

  return `\`\`${memberBadges.total}\`\`\n\n**Badges points:**\n\`\`${memberBadges.points}\`\``;
};
