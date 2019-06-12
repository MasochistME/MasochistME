import Discord from 'discord.js';
import { happensWithAChanceOf } from '../../rng';

export const fuck = (msg:Discord.Message) => {
    const listOfAvoidThose = ['was','there','is','are','aren\'t','were','do','doing','being','having','not','if','then','than','could',
        'would','have','had','has','been','only','http','tbh','ton','wanna'];
    const listOfDoubleWordsToRespond = ['your','his','her','my','our','mine','the','a','an'];
    const sentenceArray = msg.content.toLowerCase()
        .replace(/[,.;!?"]/g, '')
        .split(' ');
    const thingToFuckIndex = sentenceArray.indexOf('fuck') + 1;
    let thingToFuck = sentenceArray[thingToFuckIndex];

    const customizeFuck = () => {
        if (thingToFuck === 'arcy')
            return '... Or not. She\' nice.';
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

    if (thingToFuckIndex === 0)
        return;
    if (listOfAvoidThose.includes(thingToFuck))
        return;
    
    msg.channel.send(`Yeah! Fuck ${customizeFuck()}`)
}

export const mega = (msg:Discord.Message) => {
    const sentenceArray = msg.content.toLowerCase().split(' ')
    if (sentenceArray.includes('hi'))
        return msg.channel.send('Hi Mega 1 <:hi:435199913199009793>');
    else {
        if (happensWithAChanceOf(10))
            return msg.channel.send('Hi Mega 2 <:hi:435199913199009793>');
    }
}