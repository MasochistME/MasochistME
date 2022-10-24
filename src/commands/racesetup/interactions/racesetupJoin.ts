import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { getErrorEmbed, getInfoEmbed } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v1/types";

import { sdk } from "fetus";
import { RaceButton } from "consts";
import { getChannelById, getOption, getUTCDate, cenzor } from "utils";

import { raceJoinAfterStart } from "./raceStart";

export const racesetupJoin = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  const raceId = interaction.customId.replace(`${RaceButton.RACE_JOIN}-`, "");
  try {
    const response = await sdk.getRaceParticipantById({
      raceId,
      memberId: interaction.user.id,
    });
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
    // user not signed up for race yet, proceed
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
  const race = await sdk.getRaceById({ raceId });
  if (registerUser) {
    interaction.update({ embeds: [updatedEmbed] });
    if (race.isActive) raceJoinAfterStart(interaction);
  }
};

/**
 * Saves the information about user joining the race.
 * @param interaction ButtonInteraction
 */
const saveJoinRace = async (
  interaction: ButtonInteraction,
): Promise<boolean> => {
  const raceId = interaction.customId.replace(`${RaceButton.RACE_JOIN}-`, "");
  try {
    const response = await sdk.joinRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
    });
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
 * Sends a race join form to users facing channel.
 * @param interaction ButtonInteraction
 */
export const sendRaceJoinForm = async (
  interaction: ButtonInteraction,
  raceId: string,
) => {
  const newRace = await sdk.getRaceById({ raceId });

  const raceRoomId = getOption("room_race");
  const channel = getChannelById(interaction, raceRoomId);

  await channel?.send({
    embeds: [getNewRaceCensoredEmbed(newRace)],
    components: [getRaceJoinButton(raceId)],
  });
};

/**
 * Creates a "join" button
 * @return ActionRowBuilder<ButtonBuilder>
 */
const getRaceJoinButton = (newRaceId: string) => {
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`${RaceButton.RACE_JOIN}-${newRaceId}`)
      .setLabel("JOIN THE RACE!")
      .setStyle(ButtonStyle.Primary),
  );
  return buttonBar;
};

/**
 * Creates an embed for the newly created race, censored
 * @param race Race
 * @return APIEmbed
 */
const getNewRaceCensoredEmbed = (race: Race): APIEmbed => {
  const fields: APIEmbedField[] = [
    {
      name: "Instructions",
      value: race.instructions,
    },
    {
      name: "Objectives",
      value: cenzor(race.objectives),
    },
    {
      name: "Start time",
      value: getUTCDate(race.startDate),
      inline: true,
    },
    {
      name: "Finish time",
      value: getUTCDate(race.endDate),
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
  ];

  if (race.type === RaceType.SCORE_BASED)
    fields.push({
      name: "Play time limit",
      value: `${(race as RaceScoreBased).playLimit} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title: `📌 ${race.name.toUpperCase()} - new race sign-up form!`,
    fields: [
      ...fields,
      {
        name: "Race organizer",
        value: `<@${race.organizer}>`,
      },
      {
        name: "---",
        value: `Clicking the **JOIN** button below will sign you up for the race!\n\nYou will get a ping from the bot when the race opens - then you can click **START** button whenever you feel ready to go.\n\n---`,
      },
    ],
  };

  return embed;
};
