import Discord from "discord.js";
import { chooseRandom } from '../../rng';
import { removeKeyword } from '../../helpers';
import { insertOne } from '../../db';
import { cache } from '../../../cache';

export const meme = (msg:Discord.Message) => msg.channel.send(`_" ${chooseRandom(cache["memes"]).meme} "_`);
export const addmeme = (msg:Discord.Message) => insertOne('memes', { 'meme': removeKeyword(msg) }, err => 
    err
        ? msg.react('❌')
        : msg.react('✅'));
