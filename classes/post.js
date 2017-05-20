const Discord = require('discord.js');

exports.Post = function (data) {
    var post = this;

    post.editedMessage = function (userMessage, editedContent) {
        userMessage.edit(editedContent);
    };
    post.message = function (messageToPost) {
        data.message.channel.send(messageToPost);
    };
    post.messageToChannel = function (messageToPost, channelToPost) {
        data.bot.channels.get(channelToPost).send(messageToPost);
    };
    post.embed = function (title, embedTitleBodyAndArgs) {//messageToPost) {
        var embed = new Discord.RichEmbed()
            .setTitle(title)
            .setColor(0xB04300);
        for (var i = 0; i < embedTitleBodyAndArgs.length; i++) {
            embed.addField(embedTitleBodyAndArgs[i][0],
                embedTitleBodyAndArgs[i][1],
                embedTitleBodyAndArgs[i][2]);
            if (i === embedTitleBodyAndArgs.length - 1) {
                data.message.channel.send({ embed });
                break;
            }
        }
    };
    //TODO: zmienic zeby przyjmowal array of args[] i robił addField tak długo aż nie przyjmie wszystkich
    post.embedToChannel = function (title, embedTitleBodyAndArgs, channelToPost) {
        var embed = new Discord.RichEmbed()
            .setTitle(title)
            .setColor(0xB04300);
        for (var i = 0; i < embedTitleBodyAndArgs.length; i++) {
            embed.addField(embedTitleBodyAndArgs[i][0],
                embedTitleBodyAndArgs[i][1],
                embedTitleBodyAndArgs[i][2]);
            if (i === embedTitleBodyAndArgs.length - 1) {
                data.bot.channels.get(channelToPost).send({ embed });
                break;
            }
        }
    };
    post.reactionToMessage = function (reactionEmoji) {
        data.message.react(reactionEmoji);
    };
    post.newStatus = function (newStatus) {
        data.bot.user.setGame(newStatus);
    };
};