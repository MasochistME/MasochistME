import Discord from "discord.js";
import { ObjectId } from "mongodb";
import { deleteOne } from "utils/db";
import { createEmbed, removeKeyword } from "utils/helpers";
import { cache } from "utils/cache";
// import { log } from "utils/log";

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

  if (!badge) {
    msg.channel.send(
      createEmbed("Invalid badge ID", [
        { title: "___", content: "Cannot delete badge that doesn't exist." },
      ]),
    );
    return;
  } else {
    deleteOne("masochist", "badges", { _id: ObjectId(badgeId) }, err =>
      err ? msg.react("❌") : msg.react("✅"),
    );
  }
};
