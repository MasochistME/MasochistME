import { Race, RaceRating } from '@masochistme/sdk/dist/v1/types';
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
      embeds: [raceRatingEmbed(race, { rating: null, difficulty: null })],
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

    const userRating = buttonId.match(ratingRegex)?.[0] ?? null;
    const raceId = buttonId.match(raceIdRegex)?.[0] ?? null;
    const memberId = buttonId.match(memberIdRegex)?.[0] ?? null;

    if (!raceId || !memberId || !userRating)
      throw 'Something went wrong. Just try again, it should work this time.';

    const raceRating = {
      discordId: interaction.user.id,
      raceId,
      rating: Number(userRating)
    }

    const race = await sdk.getRaceById({ raceId });    
    const { difficulty, rating } = await sdk.updateRaceRatingById({ raceId, raceRating })

    interaction.update({
      embeds: [raceRatingEmbed(race, { difficulty, rating })],
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
    const userRating = buttonId.match(ratingRegex)?.[0] ?? null;

    if (!raceId || !memberId || !userRating)
      throw 'Something went wrong. Just try again, it should work this time.';

    const raceRating = {
      discordId: interaction.user.id,
      raceId,
      difficulty: Number(userRating)
    }

    const race = await sdk.getRaceById({ raceId });
    const { difficulty, rating } = await sdk.updateRaceRatingById({ raceId, raceRating })

    interaction.update({
      embeds: [raceRatingEmbed(race, { difficulty, rating })],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

const raceRatingEmbed = (race: Race, responseRating: Pick<RaceRating, 'rating'|'difficulty'>) => {
  const { difficulty, rating } = responseRating

  const emojiFun =
    funEmojis.find(game => game.rating === rating)?.emojiId ?? '-';
  const emojiDifficulty =
    difficultyEmojis.find(game => game.difficulty === difficulty)
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
