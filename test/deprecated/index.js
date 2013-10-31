var util = require('util');
var Paranoic = require('../..');

module.exports = DeprecatedParanoic;


function  DeprecatedParanoic () {
    Paranoic.apply(this, arguments);
}

util.inherits(DeprecatedParanoic, Paranoic);

DeprecatedParanoic.prototype.__callDeprecated = function silent () {};
