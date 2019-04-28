exports.Mods = function(data) {
	var mods = this;
	var Post = require(`../post.js`);
	var post = new Post.Post(data);
    var serverDataPath = `../data/serverData.json`;

	mods.promote = function () {
		var fs = require('fs');
		var Input = require('../input.js');
        var input = new Input.Input();

		var modID = input.getIDOfMentionedPerson(data.message.content);
		var modExists = data.message.mentions.users.find('id', modID);

		if (!modID || !modExists)
			return post.embed(`:warning:`, [[`___`, `You didn't mention the person who you want to mod.`, false]]);
        fs.readFile(serverDataPath, `utf8`, (err, serverDataJson) => {
            if (err) {
                post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                return console.log(`Reading mods file: ${err}`);
            }
            var modNick = data.message.mentions.users.find('id', modID).username;
            serverDataJson = JSON.parse(serverDataJson);
            if (!mods.serverIsListed(serverDataJson))
                return;
            var modList = serverDataJson.Servers[mods.serverIndex(serverDataJson)].moderators;

            if (mods.modIsOnTheList(modList, modID) != -1)
                return post.embed(`:warning:`, [[`___`, `${modNick} already is a moderator.`, false]]);
            serverDataJson.Servers[mods.serverIndex(serverDataJson)].moderators.push(modID);
            fs.writeFile(serverDataPath, JSON.stringify(serverDataJson), err => {
                if (err) {
                    post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                    return console.log(`Writing mods file: ${err}`);
                };
            });
            post.embed(`Promotion!`, [[`___`, `${data.message.mentions.users.find('id', modID).username} is moderator now!`, false]]);
        });
	};
	mods.demote = function () {
		var fs = require('fs');
		var Input = require('../input.js');
		var input = new Input.Input();

		var modID = input.getIDOfMentionedPerson(data.message.content);
		var modExists = data.message.mentions.users.find('id', modID);

		if (!modID || !modExists)
			return post.embed(`:warning:`, [[`___`, `You didn't mention the person who you want to unmod.`, false]]);
        fs.readFile(serverDataPath, 'utf8', (err, serverDataJson) => {
            if (err) {
                post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                return console.log(`Reading mod file: ${err}`);
            };
            var modNick = data.message.mentions.users.find('id', modID).username;
            serverDataJson = JSON.parse(serverDataJson);
            if (!mods.serverIsListed(serverDataJson))
                return;
            var modList = serverDataJson.Servers[mods.serverIndex(serverDataJson)].moderators;

            if (mods.modIsOnTheList(modList, modID) == -1)
                return post.embed(`:warning:`, [[`___`, `${modNick} is not a moderator.`, false]]);
            var id = mods.modIsOnTheList(modList, modID);
            serverDataJson.Servers[mods.serverIndex(serverDataJson)].moderators.splice(id, 1);
            fs.writeFile(serverDataPath, JSON.stringify(serverDataJson), err => {
                if (err) {
                    post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                    return console.log(`Writing mod file: ${err}`);
                };
            });
            return post.embed(`Unmoding`, [[`___`, `${modNick} is no longer a mod. Shame.`, false]]);
        });
	};
	mods.showList = function () {
		var fs = require('fs');
		var modList = '';

        fs.readFile(serverDataPath, 'utf8', (err, serverDataJson) => {
            if (err) {
                post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                return console.log(`Reading mod file: ${err}`);
            };
            serverDataJson = JSON.parse(serverDataJson);
            if (!mods.serverIsListed(serverDataJson))
                return;
            var modJson = serverDataJson.Servers[mods.serverIndex(serverDataJson)].moderators;
            for (i in modJson) {
                try {
                    modList += `**${(parseInt(i) + 1)}**: ` +
                        `${data.message.channel.members.find('id', modJson[i]).user.username}`+
                        `\n`;
                }
                catch (err) { //when the mod guy is no longer on server
                    modList += `**${(parseInt(i) + 1)}**: ${modJson[i]}\n`;
                }
            }
            return post.embed(`List of moderators`, [[`___`, modList, false]]);
        });
	};

    mods.locateServer = function () {
        var fs = require('fs');
        var serverDataPath = '../data/serverData.json';

        fs.readFile(serverDataPath, 'utf8', (err, serverDataJson) => {
            if (err) {
                console.log(`Downloading server data: ${err}`);
                return post.message(`:warning: Downloading server data unsuccesful.`);
            }
            serverDataJson = JSON.parse(serverDataJson);
            for (i in serverDataJson.Servers) {
                if (serverDataJson.Servers[i].id == data.message.guild.id)
                    return post.message(`:warning: This server is already listed.`);
            };
            serverDataJson.Servers.push({
                "id": data.message.guild.id,
                "name": data.message.guild.name,
                "rooms": [{
                    "video": data.message.guild.defaultChannel.id,
                    "recommendations": data.message.guild.defaultChannel.id,
                    "log": data.message.guild.defaultChannel.id,
                    "meme": data.message.guild.defaultChannel.id,
                    "info": data.message.guild.defaultChannel.id,
                    "mod": data.message.guild.defaultChannel.id,
                    "follow": data.message.guild.defaultChannel.id,
                    "general": data.message.guild.defaultChannel.id
                }],
                "moderators": [data.message.guild.ownerID]
            });
            fs.writeFile(serverDataPath, JSON.stringify(serverDataJson), err => {
                if (err) {
                    post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
                    return console.log(`Writing server data file: ${err}`);
                };
                return post.embed(`Server data`, [[`___`, `**${data.message.guild.name}** data succesfully downloaded!`, false]]);
            });
        });
    };

    mods.restrictCommand = function () {
        return post.message(`Not implemented yet.`);
    };

    mods.serverIsListed = function (serverDataJson) {
        var serverListed = false;

        for (i in serverDataJson.Servers) {
            if (serverDataJson.Servers[i].id == data.message.guild.id)
                serverListed = true;
        };
        if (!serverListed) {
            post.embed(`:no_entry_sign: Error`, [[`___`, `To use this command, this server needs to be listed first!\n\n` +
                `To list this server, the server owner needs to use the \`\`/locateserver\`\` command.`, false]]);
            return false;
        }
        return true;
    };
    mods.serverIndex = function (serverDataJson) {
        for (i in serverDataJson.Servers) {
            if (serverDataJson.Servers[i].id == data.message.guild.id)
                return i;
        };
        return - 1;
    };
	mods.modIsOnTheList = function (input, desiredId) {
		for (i in input) {
			if (input[i] == desiredId)
				return i;
		};
		return -1;
	};
};