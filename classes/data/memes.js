var Post = require('../post.js');
var Input = require('../input.js');

exports.Memes = function (data) {
    var memes = this;
    var post = new Post.Post(data);
    var input = new Input.Input();
    var memesUrl = '../data/memes.json';
    var fs = require('fs');

    memes.add = function () {
        var newMeme = input.removeKeyword(data.message.content);

        fs.readFile(memesUrl, 'utf8', (err, memesJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading meme file: ${err}`);
            };
            memesJson = JSON.parse(memesJson);
            memesJson.Memes.push(newMeme);
            fs.writeFile(memesUrl, JSON.stringify(memesJson), err => {
                if (err) {
                    post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                    return console.log(`Writing memes file: ${err}`);
                };
                return post.message(`New meme added!`);
            });
        });
    };
    memes.show = function () {
        var RNG = require('../RNG.js');
        var rng = new RNG.RNG();
        var meme = '';

        fs.readFile(memesUrl, 'utf8', (err, memesJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading meme file: ${err}`);
            };
            memesJson = JSON.parse(memesJson);
            meme = `_"${memesJson.Memes[rng.chooseRandom(memesJson.Memes.length)]}"_`;
            return post.message(meme);
        });
    };
    memes.showList = function () {
        var memeList = '';

        fs.readFile(memesUrl, 'utf8', (err, memesJson) => {
            if (err) {
                post.message(`:no_entry: Something went wrong <:SMB4:310138833377165312>`);
                return console.log(`Reading meme file: ${err}`);
            };
            memesJson = JSON.parse(memesJson);
            for (i in memesJson.Memes) {
                if (memeList.length + memesJson.Memes[i].length > 1950) {
                    post.message(memeList);
                    memeList = '';
                }
                memeList += `**${i}** - ${memesJson.Memes[i]}\n`;
            }
            return post.message(memeList);
        });
    };
};