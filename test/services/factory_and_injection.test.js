var expect = require('chai').expect;
var Paranoic = require('../..');

describe('factory and injection', function () {
    var con;

    beforeEach(function () {
        con = new Paranoic();
        con.setParameter('sample_path', __dirname + "/samples");
        con.setParameter('factory_method', "create");
    });


    it('register function and object', function () {
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

        var fs = con.get('fs');
        var foo = con.get('foo');

        expect(fs.existsSync(__filename)).be.true;
        expect(fs.existsSync("/path/to/invalid")).be.false;

        expect(foo()).be.equal("OK");
    });


    it('register with parameter', function () {
        con.setParameter('core.fs', 'fs');

        con.register('fs', {
            factory: {
                module: '<%= core.fs %>'
            }
        });

        con.register('foo', {
            factory: {
                module: "<%= sample_path %>/function"
            }
        });

        var fs = con.get('fs');
        var foo = con.get('foo');

        expect(fs.existsSync(__filename)).be.true;
        expect(fs.existsSync("/path/to/invalid")).be.false;

        expect(foo()).be.equal("OK");
    });


    it('function factory', function () {
        con.setParameter('sample_path', __dirname + "/samples");

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: "<%= sample_path %>/function_factory",
                arguments: [ "@fs" ]
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });


    it('constructor factory', function () {
        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: "<%= sample_path %>/constructor_factory",
                arguments: [ "@fs" ]
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });

    it('method factory', function () {
        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: "<%= sample_path %>/method_factory",
                method: "<%= factory_method %>",
                arguments: [ "@fs" ]
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});