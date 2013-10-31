
exports.create = function createConfiguration (name, params) {
    if (!params || typeof params !== 'object') {
        throw Error('[service parameter] invalid parameters.');
    }

    return {
        persistence: params.persistence ? true : false,
        factory: normalizeFactory(name, params.factory || {}),
        calls:      params.calls || [],
        properties: params.properties || {}
    };
};


function normalizeFactory(name, factory) {
    if ( !factory.module && !factory.service ) {
        throw Error( [ '[service parameter: ', name, '] undefined factory rules "module" or "service".' ].join('') );
    }

    if ( factory.module && factory.service ) {
        throw Error( [ '[service parameter: ', name, '] confrict factory rules "module" and "service".' ].join('') );
    }

    if (factory.module && factory.module.match(/^\.\.?\//)) {
        throw Error( [ '[service parameter: ', name,  '] unable to use "./", and "../" in factory module.' ].join('') );
    }


    factory.peoperty = factory.peoperty || undefined;


    if (factory.call) {
        if (typeof factory.call !== 'object') {
            factory.call = {
                arguments: []
            };
        } else {
            factory.call = {
                arguments: factory.call.arguments || [],
                method: factory.call.method || undefined
            };
        }
    } else if (factory.arguments || factory.method) {
        factory.call = {
            arguments: factory.arguments || [],
            method: factory.method || undefined
        };

        delete factory.arguments;
        delete factory.method;
    }

    return factory;
}