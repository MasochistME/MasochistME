// import Discord from "discord.js";
// import axios from "axios";
// import { createEmbed } from "utils/helpers";
// import { cache } from "utils/cache";
// import { log } from "utils/log";

// const timeout = 300000;
// const fields: Array<string> = [
//   "game id",
//   "name",
//   "image",
//   "points",
//   "requirements",
//   "description",
// ];

// // addbadge stuff
// export const addbadge = (msg: Discord.Message): void => {
//   cache["addbadge"].inProgress = true;
//   cache["addbadge"].activeField = fields[0].replace(" ", "");

//   const embed = badgeScreenEmbed();

//   msg.channel
//     .send(embed)
//     .then(sentEmbed => {
//       const reactions = ["✅", "❌"];
//       const iterateReactions = (index: number) => {
//         if (index >= reactions.length) {
//           return;
//         }
//         // @ts-ignore:next-line
//         sentEmbed.react(reactions[index]);
//         setTimeout(() => iterateReactions(index + 1), 500);
//       };
//       iterateReactions(0);
//       // @ts-ignore:next-line
//       cache["addbadge"].msgId = sentEmbed.id;
//       cache["addbadge"].authorId = msg.author.id;
//       cache["addbadge"].channelId = msg.channel.id;
//       log.INFO("Badge creation start detected!");
//       log.INFO(JSON.stringify(cache["addbadge"]));
//       const filter = (reaction, user) =>
//         user.id === cache["addbadge"].authorId &&
//         (reaction.emoji.name === "❌" || reaction.emoji.name === "✅");
//       // @ts-ignore:next-line
//       sentEmbed
//         .awaitReactions(filter, {
//           time: timeout,
//           maxEmojis: 1,
//         })
//         .then(collected => finalizeBadge(collected))
//         .catch(e => console.log(e));
//     })
//     .catch(err => log.WARN(err));
// };

// const badgeScreenEmbed = (footer?: string): Discord.MessageEmbed => {
//   const content = fields.map(field => {
//     const fieldNoSpaces = field.replace(" ", "");
//     return {
//       title: cache["addbadge"].badge[fieldNoSpaces]
//         ? `✅ ${field}`
//         : cache["addbadge"].activeField === fieldNoSpaces
//         ? `➡ ${field}`
//         : `🔲 ${field}`,
//       content: cache["addbadge"].badge[fieldNoSpaces]
//         ? cache["addbadge"].badge[fieldNoSpaces]
//         : "-",
//       inline: true,
//     };
//   });
//   return createEmbed(
//     "🥇 Badge adding screen",
//     [
//       ...content,
//       {
//         title: "Instruction",
//         content: `Field indicated by ️️️➡️ is the one you are filling now.
//                 \nIf the badge is for non-Steam game, write its name in \`\`game id\`\` field.
//                 \n✅ to save, ❌ to cancel.`,
//         inline: false,
//       },
//     ],
//     "0xFDC000",
//     cache["addbadge"].badge.image
//       ? cache["addbadge"].badge.image
//       : "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/question.png",
//     footer
//       ? footer
//       : `Unfinished badge expires at ${new Date(
//           Date.now() + timeout,
//         ).toLocaleString()}.`,
//   );
// };

// export const badgeCreation = (msg: Discord.Message): void => {
//   if (
//     !cache["addbadge"].inProgress ||
//     msg.author.id !== cache["addbadge"].authorId ||
//     msg.channel.id !== cache["addbadge"].channelId
//   ) {
//     return;
//   }
//   const activeField = cache["addbadge"].activeField;
//   const nextFieldIndex =
//     fields.findIndex(field => field.replace(" ", "") === activeField) + 1;

//   cache["addbadge"].badge[activeField] = msg.content.trim(); //add some validation

//   if (nextFieldIndex < fields.length) {
//     cache["addbadge"].activeField = fields[nextFieldIndex].replace(" ", "");
//   } else {
//     cache["addbadge"].activeField = "";
//   }

//   msg.channel.messages
//     .fetch(cache["addbadge"].msgId)
//     .then(message => message.edit(badgeScreenEmbed()));
// };

// export const finalizeBadge = async (collected: any): Promise<void> => {
//   let isNonSteamGame = false;
//   collected = collected.map(col => {
//     return {
//       name: col.emoji.name,
//       message: col.message,
//     };
//   })[0];
//   if (!collected) {
//     expireBadge(`Badge expired at ${new Date(Date.now()).toLocaleString()}.`);
//     return;
//   }
//   if (collected.name === "❌") {
//     const embed = createEmbed("❌ Badge cancelled", [
//       { title: "___", content: "Good, it sucked anyway." },
//     ]);
//     collected.message.channel.send(embed);
//     expireBadge(`Badge cancelled at ${new Date(Date.now()).toLocaleString()}.`);
//     return;
//   }
//   if (isNaN(parseInt(cache["addbadge"].badge.gameid))) {
//     isNonSteamGame = true;
//   }
//   if (collected.name === "✅") {
//     const url = "http://localhost:3002/api/badges";
//     const data = {
//       name: cache["addbadge"].badge.name,
//       img: cache["addbadge"].badge.image,
//       points: cache["addbadge"].badge.points,
//       requirements: cache["addbadge"].badge.requirements,
//       description: cache["addbadge"].badge.description,
//       gameId: isNonSteamGame ? null : cache["addbadge"].badge.gameid,
//       game: isNonSteamGame ? cache["addbadge"].badge.gameid : null,
//       enabled: true,
//       legacy: false,
//       isNonSteamGame,
//     };
//     try {
//       const addBadge = await axios.post(url, data);
//       if (addBadge.status !== 201) {
//         throw addBadge.data;
//       }
//       collected.message.channel.send(
//         createEmbed("✅ Badge added", [
//           {
//             title: "___",
//             content: `Done, fucker.\nBadge ID: ${addBadge.data.insertedId}\nYou need to run \`\`/updatecache\`\` command before you can assign it.`,
//           },
//         ]),
//       );
//       expireBadge(`Badge saved at ${new Date(Date.now()).toLocaleString()}.`);
//     } catch (err) {
//       log.WARN(err);
//       collected.message.channel.send(
//         createEmbed("❌ Error saving badge", [{ title: "___", content: err }]),
//       );
//       expireBadge(
//         `Badge cancelled at ${new Date(Date.now()).toLocaleString()}.`,
//       );
//       return;
//     }
//   }
// };

// const clearBadge = (): void => {
//   cache["addbadge"] = {
//     inProgress: false,
//     msgId: "",
//     authorId: "",
//     channelId: "",
//     activeField: "",
//     badge: {},
//   };
// };

// const expireBadge = (footer?: string): void => {
//   const badgeRoom = cache["addbadge"].channelId;
//   const channel = cache["bot"].channels.cache.get(badgeRoom);
//   channel.messages.fetch(cache["addbadge"].msgId).then(message => {
//     message.edit(badgeScreenEmbed(footer));
//     message.reactions
//       .removeAll()
//       .then(() => clearBadge())
//       .catch(err => log.WARN(err));
//   });
// };

export {};
