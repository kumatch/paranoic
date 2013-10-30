var _ = require('lodash');
var nestraight = require('nestraight');

module.exports = exports = Parameters;

function Parameters (values) {
    this.values = values || {};
}

Parameters.prototype.all = function () {
    return this.values;
};

Parameters.prototype.set = function (key, value) {
    nestraight.set(this.values, key, value);
};

Parameters.prototype.extend = function (values) {
    _.extend(this.values, values);
};

Parameters.prototype.get = function (key) {
    return nestraight.get(this.values, key);
};

Parameters.prototype.has = function (key) {
    return nestraight.has(this.values, key);
};

Parameters.prototype.remove = function (key) {
    nestraight.del(this.values, key);
};
