var _ = require('lodash');
var fs = require('fs');

var Container = require('./container');
var Parameters = require('./parameters');
var Services = require('./services');

module.exports = exports = Paranoic;

exports.create = function (params){
    return new Paranoic(params);
};


function Paranoic (params) {
    this._rootParameters = new Parameters();
    this._rootContainer = null;

    // this.services = Services();
    this.services = Services();


    if (typeof params === 'object') {
        this._initialize(params);
    } else if (typeof params === 'string') {
        var configuration;

        try {
            configuration = JSON.parse(params);
        } catch (e) {
            var filename = params;
            if (!fs.existsSync(filename)) {
                throw Error( [ 'A file [', filename, '] is not exists.' ].join('') );
            }

            configuration = require(filename);
        }

        this._initialize(configuration);
    }
}

Paranoic.prototype._initialize = function (configuration) {
    var self = this;

    self._rootParameters.extend(configuration.parameters || {});

    _.each(configuration.services || {}, function (service_parameter, name) {
        self.register(name, service_parameter);
    });
};



Paranoic.prototype.getRootParameters = function () {
    return this._rootParameters;
};

Paranoic.prototype.setParameter = function (key, value) {
    this._rootParameters.set(key, value);
    return this;
};

Paranoic.prototype.extendParameters = function (values) {
    this._rootParameters.extend(values);
    return this;
};

Paranoic.prototype.getParameter = function (key) {
    return this._rootParameters.get(key);
};

Paranoic.prototype.hasParameter = function (key) {
    return this._rootParameters.has(key);
};

Paranoic.prototype.removeParameter = function (key) {
    this._rootParameters.remove(key);
    return this;
};

// Paranoic.prototype.setParameterPattern = function (pattern) {
//     this._rootParameter_pattern = pattern;
// };

Paranoic.prototype.register = function (name, params) {
    this.services.configure(name, params);
};

Paranoic.prototype.createContainer = function () {
    return Container.create(this);
};



Paranoic.prototype.get = function (name) {
    this.__callDeprecated('get');

    if (!this._rootContainer) {
        this._rootContainer = this.createContainer();
    }

    return this._rootContainer.get(name);
};

Paranoic.prototype.has = function (name) {
    this.__callDeprecated('has');

    if (!this._rootContainer) {
        this._rootContainer = this.createContainer();
    }

    return this._rootContainer.has(name);
};


Paranoic.prototype.__callDeprecated = function (methodName) {
    var method = methodName + '()';
    var message = [ 'paranoic.', method,
                    ' is deprecated. Create container instance [ paranoic.createContainer() ] and call ',
                    method ].join('');
    console.warn(message);
};
