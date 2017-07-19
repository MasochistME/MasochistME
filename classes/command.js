var Input = require('./input.js');

exports.Command = function (answer, data) {
    var command = this;
    var input = new Input.Input();

/**
 *  listOfResponses is an object storing commands which can be triggered only with the use of "!", and which either send
 *  a standard string type in return, or execute a function.
 *
 *  Properties are just command keywords.
 *
 *  Values:
 *  @triggers - string response sent by bot when triggered
 *  @typeOfResponse: 'text' (returns string), 'function' (triggers function - sending from inside of function), 'embed' (REQUIRES TITLE!)
 *  @isModCommand - self-explanatory
 *  <@refusal> - a special response which gets sent instead of standard one, if bot decides to refuse to execute the command
 *  <@title> - title for embed messages (required).
 *  <@arguments> - arguments for functions. If function triggers an embed, use this to pass title instead of <title>.
 *  <@postInChannel> - directs the bot's response into the channel which ID is given. If value='DM' will send DM.
*/
    command.listOfResponses = {
        'test': {
            triggers: `toDatabase`,
            typeOfResponse: `function`,
            isModCommand: false
        },
        'fk': {
            triggers: `http://i.imgur.com/hpW1uTO.png`,
            typeOfResponse: `text`,
            isModCommand: true,
        },
        'follow': {
            triggers: `toFollow`,
            typeOfResponse: `function`,
            arguments: `start`,
            isModCommand: false
        },
        'unfollow': {
            triggers: `toFollow`,
            typeOfResponse: `function`,
            arguments: `stop`,
            isModCommand: false
        },
        'h': {
            triggers: answer.help,
            typeOfResponse: `text`,
            isModCommand: false,
            title: `List of commands`
        },
        'help': {
            triggers: answer.help,
            typeOfResponse: `text`,
            isModCommand: false,
            title: `List of commands`
        },
        'impersonate': {
            triggers: `toImpersonate`,
            typeOfResponse: `function`,
            isModCommand: true
        },
        'addinfo': {
            triggers: `toInfoRequest`,
            typeOfResponse: `function`,
            arguments: `add`,
            isModCommand: false
        },
        'editinfo': {
            triggers: `toInfoRequest`,
            typeOfResponse: `function`,
            arguments: `edit`,
            isModCommand: false
        },
        'info': {
            triggers: `toInfoRequest`,
            typeOfResponse: `function`,
            arguments: `show`,
            isModCommand: false
        },
        'addmeme': {
            triggers: `toMeme`,
            typeOfResponse: `function`,
            arguments: `add`,
            isModCommand: false
        },
        'meme': {
            triggers: `toMeme`,
            typeOfResponse: `function`,
            arguments: `show`,
            refusal: `Stop asking for those stupid memes. I'm Dr. Fetus, not kela bot.`,
            isModCommand: false
        },
        'mod': {
            triggers: `addModPrivileges`,
            typeOfResponse: `function`,
            isModCommand: false
        },
        'rec': {
            triggers: `toRecommendation`,
            typeOfResponse: `function`,
            isModCommand: false,
            postInChannel: data.recChannel
        },
        'status': {
            triggers: `toStatusChange`,
            typeOfResponse: `function`,
            isModCommand: true,
        },
        'vid': {
            triggers: `toVideoLink`,
            typeOfResponse: `function`,
            refusal: `...nobody is going to watch that anyway.`,
            isModCommand: false,
            postInChannel: data.vidChannel
        }
    };

/**
 *  listOfKeywords is an object storing keywords, which when found laying around inside sentences sent by users, are responded with
 *  whatever is inside (maintains both strings (standard) and functions (via catch - currently in the process of changing it for the
 *  typeOfResponse trigger rather).
 *  
 *  Properties are keywords which trigger specific responses. If you put "+" in property, all the words have to be present in the sentence for the
 *  trigger to be... well... triggered. Keywords aren't trimmed so you can use whitespaces to manipulate results (for example to differentiate
 *  vik in Viktor and in Rejkiavik).
 *
 *  Values:
 *  @triggers - response sent by bot when triggered
 *  @chanceOfTriggering - % chance of the response getting trigered
 *  @typeOfResponse: 'text' (when jus returns string) or 'function' (when it returns a function's result),
*/
    command.listOfKeywords = {
        'fuck ': {
            triggers: `toFuck`,
            typeOfResponse: `function`,
            chanceOfTriggering: 40,
        },
        'hello': {
            triggers: 'o/',
            typeOfResponse: `text`,
            chanceOfTriggering: 10
        }
    };

/**
 *  listOfEmoteReactionResponses is an object storing keywords, which when triggered make bot respond with an emoji.
 *  Properties are keywords which trigger specific responses. 
 *
 *  Values:
 *  @emoteResponse - either Unicode emoji or ID emoji which will be sent as bot's reaction
 *  @chanceOfTriggering - % chance of the reaction getting trigered
*/
    command.listOfEmoteReactionResponses = {
        'Ⓜ': {
            emoteResponse: `:mm:310140119606886421`,
            chanceOfTriggering: 100
        }
    };
};