var _ = require('lodash');
var instanceFactory = require('../instance-factory');

module.exports = exports = function (container) {

    return {
        generate: function (name, params) {
            var mod, instance;

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

                instance = instanceFactory.create(mod, args, method);
            } else {
                instance = mod;
            }

            callMethods(name, instance, params.calls || []);
            setProperties(instance, params.properties || {});

            return {
                instance: instance,
                persistence: params.persistence ? true : false
            };
        }
    };


    function callMethods (name, instance, calls) {
        _.each(calls, function (call) {
            var method = call.method;
            var args = createArguments(call.arguments || []);

            if (typeof instance[method] === "function") {
                instance[method].apply(instance, args);
            } else {
                throw Error( [ '[service parameter: ', name, '] undefined method "', method, '".' ].join('') );
            }
        });
    }

    function setProperties (instance, properties) {
        _.each(properties, function (value, name) {
            instance[name] = normalizeParameter(value) || value;
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
    };


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
};