import Discord from "discord.js";
import { chooseRandom } from '../../rng';
import { removeKeyword } from '../../helpers';
import { insertData, deleteOne } from '../../db';
import { log } from '../../../log';
import { cache } from '../../../cache';

export const meme = (msg:Discord.Message) => msg.channel.send(`_" ${chooseRandom(cache["memes"]).meme} "_`);
export const memelist = (msg:Discord.Message) => {
    let content = '';
    cache["memes"].map((meme, index) => {
        let helper = content + `**${parseInt(index)+1}**. ${meme.meme}\n`;
        if (helper.length >= 2000) {
            msg.channel.send(content);
            content = '';
        }
        content += `**${parseInt(index)+1}**. ${meme.meme}\n`
        if (index === cache["memes"].length - 1)
            msg.channel.send(content);
    })
}
export const addmeme = (msg:Discord.Message) => insertData('fetus', 'memes', 'meme', removeKeyword(msg), err => 
    err
        ? msg.react('❌')
        : msg.react('✅'));
export const deletememe = (msg:Discord.Message) => {
    let memeIndex:any = removeKeyword(msg);
    let memeToDelete = '';

    try {
        memeIndex = parseInt(memeIndex);
        memeIndex -= 1;
        if (!cache["memes"][memeIndex]) {
            msg.react('❌');
            log.WARN(`Cannot delete meme of index ${memeIndex}.`)
        }
        else {
            memeToDelete = cache["memes"][memeIndex].meme;
            deleteOne('fetus', 'memes', { meme: memeToDelete }, err => 
                err
                    ? msg.react('❌')
                    : msg.react('✅'));
        }
    }
    catch (err) {
        msg.react('❌');
        log.WARN(err);
    }
}
