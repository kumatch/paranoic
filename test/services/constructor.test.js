var expect = require('chai').expect;
var Paranoic = require('../..');

var fs = require('fs');

describe('register by constructor arguments', function () {
    var filename = __dirname + "/samples/configuration.json";

    function verify(paranoic) {
        paranoic.setParameter('sample_path', __dirname + "/samples");

        it('use a service of function arguments injection', function () {
            var container = paranoic.createContainer();
            var service = container.get('foo');

            expect(service.exists(__filename)).be.true;
            expect(service.exists("/path/to/invalid")).be.false;
        });

        it('use a service of method calls injection', function () {
            var container = paranoic.createContainer();
            var service = container.get('bar');

            expect(service.name).be.equals("OK");
            expect(service.exists(__filename)).be.true;
            expect(service.exists("/path/to/invalid")).be.false;
        });

        it('use a service of properies injection', function () {
                var container = paranoic.createContainer();
            var service = container.get('baz');

            expect(service.name).be.equals("OK");
            expect(service.exists(__filename)).be.true;
            expect(service.exists("/path/to/invalid")).be.false;
        });
    }

    describe('a configuration object', function () {
        var configuration = require(filename);
        var paranoic = new Paranoic(configuration);

        verify(paranoic);
    });

    describe('a configuration json', function () {
        var configuration = fs.readFileSync(filename, 'utf8');
        var paranoic = new Paranoic(configuration);

        verify(paranoic);
    });

    describe('a configuration json file', function () {
        var paranoic = new Paranoic(filename);

        verify(paranoic);
    });
});