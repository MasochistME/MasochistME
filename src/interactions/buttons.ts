import { ButtonInteraction } from "discord.js";

import { REGISTRATION_REVIEW, RACE_CONFIRMATION, RaceButton } from "consts";
import { registrationReview } from "commands/register/interactions";
import {
  racesetupConfirm,
  racesetupJoin,
  raceReveal,
  raceStart,
  raceFinish,
  raceGiveUp,
} from "commands/racesetup/interactions";

export const handleButtons = (interaction: ButtonInteraction) => {
  if (interaction.customId.includes(REGISTRATION_REVIEW)) {
    registrationReview(interaction);
  }
  if (interaction.customId.includes(RACE_CONFIRMATION)) {
    racesetupConfirm(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_JOIN)) {
    racesetupJoin(interaction);
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
};
