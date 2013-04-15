var format = require('util').format;

module.exports = Paranoic;

function Paranoic() {
    this.services = {};
}

Paranoic.prototype.register = function (name, params) {
    this.services[name] = normalizeRegisterParameters(params);
};

Paranoic.prototype.get = function (name) {
    if (!this.services[name]) {
        return undefined;
    }

    var params = this.services[name];

    if (params.parameters) {
        return params.parameters;
    }

    var mod = require(params.module);
    var service;

    if (!params.instance) {
        service = mod;
    } else {
        var args = this._createArguments(params.instance.arguments || []);
        var method = params.instance.method || undefined;
        service = newInstance(mod, args, method);
    }

    this._callMethods(name, service, (params.calls || []) );
    this._setProperties(service, (params.properties || []) );

    return service;
};

Paranoic.prototype._createArguments = function (args) {
    var self = this;
    var results = [];

    args.forEach(function (arg) {
        var param = self._normalizeParameter(arg);
        results.push(param || arg);
    });

    return results;
};

Paranoic.prototype._callMethods = function (name, service, call_params) {
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

Paranoic.prototype._setProperties = function (service, properties) {
    var self = this;
    var keys = Object.keys(properties);

    keys.forEach(function (key) {
        var param = self._normalizeParameter(properties[key]);
        service[key] = param || properties[key];
    });
};

Paranoic.prototype._normalizeParameter = function (param) {
    if (typeof param !== 'string') {
        return param;
    }

    var matches = param.match(/^@(.+)$/);
    if (!matches) {
        return param;
    }

    var service_name = matches[1];

    return this.get(service_name);
};



function normalizeRegisterParameters (params) {
    if (!params || typeof params !== 'object') {
        throw Error('invalid parameters.');
    }

    if (!params.module && !params.parameters) {
        throw Error('invalid parameters.');
    }

    return params;
}

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
