var expect = require('chai').expect;
var Paranoic = require('../..');

describe('factory on object properties', function () {
    var paranoic;

    beforeEach(function () {
        paranoic = new Paranoic();
        paranoic.setParameter('sample_path', __dirname + "/samples");
    });


    it('factory function of object property', function () {

        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: "<%= sample_path %>/function_factory_of_object_property",
                property: "example",
                call: {
                    arguments: [ "@fs" ]
                }
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });


    it('factory constructor of object property', function () {
        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: "<%= sample_path %>/constructor_factory_of_object_property",
                property: "example",
                call: {
                    arguments: [ "@fs" ]
                }
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });

    it('factory method of object property', function () {
        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: "<%= sample_path %>/method_factory_of_object_property",
                property: "example",
                call: {
                    method: "create",
                    arguments: [ "@fs" ]
                }
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});