import {
  getSuccessEmbed,
  getErrorEmbed,
  DiscordInteraction,
  log,
} from "arcybot";

/**
 * Describe your "template" command here.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const template = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const stringoption = interaction.options.getString("stringoption", true);

  try {
    interaction.editReply(
      getSuccessEmbed("Success", `Your command worked! ${stringoption}`),
    );
  } catch (err: any) {
    interaction.editReply(getErrorEmbed("Error", "Your command did not work!"));
    log.WARN(err);
  }
};
