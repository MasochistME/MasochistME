exports.Database = function (response, databaseChannel) {
    var base = this;

    base.databaseExists = function (type) {
        databaseChannel.fetchMessages()
            .then(messages => {
                messages.forEach(function (value, key) {
                    var msg = value.content;
                    if (msg.toLowerCase().startsWith(type)) {
                        console.log('Yay!!!!!!');
                        return true; //asynchronously fucks that up
                    }
                });
                return false; //asynchronously fucks that up
            })
            .catch(error => {
                console.log(`An error occured during checking existence - ${error}`);
                return false;
            });
    };
    base.createDatabase = function (type) {
        response.postMessageToChannel(type.toUpperCase(), response.database);
        return;
    };
    base.addToDatabase = function(type, whoToFollow, whoFollows) {
        databaseChannel.fetchMessages()
            .then(messages => {
                messages.forEach(function (value, key) {
                    var msg = value.content;
                    if (msg.toLowerCase().startsWith(type)) {
                        databaseChannel.messages[key].edit(whoFollows + " follows " + whoToFollow); //it says it's undefined, dunno why
                    }
                });
            })
            .catch(error => {
                console.log(`An error occured during adding - ${error}`);
            });
    };
};