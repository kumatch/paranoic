
exports.example = {
    create: function (fs) {
        return {
            exists: function (filename) {
                return fs.existsSync(filename);
            }
        };
    }
};
