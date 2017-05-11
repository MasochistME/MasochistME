const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.DISCORD_TOKEN);
var Response = require('./response.js');
var Roles = require('./roles.js');


bot.on('ready', () => {
  console.log('I am ready! '+bot.user.id);
  bot.user.setGame('/h for help');
});

bot.on('message', message => {
    var response = new Response.Response(message, bot.channels, bot.user);
    try {
        response.whatServer(message.channel.guild.id);
    }
    catch (err) {
        console.log('\n\n!!! PROBABLY DM PROBLEM !!!\n\n'+err);
    }

    try {
        if (message.author.id !== bot.user.id) {
            if (response.hasReactionTrigger())
                response.toReactionTrigger();
            if (response.hasCommandTrigger())
                return response.toCommand();
            return response.toKeyword();
        }
    }
    catch (err) {
        console.log('\n\n!!! SOME BIGGER BUG !!!\n\n'+err);
    }
});

bot.on('presenceUpdate', presence => {
	var roles=new Roles.Roles(presence);		
	var game=presence.frozenPresence.game;	
	
	if (game && game.url) 
	{	
		console.log(game.url);
		if (!roles.hasStreamingRole())
			roles.setNewRole('streaming');
	}
	if (!game || (game && !game.url))
	{
		if (roles.hasStreamingRole())
			roles.removeRole('streaming');
	}
});