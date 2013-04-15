
module.exports = function (name) {
    return {
        say: function () {
            return 'hello, ' + (name || "world");
        }
    };
};
