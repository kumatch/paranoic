
exports.example = function (fs) {
    return {
        exists: function (filename) {
            return fs.existsSync(filename);
        }
    };
};
