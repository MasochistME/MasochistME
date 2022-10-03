// import Discord from "discord.js";
// import { ObjectId } from "mongodb";
// import axios from "axios";

// import { createEmbed, extractArguments } from "utils/helpers";
// import { cache } from "utils/cache";

// export const takebadge = (msg: Discord.Message): void => {
//   const [badgeId, userId] = extractArguments(msg);

//   if (!badgeId || !userId) {
//     msg.channel.send(
//       createEmbed("Invalid syntax", [
//         {
//           title: "___",
//           content: "You need to specify both badgeID and userID.",
//         },
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

//   if (!user) {
//     msg.channel.send(
//       createEmbed("Invalid user", [
//         {
//           title: "___",
//           content:
//             "Specified user does not exist. Did you /updatecache beforehand?",
//         },
//       ]),
//     );
//     return;
//   }

//   axios
//     .delete(url)
//     .then(() =>
//       msg.channel.send(
//         createEmbed("✅ Badge removed from user!", [
//           {
//             title: "___",
//             content: `Badge ${(
//               badge?.name ??
//               badgeId ??
//               "<UNKNOWN>"
//             ).toUpperCase()} removed from the user ${(
//               user?.name ??
//               userId ??
//               "<UNKNOWN>"
//             ).toUpperCase()}.`,
//           },
//         ]),
//       ),
//     )
//     .catch(error =>
//       msg.channel.send(
//         createEmbed("❌ Error removing badge from user", [
//           { title: "___", content: error },
//         ]),
//       ),
//     );
// };

export {};
