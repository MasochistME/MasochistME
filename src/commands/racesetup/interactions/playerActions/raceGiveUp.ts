import {
  ButtonInteraction,
  ModalSubmitInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { getInfoEmbed } from "arcybot";

import { sdk } from "fetus";
import { RaceButton, RACE_GIVE_UP } from "consts";
import { createError, ErrorAction, getModChannel } from "utils";

import { getRaceStartEmbed, getRaceStartButtons } from "./__common";

const raceIdRegex = new RegExp(/(?<=raceid_)(.*)/gim);

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

    const modal = new ModalBuilder()
      .setTitle("Are you sure you want to do that?")
      .setCustomId(`${RACE_GIVE_UP}-raceid_${raceId}`);
    const textInput = new TextInputBuilder()
      .setMinLength(1)
      .setCustomId(`${RACE_GIVE_UP}_reason`)
      .setLabel("Reason of giving up")
      .setValue("This field is optional")
      .setStyle(TextInputStyle.Short);
    const actionRow = [new ActionRowBuilder().addComponents(textInput)];

    // @ts-ignore
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

export const raceGiveUpModal = async (interaction: ModalSubmitInteraction) => {
  if (!interaction.isModalSubmit()) return;

  try {
    const modalId = interaction.customId.toLowerCase();
    const giveupReason =
      interaction.fields.getTextInputValue(`${RACE_GIVE_UP}_reason`) ?? "—";
    const raceExec = modalId.match(raceIdRegex);
    const raceId = raceExec?.[0] ?? null;

    if (!raceId)
      throw "Something went wrong. Just try again, it should work this time.";

    const race = await sdk.getRaceById({ raceId });
    const raceName = race?.name ?? "UNKNOWN RACE";
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
    // @ts-ignore
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

    getModChannel(true)?.send(
      getInfoEmbed(
        `${raceName} - PARTICIPANT GAVE UP`,
        `Player **<@${interaction.user.id}>** gave up.
        \n**Race:** ${raceName}\n**Reason:** _${giveupReason}_\n**Date:** ${new Date().toLocaleString()}`,
      ),
    );
  } catch (err) {
    createError(interaction, err, ErrorAction.SEND);
  }
};
