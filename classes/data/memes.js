var Post = require('../post.js');
var Input = require('../input.js');

exports.Memes = function (data) {
    var memes = this;
    var post = new Post.Post(data);
    var input = new Input.Input();
    var memeData = '../data/memes.json';

    memes.add = function () {
        return post.message(`Not implemented yet!`);
    };
    memes.show = function () {
        return post.message(`Not implemented yet!`);
    };
    memes.showList = function () {
        return post.message(`Not implemented yet!`);
    };

    /*
    if (typeOfRequest == `show`) {
        var fetusAnswerArrays = new FetusAnswerArrays.FetusAnswerArrays();
        var meme = `_"${fetusAnswerArrays.memes[rng.chooseRandom(fetusAnswerArrays.memes.length)]}"_`;

        return post.message(meme);
    };
    if (typeOfRequest == `add`) {
        return post.message(`Not implemented yet.`); //TODO
    };*/
};