import { getInfoEmbed } from "arcybot";
import { sdk } from "fetus";
import { getMemberNameById, getModChannel } from "utils";

export const informModsAboutRaceFinish = async (
  raceId: string,
  memberId: string,
) => {
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
  modChannel.send(
    getInfoEmbed(
      `Participant ${getMemberNameById(memberId) ?? memberId} finished a race`,
      `**Started at:** ${raceParticipant.startDate}\n**Finished at:** ${raceParticipant.endDate}\n**Proof upload time:** ${raceParticipant.proofDate}\n**Screenshot proof:** ${raceParticipant.proof}`,
    ),
  );
};
