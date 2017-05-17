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
    response.hasCapsLockTrigger = function () {
        if (data.message.content === data.message.content.toUpperCase() && data.message .content.length >= 15)
            return true;
        return false;
    };
    response.userIsAMod = function () {
        if (data.message.author.id === '205755033210454016')
            return true;
        return false;
    };
    response.userAllowedToUseCommand = function (cmd) {
        if (cmd.isModCommand && !response.userIsAMod())
            return false;
        return true;
    };
    response.toEmoteReactionTrigger = function () {
        for (property in command.listOfEmoteReactionResponses) {
            if (data.message.content.indexOf(property) != -1)
                return post.reactionToMessage(command.listOfEmoteReactionTriggers[property]);
        }
    };
    response.toCapsLock = function () {
        if (rng.happensWithAChanceOf(3))
            return post.reactionToMessage(":what:314442404558012418");
        if (rng.happensWithAChanceOf(6))
            return post.reactionToMessage(":bbcat:314445446284050443");
        if (rng.happensWithAChanceOf(13))
            return post.reactionToMessage(":SMB5:311551327131926529");
        if (rng.happensWithAChanceOf(21))
            return post.reactionToMessage(":mm:310140119606886421");
        if (rng.happensWithAChanceOf(50))
            return post.reactionToMessage(":horage:310765183066701826");
    };
    response.toCommand = function () {
        var keyword = input.extractKeyword(data.message.content);
        data.message.delete(5000);

        if (command.listOfTextResponses.hasOwnProperty(keyword))
            return response.isTextResponse(command.listOfTextResponses[keyword]);
        if (command.listOfFunctionResponses.hasOwnProperty(keyword))
            return response.isFunctionResponse(command.listOfFunctionResponses[keyword]);
    };
    response.isTextResponse = function (cmd) {
        if (!response.userAllowedToUseCommand(cmd))
            return data.message.author.send('```You aren\'t allowed to use this command because you ain\'t cool enough.```'); // use the new post() class
        if (!cmd.hasOwnProperty('postInChannel'))
            return post.message(cmd.textResponse);
        post.messageToChannel(cmd.textResponse, cmd.postInChannel);
    };
    response.isFunctionResponse = function (cmd) {
        if (!response.userAllowedToUseCommand(cmd))
            return data.message.author.send('```You aren\'t allowed to use this command because you ain\'t cool enough.```'); // use the new post() class
        response[cmd.triggers](cmd.arguments);
    };

    response.toKeyword = function () {
        for (property in command.listOfKeywords) {
            if (data.message.content.toLowerCase().indexOf(property) != -1) {
                if (rng.happensWithAChanceOf(command.listOfKeywords[property].chanceOfTriggering)) {
                    var functionName = command.listOfKeywords[property].triggers;
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
    response.toStatusChange = function () {
        var newStatus = input.removeKeyword(data.message.content);
        return post.newStatus(newStatus);
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
