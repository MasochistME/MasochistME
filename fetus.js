const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.DISCORD_TOKEN);
var Response = require('./classes/response.js');
var Roles = require('./classes/roles.js');
var Stream = require('./classes/stream.js');


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

bot.on('presenceUpdate', (oldMember, newMember) => {
    var roles = new Roles.Roles(newMember);
    var stream = new Stream.Stream(newMember);
    var game = newMember.presence.game;
    
	if (game && game.url)
        stream.addStreamingRoleIfTheyDontHaveItYet();
	if (!game || (game && !game.url))
        stream.removeStreamingRoleIfTheyStoppedStreaming();
});