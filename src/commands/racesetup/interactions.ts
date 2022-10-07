import { ButtonInteraction } from "discord.js";
import { getErrorEmbed } from "arcybot";

import { RACE_CONFIRMATION } from "consts";
import { isMod } from "utils";

/**
 * Handles buttons for the "racesetup" command.
 * @param interaction
 * @returns void
 */
export const racesetupConfirm = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  if (!isMod(interaction)) {
    interaction.channel?.send(
      getErrorEmbed(
        "You can't do that",
        `User <@${interaction.user.id}> doesn't have role allowing them to confirm the new race.`,
      ),
    );
    return;
  }

  const originalEmbed = interaction.message.embeds[0];
  const editedEmbed = {
    ...originalEmbed,
    fields: [
      ...(originalEmbed.data.fields ?? []),
      {
        name: "Race organizer",
        value: `<@${interaction.user.id}>`,
      },
    ],
  };

  if (interaction.customId === `${RACE_CONFIRMATION}_CONFIRM`) {
    saveRaceDetails(interaction);
    interaction.reply({
      embeds: [{ title: `✅ Race confirmed`, ...editedEmbed }],
      components: [],
    });
  }
  if (interaction.customId === `${RACE_CONFIRMATION}_REJECT`) {
    interaction.update({
      embeds: [{ title: `❌ Race rejected`, ...editedEmbed }],
      components: [],
    });
  }
};

const saveRaceDetails = (interaction: ButtonInteraction) => {
  const embedFields = interaction.message.embeds[0].data.fields;
  console.log(embedFields);

  // TODO
  // create an endpoint which would save this race data to database for future use.
};
