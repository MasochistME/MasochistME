/**
 * This is a class which stores all the consts that main events return, and which are crucial to other classes.
 * Its purpose is to gather all the consts needed in other classes, so passing multiple, hard to remember arguments, to every class can be avoided.
 * In such case just pass the Data() object which was crated initially in the event and you're set.
 *
 * Stores also IDs of "special" channels that normally would be storedin a database, but I am noob and can't into databases... yet.
 *
 * @param message - for fetching author ID, channel ID, message contents etc
 * @param bot     - for fetching bot's ID, guilds and channels
 */

exports.Data = function (message, bot) {
    var data = this;
    data.message = message;
    data.bot = bot;

    data.vidChannel = '';
    data.recChannel = '';
    data.genChannel = '';
    data.strChannel = '';

    data.arrayOfMods = '';

    data.loadServerData = function (callback) {
        if (data.message.guild != null) { //if it was send in guild channel, not in DM
            var fs = require('fs');
            var serverDataPath = '../data/serverData.json';

            fs.readFile(serverDataPath, 'utf8', (err, serverDataJson) => {
                serverDataJson = JSON.parse(serverDataJson);
                if (data.serverIsListed(serverDataJson)) {
                    data.arrayOfMods = serverDataJson.Servers[data.serverIndex(serverDataJson)].moderators;
                    return callback();
                    // add all the logic of server initial data here!!!!!!!!!
                }
                data.arrayOfMods = data.message.guild.ownerID;
                return callback();
            });
        }
    };

    data.whatServer = function (serverID) {
        switch (serverID) {
            case '263045520358899714': //0.1%
                {
                    data.genChannel = '263045520358899714';
                    data.vidChannel = '310035724328239105';
                    data.recChannel = '267070116649238539';
                    data.strChannel = '337592878140227585';
                    data.logChannel = '315248444316975125';
                    break;
                }
            case '234740225782317057': //arcytesting
                {
                    data.genChannel = '234740225782317057';
                    data.vidChannel = '310735697260707841';
                    data.recChannel = '310735697260707841';
                    data.strChannel = '310735697260707841';
                    data.logChannel = '310735697260707841';
                    break;
                }
            default: return null; //zrobić tu żeby zwracało DM bota kiedy się gada z nim przez DM
        }
    };

    data.serverIsListed = function (serverDataJson) {
        if (data.message){
            for (i in serverDataJson.Servers) {
                if (serverDataJson.Servers[i].id == data.message.guild.id)
                    return true;
            };
        }
        return false;
    };
    data.serverIndex = function (serverDataJson) {
        for (i in serverDataJson.Servers) {
            if (serverDataJson.Servers[i].id == data.message.guild.id)
                return i;
        };
        return -1;
    };
    data.userIsNotThisBot = function () {
        if (message.author.id !== bot.user.id)
            return true;
        return false;
    };
}