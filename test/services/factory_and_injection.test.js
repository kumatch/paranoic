var expect = require('chai').expect;
var Paranoic = require('../..');

describe('factory and injection', function () {
    var paranoic;

    beforeEach(function () {
        paranoic = new Paranoic();
        paranoic.setParameter('sample_path', __dirname + "/samples");
        paranoic.setParameter('factory_method', "create");
    });


    it('register function and object', function () {
        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: __dirname + "/samples/function"
            }
        });

        var container = paranoic.createContainer();
        var fs = container.get('fs');
        var foo = container.get('foo');

        expect(fs.existsSync(__filename)).be.true;
        expect(fs.existsSync("/path/to/invalid")).be.false;

        expect(foo()).be.equal("OK");
    });


    it('register with parameter', function () {
        paranoic.setParameter('core.fs', 'fs');

        paranoic.register('fs', {
            factory: {
                module: '<%= core.fs %>'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: "<%= sample_path %>/function"
            }
        });

        var container = paranoic.createContainer();
        var fs = container.get('fs');
        var foo = container.get('foo');

        expect(fs.existsSync(__filename)).be.true;
        expect(fs.existsSync("/path/to/invalid")).be.false;

        expect(foo()).be.equal("OK");
    });


    it('function factory', function () {
        paranoic.setParameter('sample_path', __dirname + "/samples");

        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: "<%= sample_path %>/function_factory",
                arguments: [ "@fs" ]
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });


    it('constructor factory', function () {
        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: "<%= sample_path %>/constructor_factory",
                arguments: [ "@fs" ]
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });

    it('method factory', function () {
        paranoic.register('fs', {
            factory: {
                module: 'fs'
            }
        });

        paranoic.register('foo', {
            factory: {
                module: "<%= sample_path %>/method_factory",
                method: "<%= factory_method %>",
                arguments: [ "@fs" ]
            }
        });

        var container = paranoic.createContainer();
        var foo = container.get('foo');

        expect(foo.exists(__filename)).be.true;
        expect(foo.exists("/path/to/invalid")).be.false;
    });
});