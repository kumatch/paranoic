
module.exports = function (name, params) {
    if (!params || typeof params !== 'object') {
        throw Error('[service parameter] invalid parameters.');
    }

    var factory = params.factory || {};

    var __factoryModuleCount = 0;

    if (factory.module && typeof factory.module === 'string') {
        if (factory.module.match(/^\.\.?\//)) {
            throw Error( [ '[service parameter: ', name,  '] unable to use "./", and "../" in factory module.' ].join('') );
        }

        __factoryModuleCount += 1;
    }

    if (factory.service && typeof factory.service) {
        __factoryModuleCount += 1;
    }

    if (__factoryModuleCount === 0) {
        throw Error( [ '[service parameter: ', name, '] factory module or service not defined.' ].join('') );
    }
    if (__factoryModuleCount > 1) {
        throw Error( [ '[service parameter: ', name, '] duplicated factory module and service.' ].join('') );
    }

    return {
        persistence: params.persistence ? true : false,
        factory: factory,
        calls:      params.calls || [],
        properties: params.properties || {}
    };
};
