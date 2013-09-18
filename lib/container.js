var fs = require('fs');
var format = require('util').format;
var breath = require('breath');

var Setting = require('./setting');

module.exports = Container;

function Container(filename) {
    this.settings = {};
    this.parameters = {};
    // this.parameter_pattern = undefined;

    if (filename) {
        var self = this;

        if (!fs.existsSync(filename)) {
            throw Error('A file [' + filename + '] is not exists.');
        }

        var configuration = require(filename);

        this.parameters = configuration.parameters || {};

        var services = configuration.services || {};
        var entry_names = Object.keys(services);
        entry_names.forEach(function (entry_name) {
            self.register(entry_name, services[entry_name]);
        });
    }
};

Container.prototype.setParameter = function (key, value) {
    this.parameters[key] = value;
};

Container.prototype.getParameter = function (key) {
    return this.parameters[key];
};

Container.prototype.hasParameter = function (key) {
    return (typeof this.parameters[key] !== 'undefined') ? true : false;
};

// Container.prototype.setParameterPattern = function (pattern) {
//     this.parameter_pattern = pattern;
// };



Container.prototype.register = function (name, param) {
    this.settings[name] = Setting(param);
};

Container.prototype.get = function (name) {
    if (!this.settings[name]) {
        return undefined;
    }

    var setting = breath(this.settings[name]).createSync(this.parameters);
    var mod, service;

    if (typeof setting.module === 'string') {
        mod = require(setting.module);
    } else {
        mod = setting.module;
    }


    if (setting.instance) {
        // constructor injection
        var args = this._createArguments(setting.instance.arguments || []);
        var method = setting.instance.method || undefined;
        service = newInstance(mod, args, method);
    } else {
        service = mod;
    }

    // setter injection
    this._callMethods(name, service, setting.calls);
    // property injection
    this._setProperties(service, setting.properties);

    return service;
};

Container.prototype.has = function (name) {
    return this.settings[name] ? true : false;
};


Container.prototype._callMethods = function (name, service, call_params) {
    var self = this;

    call_params.forEach(function (call_param) {
        var method = call_param.method;
        var args = self._createArguments(call_param.arguments || []);

        if (typeof service[method] === "function") {
            service[method].apply(service, args);
        } else {
            throw Error(format('undefined method "%s" in %s service', method, name));
        }
    });
};





Container.prototype._setProperties = function (service, properties) {
    var self = this;
    var keys = Object.keys(properties);

    keys.forEach(function (key) {
        var param = self._normalizeParameter(properties[key]);
        service[key] = param || properties[key];
    });
};

Container.prototype._createArguments = function (args) {
    var self = this;
    var results = [];

    args.forEach(function (arg) {
        var param = self._normalizeParameter(arg);
        results.push(param || arg);
    });

    return results;
};

Container.prototype._normalizeParameter = function (param) {
    if (typeof param !== 'string') {
        return param;
    }

    var matches = param.match(/^@(.+)$/);

    if (!matches) {
        return param;
    } else {
        return this.get(matches[1]);
    }
};



function newInstance (F, args, method) {
    var o, r;

    if (typeof F === "function") {
        o = Object.create(F.prototype);
        r = F.apply(o, args);
    } else {
        o = Object.create(F);
        r = F[method].apply(o, args);
    }

    return (r != null && r instanceof Object) ? r : o;
}