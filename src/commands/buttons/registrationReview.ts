import axios from "axios";
import { getErrorEmbed } from "arcybot";
import { ButtonInteraction, APIEmbed } from "discord.js";

import { isMod } from "utils";
import { API_URL } from "consts";

export const REGISTRATION_REVIEW = "REGISTRATION_REVIEW";

/**
 * Handles autocompletion for the create badge command
 * @param interaction
 * @returns void
 */
export const registrationReview = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  if (!isMod(interaction)) {
    interaction.channel?.send(
      getErrorEmbed(
        "Error",
        `User <@${interaction.user.id}> doesn't have role allowing them to review registration application.`,
      ),
    );
    return;
  }

  const embedFields = interaction.message.embeds[0].data.fields;
  const steamId = embedFields?.find(field => field.name === "Steam ID")?.value;
  const user = embedFields?.find(field => field.name === "User")?.value;
  const regexUserId = new RegExp(/(?<=<@)([^>]*)/);
  const userDiscordId = user?.match(regexUserId)?.[0];

  if (!steamId || !user || !userDiscordId) {
    interaction.update({
      ...getErrorEmbed("Error", "Something went wrong."),
      components: [],
    });
    return;
  }

  const embed = getApplicationReviewedEmbed(interaction, user, steamId);

  if (interaction.customId === `${REGISTRATION_REVIEW}_APPROVE`) {
    try {
      await connectDiscordUserToSteam(steamId, userDiscordId);
    } catch (err: any) {
      interaction.update({
        ...getErrorEmbed("Error", err),
        components: [],
      });
    }
    interaction.update({
      embeds: [{ ...embed, title: "✅ User application - APPROVED" }],
      components: [],
    });
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
  const url = `${API_URL}/users/user/${steamId}/discord/${discordId}`;
  const badgeRes = await axios.put(url);
  if (badgeRes.status !== 200) throw badgeRes.data;
};

/**
 * Creates and returns embed with info about the result of registration review.
 * @param interaction ButtonInteraction
 * @param user string - user's Discord mention string
 * @param steamId string - user's Steam ID
 * @returns APIEmbed
 */
const getApplicationReviewedEmbed = (
  interaction: ButtonInteraction,
  user: string,
  steamId: string,
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
