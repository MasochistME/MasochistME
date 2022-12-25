import { ButtonInteraction } from "discord.js";

import { sdk } from "fetus";
import { RaceButton } from "consts";
import { getUTCDate, createError, ErrorAction } from "utils";

import { getRaceStartEmbed, getRaceStartButtons } from "./__common";

/**
 * Response to race participant clicking the START button.
 * @param interaction ButtonInteraction
 * @return void
 */
export const raceStart = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_START}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });
    if (race.isDone)
      throw "This race is finished. You cannot participate anymore.";

    const startDate = new Date();
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { startDate },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    const tempFields = [
      {
        name: "---",
        value: `When you are done click the **FINISH** button - this will prompt you to upload a proof of finishing the race.
        \nYou'll have ${race.uploadGrace} seconds to upload your screenshot. If you exceed that time it's fine, but the additional time will be added to your final score.`,
      },
      {
        name: "Your start time",
        value: getUTCDate(startDate),
        inline: true,
      },
    ];
    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `🎮 ${race.name.toUpperCase()} - IN PROGRESS`,
          false,
          tempFields,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, false, true, true)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};
