import Discord from "discord.js";
import { chooseRandom } from '../../rng';
import { removeKeyword,  } from '../../helpers';
import { insertData } from '../../db';
import { cache } from '../../../cache';

// @ts-ignore
export const meme = (msg:Discord.Message) => msg.channel.send(`_"${chooseRandom(cache.memes).meme}"_`);
export const addmeme = (msg:Discord.Message) => insertData('memes', 'meme', removeKeyword(msg), err => 
    err
        ? msg.react('❌')
        : msg.react('✅'));