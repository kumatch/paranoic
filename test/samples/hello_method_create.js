
exports.createInstance = function (name) {
    return {
        say: function () {
            return 'hello, ' + (name || "world");
        }
    };
};
