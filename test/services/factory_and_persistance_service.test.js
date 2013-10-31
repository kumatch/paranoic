var expect = require('chai').expect;
var Paranoic = require('../..');

describe('persistence service', function () {
    var paranoic;

    beforeEach(function () {
        paranoic = new Paranoic();
        paranoic.setParameter('sample_path', __dirname + "/samples");
    });


    it('register not persistence service', function () {
        paranoic.register('foo', {
            factory: {
                module: __dirname + "/samples/properties.js",
                call: {
                    arguments: []
                }
            },
            properties: {
                name: "OK"
            }
        });

        var container = paranoic.createContainer();

        var foo1 = container.get('foo');
        var foo2 = container.get('foo');

        expect(foo1.name).to.equals("OK");
        expect(foo2.name).to.equals("OK");

        foo1.name = "modified";

        expect(foo1.name).to.equals("modified");
        expect(foo2.name).to.equals("OK");

        expect(container.get('foo').name).to.equals("OK");
    });

    it('register persistence service', function () {
        paranoic.register('foo', {
            persistence: true,
            factory: {
                module: __dirname + "/samples/properties.js",
                call: true
            },
            properties: {
                name: "OK"
            }
        });

        var container = paranoic.createContainer();

        var foo1 = container.get('foo');
        var foo2 = container.get('foo');

        expect(foo1.name).to.equals("OK");
        expect(foo2.name).to.equals("OK");

        foo1.name = "modified";

        expect(foo1.name).to.equals("modified");
        expect(foo2.name).to.equals("modified");

        expect(container.get('foo').name).to.equals("modified");
    });
});