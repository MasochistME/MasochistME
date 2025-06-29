import { RaceWithParticipants } from '@masochistme/sdk/dist/v1/types';
import { DiscordInteraction, getInfoEmbed } from 'arcybot';
import { getMedal } from 'commands/_utils/race';
import { isRaceFinished } from 'commands/racesetup/interactions/playerActions/__common';
import { APIEmbed, APIEmbedField } from 'discord.js';
import { sdk } from 'fetus';
import { createError, ErrorAction, splitArrayToChunks } from 'utils';

/**
 * Displays info about an ongoing or soon starting race, if it exists.
 * @param interaction DiscordInteraction
 * @return void
 */
export const race = async (interaction: DiscordInteraction): Promise<void> => {
  await interaction.deferReply();

  const raceId = interaction.options.getString('race', true);
  if (!raceId) throw 'The selected race apparently does not exist.';

  try {
    const race = await sdk.getRaceById({ raceId });

    if (isRaceFinished(race)) getFinishedRaceEmbed(interaction, race);
    else getActiveRaceEmbed(interaction, race);
  } catch (err: unknown) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

/**
 * Creates an embed for the active race
 * @param activeRace Race
 * @return APIEmbed
 */
const getActiveRaceEmbed = (
  interaction: DiscordInteraction,
  race: RaceWithParticipants,
) => {
  const raceParticipants = (race.participants ?? [])
    .map(participant => `● <@${participant.discordId}>`)
    .join('\n ');
  interaction.editReply(
    getInfoEmbed(
      `${race.name}\n→ ${
        race.participants?.length ?? 0
      } registered participants`,
      raceParticipants,
    ),
  );
};

/**
 * Creates an embed for the finished race
 * @param activeRace Race
 * @return APIEmbed
 */
const getFinishedRaceEmbed = (
  interaction: DiscordInteraction,
  race: RaceWithParticipants,
) => {
  const raceParticipants = (race.leaderboards ?? []).map((leader, index) => {
    const isLeader = leader.discordId === race.owner ? '(owner)' : '';
    return `\`\`#${leader.place ?? index + 1}\`\` - \`\`${
      leader.score
    }\`\` - <@${leader.discordId}> ${getMedal(index)} ${isLeader}`;
  });
  const raceParticipantsChunks = splitArrayToChunks(raceParticipants, 5);
  const fields: APIEmbedField[] = raceParticipantsChunks.map(chunk => ({
    name: '---',
    value: chunk.join('\n'),
    inline: false,
  }));
  const embed: APIEmbed = {
    title: `🏁 ${race.name}\n→ ${race.leaderboards?.length ?? 0} finished runs`,
    fields: [
      {
        name: `Link to the game`,
        value: race.downloadLink,
        inline: false,
      },
      ...fields,
    ],
  };

  interaction.editReply({ embeds: [embed] });
};
