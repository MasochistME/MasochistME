var Roles = require('./roles.js');

exports.Stream = function (member) {
    var stream = this;
    var roles = new Roles.Roles(member);

    stream.addStreamingRoleIfTheyDontHaveItYet = function () {
        var roleName = 'Live Stream';
        if (!roles.userHasRole(roleName)) {
            roles.addRoleToUser(roleName);
            console.log(`${member.user.username} started streaming!`);
        }
    };
    stream.removeStreamingRoleIfTheyStoppedStreaming = function () {
        var roleName = 'Live Stream';
        if (roles.userHasRole(roleName)) {
            roles.removeRoleFromUser(roleName);
            console.log(`${member.user.username} stopped streaming!`);
        }
    };
};