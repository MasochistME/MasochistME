import { RacePlayer } from "@masochistme/sdk/dist/v1/types";
import { getErrorEmbed, getInfoEmbed, log } from "arcybot";

import { sdk } from "fetus";
import { getMemberNameById, getModChannel } from "utils";

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
    const disqualified = participantsUpdated.filter(p => p.disqualified).length;
    const finished = participantsUpdated.filter(
      p => !p.dnf && !p.disqualified,
    ).length;

    const finishedPercentage = Math.round((100 * finished) / participated);
    const disqualifiedPercentage = Math.round(
      (100 * disqualified) / participated,
    );

    //@ts-ignore
    const leaderboards = race.leaderboards
      .slice(0, 9)
      .map(
        (leader: any, index: number) =>
          `\`\`#${index + 1}\`\`. \`\`${
            leader.score
          }\`\` - **${getMemberNameById(leader.discordId)}**`,
      )
      .join("\n");

    getModChannel(true)?.send(
      getInfoEmbed(
        `${race.name.toUpperCase()} - RACE FINISHED!`,
        `**LEADERBOARDS**
        ${leaderboards}
        \n**STATISTICS**
        - **${participated}** members participated
        - **${finished}** members finished (**${finishedPercentage}%** completion ratio)
        - **${disqualified}** members were disqualified (**${disqualifiedPercentage}%** disqualification ratio)`,
      ),
    );
  } catch (err: any) {
    log.WARN(err);
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
