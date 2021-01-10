import Discord from "discord.js";
import { ObjectId } from "mongodb";
import axios from "axios";
import { createEmbed, extractArguments } from "utils/helpers";
import { cache } from "utils/cache";
// import { log } from "utils/log";

export const takebadge = (msg: Discord.Message): void => {
  const [badgeId, userId] = extractArguments(msg);

  if (!badgeId || !userId) {
    msg.channel.send(
      createEmbed("Invalid syntax", [
        { title: "___", content: "Badge or user is invalid." },
      ]),
    );
    return;
  }

  const badge = cache["badges"].find(b => {
    const badgeIdObj = ObjectId(badgeId);
    return badgeIdObj.equals(b["_id"]);
  });
  const user = cache["users"].find(u => u.id === userId);
  const url = `http://localhost:3002/rest/badges/badge/${badgeId}/user/${userId}`;

  if (!badge || !user) {
    msg.channel.send(
      createEmbed("Invalid ID", [
        { title: "___", content: "Badge or user doesn't exist." },
      ]),
    );
    return;
  }

  axios
    .delete(url)
    .then(() => msg.channel.send("Taken! :3"))
    .catch(error => msg.channel.send(`Error: ${error}`));
};
