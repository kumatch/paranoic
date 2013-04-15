
module.exports = Bar;

function Bar () {
    this.foo;
    this.undef;
    this.list;
    this.obj;
}

Bar.prototype.setFoo = function (foo) {
    this.foo = foo;
};

Bar.prototype.setUndef = function (undef) {
    this.undef = undef;
};

Bar.prototype.setList = function (list) {
    this.list = list;
};

Bar.prototype.setObj = function (obj) {
    this.obj = obj;
};