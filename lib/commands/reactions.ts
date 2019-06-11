import Discord from 'discord.js';
import { CustomReaction } from './logic';

import { fuck } from './reactions/words';

export const Reaction: { [key:string]: (msg:Discord.Message) => string | void} = {
    fuck: (msg:Discord.Message) => new CustomReaction(msg).execute(fuck, msg),
};