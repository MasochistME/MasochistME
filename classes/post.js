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
    post.reactionToMessage = function (reactionEmoji) {
        data.message.react(reactionEmoji);
    };
    post.newStatus = function (newStatus) {
        data.bot.user.setGame(newStatus);
    };
};