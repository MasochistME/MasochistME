import { getInfoEmbed } from "arcybot";
import dayjs from "dayjs";

import { sdk } from "fetus";
import { getMemberNameById, getModChannel } from "utils";
import { getParticipantRaceTime } from "commands/_utils/race";

export const informModsAboutRaceFinish = async (
  raceId: string,
  memberId: string,
) => {
  const race = await sdk.getRaceById({ raceId });
  const raceParticipant = await sdk.getRaceParticipantById({
    raceId,
    memberId,
  });

  const modChannel = getModChannel(true);
  if (!modChannel) {
    throw new Error(
      "Could not inform mods about you finishing a race. Tough luck QQ",
    );
  }
  const totalTimeTimestamp = getParticipantRaceTime(raceParticipant, race);
  const totalTime = dayjs.duration(totalTimeTimestamp).format("m:ss.SSS");
  modChannel.send(
    getInfoEmbed(
      `${race.name ?? "UNKNOWN RACE"} - FINISH - ${
        getMemberNameById(memberId) ?? memberId
      }`,
      `**FINAL TIME:** ${totalTime}\n**PROOF:** ${raceParticipant.proof}\n\n**Revealed at:** ${raceParticipant.revealDate}\n**Started at:** ${raceParticipant.startDate}\n**Finished at:** ${raceParticipant.endDate}\n**Proof upload time:** ${raceParticipant.proofDate}`,
    ),
  );
};

export const informModsAboutRaceForfeit = async (
  raceId: string,
  memberId: string,
) => {
  const race = await sdk.getRaceById({ raceId });
  const raceParticipant = await sdk.getRaceParticipantById({
    raceId,
    memberId,
  });

  const modChannel = getModChannel(true);
  if (!modChannel) {
    throw new Error(
      "Could not inform mods about you forfeiting a race. Tough luck QQ",
    );
  }
  modChannel.send(
    getInfoEmbed(
      `${race.name ?? "UNKNOWN RACE"} - GIVE UP - ${
        getMemberNameById(memberId) ?? memberId
      }`,
      `**Revealed at:** ${raceParticipant.revealDate}\n**Started at:** ${raceParticipant.startDate}\n`,
    ),
  );
};
