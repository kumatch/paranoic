var _ = require('lodash');
var nestraight = require('nestraight');

module.exports = exports = Parameters;

function Parameters (values, root) {
    this._values = values || {};
    this._root = root || undefined;
}

Parameters.prototype.all = function () {
    var values = {};

    if (this._root) {
        values = _.extend(values, this._root.all());
    }

    return _.extend(values, this._values);
};

Parameters.prototype.set = function (key, value) {
    nestraight.set(this._values, key, value);
};

Parameters.prototype.extend = function (values) {
    _.extend(this._values, values);
};

Parameters.prototype.get = function (key) {
    var value = nestraight.get(this._values, key);

    if (!this._root) {
        return value;
    }

    if (typeof value !== 'undefined') {
        return value;
    } else {
        return this._root.get(key);
    }
};

Parameters.prototype.has = function (key) {
    var has = nestraight.has(this._values, key);

    if (!this._root) {
        return has;
    } else {
        return (has || this._root.has(key));
    }
};

Parameters.prototype.remove = function (key) {
    nestraight.del(this._values, key);
};
