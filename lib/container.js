var Parameters = require('./parameters');

exports.create = function (paranoic) {
    var parameters = new Parameters({}, paranoic.getRootParameters());
    var instances = {};

    var container = {
        setParameter: function (key, value) {
            parameters.set(key, value);
            return this;
        },

        extendParameters: function (values) {
            parameters.extend(values);
            return this;
        },

        getParameter: function  (key) {
            return parameters.get(key);
        },

        hasParameter: function (key) {
            return parameters.has(key);
        },

        removeParameter: function (key) {
            parameters.remove(key);
            return this;
        },


        has: function (name) {
            return paranoic.services.has(name);
        },


        get: function (name) {
            if (instances[name]) {
                return instances[name];
            }

            if (!paranoic.services.has(name)) {
                return undefined;
            }

            var service = paranoic.services.generate(name, this, parameters.all());

            if (service.persistence) {
                instances[name] = service.instance;
            }

            return service.instance;
        },

        set: function (name, service) {
            instances[name] = service;
        }
    };

    return container;
};


