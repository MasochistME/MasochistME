import Discord from 'discord.js';

export const fuck = (msg:Discord.Message) => {
    const listOfAvoidThose = ['was','there','is','are','aren\'t','were','do','doing','being','having','not','if','then','than','could',
        'would','have','had','has','been','only','http','tbh','ton','wanna'];
    const listOfDoubleWordsToRespond = ['your','his','her','my','our','mine','the','a','an'];
    const sentenceArray = msg.content.toLowerCase()
        .replace(/[,.;!?]/g, '')
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
