import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom createbadge command
 */
export const createbadgeBuilder = new SlashCommandBuilder()
  .setName("createbadge")
  .addStringOption(option =>
    option
      .setName("game")
      .setDescription("Game which gets the badge")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption(option =>
    option
      .setName("name")
      .setDescription("Name of the badge")
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("description")
      .setDescription("Description of the badge")
      .setRequired(true),
  )
  .addNumberOption(option =>
    option
      .setName("points")
      .setDescription("Points that the badge is worth")
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("requirements")
      .setDescription("Requirements for the badge")
      .setRequired(true),
  )
  .addAttachmentOption(option =>
    option
      .setName("image")
      .setDescription("Image for the badge")
      .setRequired(true),
  );

/**
 * Builder for the custom editbadge command
 */
export const editbadgeBuilder = new SlashCommandBuilder()
  .setName("editbadge")
  .addStringOption(option =>
    option
      .setName("badge")
      .setDescription("Badge which will be updated")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption(option =>
    option.setName("name").setDescription("Name of the badge"),
  )
  .addStringOption(option =>
    option.setName("description").setDescription("Badge's description"),
  )
  .addNumberOption(option =>
    option.setName("points").setDescription("Badge's point value"),
  )
  .addStringOption(option =>
    option.setName("requirements").setDescription("Badge requirement"),
  )
  .addAttachmentOption(option =>
    option.setName("image").setDescription("Image for the badge"),
  );

/**
 * Builder for the custom deletebadge command
 */
export const deletebadgeBuilder = new SlashCommandBuilder()
  .setName("deletebadge")
  .addStringOption(option =>
    option
      .setName("badge")
      .setDescription("Badge which will be removed")
      .setRequired(true)
      .setAutocomplete(true),
  );

/**
 * Builder for the custom givebadge command
 */
export const givebadgeBuilder = new SlashCommandBuilder()
  .setName("givebadge")
  .addStringOption(option =>
    option
      .setName("badge")
      .setDescription("Badge to search for")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("member")
      .setDescription("Member to search for")
      .setAutocomplete(true)
      .setRequired(true),
  );

/**
 * Builder for the custom revokebadge command
 */
export const revokebadgeBuilder = new SlashCommandBuilder()
  .setName("revokebadge")
  .addStringOption(option =>
    option
      .setName("badge")
      .setDescription("Badge to search for")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("member")
      .setDescription("Member to search for")
      .setAutocomplete(true)
      .setRequired(true),
  );
