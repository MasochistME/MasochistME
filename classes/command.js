var Post = require('./post.js');
var Input = require('./input.js');
var RNG = require('./RNG.js');

exports.Command = function (data) {
    var command = this;
    var post = new Post.Post(data);
    var input = new Input.Input();
    var rng = new RNG.RNG();

    //TEXT RESPONSES
    command.help = "```List of commands:\n\n" +
        "- /vid <link>            - posts a video to the #videos channel\n" +
        "- /rec <link> <text>     - posts a recommendation with a custom text to the #recommendations channel```";
    command.test = 'This is a test and apparently went right';
    
    command.listOfStringResponses = {
        'test': {
            textResponse: command.test
        },
        'h': {
            textResponse: command.help,
            title: 'List of commands'
        },
        'help': {
            textResponse: command.help,
            title: 'List of commands'
        }
    };
    command.listOfFunctions = {
        'fk': {
            triggers: 'toModCommand',
            arguments: 'fk',
            chanceOfTriggering: 40
        },
        //'follow': {
        //    triggers: 'toFollow',
        //},
        //'unfollow': {
        //    triggers: 'toUnfollow'
        //},
        'rec': {
            triggers: 'toRecommendation'
        //},
        'status': {
            triggers: 'toModCommand',
            arguments: 'status'
        },
        'vid': {
            triggers: 'toVideoLink'
        }
    };
    command.listOfKeywordsAndChanceToReact = {
        'fuck ': {
            triggers: 'toFuck',
            chanceOfTriggering: 40,
        },
        'hello': {
            triggers: 'o/',
            chanceOfTriggering: 5
        }
    };
    command.listOfTriggers = {
        'Ⓜ': ':mm:310140119606886421'
    };
    command.arrayOfFetus = ["None of you could beat that lol if u change your mind appreciate",
                            "Almost as good as Clicker Heroes",
                            "Why should you torture yourself with this game when you can do 100 easy ones?"];
};