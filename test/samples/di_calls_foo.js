
module.exports = function () {
    var fs;

    return {
        setFs: function (mod) {
            fs = mod;
        },

        exists: function (filename) {
            return fs.existsSync(filename);
        }
    };
};

