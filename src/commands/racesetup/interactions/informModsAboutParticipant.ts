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
  const { startDate, endDate } = raceParticipant;
  const { downloadGrace, uploadGrace } = race;

  const { fullTime, downloadTime, uploadTime } = getParticipantRaceTime(
    raceParticipant,
    race,
  );
  const totalTime = dayjs.duration(fullTime).format("m:ss.SSS");
  const download = `${downloadTime > downloadGrace ? "⚠️ " : ""}${dayjs
    .duration(downloadTime)
    .format("m:ss.SSS")}`;
  const upload = `${uploadTime > uploadGrace ? "⚠️ " : ""}${dayjs
    .duration(uploadTime)
    .format("m:ss.SSS")}`;

  const fields: APIEmbedField[] = [
    { name: "FINAL TIME", value: totalTime, inline: false },
    {
      name: "Time spent downloading game",
      value: download,
      inline: true,
    },
    {
      name: "Time spent uploading proof",
      value: upload,
      inline: true,
    },
    { name: "PROOF", value: raceParticipant.proof ?? "—", inline: false },
    {
      name: "Start time",
      value: startDate ? dayjs(startDate).format("DD.MM.YYYY, HH:mm:ss") : "—",
      inline: true,
    },
    {
      name: "Finish time",
      value: endDate ? dayjs(startDate).format("DD.MM.YYYY, HH:mm:ss") : "—",
      inline: true,
    },
  ];

  const embed: APIEmbed = {
    title: `${race.name ?? "UNKNOWN RACE"} - FINISH - ${
      getMemberNameById(memberId) ?? memberId
    }`,
    thumbnail: { url: raceParticipant.proof ?? "http://http.cat/404" },
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
