
module.exports = Hello;

function Hello (name) {
    this.name = name ? name : 'world';
}

Hello.prototype.say = function () {
    return 'hello, ' + this.name;
};
