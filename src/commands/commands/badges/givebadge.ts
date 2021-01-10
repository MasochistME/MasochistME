import Discord from "discord.js";
import { ObjectId } from "mongodb";
import axios from "axios";
import { createEmbed, extractArguments } from "utils/helpers";
import { cache } from "utils/cache";
import { log } from "utils/log";
// import { log } from "utils/log";

export const givebadge = async (msg: Discord.Message): Promise<void> => {
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
  const url = `http://localhost:3002/api/badges/badge/${badgeId}/user/${userId}`;

  if (!badge || !user) {
    msg.channel.send(
      createEmbed("Invalid ID", [
        { title: "___", content: "Badge or user doesn't exist." },
      ]),
    );
    return;
  }

  try {
    const badgeGiven = await axios.put(url);
    if (badgeGiven.status === 200) {
      msg.channel.send("Given! :3");
    } else {
      throw badgeGiven.data;
    }
  } catch (err) {
    log.WARN(err);
    msg.channel.send(`Error: ${err}.`);
  }
};
