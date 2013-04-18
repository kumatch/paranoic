var keyplace = require('keyplace');
var regex = /#\{(\w+)\}/;


module.exports = function (params) {
    return new Setting(params);
};

function Setting(params) {
    if (!params || typeof params !== 'object') {
        throw Error('invalid parameters.');
    }

    if (!params.module && !params.parameters) {
        throw Error('invalid parameters.');
    }

    this.module     = params.module;
    this.instance   = params.instance;
    this.calls      = params.calls || [];
    this.properties = params.properties || {};
}
