import { ButtonInteraction } from "discord.js";

import { sdk } from "fetus";
import { RaceButton } from "consts";
import { createError, ErrorAction } from "utils";

import {
  fieldsAfterReveal,
  getRaceStartEmbed,
  getRaceStartButtons,
} from "./__common";

/**
 * Response to race participant clicking the REVEAL button.
 * @param interaction ButtonInteraction
 * @return void
 */
export const raceReveal = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_REVEAL}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });
    if (race.isDone)
      throw "This race is finished. You cannot participate anymore.";

    const revealDate = new Date();
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { revealDate },
    });
    if (!acknowledged) throw new Error("Database did not respond.");

    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `⌛ ${race.name.toUpperCase()} - READY TO GO`,
          false,
          fieldsAfterReveal,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, true, false, false)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};
