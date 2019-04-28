var Input = require('./input.js');

exports.UserMessage = function (data) {
    var userMessage = this;
    var input = new Input.Input();

    userMessage.content = data.message.content;
    userMessage.authorName = data.message.author.username;
    userMessage.authorID = data.message.author.id;

    userMessage.hasCommandTrigger = function () {
        if (userMessage.content.startsWith('/'))
            return true;
        return false;
    };
    userMessage.hasCapsLockTrigger = function () {
        if (userMessage.content === userMessage.content.toUpperCase() && userMessage.content.length >= 15)
            return true;
        return false;
    };
};
