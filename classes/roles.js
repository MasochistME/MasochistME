exports.Roles = function (member) {
    var roles = this;
    roles.user = member.id;

    roles.returnRoleIDIfExists = function (roleName) {
        try {
            return member.guild.roles.find('name', roleName).id;
        }
        catch (err) {
            console.log(`${roleName} role doesn't exist in the ${member.guild.name} server. ${err}`);
            return null;
        }
    };
    roles.userHasRole = function (roleName) {
        if (member.roles.has(roles.returnRoleIDIfExists(roleName)))
            return true;
        return false;
    };

    roles.addRoleToUser = function (roleName) {
        member.addRole(roles.returnRoleIDIfExists(roleName))
            .then(console.log(`${roleName} succesfully added to the ${member.user.username} user!`))
            .catch(console.error);
    };
    roles.removeRoleFromUser = function (roleName) {
        member.removeRole(roles.returnRoleIDIfExists(roleName))
            .then(console.log(`${roleName} succesfully removed from the ${member.user.username} user!`))
            .catch(console.error);
    };
};