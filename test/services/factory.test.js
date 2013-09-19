var expect = require('chai').expect;
var Paranoic = require('../../');

describe('register function and object', function () {
    var con;

    before(function () {
        con = new Paranoic();

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: __dirname + "/samples/function"
            }
        });
    });

    it('get services', function () {
        var fs = con.get('fs');
        var foo = con.get('foo');

        expect(fs.existsSync(__filename)).be.true;
        expect(fs.existsSync("/path/to/invalid")).be.false;

        expect(foo()).be.equal("OK");
    });
});


describe('function factory', function () {
    var con;

    before(function () {
        con = new Paranoic();

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: __dirname + "/samples/function_factory",
                arguments: [ "@fs" ]
            }
        });
    });

    it('get foo service', function () {
        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});


describe('constructor factory', function () {
    var con;

    before(function () {
        con = new Paranoic();

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: __dirname + "/samples/constructor_factory",
                arguments: [ "@fs" ]
            }
        });
    });

    it('get foo service', function () {
        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});

describe('method factory', function () {
    var con;

    before(function () {
        con = new Paranoic();

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: __dirname + "/samples/method_factory",
                method: "create",
                arguments: [ "@fs" ]
            }
        });
    });

    it('get foo service', function () {
        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});

describe('service function factory', function () {
    var con;

    before(function () {
        con = new Paranoic();

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                service: "bar",
                arguments: [ "@fs" ]
            }
        });

        con.register('bar', {
            factory: {
                module: __dirname + "/samples/service_function_factory"
            }
        });
    });

    it('get foo service', function () {
        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});


describe('service method factory', function () {
    var con;

    before(function () {
        con = new Paranoic();

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                service: "bar",
                method: "create",
                arguments: [ "@fs" ]
            }
        });

        con.register('bar', {
            factory: {
                module: __dirname + "/samples/service_function_factory"
            }
        });
    });

    it('get foo service', function () {
        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});