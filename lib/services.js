var breath = require('breath');
var configuration = require('./services/configuration');
var generator = require('./services/generator');


module.exports = exports = function () {
    var configurations = {};

    return {
        configure: function (name, params) {
            configurations[ name ] = configuration.create(name, params);
        },

        has: function (name) {
            return ( typeof configurations[ name ] !== 'undefined' );
        },

        generate: function (name, container, parameters) {
            if (!this.has(name)) {
                return undefined;
            }

            var params = breath(configurations[name]).createSync(parameters);

            return generator(container).generate(name, params);
        }
    };
};