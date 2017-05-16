var Input = require('./input.js');

exports.Command = function (data) {
    var command = this;
    var input = new Input.Input();

    //TEXT RESPONSES
    command.help = "```List of commands:\n\n" +
        "- /vid <link>            - posts a video to the #videos channel\n" +
        "- /rec <link> <text>     - posts a recommendation with a custom text to the #recommendations channel```";
    command.test = 'This is a test and apparently went right';
    
    command.listOfTextResponses = {
        'test': {
            textResponse: command.test,
            isModCommand: true
        },
        'fk': {
            textResponse: 'http://i.imgur.com/hpW1uTO.png',
            isModCommand: true,
        },
        'h': {
            textResponse: command.help,
            isModCommand: false,
            title: 'List of commands'
        },
        'help': {
            textResponse: command.help,
            isModCommand: false,
            title: 'List of commands'
        },
        'impersonate': {
            textResponse: input.removeKeyword(data.message.content),
            isModCommand: false,
            postInChannel: data.genChannel
        }
    };
    command.listOfFunctionResponses = {
        
        //'follow': {
        //    triggers: 'toFollow',
        //    isModCommand: false
        //},
        //'unfollow': {
        //    triggers: 'toUnfollow',
        //    isModCommand: false
        //},
        'rec': {
            triggers: 'toRecommendation',
            isModCommand: false,
            postInChannel: data.recChannel
        },
        'status': {
            triggers: 'toStatusChange',
            isModCommand: true,
        },
        'vid': {
            triggers: 'toVideoLink',
            isModCommand: false,
            postInChannel: data.vidChannel
        }
    };
    command.listOfKeywords = {
        'fuck ': {
            triggers: 'toFuck',
            chanceOfTriggering: 40,
        },
        'hello': {
            triggers: 'o/',
            chanceOfTriggering: 5
        }
    };
    command.listOfEmoteReactionResponses = {
        'Ⓜ': ':mm:310140119606886421'
    };
    command.arrayOfFetus = ["None of you could beat that lol if u change your mind appreciate",
                            "Almost as good as Clicker Heroes",
                            "Why should you torture yourself with this game when you can do 100 easy ones?"];
};