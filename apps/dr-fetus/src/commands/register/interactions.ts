import { getErrorEmbed } from "arcybot";
import { ButtonInteraction, APIEmbed } from "discord.js";

import { isMod } from "utils";
import { REGISTRATION_REVIEW } from "consts";
import { sdk } from "fetus";

/**
 * Handles autocompletion for the create badge command
 * @param interaction
 * @return void
 */
export const registrationReview = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  if (!isMod(interaction)) {
    interaction.channel?.send(
      getErrorEmbed(
        "You can't do that",
        `User <@${interaction.user.id}> doesn't have role allowing them to review registration application.`,
      ),
    );
    return;
  }

  const embedFields = interaction.message.embeds[0].data.fields;
  const steamId = embedFields?.find(field => field.name === "Steam ID")?.value;
  const steamUsername = embedFields?.find(
    field => field.name === "Requested Steam",
  )?.value;
  const user = embedFields?.find(field => field.name === "User")?.value;
  const regexUserId = new RegExp(/(?<=<@)([^>]*)/);
  const userDiscordId = user?.match(regexUserId)?.[0];

  if (!steamId || !steamUsername || !user || !userDiscordId) {
    interaction.update({
      ...getErrorEmbed("Error", "Something went wrong."),
      components: [],
    });
    return;
  }

  const embed = getApplicationReviewedEmbed(
    interaction,
    user,
    steamId,
    steamUsername,
  );

  if (interaction.customId === `${REGISTRATION_REVIEW}_APPROVE`) {
    try {
      const { acknowledged, modifiedCount } = await connectDiscordUserToSteam(
        steamId,
        userDiscordId,
      );
      if (!acknowledged) {
        throw new Error(
          "Incorrect token. Please contact Arcyvilk because something is fucked up.",
        );
      }
      if (modifiedCount === 0) {
        throw new Error(
          "Could not modify this member. Most likely the provided profile link is incorrect.",
        );
      }
      interaction.update({
        embeds: [{ ...embed, title: "✅ User application - APPROVED" }],
        components: [],
      });
    } catch (err: any) {
      interaction.update({
        ...getErrorEmbed(
          "Error",
          err?.message ??
            err ??
            "Incorrect token. Please contact Arcyvilk because something is fucked up.",
        ),
        components: [],
      });
    }
  }
  if (interaction.customId === `${REGISTRATION_REVIEW}_REJECT`) {
    interaction.update({
      embeds: [{ ...embed, title: "❌ User application - REJECTED" }],
      components: [],
    });
  }
};

/**
 * Sends the request to API to connect Discord user with Masochist.ME one.
 * @param steamId string
 * @param discordId string
 */
const connectDiscordUserToSteam = async (
  steamId: string,
  discordId: string,
) => {
  const memberUpdateResponse = await sdk.updateMemberById({
    memberId: steamId,
    member: { discordId },
  });
  return {
    acknowledged: memberUpdateResponse.acknowledged,
    modifiedCount: memberUpdateResponse.modifiedCount,
  };
};

/**
 * Creates and returns embed with info about the result of registration review.
 * @param interaction ButtonInteraction
 * @param user string - user's Discord mention string
 * @param steamId string - user's Steam ID
 * @return APIEmbed
 */
const getApplicationReviewedEmbed = (
  interaction: ButtonInteraction,
  user: string,
  steamId: string,
  steamUsername: string,
): APIEmbed => {
  const getVerdict = (): "APPROVED" | "REJECTED" | "UNKNOWN" => {
    if (interaction.customId === `${REGISTRATION_REVIEW}_APPROVE`)
      return "APPROVED";
    if (interaction.customId === `${REGISTRATION_REVIEW}_REJECT`)
      return "REJECTED";
    return "UNKNOWN";
  };

  return {
    fields: [
      {
        name: "User",
        value: user,
        inline: true,
      },
      {
        name: "Requested Steam",
        value: steamUsername,
        inline: true,
      },
      {
        name: "Steam ID",
        value: steamId,
        inline: true,
      },
      {
        name: "Steam profile",
        value: `https://steamcommunity.com/profiles/${steamId}`,
      },
      {
        name: "Masochist.ME link",
        value: `http://masochist.me/profile/${steamId}`,
      },
      {
        name: "Verdict",
        value: getVerdict(),
        inline: true,
      },
      {
        name: "Mod reviewer",
        value: `<@${interaction.user.id}>`,
        inline: true,
      },
    ],
  };
};
