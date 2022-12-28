import { DiscordInteraction, getErrorEmbed, getSuccessEmbed } from "arcybot";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ObjectId } from "mongodb";
import { FeaturedType } from "@masochistme/sdk/dist/v1/types";

import {
  createError,
  ErrorAction,
  getChannelById,
  getOption,
  isLink,
  getIsUserRegistered,
} from "utils";
import { FEATURE_VIDEO, Room } from "consts";
import { sdk } from "fetus";
import { Options } from "./builder";

/**
 * Sends a video to the designated channel.
 * @param interaction DiscordInteraction
 * @return void
 */
export const vid = async (interaction: DiscordInteraction): Promise<void> => {
  const videoLink = interaction.options.getString(Options.VIDEO_LINK, true);
  const gameLink =
    interaction.options.getString(Options.GAME_LINK, false) ?? null;
  const description =
    interaction.options.getString(Options.DESCRIPTION, false) ?? null;
  const game = interaction.options.getString(Options.GAME, true);
  const channelVid = getOption<string>(Room.VID);

  if (!isLink(videoLink)) {
    interaction.reply(
      getErrorEmbed("Wrong link", "_This_ is not a link.", true),
    );
    return;
  }
  if (!channelVid) {
    interaction.reply(
      getErrorEmbed("Wrong channel", "I can't find the video channel.", true),
    );
    return;
  }

  const channel = getChannelById(interaction, channelVid);

  if (!channel) {
    interaction.reply(
      getErrorEmbed(
        "Wrong channel",
        "I don't have access to this channel, you dumbass.",
        true,
      ),
    );
    return;
  }
  if (!channel.isTextBased()) {
    interaction.reply(
      getErrorEmbed(
        "Wrong channel",
        "You can't send a link to a non-text based channel, dumbass.",
        true,
      ),
    );
    return;
  }

  try {
    const isUserRegistered = await getIsUserRegistered(interaction.user.id);
    const isGameId = game && !Number.isNaN(Number(game));
    const gameId = isGameId ? Number(game) : null;
    const gameTitle = isGameId ? null : game;

    const featuredVideo = {
      type: FeaturedType.VIDEO,
      memberId: interaction.user.id,
      description,
      gameId,
      gameTitle,
      gameLink,
      link: videoLink,
    };
    const postFeatured = await sdk.createFeatured({ featured: featuredVideo });
    // Only members who connected their Discord account to MasochistME one can have their posts featured
    const components = isUserRegistered
      ? [getFeatureVideoButtons(postFeatured?.insertedId)]
      : [];
    const interactionReplyContent = `It is now reposted to the video channel. ${
      !isUserRegistered
        ? "\n\n⚠️ **You don't have your Discord account connected to your MasochistME account, so the moderators won't be able to feature your video.**\n\nTo have a possibility of having your videos posted to MasochistME featured section, use the `/register` command."
        : ""
    }`;

    channel?.send({
      content: `${videoLink}\n_${description ?? ""} ~<@${
        interaction.user.id
      }>_`,
      components,
    });

    interaction.reply(
      getSuccessEmbed("Video sent!", interactionReplyContent, true),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Creates a row of buttons - approve and reject - for the mod review of user registration
 * @return ActionRowBuilder<ButtonBuilder>
 */
const getFeatureVideoButtons = (insertedId?: ObjectId) => {
  const customId = insertedId
    ? `${FEATURE_VIDEO}_${insertedId}`
    : FEATURE_VIDEO;
  const buttonFeature = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel("FEATURE VIDEO (mod only)")
    .setStyle(ButtonStyle.Primary);
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttonFeature,
  );

  return buttonBar;
};
