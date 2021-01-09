import Discord from "discord.js";
import { chooseRandom } from "utils/rng";
import {
  removeKeyword,
  createEmbed,
  isLink,
  getCommandSymbol,
  splitByFirstSymbol,
} from "utils/helpers";
import { cache } from "utils/cache";

// @ts-ignore
export const help = (msg: Discord.Message): void => {
  let content = "";
  cache["commands"]
    .filter(cmd => !cmd.isModOnly && cmd.description)
    .map(
      cmd =>
        (content += `- \`\`${getCommandSymbol()}${cmd.keyword}\`\` - ${
          cmd.description
        }\n`),
    );
  const embed = createEmbed("📜 Standard commands", [
    { title: "List:", content: content || "There's no commands." },
  ]);
  msg.channel.send(embed);
};

export const hmod = (msg: Discord.Message): void => {
  let content = "";
  cache["commands"]
    .filter(cmd => cmd.isModOnly && cmd.description)
    .map(
      cmd =>
        (content += `- \`\`${getCommandSymbol()}${cmd.keyword}\`\` - ${
          cmd.description
        }\n`),
    );
  const embed = createEmbed("📜 Moderation commands", [
    { title: "List:", content: content || "There's no moderation commands." },
  ]);
  msg.channel.send(embed);
};

export const vid = (msg: Discord.Message): void => {
  const vid = removeKeyword(msg);
  const room_vid = cache["options"].find(option => option.option === "room_vid")
    ? cache["options"].find(option => option.option === "room_vid").value
    : null;
  const channel = cache["bot"].channels.cache.get(room_vid);

  if (vid.length === 0) {
    msg.channel.send("You forgot about something, dumbass.");
    return;
  }
  if (!isLink(vid)) {
    msg.channel.send("_This_ is not a link.");
    return;
  }
  if (!channel) {
    msg.channel.send("I don't have access to this channel, you dumbass.");
    return;
  }
  try {
    channel.send(`${vid} - ${msg.author}`);
  } catch (err) {
    msg.channel.send(`Something fucked up. ${err.message}`);
  }
};

export const rec = (msg: Discord.Message): void => {
  const recFetus = [
    "None of you could beat that lol if u change your mind appreciate",
    "Almost as good as Clicker Heroes",
    "Why should you torture yourself with this game when you can do 100 easy ones?",
    "And it's not even guaranteed you're gonna win this game.",
    "Many friends also say this is a hardcore game :D",
    "This are real chellenge for mans",
  ];
  const rec = splitByFirstSymbol(msg, " ");
  const recText = rec[1]
    ? `${rec[0]} - _"${rec[1]}"_ - ${msg.author}`
    : `_"${chooseRandom(recFetus)}"_ - @Dr. Fetus \n ${rec[0]} - ${msg.author}`;
  const room_rec = cache["options"].find(option => option.option === "room_rec")
    ? cache["options"].find(option => option.option === "room_rec").value
    : null;
  const channel = cache["bot"].channels.cache.get(room_rec);

  if (rec.length === 0) {
    msg.channel.send("You forgot about something, dumbass.");
    return;
  }
  if (!isLink(rec[0])) {
    msg.channel.send("_This_ is not a link.");
    return;
  }
  if (!channel) {
    msg.channel.send("I don't have access to this channel, you dumbass.");
    return;
  }
  try {
    channel.send(recText);
  } catch (err) {
    msg.channel.send(`Something fucked up. ${err.message}`);
  }
};
