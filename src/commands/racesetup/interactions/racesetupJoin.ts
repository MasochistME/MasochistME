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
import dayjs from "dayjs";

import { sdk } from "fetus";
import { RaceButton, RoleOption, Room } from "consts";
import { getChannelByKey, getDiscordTimestamp, cenzor, getOption } from "utils";

import { raceSendStartFormToParticipantSelf } from "./playerActions";

export const racesetupJoin = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    await sdk.getMemberById({
      discordId: interaction.user.id,
    });
  } catch (err) {
    interaction.reply(
      getErrorEmbed(
        "You need to register to be able to join a race",
        `Your Discord account is not connected to the Masochist.ME profile.
          \nTo be able to join the race, please register first with the \`/register\` command and wait for the approval from mods.`,
        true,
      ),
    );
    return;
  }

  const raceId = interaction.customId.replace(`${RaceButton.RACE_JOIN}-`, "");
  const race = await sdk.getRaceById({ raceId });

  if (race.owner === interaction.user.id) {
    interaction.reply(
      getErrorEmbed(
        "You are the owner of this race",
        "You cannot participate in a race that you are an owner of.",
        true,
      ),
    );
    return;
  }

  const isRaceEnded = dayjs(race.endDate).diff(new Date()) <= 0;
  if (isRaceEnded) {
    interaction.reply(
      getErrorEmbed(
        "This race has ended",
        "You cannot join race which has already ended!",
        true,
      ),
    );
    return;
  }
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

  const getUpdatedParticipantsValue = () => {
    const updatedValue = `${participants.value} <@${interaction.user.id}>`;
    if (updatedValue.length >= 300) {
      if (participants.value.endsWith("and more...")) return participants.value;
      return `${participants.value} and more...`;
    }
    return `${participants.value} <@${interaction.user.id}>`;
  };

  const updatedParticipants = {
    ...participants,
    value: getUpdatedParticipantsValue(),
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
    interaction.user
      .send(
        getInfoEmbed(
          "You joined the race!",
          `Congratulations, you successfully joined the **${race.name}** race!\nYou'll get pinged by bot when the race opens - then you can click **START** whenever you feel ready to go.
        `,
        ),
      )
      .then(() => {
        interaction.update({ embeds: [updatedEmbed] });
      })
      .catch(() => {
        const embed: APIEmbed = {
          title: `❌ Bot could not send you a confirmation DM`,
          fields: [
            {
              name: "___",
              value: `You joined the race but Dr Fetus bot could not send you a confirmation DM. That's an issue since you won't be able to get race details when it starts.`,
            },
            {
              name: "How to fix it?",
              value: `Check https://www.notion.so/Races-6fe4971a56194039b85807adf2077262#9edac186e61a4be38bac0e4a046ba39bv - we have a list of possible reasons and fixes there.`,
            },
          ],
        };
        interaction.reply({ embeds: [embed], ephemeral: true });
      });

    if (race.isActive) raceSendStartFormToParticipantSelf(interaction);
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
export const sendRaceJoinForm = async (raceId: string) => {
  const newRace = await sdk.getRaceById({ raceId });
  const channel = getChannelByKey(Room.RACE_CURRENT);
  const roleRace = getOption<string>(RoleOption.ROLE_RACE);

  await channel?.send({
    embeds: [await getNewRaceCensoredEmbed(newRace)],
    components: [getRaceJoinButton(raceId)],
    // allowedMentions: { parse: ["roles"] },
  });
  await channel?.send({
    content: `<@&${roleRace}>`,
    // allowedMentions: { parse: ["roles"] },
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
const getNewRaceCensoredEmbed = async (race: Race): Promise<APIEmbed> => {
  const season = race.season
    ? await sdk.getSeasonById({ seasonId: race.season })
    : null;
  const seasonName = season?.name ?? "None";
  const roleRace = getOption<string>(RoleOption.ROLE_RACE);

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
      value: getDiscordTimestamp(race.startDate),
      inline: true,
    },
    {
      name: "Finish time",
      value: getDiscordTimestamp(race.endDate),
      inline: true,
    },
    {
      name: "Download link",
      value: cenzor(race.downloadLink),
    },
    ...(race.type === RaceType.SCORE_BASED
      ? [
          {
            name: "Download grace period",
            value: `${race.downloadGrace} s`,
            inline: true,
          },
        ]
      : []),
    {
      name: "Screenshot upload grace period",
      value: `${race.uploadGrace} s`,
      inline: true,
    },
    { name: "Race type", value: race.type, inline: true },
  ];

  if (race.type === RaceType.SCORE_BASED)
    fields.push({
      name: "Play time limit",
      value: `${(race as RaceScoreBased).playLimit / 60} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title: `📌 ${race.name.toUpperCase()} - new race sign-up form!`,
    fields: [
      ...fields,
      {
        name: "---",
        value: `<@&${roleRace}> clicking the **JOIN** button below will sign you up for the race!\n\nYou'll get pinged by bot when the race opens - then you can click **START** whenever you feel ready to go.`,
      },
      {
        name: "Season",
        value: seasonName,
        inline: true,
      },
      {
        name: "Race owner",
        value: `<@${race.owner}>`,
        inline: true,
      },
    ],
  };

  return embed;
};
