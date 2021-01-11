import Discord from "discord.js";
import axios from "axios";
import { orderBy } from "lodash";
import { createEmbed } from "utils/helpers";
import { log } from "utils/log";

export const badgelist = async (msg: Discord.Message): Promise<void> => {
  let content = "";
  const urlBadges = "http://89.47.165.141:3002/api/badges";
  const urlGames = "http://89.47.165.141:3002/api/curator/games";
  try {
    const badges = await axios.get(urlBadges);
    const games = await axios.get(urlGames);
    const mappedBadges = badges?.data.map((badge: any) => {
      const game = games?.data.find((g: any) => {
        return Number(g.id) === Number(badge.gameId);
      });
      return {
        ...badge,
        gameName: game?.title ?? badge.game ?? "<unknown>",
      };
    });

    const orderedBadges = orderBy(
      mappedBadges,
      [badge => badge.gameName],
      ["asc"],
    );
    orderedBadges.map(badge => {
      const newBadge = `- ${badge.gameName} - \`\`${
        badge._id
      }\`\` - ${badge.name.toUpperCase()} - ${badge.description}\n`;
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
