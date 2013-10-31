var expect = require('chai').expect;
var Paranoic = require('../..');

describe('factory service', function () {
    var paranoic;

    beforeEach(function () {
        paranoic = new Paranoic();
        paranoic.setParameter('sample_path', __dirname + "/samples");
        paranoic.setParameter('factory_method', "create");
    });

    it('service function factory', function () {

        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                service: "bar",
                arguments: [ "@fs" ]
            }
        });

        paranoic.register('bar', {
            factory: {
                module: "<%= sample_path %>/service_function_factory"
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });


    it('service method factory', function () {
        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                service: "bar",
                method: "<%= factory_method %>",
                arguments: [ "@fs" ]
            }
        });

        paranoic.register('bar', {
            factory: {
                module: "<%= sample_path %>/service_method_factory"
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});