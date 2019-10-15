import Discord from 'discord.js';
import { happensWithAChanceOf } from '../../rng';
import { cache } from '../../../cache';

export const fuck = (msg:Discord.Message) => {
    const listOfAvoidThose = cache["special"].find(special => special.id === 'nofuckstogive').list || [];
    const listOfDoubleWordsToRespond = cache["special"].find(special => special.id === 'doublefuckstogive').list || [];
    const sentenceArray = msg.content.toLowerCase()
        .replace(/[,.;!?"]/g, '')
        .split(' ');
    const thingToFuckIndex = sentenceArray.indexOf('fuck') + 1;
    let thingToFuck = sentenceArray[thingToFuckIndex];

    const customizeFuck = () => {
        if (thingToFuck === 'arcy' || thingToFuck === 'arcyvilk' || thingToFuck === '<@165962236009906176>')
            return '... Okay no, go fuck yourself.';
        if (thingToFuck === 'you')
            return 'you too!';
        if (thingToFuck === 'me')
            return 'you!';
        if (thingToFuck === 'fetus' || thingToFuck === 'dr fetus' || thingToFuck === 'dr. fetus' || thingToFuck === 'doctor fetus')
            return 'fetus! ...wait _what_.';
        if (listOfDoubleWordsToRespond.includes(thingToFuck)) {
            if (thingToFuck == 'my')
                thingToFuck = 'your';
            return `${thingToFuck} ${sentenceArray[thingToFuckIndex + 1] || 'thing'}!`;
        }
        return `${thingToFuck}!`;
    }

    if (msg.author.id == '159203133115990016' && happensWithAChanceOf(50))
        return;
    if (!thingToFuck)
        return;
    if (listOfAvoidThose.includes(thingToFuck))
        return;
    
    msg.channel.send(`Yeah! Fuck ${customizeFuck()}`)
}

export const mega = (msg:Discord.Message) => {
    const sentenceArray = msg.content.toLowerCase().split(' ')
    if (sentenceArray.includes('hi'))
        return msg.channel.send('Hi Mega <:hi:435199913199009793>');
    else {
        if (happensWithAChanceOf(10))
            return msg.channel.send('Hi Mega <:hi:435199913199009793>');
    }
}