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
    try {
        data.whatServer(message.channel.guild.id);
    }
    catch (err) {
        console.log(`\n\n!!! MESSAGE SENT IN DM, CAN'T FETCH SERVER DATA !!!\n ${err}\n\n`);
    }

    try {
        if (message.author.id !== bot.user.id) {
            var response = new Response.Response(data);

            if (message.channel.id==response.database)
                return message.delete();
            if (response.hasCapsLockTrigger())
                response.toCapsLock();
            response.toEmoteReactionTrigger();
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

bot.on('messageUpdate', (oldMessage, newMessage) => {
    var data = new Data.Data(oldMessage, bot);

    try { data.whatServer(oldMessage.channel.guild.id); }
    catch (err) { }//this triggers when message was sent in DM

    try {
        if (data.userIsNotThisBot()) {
            var embed = new Discord.RichEmbed()
                .setTitle(`MESSAGE EDITED`)
                .setColor(0x83C4F2)
                .setDescription(`**Author:** \`\`${oldMessage.author.username}#${oldMessage.author.discriminator}\`\`` +
                `\n**Timestamp:**\`\`${oldMessage.createdTimestamp}\`\`` +
                `\n**Channel:** <#${oldMessage.channel.id}>`)
                .addField(`Old message`,
                `\n\`\`\`${oldMessage.content}\`\`\``, true)
                .addField(`New message`,
                `\n\`\`\`${newMessage.content}\`\`\``, true);
            bot.channels.get(data.logChannel).send({ embed });
        }
    }
    catch (err) {
        console.log('\n\BUG IN MESSAGE UPDATE EVENT\n' + err);
    }
});

bot.on('messageDelete', message => {
    var data = new Data.Data(message, bot);

    try { data.whatServer(message.channel.guild.id); }
    catch (err) { }//this triggers when message was sent in DM

    try {
        if (data.userIsNotThisBot()) {
            var embed = new Discord.RichEmbed()
                .setTitle(`MESSAGE DELETED`)
                .setColor(0xC70000)
                .setDescription(`**Author:** \`\`${message.author.username}#${message.author.discriminator}\`\`` +
                `\n**Timestamp:**\`\`${message.createdTimestamp}\`\`` +
                `\n**Channel:** <#${message.channel.id}>`)
                .addField(`Content`,
                `\n\`\`\`${message.content}\`\`\``, false)
            bot.channels.get(data.logChannel).send({ embed });
        }
    }
    catch (err) {
        console.log('\n\BUG IN MESSAGE DELETE EVENT\n' + err);
    }
});

bot.on('guildMemberAdd', GuildMember => {
    var data = new Data.Data('', bot);

    try { data.whatServer(GuildMember.guild.id); }
    catch (err) { }//this triggers when message was sent in DM

    var embed = new Discord.RichEmbed()
        .setTitle(`USER JOINS`)
        .setColor(0x51E61C)
        .setDescription(`**User:** \`\`${GuildMember.user.username}#${GuildMember.user.discriminator}\`\`` +
        `\n**Joined at:**\`\`${GuildMember.joinedAt}\`\``);
    bot.channels.get(data.logChannel).send({ embed });
});

bot.on('guildMemberRemove', GuildMember => {
    var data = new Data.Data('', bot);
    var d = new Date();

    try { data.whatServer(GuildMember.guild.id); }
    catch (err) { }//this triggers when message was sent in DM

    var embed = new Discord.RichEmbed()
        .setTitle(`USER LEAVES`)
        .setColor(0xFDC000)
        .setDescription(`**User:** \`\`${GuildMember.user.username}#${GuildMember.user.discriminator}\`\`` +
        `\n**Leaves at:** \`\`${d}\`\``);
    bot.channels.get(data.logChannel).send({ embed });
});