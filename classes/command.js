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
 *  @postInChannel - directs the bot's response into the channel which ID is given. If value='DM' will send DM, if value='all' - is usable everywhere.
 *  @isModCommand - self-explanatory
 *  <@refusal> - a special response which gets sent instead of standard one, if bot decides to refuse to execute the command
 *  <@title> - title for embed messages (required).
 *  <@arguments> - arguments for functions. If function triggers an embed, use this to pass title instead of <title>.
*/
    command.listOfResponses = {
        'test': {
            triggers: `This is a test function.`,
            typeOfResponse: `text`,
            postInChannel: `all`,
            isModCommand: true
        },
        'fk': {
            triggers: `http://i.imgur.com/hpW1uTO.png`,
            typeOfResponse: `text`,
            postInChannel: `all`,
            isModCommand: true
        },
        'follow': {
            triggers: `toFollow`,
            typeOfResponse: `function`,
            arguments: `start`,
            postInChannel: `all`,
            isModCommand: false
        },
        'unfollow': {
            triggers: `toFollow`,
            typeOfResponse: `function`,
            arguments: `stop`,
            postInChannel: `all`,
            isModCommand: false
        },
        'followed': {
            triggers: `toFollow`,
            typeOfResponse: `function`,
            arguments: `list`,
            postInChannel: `all`,
            isModCommand: false
        },
        'h': {
            triggers: answer.help,
            typeOfResponse: `text`,
            postInChannel: `all`,
            isModCommand: false,
        },
        'help': {
            triggers: answer.help,
            typeOfResponse: `text`,
            postInChannel: `all`,
            isModCommand: false,
        },
        'hmod': {
            triggers: answer.helpMod,
            typeOfResponse: `text`,
            postInChannel: `all`,
            isModCommand: true,
        },
        'helpmod': {
            triggers: answer.helpMod,
            typeOfResponse: `text`,
            postInChannel: `all`,
            isModCommand: true,
        },
        'impersonate': {
            triggers: `toImpersonate`,
            typeOfResponse: `function`,
            postInChannel: `all`,
            isModCommand: true
        },
        'addinfo': {
            triggers: `toInfoRequest`,
            typeOfResponse: `function`,
            arguments: `add`,
            postInChannel: `all`,
            isModCommand: false
        },
        'editinfo': {
            triggers: `toInfoRequest`,
            typeOfResponse: `function`,
            arguments: `edit`,
            postInChannel: `all`,
            isModCommand: false
        },
        'info': {
            triggers: `toInfoRequest`,
            typeOfResponse: `function`,
            arguments: `show`,
            postInChannel: `all`,
            isModCommand: false
        },
        'locateserver': {
            triggers: `locateServer`,
            typeOfResponse: `function`,
            postInChannel: `all`,
            isModCommand: true
        },
        'addmeme': {
            triggers: `toMeme`,
            typeOfResponse: `function`,
            arguments: `add`,
            postInChannel: `all`,
            isModCommand: true
        },
        'meme': {
            triggers: `toMeme`,
            typeOfResponse: `function`,
            arguments: `show`,
            refusal: `Stop asking for those stupid memes. I'm Dr. Fetus, not kela bot.`,
            postInChannel: `all`,
            isModCommand: false
        },
        'deletememe': {
            triggers: `toMeme`,
            typeOfResponse: `function`,
            arguments: `delete`,
            postInChannel: `all`,
            isModCommand: true
        },
        'memelist': {
            triggers: `toMeme`,
            typeOfResponse: `function`,
            arguments: `list`,
            postInChannel: `all`,
            isModCommand: true
        },
        'mod': {
            triggers: `editModPrivileges`,
            typeOfResponse: `function`,
            arguments: `promote`,
            postInChannel: `all`,
            isModCommand: true
        },
        'unmod': {
            triggers: `editModPrivileges`,
            typeOfResponse: `function`,
            arguments: `demote`,
            postInChannel: `all`,
            isModCommand: true
        },
        'modlist': {
            triggers: `editModPrivileges`,
            typeOfResponse: `function`,
            arguments: `list`,
            postInChannel: `all`,
            isModCommand: true
        },
        'rec': {
            triggers: `toRecommendation`,
            typeOfResponse: `function`,
            postInChannel: data.recChannel,
            isModCommand: false
        },
        'restrict': {
            triggers: `restrictCommand`,
            typeOfResponse: `function`,
            postInChannel: `all`,
            isModCommand: true
        },
        'setstatus': {
            triggers: `toStatusChange`,
            typeOfResponse: `function`,
            postInChannel: `all`,
            isModCommand: true,
        },
        'vid': {
            triggers: `toVideoLink`,
            typeOfResponse: `function`,
            refusal: `...nobody is going to watch that anyway.`,
            postInChannel: data.vidChannel,
            isModCommand: false
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
        },
        'dark souls': {
            emoteRespons: `:likeDS:371262717664952321`,
            chanceOfTriggering: 100
        }
    };
};