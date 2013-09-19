var util = require('util').format;

module.exports = function (name, params) {
    if (!params || typeof params !== 'object') {
        throw Error('[service parameter] invalid parameters.');
    }

    var factory = params.factory || {};

    var __factoryModuleCount = 0;

    if (factory.module && typeof factory.module === 'string') {
        if (factory.module.match(/^\.\.?\//)) {
            throw Error(format('[service parameter: %s] unable to use "./", and "../" in factory module.', name));
        }

        __factoryModuleCount += 1;
    }

    if (factory.service && typeof factory.service) {
        __factoryModuleCount += 1;
    }

    if (__factoryModuleCount === 0) {
        throw Error(format('[service parameter: %s] factory module or service not defined.', name));
    }
    if (__factoryModuleCount > 1) {
        throw Error(format('[service parameter: %s] duplicated factory module and service.', name));
    }

    return {
        factory: factory,
        calls:      params.calls || [],
        properties: params.properties || {}
    };
};
