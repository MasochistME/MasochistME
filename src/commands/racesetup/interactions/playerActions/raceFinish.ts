import { ButtonInteraction, Message } from "discord.js";
import dayjs from "dayjs";
import { getInfoEmbed } from "arcybot";
import { Race, RaceType } from "@masochistme/sdk/dist/v1/types";

import { sdk } from "fetus";
import { RaceButton } from "consts";
import { ImgType, saveImage } from "utils/saveImage";
import { awaitMessage, getUTCDate, createError, ErrorAction } from "utils";
import {
  raceShowPlayerFinishResultMods,
  raceShowPlayerFinishResultSelf,
} from "./infoRaceParticipant";

import { getRaceStartEmbed, getRaceStartButtons } from "./__common";

/**
 * Response to race participant clicking the FINISH button.
 * @param interaction
 * @return void
 */
export const raceFinish = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_FINISH}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });
    if (race.isDone)
      throw "This race is finished. You cannot participate anymore.";

    const participant = await sdk.getRaceParticipantById({
      raceId,
      memberId: interaction.user.id,
    });
    if (participant.dnf || participant.disqualified)
      throw "You are already disqualified from this race.";
    const startDate = participant?.startDate;
    const endDate = new Date();
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { endDate },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    const tempFields =
      race.type === RaceType.TIME_BASED
        ? [
            {
              name: "Your start time",
              value: getUTCDate(startDate),
              inline: true,
            },
            {
              name: "Your finish time",
              value: getUTCDate(endDate),
              inline: true,
            },
          ]
        : [];
    interaction
      .update({
        embeds: [
          getRaceStartEmbed(
            race,
            `☑️ ${race.name.toUpperCase()} - FINISHED`,
            false,
            tempFields,
          ),
        ],
        components: [getRaceStartButtons(raceId, false, false, false, false)],
        fetchReply: true,
      })
      .then(() => {
        raceUploadProof(interaction, race);
      });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

const raceUploadProof = async (
  interaction: ButtonInteraction,
  race: Race,
): Promise<void> => {
  const channel = interaction?.channel;
  if (!channel) return;

  channel.send(
    getInfoEmbed(
      "Upload the proof",
      `Please post a proof of you finishing the race below this message **within the next ${race.uploadGrace} seconds**.
      \nIf you exceed that time it's fine, but every second above the grace period will be added to your final score.`,
    ),
  );
  try {
    const raceId = String(race._id);
    const memberId = interaction.user.id;
    const proofFilter = (msg: Message) =>
      msg.author.id === memberId && !!msg.attachments.size;
    const time = dayjs(race.endDate).diff(new Date());
    let score = 0;

    // Collect a proof from user.
    const proofCollection = await awaitMessage<ButtonInteraction>(
      interaction,
      proofFilter,
      time,
    );
    const proof = proofCollection?.attachments?.first()?.proxyURL;
    if (!proof)
      throw new Error(
        "I could not collect a proof. Reason unknown. Probably something fucked up.",
      );

    // Collect a score from user.
    if (race.type === RaceType.SCORE_BASED) {
      channel.send(
        getInfoEmbed("Upload your score", `Please post your final score.`),
      );
      const proofFilter = (msg: Message) =>
        msg.author.id === memberId && !Number.isNaN(Number(msg.content));
      const scoreCollection = await awaitMessage<ButtonInteraction>(
        interaction,
        proofFilter,
        time,
      );
      score = Number(scoreCollection?.content);
      if (!score)
        throw new Error(
          "I could not collect your score. Reason unknown. Probably something fucked up.",
        );
    }

    const fixedImage = await saveImage(
      proof,
      `race-${raceId}_player-${memberId}`,
      ImgType.RACE,
    );
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId,
      update: {
        proof: fixedImage,
        proofDate: new Date(),
        ...(score ? { score } : {}),
      },
    });

    if (!acknowledged)
      throw new Error(
        "Could not save your proof. Reason unknown but probably database died or something.",
      );

    raceShowPlayerFinishResultMods(raceId, memberId);
    raceShowPlayerFinishResultSelf(channel, raceId, memberId);
  } catch (err: any) {
    createError(interaction, err, ErrorAction.SEND);
  }
};
