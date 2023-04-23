import { getSuccessEmbed, DiscordInteraction } from "arcybot";
import { createError, ErrorAction } from "utils";
import { Options } from "./builder";

/**
 * Describe your "role" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
export const role = async (interaction: DiscordInteraction): Promise<void> => {
  await interaction.deferReply();
  const subcommand = interaction.options.getSubcommand();
  if (subcommand === Options.SUBCOMMAND_ASSIGN) roleAssign(interaction);
  if (subcommand === Options.SUBCOMMAND_REMOVE) roleRemove(interaction);
};

/**
 * Describe your "roleassign" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
const roleAssign = async (interaction: DiscordInteraction): Promise<void> => {
  try {
    const roleId = interaction.options.getString(Options.ROLE_SELF, true);
    const role = interaction.guild?.roles.cache.find(
      role => role.id === roleId,
    );
    if (!role) throw "Selected role does not exist.";
    // @ts-ignore
    interaction.member?.roles.add(role);
    interaction.editReply(
      getSuccessEmbed("Success", `You now have **${role.name}** role!`),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

/**
 * Describe your "roleremove" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
const roleRemove = async (interaction: DiscordInteraction): Promise<void> => {
  try {
    const roleId = interaction.options.getString(Options.ROLE_SELF, true);
    const role = interaction.guild?.roles.cache.find(
      role => role.id === roleId,
    );
    if (!role) throw "Selected role does not exist.";
    // @ts-ignore
    interaction.member?.roles.remove(role);
    interaction.editReply(
      getSuccessEmbed(
        "Success",
        `You don't have role **${role.name}** anymore!`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
