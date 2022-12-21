import { getErrorEmbed } from "arcybot";
import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { sdk } from "fetus";
import { DISQUALIFY_PARTICIPANT } from "consts";
import {
  createError,
  ErrorAction,
  getModChannel,
  getMemberNameById,
  getDMChannel,
} from "utils";

const raceIdRegex = new RegExp(/(?<=raceid_)(.*)(?=-)/gim);
const memberIdRegex = new RegExp(/(?<=memberid_)(.*)/gim);

const DISQUALIFICATION_REASON = "DISQUALIFICATION_REASON";

export const raceDisqualify = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const buttonId = interaction.customId.toLowerCase();

    const raceId = buttonId.match(raceIdRegex)?.[0] ?? null;
    const memberId = buttonId.match(memberIdRegex)?.[0] ?? null;

    if (!raceId || !memberId)
      throw "Something went wrong. Just try again, it should work this time.";

    const modal = new ModalBuilder()
      .setTitle("Are you sure you want to do that?")
      .setCustomId(
        `${DISQUALIFY_PARTICIPANT}-raceid_${raceId}-memberid_${memberId}`,
      );
    const textInput = new TextInputBuilder()
      .setMinLength(1)
      .setCustomId(DISQUALIFICATION_REASON)
      .setLabel("Reason of disqualification")
      .setStyle(TextInputStyle.Short);
    const actionRow = [new ActionRowBuilder().addComponents(textInput)];

    // @ts-ignore
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  } catch (err) {
    createError(interaction, err, ErrorAction.SEND);
  }
};

export const raceDisqualifyModal = async (
  interaction: ModalSubmitInteraction,
) => {
  if (!interaction.isModalSubmit()) return;

  try {
    const modalId = interaction.customId.toLowerCase();
    const disqualificationReason =
      interaction.fields.getTextInputValue(DISQUALIFICATION_REASON) ?? "—";
    const raceExec = modalId.match(raceIdRegex);
    const memberExec = modalId.match(memberIdRegex);
    const raceId = raceExec?.[0] ?? null;
    const memberId = memberExec?.[0] ?? null;

    if (!raceId || !memberId)
      throw "Something went wrong. Just try again, it should work this time.";

    const race = await sdk.getRaceById({ raceId });
    const raceName = race?.name ?? "UNKNOWN RACE";
    const memberName = getMemberNameById(memberId) ?? memberId;

    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId,
      update: {
        disqualified: true,
        disqualificationReason,
        disqualifiedBy: interaction.user.id,
      },
    });
    if (!acknowledged) throw "Could not disqualify this user.";

    getModChannel(true)?.send(
      getErrorEmbed(
        `Player disqualified`,
        `Player **<@${memberId}>** got disqualified from race by **<@${
          interaction.user.id
        }>**.
        \n**Race:** ${raceName}\n**Reason:** _${disqualificationReason}_\n**Date:** ${new Date().toLocaleString()}`,
      ),
    );
    getDMChannel(memberId)?.send(
      getErrorEmbed(
        `You have been disqualified from a race`,
        `You got disqualified from race **${raceName}** by <@${interaction.user.id}>.
        \n**Reason:** _${disqualificationReason}_
        \nIf you think this is a mistake, contact mods.`,
      ),
    );

    const originalEmbed = interaction.message?.embeds[0].data;
    const editedEmbed = {
      ...originalEmbed,
      title: `${raceName} - ${memberName} - DISQUALIFIED`,
      fields: [
        ...(originalEmbed?.fields ?? []),
        {
          name: "⛔ Disqualification reason",
          value: `_${disqualificationReason}_`,
          inline: false,
        },
        {
          name: "⛔ Disqualified by",
          value: `<@${interaction.user.id}>`,
          inline: true,
        },
        {
          name: "⛔ Disqualification date",
          value: new Date().toLocaleString(),
          inline: true,
        },
      ],
    };
    // @ts-ignore
    interaction.update({
      embeds: [editedEmbed],
      components: [],
    });
  } catch (err) {
    createError(interaction, err, ErrorAction.SEND);
  }
};
