var Post = require('../post.js');

exports.Follow = function (data) {
    var follow = this;
    var post = new Post.Post(data);
    var followersPath = '../data/follow.json';

    follow.start = function () {
        var fs = require('fs');
        var Input = require('../input.js');
        var input = new Input.Input();

        var streamerID = input.getIDOfMentionedPerson(data.message.content);
        var streamerExists = data.message.mentions.users.find('id', streamerID);

        if (!streamerID || !streamerExists)
            return post.embed(`<:boshy:310151885690503169> Incorrect input`, [[`___`, `You didn't mention the person who you want to follow.`, false]]);
        fs.readFile(followersPath, 'utf8', (err, followerInfoJson) => {
            if (err) {
                post.embed(`:no_entry: Error`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                return console.log(`Reading follow file: ${err}`);
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
                    return post.embed(`<:boshy:310151885690503169> Can't do it`, [[`___`,`You already follow ${userNick}. Why do you even bother?`,false]]);
                followerInfoJson.Streamers[id].followers.push(data.message.author.id);
            };
            fs.writeFile(followersPath, JSON.stringify(followerInfoJson), err => {
                if (err) {
                    post.embed(`:no_entry: Error`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                    return console.log(`Writing follow file: ${err}`);
                };
            });
            return post.embed(`Follower alert`, [[`___`, `${data.message.author.username} now follows ${userNick}! Such a waste of time.`, false]]); 
        });
    };
    follow.stop = function () {
        var fs = require('fs');
        var Input = require('../input.js');
        var input = new Input.Input();

        var streamerID = input.getIDOfMentionedPerson(data.message.content);
        var streamerExists = data.message.mentions.users.find('id', streamerID);

        if (!streamerID || !streamerExists)
            return post.embed(`<:boshy:310151885690503169> Incorrect input`, [[`___`, `You didn't mention the person who you want to unfollow.`, false]]);
        fs.readFile(followersPath, 'utf8', (err, followerInfoJson) => {
            if (err) {
                post.embed(`:no_entry: Error`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                return console.log(`Reading follow file: ${err}`);
            };
            var userNick = data.message.mentions.users.find('id', streamerID).username;
            followerInfoJson = JSON.parse(followerInfoJson);

            if (follow.streamerIsOnTheList(followerInfoJson.Streamers, streamerID) == -1)
                return post.embed(`<:boshy:310151885690503169> Can't do it`, [[`___`, `You don't follow ${userNick} and no one cares about this.`, false]]);
            var id = follow.streamerIsOnTheList(followerInfoJson.Streamers, streamerID);
            if (!follow.userAlreadyFollows(followerInfoJson.Streamers[i]))
                return post.embed(`<:boshy:310151885690503169> Can't do it`, [[`___`, `You don't follow ${userNick} and no one cares about this.`, false]]);
            if (followerInfoJson.Streamers[id].followers.length == 1)
                followerInfoJson.Streamers.splice(id, 1);
            else {
                for (i in followerInfoJson.Streamers[id].followers) {
                    if (followerInfoJson.Streamers[id].followers[i] == data.message.author.id)
                        followerInfoJson.Streamers[id].followers.splice(i,1);
                };
            }
            fs.writeFile(followersPath, JSON.stringify(followerInfoJson), err => {
                if (err) {
                    post.embed(`:no_entry: Error`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                    return console.log(`Writing follow file: ${err}`);
                };
            });
            return post.embed(`Unfollower alert`, [[`___`, `${data.message.author.username} no longer follows ${userNick}! It was boring anyway.`, false]]); 
        });
    };
    follow.showList = function () {
        var userID = data.message.author.id;
        var fs = require('fs');

        fs.readFile(followersPath, 'utf8', (err, followerInfoJson) => {
            if (err) {
                post.embed(`:no_entry: Error`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                return console.log(`Reading follow file: ${err}`);
            };
            followerInfoJson = JSON.parse(followerInfoJson);
            for (i in followerInfoJson.Streamers) {
                if (followerInfoJson.Streamers[i].id == userID) {
                    var userFollowers = '';
                    for (j in followerInfoJson.Streamers[i].followers) {
                        try {
                            userFollowers = `${userFollowers}**${(parseInt(j) + 1)}**: ${data.message.channel.members.find('id', followerInfoJson.Streamers[i].followers[j]).user.username} \n`;
                        }
                        catch (err) { //when the guy following is no lnger on server
                            userFollowers = `${userFollowers}**${(parseInt(j) + 1)}**: ${followerInfoJson.Streamers[i].followers[j]} \n`;
                        }
                    }
                    return post.embed(`People wasting time on ${data.message.author.username}'s stream`, [[`___`, userFollowers, false]]);
                }
            };
            return post.embed(`Forever alone`, [[`___`, `No one follows ${data.message.author.username} yet. \n\nYou don't even have any friends. So sad.`, false]]);
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