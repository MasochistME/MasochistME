const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.DISCORD_TOKEN);
var Response = require('./classes/response.js');
var Roles = require('./classes/roles.js');
var Stream = require('./classes/stream.js');
var Data = require('./classes/data.js');


bot.on('ready', () => {
  console.log('I am ready! '+bot.user.id);
  bot.user.setGame('/h for help');
});

bot.on('message', message => {
    var data = new Data.Data(message, bot); //poprzez date podawac dalej wszystkie message, bot, ID etc
    var response = new Response.Response(data);
    try {
        data.whatServer(message.channel.guild.id);
    }
    catch (err) {
        console.log(`\n\n!!! MESSAGE SENT IN DM, CAN'T FETCH SERVER DATA !!!\n ${err}\n\n`);
    }

    try {
        if (message.author.id !== bot.user.id) {
            if (message.channel.id==response.database)
                return message.delete();
            response.toReactionTrigger();
            if (response.hasCommandTrigger())
                return response.toCommand();
            response.toKeyword();
        }
    }
    catch (err) {
        console.log(`\n\n!!! ${err} !!!\n\n`);
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