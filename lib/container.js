var _ = require('lodash');
var fs = require('fs');

var Parameters = require('./parameters');
var Services = require('./services');

var instanceFactory = require('./instance-factory');

module.exports = Container;

function Container(filename) {
    this.parameters = new Parameters();
    this.services = new Services(this.parameters);
    this.instances = {};

    // this.parameter_pattern = undefined;

    if (filename) {
        var self = this;

        if (!fs.existsSync(filename)) {
            throw Error( [ 'A file [', filename, '] is not exists.' ].join('') );
        }

        var configuration = require(filename);

        this.parameters.extend(configuration.parameters || {});

        _.each(configuration.services || {}, function (service_parameter, name) {
            self.register(name, service_parameter);
        });
    }
};

Container.prototype.setParameter = function (key, value) {
    this.parameters.set(key, value);
    return this;
};

Container.prototype.extendParameters = function (values) {
    this.parameters.extend(values);
    return this;
};

Container.prototype.getParameter = function (key) {
    return this.parameters.get(key);
};

Container.prototype.hasParameter = function (key) {
    return this.parameters.has(key);
};

Container.prototype.removeParameter = function (key) {
    this.parameters.remove(key);
    return this;
};

// Container.prototype.setParameterPattern = function (pattern) {
//     this.parameter_pattern = pattern;
// };



Container.prototype.register = function (name, params) {
    this.services.configure(name, params);
};

Container.prototype.get = function (name) {
    if (!this.services.has(name)) {
        return undefined;
    }

    var params = this.services.getParameter(name);
    var mod, service;

    if (params.persistence && this.instances[name]) {
        return this.instances[name];
    }


    if (params.factory.module) {
        mod = require(params.factory.module);
    } else if (params.factory.service) {
        mod = this.get(params.factory.service);
    }

    if (params.factory.property) {
        mod = mod[params.factory.property];
    }

    if (params.factory.arguments) {
        var args = this._createArguments(params.factory.arguments);
        var method = params.factory.method;

        if (method && typeof mod[method] !== 'function') {
            throw Error( [ '[service parameter: ', name, '] undefined factory method "', method, '".' ].join('') );
        }

        service = instanceFactory.create(mod, args, method);
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
    return this.services.has(name);
};


Container.prototype._callMethods = function (name, service, call_params) {
    var self = this;

    call_params.forEach(function (call_param) {
        var method = call_param.method;
        var args = self._createArguments(call_param.arguments || []);

        if (typeof service[method] === "function") {
            service[method].apply(service, args);
        } else {
            throw Error( [ '[service parameter: ', name, '] undefined method "', method, '".' ].join('') );
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

    if (_.isArray(args)) {
        return _.map(args, function (arg) {
            return self._createArguments(arg);
        });
    } else if (_.isObject(args)) {
        var results = {};

        _.each(args, function(arg, key) {
            results[key] = self._createArguments(arg);
        });

        return results;
    } else {
        return self._normalizeParameter(args);
    }
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
