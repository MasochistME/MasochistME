exports.Mods = function(data) {
	var mods = this;
	var Post = require(`../post.js`);
	var post = new Post.Post(data);
	var modsPath = `../data/mods.json`;

	mods.promote = function () {
		var fs = require('fs');
		var Input = require('../input.js');
		var input = new Input.Input();
		var modID = input.getIDOfMentionedPerson(data.message.content);
		var modExists = data.message.mentions.users.find('id', modID);

		if (!modID || !modExists)
			return post.embed(`:warning:`, [[`___`, `You didn't mention the person who you want to mod.`, false]]);
		var modNick = data.message.mentions.users.find('id', modID).username;

        fs.readFile(modsPath, `utf8`, (err, modsJson) => {
			if (err) {
				post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
				return console.log(`Reading mods file: ${err}`);
			}
			modsJson = JSON.parse(modsJson);
			if (mods.modIsOnTheList(modsJson.Moderators, modID) != -1)
				return post.message(`:warning: ${modNick} already is a moderator.`);
			modsJson.Moderators.push(modID);
            fs.writeFile(modsPath, JSON.stringify(modsJson), err => {
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
        fs.readFile(modsPath, 'utf8', (err, modsJson) => {
			if (err) {
				post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
				return console.log(`Reading mod file: ${err}`);
			};
			var modNick = data.message.mentions.users.find('id', modID).username;
			modsJson = JSON.parse(modsJson);

			if (mods.modIsOnTheList(modsJson.Moderators, modID) == -1)
				return post.embed(`:warning:`, [[`___`, `${modNick} is not a moderator.`, false]]);
			var id = mods.modIsOnTheList(modsJson.Moderators, modID);
			modsJson.Moderators.splice(id, 1);
            fs.writeFile(modsPath, JSON.stringify(modsJson), err => {
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

        fs.readFile(modsPath, 'utf8', (err, modsJson) => {
			if (err) {
				post.embed(`:no_entry:`, [[`___`, `Something went wrong <:SMB4:310138833377165312>`, false]]);
				return console.log(`Reading mod file: ${err}`);
			};
			modsJson = JSON.parse(modsJson);
			for (i in modsJson.Moderators) {
				try {
					modList += `**${(parseInt(i) + 1)}**: ${data.message.channel.members.find('id', modsJson.Moderators[i]).user.username}\n`;
				}
				catch (err) { //when the mod guy is no longer on server
					modList += `**${(parseInt(i) + 1)}**: ${modsJson.Moderators[i]}\n`;
				}
			}
			return post.embed(`List of moderators`, [[`___`, modList, false]]);
		});
	};

	mods.modIsOnTheList = function (input, desiredId) {
		for (i in input) {
			if (input[i] == desiredId)
				return i;
		};
		return -1;
	};
};