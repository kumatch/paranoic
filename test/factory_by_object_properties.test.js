var expect = require('chai').expect;
var Paranoic = require('../');

describe('factory on object properties', function () {
    var con;

    beforeEach(function () {
        con = new Paranoic();
        con.setParameter('sample_path', __dirname + "/samples");
    });


    it('factory function of object property', function () {

        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: "<%= sample_path %>/function_factory_of_object_property",
                property: "example",
                arguments: [ "@fs" ]
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });


    it('factory constructor of object property', function () {
        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: "<%= sample_path %>/constructor_factory_of_object_property",
                property: "example",
                arguments: [ "@fs" ]
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });

    it('factory method of object property', function () {
        con.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        con.register('foo', {
            factory: {
                module: "<%= sample_path %>/method_factory_of_object_property",
                property: "example",
                method: "create",
                arguments: [ "@fs" ]
            }
        });

        var foo = con.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});