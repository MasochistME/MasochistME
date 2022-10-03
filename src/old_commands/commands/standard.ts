// import Discord from "discord.js";
// import { chooseRandom } from "utils/rng";
// import {
//   removeKeyword,
//   createEmbed,
//   isLink,
//   getCommandSymbol,
//   splitByFirstSymbol,
// } from "utils/helpers";
// import { cache } from "utils/cache";

// // @ts-ignore
// export const help = (msg: Discord.Message): void => {
//   let content = "";
//   cache["commands"]
//     .filter(cmd => !cmd.isModOnly && cmd.description)
//     .map(
//       cmd =>
//         (content += `- ${
//           cmd.isDisabled ? "🚧 - " : ""
//         }\`\`${getCommandSymbol()}${cmd.keyword}\`\` - ${cmd.description}\n`),
//     );
//   const embed = createEmbed("📜 Standard commands", [
//     { title: "List:", content: content || "There's no commands." },
//   ]);
//   msg.channel.send(embed);
// };

// export const hmod = (msg: Discord.Message): void => {
//   let content = "";
//   cache["commands"]
//     .filter(cmd => cmd.isModOnly && cmd.description)
//     .map(
//       cmd =>
//         (content += `- ${
//           cmd.isDisabled ? "🚧 - " : ""
//         }\`\`${getCommandSymbol()}${cmd.keyword}\`\` - ${cmd.description}\n`),
//     );
//   const embed = createEmbed("📜 Moderation commands", [
//     { title: "List:", content: content || "There's no moderation commands." },
//   ]);
//   msg.channel.send(embed);
// };

// export const vid = (msg: Discord.Message): void => {
//   const vid = removeKeyword(msg);
//   const room_vid = cache["options"].find(option => option.option === "room_vid")
//     ? cache["options"].find(option => option.option === "room_vid").value
//     : null;
//   const channel = cache["bot"].channels.cache.get(room_vid);

//   if (vid.length === 0) {
//     msg.channel.send("You forgot about something, dumbass.");
//     return;
//   }
//   if (!isLink(vid)) {
//     msg.channel.send("_This_ is not a link.");
//     return;
//   }
//   if (!channel) {
//     msg.channel.send("I don't have access to this channel, you dumbass.");
//     return;
//   }
//   try {
//     channel.send(`${vid} - ${msg.author}`);
//   } catch (err) {
//     msg.channel.send(`Something fucked up. ${err.message}`);
//   }
// };

export {};
