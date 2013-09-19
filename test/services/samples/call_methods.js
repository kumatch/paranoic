
module.exports = CallMethodsTest;

function CallMethodsTest () {
    this.name = undefined;
    this.fs = undefined;
}

CallMethodsTest.prototype.setName = function (name) {
    this.name = name;
};

CallMethodsTest.prototype.setFs = function (fs) {
    this.fs = fs;
};

CallMethodsTest.prototype.exists = function (filename) {
    return this.fs.existsSync(filename);
};