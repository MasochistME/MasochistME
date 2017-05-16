var RNG = require('./RNG.js');
var Database = require('./database.js');
var Command = require('./command.js');
var Input = require('./input.js');
var Post = require('./post.js');

exports.Response = function (data) {
    var response = this;
    var rng = new RNG.RNG();
    var input = new Input.Input();
    var command = new Command.Command(data);
    var post = new Post.Post(data);

    response.hasCommandTrigger = function () {
        if (data.message.content.startsWith('/'))
            return true;
        return false;
    };
    response.toReactionTrigger = function () {
        for (property in command.listOfTriggers) {
            if (data.message.content.indexOf(property) != -1)
                return post.reactionToMessage(command.listOfTriggers[property]);
        }
    };
    response.toCommand = function () {
        var keyword = input.extractKeyword(data.message.content);
        if (command.listOfStringResponses.hasOwnProperty(keyword))
            post.message(command.listOfStringResponses[keyword].textResponse);
        if (command.listOfFunctions.hasOwnProperty(keyword))
        {
            var functionName = command.listOfFunctions[keyword].triggers;
            var arguments = command.listOfFunctions[keyword].arguments;
            response[functionName](arguments);
        }
        data.message.delete(3000);
    };
    response.toKeyword = function () {
        for (property in command.listOfKeywordsAndChanceToReact) {
            if (data.message.content.indexOf(property) != -1) {
                if (rng.happensWithAChanceOf(command.listOfKeywordsAndChanceToReact[property].chanceOfTriggering)) {
                    var functionName = command.listOfKeywordsAndChanceToReact[property].triggers;
                    try {
                        post.message(response[functionName]());
                    }
                    catch (err) { //TODO: poprawić to ultra brzydkie obejście (to jest, kiedy functionName zwraca string, a nie nazwe funkcji!!)
                        post.message(functionName);
                    }
                }
            }
        }
    };
    response.toFollow = function () {
        var whoToFollow = input.getIDOfMentionedPerson(data.message.content);
        var whoFollows = data.message.author.id;
        var base = new Database.Database(response, channels.get(response.database)); //TODO - make it less dmb with the "response" call
        if (!base.databaseExists('follow'))
            base.createDatabase('follow');
        return base.addToDatabase('follow', whoToFollow, whoFollows);
    };
    response.toUnfollow = function () {

    };
    response.toModCommand = function (modCommand) {
        if (data.message.author.id === '205755033210454016') //damianowe
        {
            switch (modCommand) {
                case 'fk':
                    return post.message('http://i.imgur.com/hpW1uTO.png');
                case 'status':
                    {
                        var newStatus = input.removeKeyword(data.message.content);
                        return post.newStatus(newStatus);
                    }
                default: break;
            }
        }
        else
            return data.message.author.send('```You aren\'t allowed to use this command because you ain\'t cool enough.```'); // use the new post() class
    };
    response.toVideoLink = function () {
        var linkToVid = input.removeKeyword(data.message.content);
        if (!input.isLink(linkToVid))
            return post.message('_This_ is not a link.');
        post.messageToChannel(linkToVid + " " + data.message.author, data.vidChannel);
    };
    response.toRecommendation = function () {
        var linkAndText = input.removeKeyword(data.message.content).trim();
        if (!input.isLink(linkAndText))
            return post.message('_This_ is not a link.');
        if (linkAndText.indexOf(' ') === -1) //no text
            return post.messageToChannel("\"_" + command.arrayOfFetus[rng.chooseRandom(command.arrayOfFetus.length)] + "_\" - @Dr. Fetus\n" + linkAndText +
                " - " + data.message.author, data.recChannel);
        post.messageToChannel(input.subStringBySymbol(linkAndText, ' ')[0] + " - \"_" + input.subStringBySymbol(linkAndText, ' ')[1] +
            "_\" - " + data.message.author,
            data.recChannel);
    };
    response.toFuck = function () {
        var object = data.message.content.substring(data.message.content.indexOf('fuck') + 5).toLowerCase().trim();
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
};
