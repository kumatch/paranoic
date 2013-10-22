var expect = require('chai').expect;
var Paranoic = require('../');

describe('factory service', function () {
    var con;

    beforeEach(function () {
        con = new Paranoic();
        con.setParameter('sample_path', __dirname + "/samples");
        con.setParameter('factory_method', "create");
    });

    it('service function factory', function () {

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
                module: "<%= sample_path %>/service_function_factory"
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });


    it('service method factory', function () {
        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                service: "bar",
                method: "<%= factory_method %>",
                arguments: [ "@fs" ]
            }
        });

        con.register('bar', {
            factory: {
                module: "<%= sample_path %>/service_method_factory"
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});