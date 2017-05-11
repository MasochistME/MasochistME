var RNG = require('./RNG.js');

exports.Response = function (message, channels, user) {
    var response = this;
    var rng = new RNG.RNG();

    response.originalMessage = message.content;
    response.originalAuthor = message.author;
    response.videoChannel = '';
    response.recChannel = '';

    response.editMessage = function (editedContent) { message.edit(editedContent); };
    response.postMessage = function (messageToPost) { message.channel.send(messageToPost); };
    response.postMessageToChannel = function (messageToPost, channelToPost) { channels.get(channelToPost).send(messageToPost); };
    response.reactToMessage = function (reactionEmoji) { message.react(reactionEmoji); };
    response.changeStatus = function (newStatus) { user.setGame(newStatus); };

    response.hasCommandTrigger = function () {
        if (response.originalMessage.startsWith('/'))
            return true;
        return false;
    };
    response.hasReactionTrigger = function () {
        for (var i = 0; i < response.arrayOfTriggers.length; i++) {
            if (response.originalMessage.indexOf(response.arrayOfTriggers[i][0]) !== -1)
                return true;
        }
        return false;
    };
    response.isLink = function (supposedLink) {
        if (supposedLink.startsWith('http'))
            return true;
        return false;
    };

    response.toModCommand = function (modCommand) {
        if (response.originalAuthor.id === '205755033210454016') //165962236009906176 is mine
        {
            switch (modCommand) {
                case 'fk':
                    {
                        message.delete()
                            .then(response.postMessage('http://i.imgur.com/hpW1uTO.png'))
                            .catch(console.error);
                        break;
                    }
                case 'status':
                    {
                        var newStatus = response.removeKeyword();
                        response.changeStatus(newStatus);
                        message.delete(1000);
                        break;
                    }
                default: break;
            }
        }
    };
    response.toReactionTrigger = function () {
        for (var i = 0; i < response.arrayOfTriggers.length; i++) {
            if (response.originalMessage.indexOf(response.arrayOfTriggers[i][0]) !== -1)
                return response.reactToMessage(response.arrayOfTriggers[i][1]);
        }
    };
    response.toCommand = function () {
        response.listOfCommands(response.extractKeyword());
    };
    response.toVideoLink = function () {
        var linkToVid = response.removeKeyword();
        if (response.isLink(linkToVid))
            response.postMessageToChannel(linkToVid + " " + response.originalAuthor, response.videoChannel);
        message.delete(5000);
    };
    response.toRecommendation = function () {
        var linkAndText = response.removeKeyword().trim();
        message.delete(5000);
        if (response.isLink(linkAndText))
        {
            if (linkAndText.indexOf(' ') === -1) //no text
                return response.postMessageToChannel("\"_"+response.arrayOfFetus[rng.chooseRandom(response.arrayOfFetus.length)] + "_\" - @Dr. Fetus\n" + linkAndText + " - " + response.originalAuthor, response.recChannel);
            response.postMessageToChannel(response.subStringBySymbol(linkAndText, ' ')[0] + " - \"_" + response.subStringBySymbol(linkAndText, ' ')[1] +
                                            "_\" - " + response.originalAuthor,
                                            response.recChannel);
        }
    };
    response.toHelp = function () {
        response.postMessage("```List of commands:\n\n" +
            "- /vid <link>            - posts a video to the #videos channel\n" +
            "- /rec <link> <text>     - posts a recommendation with a custom text to the #recommendations channel```");
    };
    response.toKeyword = function () {
        for (var i = 0; i < response.listOfKeywordsAndChanceToReact().length; i++)
        {
            if (!response.originalMessage.includes('|') && response.originalMessage.toLowerCase().includes(response.listOfKeywordsAndChanceToReact()[i][0])) {
                if (rng.happensWithAChanceOf(response.listOfKeywordsAndChanceToReact()[i][2]))
                    return response.postMessage(response.listOfKeywordsAndChanceToReact()[i][1]);
            }
        }
    };
    response.toFuck = function () {
        var object = response.originalMessage.substring(response.originalMessage.indexOf('fuck') + 5).toLowerCase().trim();
        if (object.indexOf(' ') !== -1)
            object = object.substring(0, object.indexOf(' '));
        switch (object)
        {
            case 'you':
            case 'you.':
            case 'you!':
                {
                    object = 'them!';
                    break;
                }
            case 'me':
            case 'me!':
            case 'me.':
                {
                    object = 'you!';
                    break;
                }
            case 'arcy':
            case 'arcy!':
            case 'arcy.':
                {
                    object = '... Or not. That\'s not very nice.';
                    break;
                }
            case 'fetus':
            case 'fetus!':
            case 'fetus.':
                {
                    object = 'fetus! ...wait _what_.';
                    break;
                }
            default:
                {
                    object += '!';
                    break;
                }
        }
        return 'Yeah! Fuck ' + object;
    };
    response.toTesting = function () {
        console.log('all right!');
    };

    //keyword stuff
    response.extractKeyword = function () {
        var keyword = response.originalMessage;
        keyword = keyword.slice(1).trim();
        if (keyword.indexOf(' ') !== -1)
            keyword = keyword.slice(0, keyword.indexOf(' ')).trim();
        return keyword;
    };
    response.removeKeyword = function () {
        var content = response.originalMessage;
        content = content.slice(content.indexOf(' ')).trim();
        return content;
    };
    response.subStringBySymbol = function (input, symbol) {
        var first = input.substring(0, input.indexOf(symbol)).trim();
        var second = input.substring(input.indexOf(symbol)).trim();
        return [first, second];
    };
    response.splitStringBySymbol = function (input, symbol) {
        return input.split(symbol);
    };
        //arrays
    response.whatServer = function (serverID) {
        switch (serverID) {
            case '263045520358899714': //0.1%
                {
                    response.videoChannel = '310035724328239105';
                    response.recChannel = '267070116649238539';
                    break;
                }
            case '234740225782317057': //vikmains
                {
                    response.videoChannel = '310735697260707841';
                    response.recChannel = '310735697260707841';
                    break;
                }
            default: return null;
        }
    };
    response.arrayOfTriggers = [['Ⓜ', ':mm:310140119606886421']];
    response.arrayOfFetus = ["None of you could beat that lol if u change your mind appreciate",
                             "Almost as good as Clicker Heroes",
                             "Why should you torture yourself with this game when you can do 100 easy ones?"];
    response.listOfCommands = function (keyword) {
        switch (keyword) {
            case 'fk':
                return response.toModCommand('fk');
            case 'h':
            case 'help':
                return response.toHelp();
            case 'rec':
                return response.toRecommendation();
            case 'status':
                return response.toModCommand('status');
            case 'test':
                return response.toTesting();
            case 'vid':
                return response.toVideoLink();
            default: return null;
        }
    };
    response.listOfKeywordsAndChanceToReact = function () {
        return [['fuck ', response.toFuck(), 40],
            ['hello', 'o/', 2]];
    };
};
