import { ButtonInteraction } from "discord.js";

import {
  REGISTRATION_REVIEW,
  RACE_CONFIRMATION,
  RACE_JOIN,
  RACE_START,
  RACE_FINISH,
} from "consts";
import { registrationReview } from "commands/register/interactions";
import {
  racesetupConfirm,
  racesetupJoin,
  raceFinish,
  raceStart,
} from "commands/racesetup/interactions";

export const handleButtons = (interaction: ButtonInteraction) => {
  if (interaction.customId.includes(REGISTRATION_REVIEW)) {
    registrationReview(interaction);
  }
  if (interaction.customId.includes(RACE_CONFIRMATION)) {
    racesetupConfirm(interaction);
  }
  if (interaction.customId.includes(RACE_JOIN)) {
    racesetupJoin(interaction);
  }
  if (interaction.customId.includes(RACE_START)) {
    raceStart(interaction);
  }
  if (interaction.customId.includes(RACE_FINISH)) {
    raceFinish(interaction);
  }
};
