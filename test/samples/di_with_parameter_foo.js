
module.exports = function (name) {
    return {
        name: name || undefined,

        setName: function (v) {
            this.name = v;
        }
    };
};

