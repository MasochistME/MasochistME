import { DiscordInteraction, getErrorEmbed, log } from "arcybot";
import { ButtonInteraction } from "discord.js";

export enum ErrorAction {
  EDIT = "edit",
  REPLY = "reply",
}

export const createError = (
  interaction: DiscordInteraction | ButtonInteraction,
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
    return "Something fucked up.";
  };

  if (action === ErrorAction.REPLY) {
    interaction.reply(getErrorEmbed(errorTitle, getErrorContent(), true));
  }
  if (action === ErrorAction.EDIT) {
    interaction.editReply(getErrorEmbed(errorTitle, getErrorContent()));
  }
};
