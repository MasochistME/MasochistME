// import Discord from "discord.js";
// import _ from "lodash";
// import { log } from "utils/log";
// import { removeKeyword, extractArguments, createEmbed } from "utils/helpers";
// import { cache } from "utils/cache";
// import { updateCache } from "utils/db";
// import config from "../../../config.json";

// export const options = (msg: Discord.Message): void => {
//   let options = cache["options"].map(option => {
//     return {
//       title: option.option,
//       content: option.option.startsWith("room_")
//         ? `<#${option.value}>`
//         : option.value,
//       inline: true,
//     };
//   });
//   options = _.orderBy(options, ["title"], ["asc"]);
//   const embed = createEmbed("⚙️ Dr. Fetus settings", options);
//   msg.channel.send(embed);
// };

// export const updatecache = (): void => {
//   config.DATABASES.map(db => updateCache(db.symbol));
// };

export {};
