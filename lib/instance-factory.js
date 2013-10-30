
exports.create = function createInstance (F, args, method) {
    var o, r;

    if (method) {
        return F[method].apply(F, args);
    } else {
        if (typeof F === "function") {
            o = Object.create(F.prototype);
            r = F.apply(o, args);

            return (r != null && r instanceof Object) ? r : o;
        }
    }
};
