import {
    raceDisqualify,
    raceFinish,
    raceGiveUp,
    raceReveal,
    raceSendStartFormToParticipantMod,
    racesetupConfirm,
    racesetupJoin,
    raceStart,
} from 'commands/racesetup/interactions';
import {
    raceRateDifficulty,
    raceRateFun,
} from 'commands/racesetup/interactions/playerActions/raceRate';
import { registrationReview } from 'commands/register/interactions';
import { featureVideo } from 'commands/vid/interactions';
import {
    FEATURE_VIDEO,
    RACE_CONFIRMATION,
    RACE_DISQUALIFICATION,
    RaceButton,
    REGISTRATION_REVIEW,
} from 'consts';
import { ButtonInteraction } from 'discord.js';

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

  // Race ratings
  if (interaction.customId.includes(RaceButton.RACE_RATING_FUN)) {
    raceRateFun(interaction);
  }
  if (interaction.customId.includes(RaceButton.RACE_RATING_DIFFICULTY)) {
    raceRateDifficulty(interaction);
  }
};
