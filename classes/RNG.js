exports.RNG = function () {
    var rng = this;

    rng.happensWithAChanceOf = function (percentageChance) {
        var drawnNumber = Math.floor((Math.random() * 100) + 1);
        if (drawnNumber <= percentageChance)
            return true;
        return false;
    };
    rng.chooseRandom = function (arrayLength) {
        return Math.floor(Math.random() * arrayLength);
    };
};