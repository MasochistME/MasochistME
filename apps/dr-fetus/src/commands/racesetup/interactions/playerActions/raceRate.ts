import { Race } from '@masochistme/sdk/dist/v1/types';
import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from 'discord.js';
import { sdk } from 'fetus';

import { RaceButton } from 'consts';
import { createError, ErrorAction, difficultyEmojis, funEmojis } from 'utils';

const STEPS_FUN = 3;
const STEPS_DIFFICULTY = 3;

// TODO get this from database, otherwise it will be hardcoded for all users
let race_fun = 0;
let race_difficulty = 0;

export const raceRate = async (
  interaction: ButtonInteraction,
  raceId: string,
): Promise<void> => {
  const channel = interaction?.channel;
  const memberId = interaction?.user.id;
  if (!channel || !memberId) return;

  try {
    const race = await sdk.getRaceById({ raceId });
    const buttonsFun = new ActionRowBuilder<ButtonBuilder>().addComponents(
      ...new Array(STEPS_FUN).fill(null).map((_, i) => {
        const raceFun = STEPS_FUN - i; // show thumbsup first
        const funEmoji =
          funEmojis.find(game => game.rating === raceFun)?.emoji ??
          funEmojis[0].emoji;
        const id = `${RaceButton.RACE_RATING_FUN}-score_${raceFun}-raceid_${raceId}-memberid_${memberId}`;
        return new ButtonBuilder()
          .setCustomId(id)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(funEmoji);
      }),
    );

    const buttonsDifficulty =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        ...new Array(STEPS_DIFFICULTY).fill(null).map((_, i) => {
          const raceDifficulty = i + 1;
          const difficultyEmoji =
            difficultyEmojis.find(game => game.difficulty === raceDifficulty)
              ?.emoji ?? difficultyEmojis[0].emoji;
          const id = `${RaceButton.RACE_RATING_DIFFICULTY}-score_${raceDifficulty}-raceid_${raceId}-memberid_${memberId}`;
          return new ButtonBuilder()
            .setCustomId(id)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(difficultyEmoji);
        }),
      );

    channel.send({
      embeds: [raceRatingEmbed(race)],
      components: [buttonsFun, buttonsDifficulty],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.SEND);
  }
};

/**
 * Rating race's fun
 */
export const raceRateFun = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const ratingRegex = new RegExp(/(?<=score_)(.*)(?=-raceid)/gim);
    const raceIdRegex = new RegExp(/(?<=raceid_)(.*)(?=-memberid)/gim);
    const memberIdRegex = new RegExp(/(?<=memberid_)(.*)/gim);

    const buttonId = interaction.customId.toLowerCase();

    const rating = buttonId.match(ratingRegex)?.[0] ?? null;
    const raceId = buttonId.match(raceIdRegex)?.[0] ?? null;
    const memberId = buttonId.match(memberIdRegex)?.[0] ?? null;

    if (!raceId || !memberId || !rating)
      throw 'Something went wrong. Just try again, it should work this time.';

    const race = await sdk.getRaceById({ raceId });

    race_fun = Number(rating);

    interaction.update({
      embeds: [raceRatingEmbed(race)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Rating race's difficulty
 */
export const raceRateDifficulty = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const ratingRegex = new RegExp(/(?<=score_)(.*)(?=-raceid)/gim);
    const raceIdRegex = new RegExp(/(?<=raceid_)(.*)(?=-memberid)/gim);
    const memberIdRegex = new RegExp(/(?<=memberid_)(.*)/gim);

    const buttonId = interaction.customId.toLowerCase();

    const raceId = buttonId.match(raceIdRegex)?.[0] ?? null;
    const memberId = buttonId.match(memberIdRegex)?.[0] ?? null;
    const rating = buttonId.match(ratingRegex)?.[0] ?? null;

    if (!raceId || !memberId || !rating)
      throw 'Something went wrong. Just try again, it should work this time.';

    const race = await sdk.getRaceById({ raceId });

    race_difficulty = Number(rating);

    interaction.update({
      embeds: [raceRatingEmbed(race)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

const raceRatingEmbed = (race: Race) => {
  const emojiFun =
    funEmojis.find(game => game.rating === race_fun)?.emojiId ?? '-';
  const emojiDifficulty =
    difficultyEmojis.find(game => game.difficulty === race_difficulty)
      ?.emojiId ?? '-';

  const embed: APIEmbed = {
    title: `Rate race: ${race.name}`,
    fields: [
      {
        name: '---',
        value: `**Link: ${race.downloadLink}**

        You can rate this race's difficulty and and how fun/good the game was.
        Rating can be changed any time in the future.`,
      },
      {
        name: 'Your fun rating',
        value: emojiFun,
        inline: true,
      },
      {
        name: 'Your difficulty rating',
        value: emojiDifficulty,
        inline: true,
      },
    ],
  };

  return embed;
};
