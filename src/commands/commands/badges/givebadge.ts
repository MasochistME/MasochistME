// import Discord from "discord.js";
// import { ObjectId } from "mongodb";
// import axios from "axios";
// import { createEmbed, extractArguments } from "utils/helpers";
// import { cache } from "utils/cache";
// import { log } from "utils/log";
// // import { log } from "utils/log";

// export const givebadge = async (msg: Discord.Message): Promise<void> => {
//   const [badgeId, userId] = extractArguments(msg);

//   if (!badgeId || !userId) {
//     msg.channel.send(
//       createEmbed("Invalid syntax", [
//         { title: "___", content: "Badge or user is invalid." },
//       ]),
//     );
//     return;
//   }

//   const badge = cache["badges"].find(b => {
//     const badgeIdObj = ObjectId(badgeId);
//     return badgeIdObj.equals(b["_id"]);
//   });
//   const user = cache["users"].find(u => u.id === userId);
//   const url = `http://localhost:3002/api/badges/badge/${badgeId}/user/${userId}`;

//   if (!badge || !user) {
//     msg.channel.send(
//       createEmbed("Invalid ID", [
//         {
//           title: "___",
//           content:
//             "Badge or user doesn't exist. Did you /updatecache beforehand?",
//         },
//       ]),
//     );
//     return;
//   }

//   try {
//     const badgeGiven = await axios.put(url);
//     if (badgeGiven.status === 200) {
//       msg.channel.send(
//         createEmbed("✅ Badge given to user!", [
//           {
//             title: "___",
//             content: `Badge ${(
//               badge?.name ??
//               badgeId ??
//               "<UNKNOWN>"
//             ).toUpperCase()} given to the user ${(
//               user?.name ??
//               userId ??
//               "<UNKNOWN>"
//             ).toUpperCase()}!`,
//           },
//         ]),
//       );
//     } else {
//       throw badgeGiven.data;
//     }
//   } catch (err) {
//     log.WARN(err);
//     msg.channel.send(
//       createEmbed("❌ Error giving badge to the user", [
//         { title: "___", content: err },
//       ]),
//     );
//   }
// };

export {};
