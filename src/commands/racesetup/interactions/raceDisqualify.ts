import { getErrorEmbed, getInfoEmbed } from "arcybot";
import { ButtonInteraction } from "discord.js";

import { sdk } from "fetus";
import {
  createError,
  ErrorAction,
  getModChannel,
  getMemberNameById,
  getDMChannel,
} from "utils";

export const raceDisqualify = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const buttonId = interaction.customId.toLowerCase();
    const raceIdRegex = new RegExp(/(?<=raceid_)(.*)(?=-)/gim);
    const memberIdRegex = new RegExp(/(?<=memberid_)(.*)/gim);
    const raceId = raceIdRegex.exec(buttonId)?.[0] ?? null;
    const memberId = memberIdRegex.exec(buttonId)?.[0] ?? null;

    if (!raceId) throw "Incorrect race ID.";
    if (!memberId) throw "Incorrect member ID.";

    const race = await sdk.getRaceById({ raceId });

    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId,
      update: { disqualified: true },
    });
    if (!acknowledged) throw "Could not disqualify this user.";

    getModChannel(true)?.send(
      getErrorEmbed(
        `Player disqualified`,
        `Player **${
          getMemberNameById(memberId) ?? memberId
        }** got disqualified from race **${
          race?.name ?? "UNKNOWN RACE"
        }**.\n\n**Responsible mod:** <@${
          interaction.user.id
        }>\n**Member ID:** ${memberId}\n**Race ID:** ${raceId}\n**Date:** ${new Date().toLocaleString()}`,
      ),
    );
    getDMChannel(memberId)?.send(
      getErrorEmbed(
        `You have been disqualified from a race`,
        `You got disqualified from race ${
          race?.name ?? "UNKNOWN RACE"
        }.\n\n**Responsible mod:** <@${
          interaction.user.id
        }>\n**Member ID:** ${memberId}\n**Race ID:** ${raceId}\n\nIf you think this is a mistake, contact mods.`,
      ),
    );

    const originalEmbed = interaction.message.embeds[0].data;
    const editedEmbed = {
      ...originalEmbed,
      title: `${originalEmbed.title} - DISQUALIFIED`,
      fields: [
        ...(originalEmbed.fields ?? []),
        {
          name: "⛔ Disqualified by",
          value: `<@${interaction.user.id}>`,
          inline: true,
        },
        {
          name: "⛔ Disqualifcation date",
          value: new Date().toLocaleString(),
          inline: true,
        },
      ],
    };
    interaction.update({
      embeds: [editedEmbed],
      components: [],
    });
  } catch (err) {
    createError(interaction, err, ErrorAction.SEND);
  }
};
