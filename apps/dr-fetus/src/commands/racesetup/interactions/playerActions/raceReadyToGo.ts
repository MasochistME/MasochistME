import {
  ActionRowBuilder,
  APIEmbed,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import { getErrorEmbed, getInfoEmbed, getSuccessEmbed, log } from "arcybot";

import { bot, sdk } from "fetus";
import { getModChannel } from "utils";
import { RaceButton } from "consts";
import { getDMChannel, createError, ErrorAction } from "utils";

import {
  fieldsBeforeReveal,
  getRaceStartEmbed,
  getRaceStartButtons,
} from "./__common";
import { Race } from "@masochistme/sdk/dist/v1/types";

/**
 * Message sent to race participant on DM when the race begins.
 * @param raceId string
 * @return void
 */
export const raceReadyToGo = async (raceId: string): Promise<void> => {
  try {
    const race = await sdk.getRaceById({ raceId });
    const participants = await sdk.getRaceParticipantsList({ raceId });
    const participantsDiscordIds = participants.map(
      participant => participant.discordId,
    );
    log.INFO("Preparing to inform race participants about race starting...");
    getModChannel(true)?.send(
      getInfoEmbed(
        `${race.name.toUpperCase()} - RACE STARTED`,
        `Race successfully started!
        \nI'm sending DMs to all participants now...`,
      ),
    );
    participantsDiscordIds.forEach((memberId: string) => {
      raceSendStartFormToParticipant(String(race._id), memberId);
    });
  } catch (err: any) {
    getModChannel(true)?.send(
      getErrorEmbed(
        `ERROR - RACE STARTING...`,
        err?.error ?? err?.message ?? err ?? "Something went wrong.",
      ),
    );
    // createError(interaction, err, ErrorAction.REPLY);
    log.WARN(err);
  }
};

/**
 * When user triggers sending the join message themselves
 */
export const raceSendStartFormToParticipantSelf = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  const memberId = interaction.user.id;
  const raceId = interaction.customId.replace(`${RaceButton.RACE_JOIN}-`, "");

  try {
    raceSendStartFormToParticipant(raceId, memberId);
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * When a mod triggers resending the join message to participant
 */
export const raceSendStartFormToParticipantMod = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  const raceIdRegex = new RegExp(/(?<=raceid_)(.*)(?=-)/gim);
  const memberIdRegex = new RegExp(/(?<=memberid_)(.*)/gim);
  const buttonId = interaction.customId.toLowerCase();
  const raceId = buttonId.match(raceIdRegex)?.[0] ?? null;
  const memberId = buttonId.match(memberIdRegex)?.[0] ?? null;

  if (!raceId || !memberId)
    throw "Something went wrong. Just try again, it should work this time.";

  try {
    raceSendStartFormToParticipant(raceId, memberId);
    interaction.update({
      embeds: [
        {
          title: "❌ Attempt to reach member",
          description: `<@${interaction.user.id}> attempted to reach <@${memberId}>...`,
        },
      ],
      components: [],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Handles situation where member joins the race after it already started.
 * @param interaction ButtonInteraction
 * @return void
 */
const raceSendStartFormToParticipant = async (
  raceId: string,
  memberId: string,
): Promise<void> => {
  const race = await sdk.getRaceById({ raceId });
  bot.botClient.users
    .send(memberId, {
      embeds: [
        getRaceStartEmbed(
          race,
          `⏳ ${race.name.toUpperCase()} - PREPARING...`,
          true,
          fieldsBeforeReveal,
        ),
      ],
      components: [getRaceStartButtons(raceId, true, false, false, false)],
    })
    .then(() => {
      raceParticipantsInformedSuccess(race, memberId);
    })
    .catch(() => {
      raceParticipantsInformedError(race, memberId);
    });
};

/**
 * Sends a message to mods channel that participant got DM about race starting.
 * @param race Race
 * @param userId string
 * @return void
 */
const raceParticipantsInformedSuccess = (race: Race, userId: string) => {
  getModChannel(true)?.send(
    getSuccessEmbed(
      `${race.name.toUpperCase()} - PARTICIPANT INFORMED`,
      `Participant <@${userId}> got informed about race starting.`,
    ),
  );
  log.INFO(`Discord user ${userId} informed about the race starting!`);
};

/**
 * Sends a message to mods channel that participant could not get reached.
 * @param race Race
 * @param userId string
 * @return void
 */
const raceParticipantsInformedError = (race: Race, memberId: string) => {
  const raceId = String(race._id);
  const embed: APIEmbed = {
    title: `❌ ${race.name.toUpperCase()} - PARTICIPANT NOT INFORMED`,
    fields: [
      {
        name: "---",
        value: `Participant <@${memberId}> could not get informed about race starting.`,
      },
      {
        name: "How to fix it?",
        value: `Check https://www.notion.so/Races-6fe4971a56194039b85807adf2077262#9edac186e61a4be38bac0e4a046ba39bv - we have a list of possible reasons and fixes there.`,
      },
    ],
  };
  getModChannel(true)?.send({
    embeds: [embed],
    components: [getResendRaceStartFormButton(raceId, memberId)],
  });
  log.WARN(
    `Discord user ${memberId} could not be reached about the race starting!`,
  );
};

const getResendRaceStartFormButton = (raceId: string, memberId: string) => {
  const buttonResend = new ButtonBuilder()
    .setCustomId(
      `${RaceButton.RACE_RESEND_JOIN_FORM}-raceid_${raceId}-memberid_${memberId}`,
    )
    .setLabel("Resend race DM to this player")
    .setStyle(ButtonStyle.Primary);
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttonResend,
  );
  return buttonBar;
};
