import Discord from "discord.js";
import { CustomReaction } from "./logic";

import { fuck, mega } from "commands/reactions/words";
import { meme } from "commands/commands/meme";

export const Reaction: {
  [key: string]: (msg: Discord.Message) => string | void;
} = {
  fuck: (msg: Discord.Message) => new CustomReaction(msg).execute(fuck, msg),
  mega: (msg: Discord.Message) => new CustomReaction(msg).execute(mega, msg),
  memebers: (msg: Discord.Message) =>
    new CustomReaction(msg).execute(meme, msg),
};
