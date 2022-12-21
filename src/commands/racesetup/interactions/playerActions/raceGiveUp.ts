import { ButtonInteraction } from "discord.js";

import { sdk } from "fetus";
import { RaceButton } from "consts";
import { createError, ErrorAction } from "utils";

import { getRaceStartEmbed, getRaceStartButtons } from "./__common";

/**
 * Response to race participant clicking the GIVE UP button.
 * @param interaction
 * @return void
 */
export const raceGiveUp = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_GIVE_UP}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });

    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { dnf: true },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    const tempFields = [
      {
        name: "---",
        value: `You gave up :( You won't be able to rejoin this race.`,
      },
    ];
    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `❌ ${race.name.toUpperCase()} - WALKOVER`,
          false,
          tempFields,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, false, false, false)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

export const raceGiveUpModal = () => {
  //
};
