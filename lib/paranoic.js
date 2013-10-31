var _ = require('lodash');
var fs = require('fs');

var Container = require('./container');
var Parameters = require('./parameters');
var Services = require('./services');
var instanceFactory = require('./instance-factory');

module.exports = exports = Paranoic;

function Paranoic (params) {
    this.parameters = new Parameters();
    this.services = new Services(this.parameters);

    this._rootContainer = null;


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

    self.parameters.extend(configuration.parameters || {});

    _.each(configuration.services || {}, function (service_parameter, name) {
        self.register(name, service_parameter);
    });
};



Paranoic.prototype.setParameter = function (key, value) {
    this.parameters.set(key, value);
    return this;
};

Paranoic.prototype.extendParameters = function (values) {
    this.parameters.extend(values);
    return this;
};

Paranoic.prototype.getParameter = function (key) {
    return this.parameters.get(key);
};

Paranoic.prototype.hasParameter = function (key) {
    return this.parameters.has(key);
};

Paranoic.prototype.removeParameter = function (key) {
    this.parameters.remove(key);
    return this;
};

// Paranoic.prototype.setParameterPattern = function (pattern) {
//     this.parameter_pattern = pattern;
// };

Paranoic.prototype.register = function (name, params) {
    this.services.configure(name, params);
};

Paranoic.prototype.createContainer = function () {
    return Container.create(this);
};



Paranoic.prototype.get = function (name) {
    this.__callDeprecated('has');

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
