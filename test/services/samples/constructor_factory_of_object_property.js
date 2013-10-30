
exports.example = ConstructorFactoryTest;

function ConstructorFactoryTest(fs) {
    this.fs = fs;
}

ConstructorFactoryTest.prototype.exists = function (filename) {
    return this.fs.existsSync(filename);
};

