var expect = require('chai').expect;
var Paranoic = require('../..');

describe('properties injection', function () {
    var paranoic;

    before(function () {
        paranoic = new Paranoic();

        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
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
        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.name).be.equals("OK");
        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});
