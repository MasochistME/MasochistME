import { ButtonInteraction } from "discord.js";

import { REGISTRATION_REVIEW, RACE_CONFIRMATION } from "consts";
import { registrationReview } from "commands/register/interactions";
import { racesetupConfirm } from "commands/racesetup/interactions";

export const handleButtons = (interaction: ButtonInteraction) => {
  if (interaction.customId.includes(REGISTRATION_REVIEW)) {
    registrationReview(interaction);
  }
  if (interaction.customId.includes(RACE_CONFIRMATION)) {
    racesetupConfirm(interaction);
  }
};
