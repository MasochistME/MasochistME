var RNG = require('./RNG.js');
var Command = require('./command.js');
var FetusAnswerArrays = require('./fetusAnswerArrays.js');
var Post = require('./post.js');
var Input = require('./input.js');

exports.Answer = function (data) {
    var answer = this;
    var rng = new RNG.RNG();
    var post = new Post.Post(data);
    var input = new Input.Input();

    answer.help = "```List of commands:\n\n" +
        "- /vid <link>            - posts a video to the #videos channel\n" +
        "- /rec <link> <text>     - posts a recommendation with a custom text to the #recommendations channel\n" +
        "- /meme                  - posts a random meme\n\n" +
        "- /info <@mention>       - shows info of mentioned used\n" +
        "- /addinfo <text>        - adds info about yourself which can be later shown with the /info command\n" +
        "- /editinfo <text>       - allows you to edit info about yourself for the /info command\n\n" +
        "- /follow <@mention>     - sends a message whenever followed person starts streaming \n" +
        "- /unfollow <@mention>   - opts out of the function described above\n" +
        "```";
    answer.test = 'This is a test and apparently went right';
      

    answer.userIsAMod = function () { //TODO
        if (data.message.author.id === '205755033210454016')
            return true;
        return false;
    };
    answer.userAllowedToUseCommand = function (cmd) {
        if (cmd.isModCommand && !answer.userIsAMod())
            return false;
        return true;
    }


    answer.toEmoteReactionTrigger = function () {
        var command = new Command.Command(answer, data);
        for (property in command.listOfEmoteReactionResponses) {
            var cmd = command.listOfEmoteReactionResponses[property];
            if (data.message.content.indexOf(property)==-1)
                continue;
            if (rng.happensWithAChanceOf(cmd.chanceOfTriggering)) {
                return post.reactionToMessage(command.listOfEmoteReactionResponses[property].emoteResponse);
            }
        }
    };
    answer.toCapsLock = function () {
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
    answer.toKeyword = function () {
        var command = new Command.Command(answer, data);
        for (property in command.listOfKeywords) {
            var cmd = command.listOfKeywords[property];
            if (!input.allKeywordsWereFoundInString(property.toString().split('+'), data.message.content)) 
                continue;
            if (rng.happensWithAChanceOf(cmd.chanceOfTriggering)) 
                return answer.sendAppropiateResponseToCommand(cmd);
        }
    };
    answer.toCommand = function () {
        var keyword = input.extractKeyword(data.message.content);
        var command = new Command.Command(answer, data);

        if (command.listOfResponses.hasOwnProperty(keyword))
            answer.checkForModPrivileges(command.listOfResponses[keyword]);
        data.message.delete(5000);
    };


    answer.checkForModPrivileges = function (cmd) {
        if (!answer.userAllowedToUseCommand(cmd))
            return post.toDM("```You aren\'t allowed to use this command because you ain\'t cool enough.```");
        answer.checkForBotRefusal(cmd);
    };
    answer.checkForBotRefusal = function (cmd) {
        if (rng.botRefuses()) {
            if (cmd.refusal)
                return post.message(cmd.refusal);
            return post.message(`I refuse.`);
        }
        return answer.sendAppropiateResponseToCommand(cmd);
    };
    answer.sendAppropiateResponseToCommand = function (cmd) {
        if (cmd.typeOfResponse == `text`) {
            if (!cmd.hasOwnProperty(`postInChannel`))
                return post.message(cmd.triggers);
            if (cmd.postInChannel == `DM`)
                return post.toDM(cmd.triggers);
            return post.messageToChannel(cmd.triggers, cmd.postInChannel);
        }
        if (cmd.typeOfResponse == `embed`) {
            if (!cmd.hasOwnProperty(`postInChannel`))
                return post.embed(cmd.title, [[`___`, cmd.triggers, false]]);
            return post.messageToChannel(cmd.title, [[`___`, cmd.triggers, false]], cmd.postInChannel);
        }
        if (cmd.typeOfResponse == `function`) {
            return answer[cmd.triggers](cmd.arguments);
        }
    };


    answer.toInfoRequest = function (typeOfRequest) {
        var fs = require('fs')

        if (typeOfRequest == `show`) {
            var userID = input.getIDOfMentionedPerson(data.message.content);

            fs.readFile('../data/info.json', 'utf8', (err, userInfoJson) => {
                if (err) {
                    console.log(`Reading info file: ${err}`);
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return;
                };
                userInfoJson = JSON.parse(userInfoJson);
                for (i in userInfoJson.User) {
                    if (userInfoJson.User[i].id == userID)
                        return post.embed(`A few words about ${input.removeKeyword(data.message.content)}`, [[`___`, userInfoJson.User[i].info, false]]);
                };
                post.message(`User <@${userID}> didn't provide any info about themselves yet.`);
                return;
            });
        };
        if (typeOfRequest == `add`) {
            fs.readFile('../data/info.json', 'utf8', (err, userInfoJson) => {
                if (err) {
                    console.log(`Reading info file: ${err}`);
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return;
                };
                userInfoJson = JSON.parse(userInfoJson);
                if (answer.userIsAlreadyInThisJson(userInfoJson.User))
                    return post.message(`:warning: You already wrote something about yourself. If you want to edit your entry, use /editinfo .`);
                var userInfo = {
                    "id": data.message.author.id,
                    "info": input.removeKeyword(data.message.content)
                };
                userInfoJson.User.push(userInfo);
                fs.writeFile('../data/info.json', JSON.stringify(userInfoJson), err => {
                    if (err) {
                        console.log(`Writing info file: ${err}`);
                        post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                        return;
                    };
                    return post.message(`Done!`);
                });
            });
        };
        if (typeOfRequest == `edit`) {
            return post.message(`No. You're stuck with what you wrote about yourself _forever_.`);
        };
    };
    answer.userIsAlreadyInThisJson = function (input) {
        for (i in input){
            if (input[i].id == data.message.author.id)
                return true;
        };
        return false;
    };
    answer.toFollow = function () {
        //todo
        return post.message(`Not implemented yet.`); //TODO
    };
    answer.toUnfollow = function () {
        //todo
        return post.message(`Not implemented yet.`); //TODO
    };
    answer.toMeme = function (typeOfRequest) {
        if (typeOfRequest == `show`) {
            var fetusAnswerArrays = new FetusAnswerArrays.FetusAnswerArrays();
            var meme = `_"${fetusAnswerArrays.memes[rng.chooseRandom(fetusAnswerArrays.memes.length)]}"_`;

            return post.message(meme);
        };
        if (typeOfRequest == `add`) {
            return post.message(`Not implemented yet.`); //TODO
        };
    };
    answer.toStatusChange = function () {
        var newStatus = input.removeKeyword(data.message.content);
        return post.newStatus(newStatus);
    };
    answer.toImpersonate = function () {
        var output = input.removeKeyword(data.message.content);
        post.messageToChannel(output, data.genChannel);
    }
    answer.toVideoLink = function () {
        var linkToVid = input.removeKeyword(data.message.content);
        if (!input.isLink(linkToVid))
            return post.message('_This_ is not a link.');
        post.messageToChannel(linkToVid + " " + data.message.author, data.vidChannel);
    };
    answer.toRecommendation = function () {
        var fetusAnswerArrays = new FetusAnswerArrays.FetusAnswerArrays();
        var linkAndText = input.removeKeyword(data.message.content).trim();

        if (!input.isLink(linkAndText))
            return post.message('_This_ is not a link.');
        if (linkAndText.indexOf(' ') === -1) //no text
            return post.messageToChannel("\"_" + fetusAnswerArrays.recommendations[rng.chooseRandom(fetusAnswerArrays.recommendations.length)] + "_\" - @Dr. Fetus\n" + linkAndText +
                " - " + data.message.author, data.recChannel);
        post.messageToChannel(input.subStringBySymbol(linkAndText, ' ')[0] + " - \"_" + input.subStringBySymbol(linkAndText, ' ')[1] +
            "_\" - " + data.message.author,
            data.recChannel);
    };


    answer.toFuck = function () {
        var userMessage = data.message.content.substring(data.message.content.toLowerCase().indexOf('fuck') + 5).toLowerCase().trim();

        if (answer.containsWordsToAvoid(userMessage))
            return;
        if (answer.containsDoubleWordsToRespond(userMessage))
            return post.message(`Yeah! Fuck ${answer.toDoubleWordsToRespond(userMessage)}`);
        return post.message(`Yeah! Fuck ${answer.standardFuck(userMessage)}`);
    };
    // UWAGA - kod jest teraz zrobiony tak, że obecność słów z listy jst sprawdzana startsWith'em! To może prowadzić do problemów. 
    // Zmienić to na standardowe sprawzanie kolejnego słowa kiedyś!
    answer.containsWordsToAvoid = function (userMessage) {
        var listOfAvoidThose = [`was `, `there`, `is `, `are `, `aren't`, `were `, `do `, `doing`, `being`, `having`, `not `, `if `, `then`, `than`, `could`,
            `would`, `have`, `had `, `has `, `been`, `only`, `http`];

        for (i in listOfAvoidThose) {
            if (userMessage.startsWith(listOfAvoidThose[i]))
                return true;
        }
        return false;
    };
    answer.containsDoubleWordsToRespond = function (userMessage) {
        var listOfDoubleWordsToRespond = [`your `, `his `, `her`, `my `, `our `, `mine `, `the `, `a `, `an `];

        for (i in listOfDoubleWordsToRespond) {
            if (userMessage.startsWith(listOfDoubleWordsToRespond[i]))
                return true;
        }
        return false;
    };
    answer.toDoubleWordsToRespond = function (userMessage) {
        var firstWord = userMessage.substring(0, userMessage.indexOf(` `));
        var secondWord = ``;

        if (firstWord == `my`)
            firstWord = `your`;
        if (userMessage.indexOf(' ') !== -1) {
            secondWord = userMessage.substring(userMessage.indexOf(` `)).trim();
            if (secondWord.indexOf(' ') !== -1)
                secondWord = secondWord.substring(0, secondWord.indexOf(` `)).trim();
        }
        return `${firstWord} ${secondWord}!`;
    }
    answer.standardFuck = function (userMessage) {
        if (userMessage.startsWith(`arcy`))
            return `... Or not. That\'s not very nice.`;
        if (userMessage.startsWith(`you`))
            return `you too!`;
        if (userMessage.startsWith(`me`))
            return `you!`;
        if (userMessage.startsWith(`fetus`) || userMessage.startsWith(`dr fetus`) || userMessage.startsWith(`dr. fetus`) || userMessage.startsWith(`doctor fetus`))
            return `fetus! ...wait _what_.`;

        if (userMessage.indexOf(` `) !== -1)
            return `${userMessage.substring(0, userMessage.indexOf(` `))}!`;
        return `${userMessage}!`;        
    };
};