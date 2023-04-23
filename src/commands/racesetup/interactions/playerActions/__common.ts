import {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import dayjs from "dayjs";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v1/types";

import { RaceButton } from "consts";
import { getDiscordTimestamp, cenzor } from "utils";

export const fieldsBeforeReveal = [
  {
    name: "---",
    value: `1. Once you click the **REVEAL** button, the grace time begins. It's a short time of undisclosured length for downloading and starting the game - it will get substracted from your final time.
  \n2. After the game is downloaded and you are ready to start, click the **START** button. **Remember to do this or your race will get forfeited!**
  \nGood luck! You can start the race whenever it's convenient for you within the time limit.`,
  },
];

export const fieldsAfterReveal = [
  {
    name: "---",
    value: `**The grace period has started** - it will get substracted from your final score while you download the game.
  \nWhen you are ready to start click the **START** button. **Remember to do this or the entire grace period will be added to your final time!**`,
  },
];

/**
 * Creates a row of buttons for the user to manage their race.
 * @param raceId string
 * @param canFinish boolean
 * @return ActionRowBuilder<ButtonBuilder>
 */
export const getRaceStartButtons = (
  raceId: string,
  isRevealButtonEnabled: boolean,
  isStartButtonEnabled: boolean,
  isFinishButtonEnabled: boolean,
  isGiveUpButtonEnabled: boolean,
) => {
  const buttonRevealRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_REVEAL}-${raceId}`)
    .setLabel("REVEAL")
    .setStyle(
      isRevealButtonEnabled ? ButtonStyle.Primary : ButtonStyle.Secondary,
    )
    .setDisabled(!isRevealButtonEnabled);
  const buttonStartRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_START}-${raceId}`)
    .setLabel("START")
    .setStyle(
      isStartButtonEnabled ? ButtonStyle.Success : ButtonStyle.Secondary,
    )
    .setDisabled(!isStartButtonEnabled);
  const buttonFinishRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_FINISH}-${raceId}`)
    .setLabel("FINISH")
    .setStyle(
      isFinishButtonEnabled ? ButtonStyle.Primary : ButtonStyle.Secondary,
    )
    .setDisabled(!isFinishButtonEnabled);
  const buttonGiveUpRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_GIVE_UP}-${raceId}`)
    .setLabel("GIVE UP")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(!isGiveUpButtonEnabled);
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttonRevealRace,
    buttonStartRace,
    buttonFinishRace,
    buttonGiveUpRace,
  );
  return buttonBar;
};

/**
 * Creates an embed for user to start and finish the race
 * @param race Race
 * @param isCenzored boolean
 * @return APIEmbed
 */
export const getRaceStartEmbed = (
  race: Race,
  title: string,
  isCenzored: boolean,
  newFields?: APIEmbedField[],
): APIEmbed => {
  const fields: APIEmbedField[] = [
    {
      name: "Instructions",
      value: race.instructions,
    },
    {
      name: "Objectives",
      value: isCenzored ? cenzor(race.objectives) : race.objectives,
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
      value: isCenzored ? cenzor(race.downloadLink) : race.downloadLink,
    },
    {
      name: "Screenshot upload grace period",
      value: `${race.uploadGrace} s`,
      inline: true,
    },
  ];

  if (race.type === RaceType.SCORE_BASED)
    fields.push({
      name: "Play time limit",
      value: `${(race as RaceScoreBased).playLimit / 60} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title,
    ...(!isCenzored && race.icon && { thumbnail: { url: race.icon } }),
    fields: [
      ...fields,
      {
        name: "Race owner",
        value: `<@${race.owner}>`,
        inline: true,
      },
      ...(newFields ?? []),
    ],
  };

  return embed;
};
