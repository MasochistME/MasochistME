import Discord from 'discord.js';
import { 
    TextReaction,
    CustomReaction,
} from './logic';

import { fuck, mega } from './reactions/words';

export const Reaction: { [key:string]: (msg:Discord.Message) => string | void} = {
    fuck: (msg:Discord.Message) => new CustomReaction(msg).execute(fuck, msg),
    mega: (msg:Discord.Message) => new CustomReaction(msg).execute(mega, msg),
};