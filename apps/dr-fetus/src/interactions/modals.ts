import { raceGiveUpModal } from "commands/racesetup/interactions/playerActions";
import { raceDisqualifyModal } from "commands/racesetup/interactions/raceDisqualify";
import { DISQUALIFY_PARTICIPANT, RACE_GIVE_UP } from "consts";
import { ModalSubmitInteraction } from "discord.js";

export const handleModals = (interaction: ModalSubmitInteraction) => {
  if (interaction.customId.includes(DISQUALIFY_PARTICIPANT)) {
    raceDisqualifyModal(interaction);
  }
  if (interaction.customId.includes(RACE_GIVE_UP)) {
    raceGiveUpModal(interaction);
  }
};
