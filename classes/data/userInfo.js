var Post = require('../post.js');
var Input= require('../input.js');

exports.UI = function (data) {
    var ui = this;
    var fs = require('fs');
    var post = new Post.Post(data);
    var input = new Input.Input();
    var dataUrl = '../data/userInfo.json';

    ui.add = function () {
        fs.readFile(dataUrl, 'utf8', (err, userInfoJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading info file: ${err}`);
            };
            userInfoJson = JSON.parse(userInfoJson);
            if (ui.userIsAlreadyInThisJson(userInfoJson.User))
                return post.message(`:warning: You already wrote something about yourself. If you want to edit your entry, use \`\`/editinfo <text>\`\` .`);
            var infoString = ui.formatUserInput(data.message.content);

            var userInfo = {
                "id": data.message.author.id,
                "info": infoString
            };
            userInfoJson.User.push(userInfo);
            fs.writeFile(dataUrl, JSON.stringify(userInfoJson), err => {
                if (err) {
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return console.log(`Writing info file: ${err}`);
                };
                return post.message(`Done!`);
            });
        });
    };
    ui.show = function () {
        var userID = input.getIDOfMentionedPerson(data.message.content);
        var userNick = data.message.mentions.users.find('id', userID);

        if (!userID || !userNick)
            return post.message(`:warning: You didn't mention the person whose info you want to know.`);
        fs.readFile(dataUrl, 'utf8', (err, userInfoJson) => {
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
            post.message(`User ${userNick} didn't provide any info about themselves yet.`);
            return;
        });
    };
    ui.edit = function () {
        fs.readFile(dataUrl, 'utf8', (err, userInfoJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading info file: ${err}`);
            };
            userInfoJson = JSON.parse(userInfoJson);
            if (!ui.userIsAlreadyInThisJson(userInfoJson.User))
                return post.message(`:warning: You can't edit something that doesn't exist. Use \`\`/addinfo <text>\`\` command.`);
            for (i in userInfoJson.User) {
                if (userInfoJson.User[i].id == data.message.author.id) {
                    userInfoJson.User[i].info = input.removeKeyword(data.message.content);
                    break;
                }
            }
            fs.writeFile(dataUrl, JSON.stringify(userInfoJson), err => {
                if (err) {
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return console.log(`Editing info file: ${err}`);
                };
                return post.message(`Done!`);
            });
        });
    };

    ui.formatUserInput = function (input) {
        var output = input.removeKeyword(data.message.content);
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