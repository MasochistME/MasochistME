import { getErrorEmbed, getInfoEmbed } from "arcybot";

import { sdk } from "fetus";
import { getModChannel } from "utils";

/**
 * Aggregates and sends the results after race finish.
 * @param raceId string
 * @returns void
 */
export const raceResults = async (raceId: string): Promise<void> => {
  try {
    const race = await sdk.getRaceById({ raceId });
    const participants = await sdk.getRaceParticipantsList({ raceId });

    const participated = participants.length;
    const finished = participants.filter(p => !p.dnf).length;
    const percentage = Math.round((100 * finished) / participated);

    getModChannel()?.send(
      getInfoEmbed(
        `${race.name.toUpperCase()} - RACE FINISHED`,
        `Race successfully finished.
        \n**${participated}** members participated.
        \n**${finished}** members finished (**${percentage}%** completion ratio).`, // TODO DNFs are set up only on giving up atm
      ),
    );
  } catch (err: any) {
    getModChannel()?.send(
      getErrorEmbed(
        `ERROR - RACE FINISHING...`,
        `Race finished and something fucked up when I was trying to send the results. Sorry :(`,
      ),
    );
  }
};
