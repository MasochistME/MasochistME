import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from 'discord.js';

import { RaceButton } from 'consts';
import { createError, ErrorAction, tierEmojis } from 'utils';
import { sdk } from 'fetus';
import { Race } from '@masochistme/sdk/dist/v1/types';

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
      ...new Array(5).fill(null).map((_, i) => {
        const raceFun = i + 1;
        const id = `${RaceButton.RACE_RATING_FUN}-score_${raceFun}-raceid_${raceId}-memberid_${memberId}`;
        return new ButtonBuilder()
          .setCustomId(id)
          .setLabel(new Array(raceFun).fill('⭐').join(''))
          .setStyle(ButtonStyle.Secondary);
      }),
    );

    const buttonsDifficulty =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        ...new Array(5).fill(null).map((_, i) => {
          const raceDifficulty = i + 1;
          const difficultyEmoji =
            tierEmojis.find(tier => tier.tier === raceDifficulty)?.emoji ??
            tierEmojis[0].emoji;
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
  const emojiFun = new Array(race_fun).fill('⭐').join('') ?? '-';
  const emojiDifficulty =
    tierEmojis.find(tier => tier.tier === race_difficulty)?.emojiId ?? '-';

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
