import { ButtonInteraction } from "discord.js";

import {
  REGISTRATION_REVIEW,
  RACE_CONFIRMATION,
  FEATURE_VIDEO,
  RACE_DISQUALIFICATION,
  RaceButton,
} from "consts";
import { registrationReview } from "commands/register/interactions";
import {
  racesetupConfirm,
  racesetupJoin,
  raceReveal,
  raceStart,
  raceFinish,
  raceGiveUp,
  raceDisqualify,
  raceSendStartFormToParticipantMod,
} from "commands/racesetup/interactions";
import { featureVideo } from "commands/vid/interactions";

export const handleButtons = (interaction: ButtonInteraction) => {
  if (interaction.customId.includes(FEATURE_VIDEO)) {
    featureVideo(interaction);
  }
  if (interaction.customId.includes(REGISTRATION_REVIEW)) {
    registrationReview(interaction);
  }
  if (interaction.customId.includes(RACE_CONFIRMATION)) {
    racesetupConfirm(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_JOIN)) {
    racesetupJoin(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_RESEND_JOIN_FORM)) {
    raceSendStartFormToParticipantMod(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_REVEAL)) {
    raceReveal(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_START)) {
    raceStart(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_FINISH)) {
    raceFinish(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_GIVE_UP)) {
    raceGiveUp(interaction);
  }
  if (interaction.customId.includes(RACE_DISQUALIFICATION)) {
    raceDisqualify(interaction);
  }
};
