var keyplace = require('keyplace');
var regex = /#\{(\w+)\}/;

module.exports = Container;

function Container() {
    this.settings = {};
};

Container.prototype.set = function (name, setting) {
    this.settings[name] = setting;
};

Container.prototype.get = function (name, module_path) {
    var setting = this.settings[name];
    var mod, service;

    if (!setting) {
        return undefined;
    }

    if (setting.isParameter()) {
        return setting.parameters;
    }

    if (typeof setting.module === 'string') {
        var path = keyplace(setting.module, regex).format(module_path).toString();
        mod = require(path);
    } else {
        mod = setting.module;
    }


    if (setting.instance) {
        // constructor injection
        var args = this._createArguments(setting.instance.arguments || [], module_path);
        var method = setting.instance.method || undefined;
        service = newInstance(mod, args, method);
    } else {
        service = mod;
    }

    // setter injection
    this._callMethods(name, service, setting.calls, module_path);
    // property injection
    this._setProperties(service, setting.properties, module_path);

    return service;
};

Container.prototype.has = function (name) {
    return this.settings[name] ? true : false;
};


Container.prototype._callMethods = function (name, service, call_params, module_path) {
    var self = this;

    call_params.forEach(function (call_param) {
        var method = call_param.method;
        var args = self._createArguments(call_param.arguments || [], module_path);

        if (typeof service[method] === "function") {
            service[method].apply(service, args);
        } else {
            throw Error(format('undefined method "%s" in %s service', method, name));
        }
    });
};

Container.prototype._setProperties = function (service, properties, module_path) {
    var self = this;
    var keys = Object.keys(properties);

    keys.forEach(function (key) {
        var param = self._normalizeParameter(properties[key], module_path);
        service[key] = param || properties[key];
    });
};

Container.prototype._createArguments = function (args, module_path) {
    var self = this;
    var results = [];

    args.forEach(function (arg) {
        var param = self._normalizeParameter(arg, module_path);
        results.push(param || arg);
    });

    return results;
};

Container.prototype._normalizeParameter = function (param, module_path) {
    if (typeof param !== 'string') {
        return param;
    }

    var matches = param.match(/^@(.+)$/);
    if (!matches) {
        return param;
    }

    var service_name = matches[1];

    return this.get(service_name, module_path);
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
