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

  if (action === ErrorAction.REPLY) {
    interaction.reply(
      getErrorEmbed(
        title ?? "Error",
        err?.error ?? err?.message ?? message ?? err ?? "Something fucked up.",
        true,
      ),
    );
  }

  if (action === ErrorAction.EDIT) {
    interaction.editReply(
      getErrorEmbed(
        title ?? "Error",
        err?.error ?? err?.message ?? message ?? err ?? "Something fucked up.",
        true,
      ),
    );
  }
};
