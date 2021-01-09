import Discord from "discord.js";
import { chooseRandom } from "utils/rng";
import { removeKeyword } from "utils/helpers";
import { insertData, deleteOne } from "utils/db";
import { log } from "utils/log";
import { cache } from "utils/cache";

export const meme = (msg: Discord.Message): void => {
  msg.channel.send(`_" ${chooseRandom(cache["memes"]).meme} "_`);
};

export const memelist = (msg: Discord.Message): void => {
  let content = "";
  cache["memes"].map((meme, index) => {
    const helper = content + `**${parseInt(index) + 1}**. ${meme.meme}\n`;
    if (helper.length >= 2000) {
      msg.channel.send(content);
      content = "";
    }
    content += `**${parseInt(index) + 1}**. ${meme.meme}\n`;
    if (index === cache["memes"].length - 1) {
      msg.channel.send(content);
    }
  });
};

export const addmeme = (msg: Discord.Message): void =>
  insertData("fetus", "memes", "meme", removeKeyword(msg), err =>
    err ? msg.react("❌") : msg.react("✅"),
  );

export const deletememe = (msg: Discord.Message): void => {
  let memeIndex: any = removeKeyword(msg);
  let memeToDelete = "";

  try {
    memeIndex = parseInt(memeIndex);
    memeIndex -= 1;
    if (!cache["memes"][memeIndex]) {
      msg.react("❌");
      log.WARN(`Cannot delete meme of index ${memeIndex}.`);
    } else {
      memeToDelete = cache["memes"][memeIndex].meme;
      deleteOne("fetus", "memes", { meme: memeToDelete }, err =>
        err ? msg.react("❌") : msg.react("✅"),
      );
    }
  } catch (err) {
    msg.react("❌");
    log.WARN(err);
  }
};
