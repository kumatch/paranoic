
module.exports = function () {
    return {
        fs: null,

        exists: function (filename) {
            return this.fs.existsSync(filename);
        }
    };
};

