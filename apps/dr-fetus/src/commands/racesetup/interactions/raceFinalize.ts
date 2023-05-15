import { RacePlayer } from "@masochistme/sdk/dist/v1/types";
import { getErrorEmbed, log } from "arcybot";
import { Room } from "consts";
import { APIEmbed } from "discord.js";

import { sdk } from "fetus";
import { getChannelByKey, getModChannel } from "utils";
import { getMedal } from "commands/_utils/race";

/**
 * Aggregates and sends the results after race finish.
 * @param raceId string
 * @return void
 */
export const raceFinalize = async (raceId: string): Promise<void> => {
  try {
    log.INFO("Detected a race to end...");

    const participantsOld = await sdk.getRaceParticipantsList({
      raceId,
    });
    const participantsUpdated = await distributeDNF(participantsOld, 0);
    const race = await sdk.getRaceById({ raceId });

    const participated = participantsUpdated.length ?? 0;
    const disqualified =
      participantsUpdated.filter(p => p.disqualified).length ?? 0;
    const finished =
      participantsUpdated.filter(p => !p.dnf && !p.disqualified).length ?? 0;

    const finishedPercentage = Math.round((100 * finished) / participated) ?? 0;
    const disqualifiedPercentage =
      Math.round((100 * disqualified) / participated) ?? 0;

    const leaderboards = (race.leaderboards ?? [])
      .slice(0, 10)
      .map((leader: RacePlayer, index: number) => {
        const isLeader = leader.discordId === race.owner ? "(owner)" : "";
        return `\`\`#${index + 1}\`\`. \`\`${leader.score}\`\` - <@${
          leader.discordId
        }> ${getMedal(index)} ${isLeader}`;
      })
      .join("\n");

    const raceLeaderboardsEmbed: APIEmbed = {
      title: `🏁 ${race.name.toUpperCase()}`,
      ...(race?.icon ? { thumbnail: { url: race.icon } } : {}),
      fields: [
        {
          name: `Leaderboards`,
          value: leaderboards?.length ? leaderboards : "—",
        },
        {
          name: `Link to the game`,
          value: race.downloadLink,
        },
        {
          name: "Statistics",
          value: `- **${participated}** members signed in\n- **${finished}** members finished (**${finishedPercentage}%** completion ratio)\n- **${disqualified}** members were disqualified (**${disqualifiedPercentage}%** disqualification ratio)\n\nTo see participants above 10th place use \`\`/race\`\` command.`,
        },
      ],
    };
    getModChannel(true)?.send({ embeds: [raceLeaderboardsEmbed] });
    getChannelByKey(Room.RACE_PAST)?.send({ embeds: [raceLeaderboardsEmbed] });
    const response = await sdk.updateRaceById({
      raceId,
      race: { isDone: true },
    });
    if (!response.acknowledged) {
      getModChannel(true)?.send(
        getErrorEmbed(
          "ERROR - RACE FINALIZING...",
          `Race **${race?.name}** should ultimately finalize right now, but something fucked up and it could not.`,
        ),
      );
    }
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
  if (!participants.length) return [];
  const participant = participants[index];
  const isDNF =
    !participant?.endDate || !participant?.proof || !participant?.proofDate;
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
