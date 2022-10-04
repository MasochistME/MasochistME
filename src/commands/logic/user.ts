import { DiscordInteraction } from "arcybot";

import { cache } from "fetus";
import { getErrorEmbed, getSuccessEmbed, isLink } from "utils";

/**
 * Sends a video to the designated channel.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const vid = async (interaction: DiscordInteraction): Promise<void> => {
  const link = interaction.options.getString("link", true);
  const channelVid = cache.options.find(
    option => option.option === "room_vid",
  )?.value;

  if (!isLink(link)) {
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

  const channel = interaction.guild?.channels.cache.find(
    ch => ch.id === channelVid,
  );

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
    channel?.send(`${link} - ${interaction.member?.user.username}`);
    interaction.reply(
      getSuccessEmbed(
        "Video sent!",
        "It is now reposted to the video channel.",
        true,
      ),
    );
  } catch (err: any) {
    interaction.reply(
      getErrorEmbed("Something fucked up", err.message ?? err, true),
    );
  }
};
