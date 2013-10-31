var _ = require('lodash');
var breath = require('breath');

var Parameters = require('./parameters');
var Services = require('./services');

var instanceFactory = require('./instance-factory');


exports.create = function (paranoic) {
    var parameters = new Parameters({}, paranoic.parameters);
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
            if (!paranoic.services.has(name)) {
                return undefined;
            }

            // var params = paranoic.services.getParameter(name);
            var params = breath(paranoic.services.configurations[name]).createSync(parameters.all());


            var mod, service;

            if (params.persistence && instances[name]) {
                return instances[name];
            }


            if (params.factory.module) {
                mod = require(params.factory.module);
            } else if (params.factory.service) {
                mod = container.get(params.factory.service);
            }

            if (params.factory.property) {
                mod = mod[params.factory.property];
            }


            if (params.factory.call) {
                var args = createArguments(params.factory.call.arguments || []);
                var method = params.factory.call.method;

                if (method && typeof mod[method] !== 'function') {
                    throw Error( [ '[service parameter: ', name, '] undefined factory method "', method, '".' ].join('') );
                }

                service = instanceFactory.create(mod, args, method);
            } else {
                service = mod;
            }




            callMethods(name, service, params.calls);
            setProperties(service, params.properties);

            if (params.persistence) {
                instances[name] = service;
            }

            return service;
        }
    };


    function callMethods (name, service, call_params) {
        call_params.forEach(function (call_param) {
            var method = call_param.method;
            var args = createArguments(call_param.arguments || []);

            if (typeof service[method] === "function") {
                service[method].apply(service, args);
            } else {
                throw Error( [ '[service parameter: ', name, '] undefined method "', method, '".' ].join('') );
            }
        });
    }

    function setProperties (service, properties) {
        var keys = Object.keys(properties);

        keys.forEach(function (key) {
            var param = normalizeParameter(properties[key]);
            service[key] = param || properties[key];
        });
    }

    function createArguments (args) {
        if (_.isArray(args)) {
            return _.map(args, function (arg) {
                return createArguments(arg);
            });
        } else if (_.isObject(args)) {
            var results = {};

            _.each(args, function(arg, key) {
                results[key] = createArguments(arg);
            });

            return results;
        } else {
            return normalizeParameter(args);
        }
    }


    function normalizeParameter (param) {
        if (typeof param !== 'string') {
            return param;
        }

        var matches = param.match(/^@(.+)$/);

        if (!matches) {
            return param;
        } else {
            return container.get(matches[1]);
        }
    }

    return container;
};


