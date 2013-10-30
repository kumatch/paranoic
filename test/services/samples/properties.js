
module.exports = function () {
    return {
        name: undefined,
        fs: undefined,

        exists: function (filename) {
            return this.fs.existsSync(filename);
        }
    };
};
