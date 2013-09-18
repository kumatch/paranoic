var keyplace = require('keyplace');
var regex = /#\{(\w+)\}/;

module.exports = function (params) {
    if (!params || typeof params !== 'object') {
        throw Error('invalid parameters.');
    }

    if (!params.module && !params.parameters) {
        throw Error('invalid parameters.');
    }

    return {
        module:     params.module,
        instance:   params.instance,
        calls:      params.calls || [],
        properties: params.properties || {}
    };
};
