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
    
    command.listOfTextResponses = {
        'test': {
            textResponse: command.test,
            modCommand: true
        },
        'fk': {
            textResponse: 'http://i.imgur.com/hpW1uTO.png',
            modCommand: true,
        },
        'h': {
            textResponse: command.help,
            modCommand: false,
            title: 'List of commands'
        },
        'help': {
            textResponse: command.help,
            modCommand: false,
            title: 'List of commands'
        }
    };
    command.listOfFunctionResponses = {
        
        //'follow': {
        //    triggers: 'toFollow',
        //    modCommand: false
        //},
        //'unfollow': {
        //    triggers: 'toUnfollow',
        //    modCommand: false
        //},
        'rec': {
            triggers: 'toRecommendation',
            modCommand: false
        },
        'status': {
            triggers: 'toStatusChange',
            modCommand: true,
        },
        'vid': {
            triggers: 'toVideoLink',
            modCommand: false
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