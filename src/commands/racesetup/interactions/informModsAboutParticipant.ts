import {
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { getInfoEmbed } from "arcybot";
import dayjs from "dayjs";

import { sdk } from "fetus";
import { getMemberNameById, getModChannel } from "utils";
import { getParticipantRaceTime } from "commands/_utils/race";
import { RACE_DISQUALIFICATION } from "consts";

export const informModsAboutRaceFinish = async (
  raceId: string,
  memberId: string,
) => {
  const modChannel = getModChannel(true);
  if (!modChannel) {
    throw new Error(
      "Could not inform mods about you finishing a race. Tough luck QQ",
    );
  }

  await modChannel.send({
    embeds: [await getParticipantStatsRaceFinish(raceId, memberId)],
    components: [getParticipantRaceFinishActions(raceId, memberId)],
  });
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

const getParticipantStatsRaceFinish = async (
  raceId: string,
  memberId: string,
) => {
  const race = await sdk.getRaceById({ raceId });
  const raceParticipant = await sdk.getRaceParticipantById({
    raceId,
    memberId,
  });
  const { revealDate, startDate, endDate, proofDate } = raceParticipant;

  const totalTimeTimestamp = getParticipantRaceTime(raceParticipant, race);
  const totalTime = dayjs.duration(totalTimeTimestamp).format("m:ss.SSS");

  const fields: APIEmbedField[] = [
    { name: "FINAL TIME", value: totalTime, inline: false },
    { name: "PROOF", value: raceParticipant.proof ?? "—", inline: false },
    {
      name: "Reveal time",
      value: revealDate ? revealDate.toLocaleString() : "—",
      inline: true,
    },
    {
      name: "Start time",
      value: startDate ? startDate.toLocaleString() : "—",
      inline: false,
    },
    {
      name: "Finish time",
      value: endDate ? endDate.toLocaleString() : "—",
      inline: true,
    },
    {
      name: "Proof upload time",
      value: proofDate ? proofDate.toLocaleString() : "—",
      inline: false,
    },
  ];
  const embed: APIEmbed = {
    title: `${race.name ?? "UNKNOWN RACE"} - FINISH - ${
      getMemberNameById(memberId) ?? memberId
    }`,
    fields,
  };
  return embed;
};

const getParticipantRaceFinishActions = (raceId: string, memberId: string) => {
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(
        `${RACE_DISQUALIFICATION}-raceid_${raceId}-memberid_${memberId}`,
      )
      .setLabel("Disqualify")
      .setStyle(ButtonStyle.Danger),
  );
  return buttonBar;
};
