import { ButtonInteraction } from "discord.js";

import { REGISTRATION_REVIEW } from "consts";
import { registrationReview } from "commands/register/interactions";

export const handleButtons = (interaction: ButtonInteraction) => {
  if (interaction.customId.includes(REGISTRATION_REVIEW)) {
    registrationReview(interaction);
  }
};
