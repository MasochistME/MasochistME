import Discord from "discord.js";
import axios from "axios";
import { orderBy } from "lodash";
import { createEmbed } from "utils/helpers";
import { log } from "utils/log";

export const badgelist = async (msg: Discord.Message): Promise<void> => {
  let content = "";
  const url = "http://localhost:3002/api/badges";
  try {
    const badges = await axios.get(url);
    const filteredBadges = orderBy(badges?.data, ["gameId"], ["asc"]);
    filteredBadges.map(badge => {
      const newBadge = `\`\`${badge._id}\`\` - ${badge.name.toUpperCase()} - ${
        badge.description
      }\n`;
      if (`${content}${newBadge}`.length >= 1024) {
        const embed = createEmbed("🥇 List of badges", [
          { title: "___", content },
        ]);
        msg.channel.send(embed);
        content = "";
      }
      content += newBadge;
    });

    const embed = createEmbed("🥇 List of badges", [{ title: "___", content }]);
    msg.channel.send(embed);
  } catch (err) {
    log.DEBUG(err);
    msg.channel.send("Something went wrong. Please check the logs.");
  }
};
