import Discord from "discord.js";
import { ObjectId } from "mongodb";
import axios from "axios";

import { createEmbed, removeKeyword } from "utils/helpers";
import { cache } from "utils/cache";

export const deletebadge = (msg: Discord.Message): void => {
  const badgeId = removeKeyword(msg);

  if (!badgeId) {
    msg.channel.send(
      createEmbed("Invalid badge ID", [
        { title: "___", content: "Cannot delete badge that doesn't exist." },
      ]),
    );
    return;
  }

  const badge = cache["badges"].find(b => {
    const badgeIdObj = ObjectId(badgeId);
    return badgeIdObj.equals(b["_id"]);
  });
  const url = `http://localhost:3002/rest/badges/badge/${badgeId}`;

  if (!badge) {
    msg.channel.send(
      createEmbed("Invalid badge ID", [
        { title: "___", content: "Cannot delete badge that doesn't exist." },
      ]),
    );
    return;
  }
  axios
    .delete(url)
    .then(() =>
      msg.channel.send(
        `Badge ${(badge?.name ?? badgeId ?? "<?>").toUpperCase()} removed! :3`,
      ),
    )
    .catch(error => msg.channel.send(`Error: ${error}`));
};
