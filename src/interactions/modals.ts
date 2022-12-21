import { ModalSubmitInteraction } from "discord.js";

import { DISQUALIFY_PARTICIPANT } from "consts";
import { raceDisqualifyModal } from "commands/racesetup/interactions/raceDisqualify";

export const handleModals = (interaction: ModalSubmitInteraction) => {
  if (interaction.customId.includes(DISQUALIFY_PARTICIPANT)) {
    raceDisqualifyModal(interaction);
  }
};
