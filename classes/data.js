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
    data.database = '';

    data.whatServer = function (serverID) {
        switch (serverID) {
            case '263045520358899714': //0.1%
                {
                    data.vidChannel = '310035724328239105';
                    data.recChannel = '267070116649238539';
                    data.database = '312533236800815104';
                    break;
                }
            case '234740225782317057': //vikmains
                {
                    data.vidChannel = '310735697260707841';
                    data.recChannel = '310735697260707841';
                    data.database = '313255760320790529';
                    break;
                }
            default: return null; //zrobić tu żeby zwracało DM bota kiedy się gada z nim przez DM
        }
    };
}