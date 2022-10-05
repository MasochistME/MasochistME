import { DiscordInteraction, getSuccessEmbed } from "arcybot";

export const profile = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  interaction.reply(
    getSuccessEmbed("Something went wrong :C", "Try again later.", true),
  );
};
