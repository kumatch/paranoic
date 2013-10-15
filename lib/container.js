var _ = require('lodash');
var fs = require('fs');
var format = require('util').format;
var breath = require('breath');
var nestraight = require('nestraight');

var service = require('./service');

module.exports = Container;

function Container(filename) {
    this.services = {};
    this.parameters = {};
    this.instances = {};

    // this.parameter_pattern = undefined;

    if (filename) {
        var self = this;

        if (!fs.existsSync(filename)) {
            throw Error('A file [' + filename + '] is not exists.');
        }

        var configuration = require(filename);

        this.parameters = configuration.parameters || {};

        var services = configuration.services || {};

        _.each(services, function (service_parameter, name) {
            self.register(name, service_parameter);
        });
    }
};

Container.prototype.setParameter = function (key, value) {
    nestraight.set(this.parameters, key, value);
};

Container.prototype.extendParameters = function (parameters) {
    _.extend(this.parameters, parameters);
};

Container.prototype.getParameter = function (key) {
    return nestraight.get(this.parameters, key);
};

Container.prototype.hasParameter = function (key) {
    return nestraight.has(this.parameters, key);
};

Container.prototype.removeParameter = function (key) {
    nestraight.del(this.parameters, key);
};

// Container.prototype.setParameterPattern = function (pattern) {
//     this.parameter_pattern = pattern;
// };



Container.prototype.register = function (name, param) {
    this.services[name] = service(name, param);
};

Container.prototype.get = function (name) {
    if (!this.services[name]) {
        return undefined;
    }

    var params = breath(this.services[name]).createSync(this.parameters);
    var mod, service;

    if (params.persistence && this.instances[name]) {
        return this.instances[name];
    }


    if (params.factory.module) {
        mod = require(params.factory.module);
    } else if (params.factory.service) {
        mod = this.get(params.factory.service);
    }


    if (params.factory.arguments) {
        var args = this._createArguments(params.factory.arguments);
        var method = params.factory.method;
        service = newInstance(mod, args, method);
    } else {
        service = mod;
    }

    this._callMethods(name, service, params.calls);
    this._setProperties(service, params.properties);

    if (params.persistence) {
        this.instances[name] = service;
    }

    return service;
};

Container.prototype.has = function (name) {
    return this.services[name] ? true : false;
};


Container.prototype._callMethods = function (name, service, call_params) {
    var self = this;

    call_params.forEach(function (call_param) {
        var method = call_param.method;
        var args = self._createArguments(call_param.arguments || []);

        if (typeof service[method] === "function") {
            service[method].apply(service, args);
        } else {
            throw Error(format('[service parameter: %s] undefined method "%s".', name, method));
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
