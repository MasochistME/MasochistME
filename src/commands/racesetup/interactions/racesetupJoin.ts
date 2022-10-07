import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { getInfoEmbed } from "arcybot";

import { RACE_JOIN } from "consts";
import { getChannelById, getOption } from "utils";

export const racesetupJoin = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  const originalEmbed = interaction.message.embeds[0].data;
  const participants = originalEmbed.fields?.find(
    field => field.name === "Participants:",
  ) ?? {
    name: "Participants:",
    value: "",
  };

  if (participants.value.includes(interaction.user.id)) {
    interaction.reply(
      getInfoEmbed(
        "You already joined",
        "You are already listed as a participant in this race.",
        true,
      ),
    );
    return;
  }

  const updatedParticipants = {
    ...participants,
    value: `${participants.value}<@${interaction.user.id}>\n`,
  };
  const updatedFields = [
    ...(originalEmbed.fields ?? []).filter(
      field => field.name !== "Participants:",
    ),
    updatedParticipants,
  ];
  const updatedEmbed = {
    ...originalEmbed,
    fields: updatedFields,
  };

  saveRaceJoin(interaction);
  interaction.update({ embeds: [updatedEmbed] });
};

/**
 * Creates a "join" buttil
 * @returns ActionRowBuilder<ButtonBuilder>
 */
const getRaceJoinButton = () => {
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(RACE_JOIN)
      .setLabel("JOIN THE RACE!")
      .setStyle(ButtonStyle.Primary),
  );
  return buttonBar;
};

/**
 * Sends a race join form to users facing channel.
 * @param interaction ButtonInteraction
 */
export const sendRaceJoinForm = async (interaction: ButtonInteraction) => {
  const raceRoomId = getOption("room_race");
  const channel = getChannelById(interaction, raceRoomId);
  const originalEmbed = interaction.message.embeds[0].data;
  const raceName =
    originalEmbed.fields?.find(field => field.name === "Name")?.value ??
    "New race";

  const editedEmbed = {
    ...originalEmbed,
    title: `📌 ${raceName.toUpperCase()} - race sign-up form`,
    fields: [
      ...(originalEmbed.fields ?? []),
      {
        name: "---",
        value: `Clicking the **JOIN** button below will sign you up for the race!\n\nYou will get a ping from the bot when the race opens - then you can click **START** button whenever you feel ready to go.\n\n---`,
      },
    ],
  };

  await channel?.send({
    embeds: [editedEmbed],
    components: [getRaceJoinButton()],
  });
};

/**
 * Saves the information about user joining the race.
 * @param interaction ButtonInteraction
 */
const saveRaceJoin = (interaction: ButtonInteraction) => {
  const embedFields = interaction.message.embeds[0].data.fields;
  console.log(Boolean(embedFields));
  // TODO
  // create an endpoint which would save the info of user joining race to the database.
};
