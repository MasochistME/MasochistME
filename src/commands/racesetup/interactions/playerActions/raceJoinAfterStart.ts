import { ButtonInteraction } from "discord.js";

import { sdk } from "fetus";
import { RaceButton } from "consts";
import { createError, ErrorAction } from "utils";

import {
  fieldsBeforeReveal,
  getRaceStartEmbed,
  getRaceStartButtons,
} from "./__common";

/**
 * Handles situation where member joins the race after it already started.
 * @param interaction ButtonInteraction
 * @return void
 */
export const raceJoinAfterStart = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(`${RaceButton.RACE_JOIN}-`, "");
    const race = await sdk.getRaceById({ raceId });
    interaction.user.send({
      embeds: [
        getRaceStartEmbed(
          race,
          `⏳ ${race.name.toUpperCase()} - PREPARING...`,
          true,
          fieldsBeforeReveal,
        ),
      ],
      components: [getRaceStartButtons(raceId, true, false, false, false)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};
