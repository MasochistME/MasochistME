import { ButtonInteraction } from "discord.js";
import { getErrorEmbed } from "arcybot";
import { Race } from "@masochistme/sdk/dist/v1/types";

import { sdk } from "fetus";
import { RACE_CONFIRMATION } from "consts";
import { isMod } from "utils";

import { sendRaceJoinForm } from "./racesetupJoin";
import { getDraftRace, setDraftRace } from "commands/_utils/race";

export const draftRaceData: { race?: Race } = {};

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

  const originalEmbed = interaction.message.embeds[0].data;
  const editedEmbed = {
    ...originalEmbed,
    fields: [
      ...(originalEmbed.fields ?? []),
      {
        name: "Race organizer",
        value: `<@${interaction.user.id}>`,
      },
    ],
  };

  if (interaction.customId === `${RACE_CONFIRMATION}_CONFIRM`) {
    try {
      const newRaceId = await saveRaceDetails();
      sendRaceJoinForm(interaction, newRaceId);
      interaction.update({
        embeds: [
          { ...editedEmbed, title: `✅ Race draft confirmed and created!` },
        ],
        components: [],
      });
    } catch (err: any) {
      interaction.reply(
        getErrorEmbed(
          "Something went wrong",
          err.message ?? err ?? "Could not save race. Please try again later.",
        ),
      );
      return;
    }
  }
  if (interaction.customId === `${RACE_CONFIRMATION}_REJECT`) {
    interaction.update({
      embeds: [{ ...editedEmbed, title: `❌ Race draft rejected!` }],
      components: [],
    });
  }
};

/**
 * Saves the new race details to database.
 * @param interaction ButtonInteraction
 */
const saveRaceDetails = async (): Promise<string> => {
  const race = getDraftRace();
  if (!race) throw new Error("No draft race data found.");

  const response = await sdk.createRace({ race });
  if (!response.acknowledged)
    throw new Error("Database refused to save draft race data.");
  setDraftRace();
  return String(response.insertedId);
};
