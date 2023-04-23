import {
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
  ButtonBuilder,
  ButtonStyle,
  TextBasedChannel,
} from "discord.js";
import dayjs from "dayjs";

import { sdk } from "fetus";
import { getMemberNameById, getModChannel } from "utils";
import { getParticipantRaceTime } from "commands/_utils/race";
import { RACE_DISQUALIFICATION } from "consts";
import { RaceType } from "@masochistme/sdk/dist/v1/types";

export const raceShowPlayerFinishResultSelf = async (
  channel: TextBasedChannel,
  raceId: string,
  memberId: string,
) => {
  channel.send({
    embeds: [await getParticipantStatsRaceFinish(raceId, memberId)],
  });
};

export const raceShowPlayerFinishResultMods = async (
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
    embeds: [await getParticipantStatsRaceFinish(raceId, memberId, true)],
    components: [getParticipantRaceFinishActions(raceId, memberId)],
  });
};

const getParticipantStatsRaceFinish = async (
  raceId: string,
  memberId: string,
  showMore?: boolean,
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
  const totalTime = dayjs.duration(fullTime).format("H:mm:ss.SSS");
  const download = `${downloadTime > downloadGrace * 1000 ? "⚠️ " : ""}${dayjs
    .duration(downloadTime)
    .format("H:mm:ss.SSS")}`;
  const upload = `${uploadTime > uploadGrace * 1000 ? "⚠️ " : ""}${dayjs
    .duration(uploadTime)
    .format("H:mm:ss.SSS")}`;

  const fields: APIEmbedField[] = [
    { name: "FINAL TIME", value: totalTime, inline: false },
    ...(showMore
      ? [
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
        ]
      : []),
    { name: "PROOF", value: raceParticipant.proof ?? "—", inline: false },
    ...(race.type === RaceType.SCORE_BASED
      ? [
          {
            name: "SCORE",
            value: String(raceParticipant.score) ?? "—",
            inline: false,
          },
        ]
      : []),
    {
      name: "Start time",
      value: startDate ? dayjs(startDate).format("DD.MM.YYYY, HH:mm:ss") : "—",
      inline: true,
    },
    {
      name: "Finish time",
      value: endDate ? dayjs(endDate).format("DD.MM.YYYY, HH:mm:ss") : "—",
      inline: true,
    },
  ];

  const embed: APIEmbed = {
    title: `🏁 ${race.name ?? "UNKNOWN RACE"} - FINISH - ${
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
