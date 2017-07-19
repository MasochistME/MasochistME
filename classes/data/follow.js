var Post = require('../post.js');
var Input = require('../input.js');

exports.Follow = function (data) {
    var follow = this;
    var post = new Post.Post(data);
    var input = new Input.Input();
    var followersData = '../data/follow.json';

    follow.start = function () {
        var fs = require('fs');
        var streamerID = input.getIDOfMentionedPerson(data.message.content);
        var streamerExists = data.message.mentions.users.find('id', streamerID);

        if (!streamerID || !streamerExists)
            return post.message(`:warning: You didn't mention the person who you want to follow.`);
        fs.readFile(followersData, 'utf8', (err, followerInfoJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading info file: ${err}`);
            };
            var userNick = data.message.mentions.users.find('id', streamerID).username;
            followerInfoJson = JSON.parse(followerInfoJson);

            if (follow.streamerIsOnTheList(followerInfoJson.Streamers, streamerID) == -1) {
                followerInfoJson.Streamers.push({
                    "id": streamerID,
                    "followers": [ data.message.author.id ]
                });
            }
            else {
                var id = follow.streamerIsOnTheList(followerInfoJson.Streamers, streamerID);
                
                if (follow.userAlreadyFollows(followerInfoJson.Streamers[id]))
                    return post.message(`:warning: You already follow ${userNick}.`);
                followerInfoJson.Streamers[id].followers.push(data.message.author.id);
            };
            fs.writeFile(followersData, JSON.stringify(followerInfoJson), err => {
                if (err) {
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return console.log(`Writing info file: ${err}`);
                };
            });
            return post.message(`${data.message.author.username} now follows ${userNick}!`); 
        });
    };
    follow.stop = function () {
        var fs = require('fs');
        var streamerID = input.getIDOfMentionedPerson(data.message.content);
        var streamerExists = data.message.mentions.users.find('id', streamerID);

        if (!streamerID || !streamerExists)
            return post.message(`:warning: You didn't mention the person who you want to follow.`);
        fs.readFile(followersData, 'utf8', (err, followerInfoJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading info file: ${err}`);
            };
            var userNick = data.message.mentions.users.find('id', streamerID).username;
            followerInfoJson = JSON.parse(followerInfoJson);

            if (follow.streamerIsOnTheList(followerInfoJson.Streamers, streamerID) == -1)
                return post.message(`:warning: You don't follow ${userNick}.`);
            var id = follow.streamerIsOnTheList(followerInfoJson.Streamers, streamerID);
            if (!follow.userAlreadyFollows(followerInfoJson.Streamers[i]))
                return post.message(`:warning: You don't follow ${userNick}.`);
            if (followerInfoJson.Streamers[id].followers.length == 1)
                followerInfoJson.Streamers.splice(id, 1);
            else {
                for (i in followerInfoJson.Streamers[id].followers) {
                    if (followerInfoJson.Streamers[id].followers[i] == data.message.author.id)
                        followerInfoJson.Streamers[id].followers.splice(i,1);
                };
            }
            fs.writeFile(followersData, JSON.stringify(followerInfoJson), err => {
                if (err) {
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return console.log(`Writing info file: ${err}`);
                };
            });
            return post.message(`${data.message.author.username} no longer follows ${userNick}!`); 
        });
    };

    follow.userAlreadyFollows = function (input) {
        for (i in input.followers) {
            if (input.followers[i] == data.message.author.id)
                return true;
        };
        return false;
    };
    follow.streamerIsOnTheList = function (input, desiredId) {
        for (i in input) {
            if (input[i].id == desiredId)
                return i;
        };
        return -1;
    };
};