var Roles = require('./roles.js');

exports.Stream = function (member, data) {
    var stream = this;
    var roles = new Roles.Roles(member);

    stream.addStreamingRoleIfTheyDontHaveItYet = function () {
        var roleName = 'Live Stream';
        var d = new Date();

        if (!roles.userHasRole(roleName)) {
            roles.addRoleToUser(roleName);
            stream.informFollowers();
            console.log(`\n${d} - ${member.user.username} started streaming!`);
        }
    };
    stream.removeStreamingRoleIfTheyStoppedStreaming = function () {
        var roleName = 'Live Stream';
        var d = new Date();

        if (roles.userHasRole(roleName)) {
            roles.removeRoleFromUser(roleName);
            console.log(`\n${d} - ${member.user.username} stopped streaming!`);
        }
    };
    stream.informFollowers = function () {
        var fs = require('fs');
        var followersPath = '../data/follow.json';

        fs.readFile(followersPath, 'utf8', (err, followerInfoJson) => {
            if (err)
                return console.log(`Reading follow file for stream: ${err}`);
            followerInfoJson = JSON.parse(followerInfoJson);
            for (i in followerInfoJson.Streamers) {
                if (followerInfoJson.Streamers[i].id == member.user.id) {
                    var userFollowers = '**Tagging:** ';
                    for (j in followerInfoJson.Streamers[i].followers)
                        userFollowers += `${member.guild.members.find('id', followerInfoJson.Streamers[i].followers[j]).user.toString()} `;
                    var Post = require('./post.js');
                    var post = new Post.Post(data);

                    post.embedToChannel(`${member.user.username} started streaming!`, [[`___`, `${member.presence.game.url}`, false]], data.strChannel);
                    post.messageToChannel(userFollowers, data.strChannel);
                    return;
                }
            };
        });
    };
};