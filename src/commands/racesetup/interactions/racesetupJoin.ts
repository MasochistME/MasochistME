import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { getErrorEmbed, getInfoEmbed } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v2/types";

import { sdk } from "fetus";
import { RACE_JOIN } from "consts";
import { getChannelById, getOption, getUTCDate, cenzor } from "utils";

export const racesetupJoin = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  const raceId = interaction.customId.replace(`${RACE_JOIN}-`, "");
  try {
    const response = await sdk.getRaceParticipantById({
      raceId,
      discordId: interaction.user.id,
    });
    // @ts-ignore // TODO fix SDK types
    if (response) {
      interaction.reply(
        getInfoEmbed(
          "You already joined",
          "You are already listed as a participant in this race.",
          true,
        ),
      );
      return;
    }
  } catch (error) {
    interaction.reply(
      getErrorEmbed("Something went wrong", "Please try again later.", true),
    );
  }

  const originalEmbed = interaction.message.embeds[0].data;
  const participants = originalEmbed.fields?.find(
    field => field.name === "Participants:",
  ) ?? {
    name: "Participants:",
    value: "",
  };

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

  const registerUser = await saveJoinRace(interaction);
  if (registerUser) {
    interaction.update({ embeds: [updatedEmbed] });
  }
};

/**
 * Saves the information about user joining the race.
 * @param interaction ButtonInteraction
 */
const saveJoinRace = async (
  interaction: ButtonInteraction,
): Promise<boolean> => {
  const raceId = interaction.customId.replace(`${RACE_JOIN}-`, "");
  try {
    const response = await sdk.joinRaceByParticipantId({
      raceId,
      discordId: interaction.user.id,
    });
    // @ts-ignore // TODO fix SDK types
    if (!response.acknowledged)
      throw new Error("Could not join the race, please try again later.");
    return true;
  } catch (error: any) {
    interaction.reply(
      getErrorEmbed(
        "Error",
        error.message ?? error ?? "Something went wrong.",
        true,
      ),
    );
    return false;
  }
};

/**
 * Creates a "join" button
 * @returns ActionRowBuilder<ButtonBuilder>
 */
const getRaceJoinButton = (newRaceId: string) => {
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`${RACE_JOIN}-${newRaceId}`)
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
    components: [getRaceJoinButton(newRaceId)],
  });
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
