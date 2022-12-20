import { RacePlayer } from "@masochistme/sdk/dist/v1/types";
import { getErrorEmbed, getInfoEmbed } from "arcybot";

import { sdk } from "fetus";
import { getModChannel } from "utils";

/**
 * Aggregates and sends the results after race finish.
 * @param raceId string
 * @return void
 */
export const raceFinalize = async (raceId: string): Promise<void> => {
  try {
    const race = await sdk.getRaceById({ raceId });
    const participantsOld = await sdk.getRaceParticipantsList({
      raceId,
    });

    const participantsUpdated = await distributeDNF(participantsOld, 0);

    const participated = participantsUpdated.length;
    const finished = participantsUpdated.filter(p => !p.dnf).length;
    const percentage = Math.round((100 * finished) / participated);

    getModChannel(true)?.send(
      getInfoEmbed(
        `${race.name.toUpperCase()} - RACE FINISHED`,
        `Race successfully finished.
        \n**${participated}** members participated.
        \n**${finished}** members finished (**${percentage}%** completion ratio).`,
      ),
    );
  } catch (err: any) {
    getModChannel(true)?.send(
      getErrorEmbed(
        `ERROR - RACE FINISHING...`,
        `Race finished and something fucked up when I was trying to send the results. Sorry :(`,
      ),
    );
  }
};

const distributeDNF = async (
  participants: RacePlayer[],
  index: number,
): Promise<RacePlayer[]> => {
  const participant = participants[index];
  const isDNF =
    !participant.endDate || !participant.proof || !participant.proofDate;
  if (isDNF) {
    await sdk.updateRaceByParticipantId({
      raceId: participant.raceId,
      memberId: participant.discordId,
      update: { dnf: true },
    });
  }
  if (participants[index + 1]) {
    return await distributeDNF(participants, index + 1);
  }
  const participantsUpdated = await sdk.getRaceParticipantsList({
    raceId: participant.raceId,
  });
  return participantsUpdated;
};
