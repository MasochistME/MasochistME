exports.Roles = function (presence) {
    var roles = this;
    roles.user = presence.guild.member(presence.user.id);
    roles.list = presence._roles;
    roles.streamingRole = '310767157153759243'; //'310767157153759243'; //for 0.1%

    roles.hasStreamingRole = function () {
        for (var i = 0; i < roles.list.length; i++) {
            if (roles.list[i] === roles.streamingRole)
                return true;
        }
        return false;
    };
    roles.setNewRole = function (desiredRole) {
        switch (desiredRole) {
            case 'streaming':
                return roles.user.addRole(roles.streamingRole);
            default: break;
        }
    };
    roles.removeRole = function (roleToRemove) {
        switch (roleToRemove) {
            case 'streaming':
                return roles.user.removeRole(roles.streamingRole);
            default: break;
        }
    };
};