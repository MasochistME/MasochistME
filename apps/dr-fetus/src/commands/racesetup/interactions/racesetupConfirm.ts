import { Race } from '@masochistme/sdk/dist/v1/types';
import { getErrorEmbed } from 'arcybot';
import { getDraftRace, setDraftRace } from 'commands/_utils/race';
import { RACE_CONFIRMATION } from 'consts';
import { ButtonInteraction } from 'discord.js';
import { sdk } from 'fetus';
import { ImgType, log, saveImage } from 'utils';
import { sendRaceJoinForm } from './racesetupJoin';

export const draftRaceData: { race?: Race } = {};

/**
 * Handles buttons for the "racesetup" command.
 * @param interaction
 * @return void
 */
export const racesetupConfirm = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  const originalEmbed = interaction.message.embeds[0].data;

  if (interaction.customId === `${RACE_CONFIRMATION}_CONFIRM`) {
    try {
      const newRaceId = await saveRaceDetails();
      const originalIcon = originalEmbed.thumbnail?.proxy_url;
      if (originalIcon) {
        const savedRaceIcon = await saveImage(
          originalIcon,
          newRaceId,
          ImgType.ICON_RACE,
        );
        // We don't throw if this does not work because season icon is not something crucial
        await sdk.updateRaceById({
          raceId: newRaceId,
          race: { icon: savedRaceIcon },
        });
      }

      sendRaceJoinForm(newRaceId);
      interaction.update({
        embeds: [
          { ...originalEmbed, title: `✅ Race draft confirmed and created!` },
        ],
        components: [],
      });
    } catch (err: unknown) {
      interaction.reply(
        getErrorEmbed(
          'Something went wrong',
          'Could not save race. Please try again later.',
        ),
      );
      log.ERROR(err);
      return;
    }
  }
  if (interaction.customId === `${RACE_CONFIRMATION}_REJECT`) {
    interaction.update({
      embeds: [{ ...originalEmbed, title: `❌ Race draft rejected!` }],
      components: [],
    });
  }
};

/**
 * Saves the new race details to database.
 * @param interaction ButtonInteraction
 */
const saveRaceDetails = async (): Promise<string> => {
  const race = getDraftRace();
  if (!race) throw new Error('No draft race data found.');

  const response = await sdk.createRace({ race });
  if (!response.acknowledged)
    throw new Error('Database refused to save draft race data.');
  setDraftRace();
  return String(response.insertedId);
};
