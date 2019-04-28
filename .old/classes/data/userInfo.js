var Post = require('../post.js');
var Input= require('../input.js');

exports.UI = function (data) {
    var ui = this;
    var fs = require('fs');
    var post = new Post.Post(data);
    var input = new Input.Input();
    var dataPath = '../data/userInfo.json';

    ui.add = function () {
        fs.readFile(dataPath, 'utf8', (err, userInfoJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading info file: ${err}`);
            };
            userInfoJson = JSON.parse(userInfoJson);
            if (ui.userIsAlreadyInThisJson(userInfoJson.User))
                return post.embed(`<:boshy:310151885690503169> You already wrote something about yourself.`, [[`___`, `If you want to improve your entry, use \`\`/editinfo <text>\`\` .`, false]]);
            var infoString = ui.formatUserInput(data.message.content);

            var userInfo = {
                "id": data.message.author.id,
                "info": infoString
            };
            userInfoJson.User.push(userInfo);
            fs.writeFile(dataPath, JSON.stringify(userInfoJson), err => {
                if (err) {
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return console.log(`Writing info file: ${err}`);
                };
                return post.message(`Got it!`);
            });
        });
    };
    ui.show = function () {
        var userID = input.getIDOfMentionedPerson(data.message.content);
        var userNick = data.message.mentions.users.find('id', userID);

        if (!userID || !userNick)
            return post.embed(`<:boshy:310151885690503169> Incorrect input`, [[`___`, `Next time tag the person whose info you want to know, loser.`, false]]);
        fs.readFile(dataPath, 'utf8', (err, userInfoJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading info file: ${err}`);
            };
            userInfoJson = JSON.parse(userInfoJson);
            for (i in userInfoJson.User) {
                if (userInfoJson.User[i].id == userID) {
                    userNick = data.message.mentions.users.find('id', userID).username;
                    return post.embed(`A few words about ${userNick}`, [[`___`, userInfoJson.User[i].info, false]]);
                }
            };
            post.embed(`<:boshy:310151885690503169> No info of this guy`, [[`___`, `${userNick} was too dumb to write a note about himself.`, false]]);
            return;
        });
    };
    ui.edit = function () {
        fs.readFile(dataPath, 'utf8', (err, userInfoJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading info file: ${err}`);
            };
            userInfoJson = JSON.parse(userInfoJson);
            if (!ui.userIsAlreadyInThisJson(userInfoJson.User))
                return post.embed(`<:boshy:310151885690503169> Can't do it`, [[`___`, `___First___ write a note, ___then___ edit it. Is it so hard to you? \n\nUse \`\`/addinfo <text>\`\` command.`, false]]);
            for (i in userInfoJson.User) {
                if (userInfoJson.User[i].id == data.message.author.id) {
                    userInfoJson.User[i].info = input.removeKeyword(data.message.content);
                    break;
                }
            }
            fs.writeFile(dataPath, JSON.stringify(userInfoJson), err => {
                if (err) {
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return console.log(`Editing info file: ${err}`);
                };
                return post.message(`Done!`);
            });
        });
    };

    ui.formatUserInput = function (_input) {
        var output = input.removeKeyword(_input);
        output = output.replace(/(?:\r\n|\r|\n)/g, '\n');
        return output;
    };
    ui.userIsAlreadyInThisJson = function (input) {
        for (i in input) {
            if (input[i].id == data.message.author.id)
                return true;
        };
        return false;
    };
};