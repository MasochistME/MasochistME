import { getErrorEmbed, getInfoEmbed, getSuccessEmbed, log } from "arcybot";

import { bot, sdk } from "fetus";
import { getModChannel } from "utils";

import {
  fieldsBeforeReveal,
  getRaceStartEmbed,
  getRaceStartButtons,
} from "./__common";

/**
 * Message sent to race participant on DM when the race begins.
 * @param raceId string
 * @return void
 */
export const raceReadyToGo = async (raceId: string): Promise<void> => {
  try {
    const race = await sdk.getRaceById({ raceId });
    const participants = await sdk.getRaceParticipantsList({ raceId });
    const participantsDiscordIds = participants.map(
      participant => participant.discordId,
    );
    log.INFO("Preparing to inform race participants about race starting...");
    getModChannel(true)?.send(
      getInfoEmbed(
        `${race.name.toUpperCase()} - RACE STARTED`,
        `Race successfully started!
        \nI'm sending DMs to all participants now...`,
      ),
    );
    participantsDiscordIds.forEach((userId: string) => {
      bot.botClient.users
        .send(userId, {
          embeds: [
            getRaceStartEmbed(
              race,
              `⏳ ${race.name.toUpperCase()} - PREPARING...`,
              true,
              fieldsBeforeReveal,
            ),
          ],
          components: [getRaceStartButtons(raceId, true, false, false, false)],
        })
        .then(() => {
          getModChannel(true)?.send(
            getSuccessEmbed(
              `${race.name.toUpperCase()} - PARTICIPANT UPDATED`,
              `Participant <@${userId}> got informed about race starting.`,
            ),
          );
          log.INFO(`Discord user ${userId} informed about the race starting!`);
        })
        .catch(() => {
          getModChannel(true)?.send(
            getErrorEmbed(
              `${race.name.toUpperCase()} - PARTICIPANT NOT UPDATED`,
              `Participant <@${userId}> could not get informed about race starting.`,
            ),
          );
          log.WARN(
            `Discord user ${userId} could not be reached about the race starting!`,
          );
        });
    });
  } catch (err: any) {
    getModChannel(true)?.send(
      getErrorEmbed(
        `ERROR - RACE STARTING...`,
        err?.error ?? err?.message ?? err ?? "Something went wrong.",
      ),
    );
    // createError(interaction, err, ErrorAction.REPLY);
    log.WARN(err);
  }
};
