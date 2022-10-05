import { getErrorEmbed } from "arcybot";
import { ButtonInteraction, APIEmbed } from "discord.js";

import { isMod } from "utils";

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

  if (!steamId || !user) {
    interaction.update({
      ...getErrorEmbed("Error", "Something went wrong."),
      components: [],
    });
    return;
  }

  const getVerdict = (): "APPROVED" | "REJECTED" | "UNKNOWN" => {
    if (interaction.customId === `${REGISTRATION_REVIEW}_APPROVE`)
      return "APPROVED";
    if (interaction.customId === `${REGISTRATION_REVIEW}_REJECT`)
      return "REJECTED";
    return "UNKNOWN";
  };

  const embed: APIEmbed = {
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

  if (interaction.customId === `${REGISTRATION_REVIEW}_APPROVE`) {
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
