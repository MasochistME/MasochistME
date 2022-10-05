import { ButtonInteraction } from "discord.js";

import { registrationReview, REGISTRATION_REVIEW } from "./registrationReview";

export const handleButton = (interaction: ButtonInteraction) => {
  if (interaction.customId.includes(REGISTRATION_REVIEW)) {
    registrationReview(interaction);
  }
};
