
module.exports = function (foo) {
    return {
        foo: foo || undefined,

        setFoo: function (v) {
            this.foo = v;
        }
    };
};
