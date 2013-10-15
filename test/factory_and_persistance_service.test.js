var expect = require('chai').expect;
var Paranoic = require('../');

describe('persistence service', function () {
    var con;

    beforeEach(function () {
        con = new Paranoic();
        con.setParameter('sample_path', __dirname + "/samples");
    });


    it('register not persistence service', function () {
        con.register('foo', {
            factory: {
                module: __dirname + "/samples/properties.js",
                arguments: []
            },
            properties: {
                name: "OK"
            }
        });

        var foo1 = con.get('foo');
        var foo2 = con.get('foo');

        expect(foo1.name).to.equals("OK");
        expect(foo2.name).to.equals("OK");

        foo1.name = "modified";

        expect(foo1.name).to.equals("modified");
        expect(foo2.name).to.equals("OK");

        expect(con.get('foo').name).to.equals("OK");
    });

    it('register persistence service', function () {
        con.register('foo', {
            persistence: true,
            factory: {
                module: __dirname + "/samples/properties.js",
                arguments: []
            },
            properties: {
                name: "OK"
            }
        });

        var foo1 = con.get('foo');
        var foo2 = con.get('foo');

        expect(foo1.name).to.equals("OK");
        expect(foo2.name).to.equals("OK");

        foo1.name = "modified";

        expect(foo1.name).to.equals("modified");
        expect(foo2.name).to.equals("modified");

        expect(con.get('foo').name).to.equals("modified");
    });
});