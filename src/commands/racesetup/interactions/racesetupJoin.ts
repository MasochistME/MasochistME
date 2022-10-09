import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { getInfoEmbed } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v2/types";

import { sdk } from "fetus";
import { RACE_JOIN } from "consts";
import { getChannelById, getOption, getUTCDate, cenzor } from "utils";

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
export const sendRaceJoinForm = async (
  interaction: ButtonInteraction,
  newRaceId: string,
) => {
  const raceRoomId = getOption("room_race");
  const channel = getChannelById(interaction, raceRoomId);

  const newRace = await sdk.getRaceById({ id: newRaceId });

  //@ts-ignore // TODO fix types in SDK
  const embed = getNewRaceCensoredEmbed(newRace);

  await channel?.send({
    embeds: [embed],
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

/**
 * Creates an embed for the newly created race, censored
 * @param race Race
 * @returns APIEmbed
 */
const getNewRaceCensoredEmbed = (race: Race): APIEmbed => {
  const fields: APIEmbedField[] = [
    {
      name: "Name",
      value: race.name,
    },
    {
      name: "Instructions",
      value: cenzor(race.instructions),
    },
    {
      name: "Start time",
      value: getUTCDate(race.startTime),
      inline: true,
    },
    {
      name: "Finish time",
      value: getUTCDate(race.endTime),
      inline: true,
    },
    {
      name: "Download link",
      value: cenzor(race.downloadLink),
    },
    {
      name: "Download grace period",
      value: `${race.downloadGrace} seconds`,
      inline: true,
    },
    {
      name: "Screenshot upload grace period",
      value: `${race.uploadGrace} seconds`,
      inline: true,
    },
    {
      name: "Race organizer",
      value: `<@${race.organizer}>`,
    },
    {
      name: "---",
      value: `Clicking the **JOIN** button below will sign you up for the race!\n\nYou will get a ping from the bot when the race opens - then you can click **START** button whenever you feel ready to go.\n\n---`,
    },
  ];

  if (race.type === RaceType.SCORE_BASED)
    // optional field
    fields.push({
      name: "Play time limit",
      value: `${(race as RaceScoreBased).playLimit} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title: `📌 ${race.name.toUpperCase()} - new race sign-up form!`,
    fields,
  };

  return embed;
};
