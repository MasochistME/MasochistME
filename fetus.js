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
	var response=new Response.Response(message, bot.channels);
	response.whatServer(message.channel.guild.id);
	
	if (response.hasCommandTrigger())
		response.toCommand();
	if (response.hasReactionTrigger())
		response.toReactionTrigger();
	if (response.hasStatusChangeTrigger())
		response.toStatusChangeTrigger();
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