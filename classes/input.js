/**
 * This class performs basic, Discord specific string operations.
 *
 * @param NaN
 */

exports.Input = function () {
    var input = this;

    input.extractKeyword = function (_input) {
        var output = _input.slice(1).trim();
        if (output.indexOf(' ') !== -1)
            output = output.slice(0, output.indexOf(' ')).trim();
        return output;
    };
    input.removeKeyword = function (_input) {
        var output = _input.slice(_input.indexOf(' ')).trim();
        return output;
    };
    input.subStringBySymbol = function (_input, symbol) {
        var first = _input.substring(0, _input.indexOf(symbol)).trim();
        var second = _input.substring(_input.indexOf(symbol)).trim();
        return [first, second];
    };
    input.getIDOfMentionedPerson = function (_input) {
        var output = input.removeKeyword(_input);
        output = output.substring(2, output.length - 1);
        return output;
    };
    input.isLink = function (supposedLink) {
        if (supposedLink.startsWith('http'))
            return true;
        return false;
    };
};