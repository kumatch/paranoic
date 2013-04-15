var fs = require('fs');
var format = require('util').format;

var Container = require('./container');
var Setting = require('./setting');

module.exports = Paranoic;

function Paranoic(filename, module_path) {
    this.container = new Container();
    this.module_path = module_path || {};

    if (filename) {
        var self = this;

        if (!fs.existsSync(filename)) {
            throw Error('A file [' + filename + '] is not exists.');
        }

        var configuration = require(filename);
        var services = configuration.services || {};
        var entry_names = Object.keys(services);

        entry_names.forEach(function (entry_name) {
            self.register(entry_name, services[entry_name]);
        });
    }
}

Paranoic.prototype.register = function (name, params) {
    this.container.set(name, Setting(params));
};

Paranoic.prototype.get = function (name) {
    return this.container.get(name, this.module_path);
};
