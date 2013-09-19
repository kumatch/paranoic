var expect = require('chai').expect;
var Paranoic = require('../../');

describe('call methods', function () {
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
                module: __dirname + "/samples/properties",
                arguments: [ ]
            },
            properties: {
                name: "OK",
                fs: "@fs"
            }
        });
    });

    it('get foo service', function () {
        var foo = con.get('foo');

        expect(foo.name).be.equals("OK");
        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});
