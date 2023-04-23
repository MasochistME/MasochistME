import { DiscordInteraction, getErrorEmbed, log } from "arcybot";
import { ButtonInteraction, ModalSubmitInteraction } from "discord.js";

export enum ErrorAction {
  EDIT = "edit",
  REPLY = "reply",
  SEND = "send",
}

export const createError = (
  interaction: DiscordInteraction | ButtonInteraction | ModalSubmitInteraction,
  err: any,
  action: ErrorAction,
  title?: string,
  message?: string,
) => {
  log.WARN(err);

  const errorTitle = title ?? "Error";
  const getErrorContent = () => {
    if (err?.error?.length) return err.error;
    if (err?.message?.length) return err?.message;
    if (message) return message;
    if (err) return err;
    return "Something fucked up.";
  };

  if (action === ErrorAction.REPLY) {
    interaction.reply(getErrorEmbed(errorTitle, getErrorContent(), true));
  }
  if (action === ErrorAction.EDIT) {
    interaction.editReply(getErrorEmbed(errorTitle, getErrorContent()));
  }
  if (action === ErrorAction.SEND) {
    interaction.channel?.send(getErrorEmbed(errorTitle, getErrorContent()));
  }
};
