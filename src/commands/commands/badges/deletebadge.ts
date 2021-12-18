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
        {
          title: "___",
          content: "You need to specify badgeID.",
        },
      ]),
    );
    return;
  }

  const badge = cache["badges"].find(b => {
    const badgeIdObj = ObjectId(badgeId);
    return badgeIdObj.equals(b["_id"]);
  });
  const url = `http://localhost:3002/api/badges/${badgeId}`;

  if (!badge) {
    msg.channel.send(
      createEmbed("Invalid badge ID", [
        {
          title: "___",
          content:
            "Cannot delete badge that doesn't exist. Did you /updatecache beforehand?",
        },
      ]),
    );
    return;
  }
  axios
    .delete(url)
    .then(() =>
      msg.channel.send(
        createEmbed("✅ Badge deleted", [
          {
            title: "___",
            content: `Done, fucker.\nBadge ${(
              badge?.name ??
              badgeId ??
              "<UNKNOWN>"
            ).toUpperCase()} permanently deleted.\n**Important**: If any user had this badge assigned, they will still have it, but it won't display on their profile anymore. `,
          },
        ]),
      ),
    )
    .catch(error =>
      msg.channel.send(
        createEmbed("❌ Error deleting badge", [
          { title: "___", content: error },
        ]),
      ),
    );
};
