var expect = require('chai').expect;
var Paranoic = require('../..');

describe('register by json', function () {
    var filename = __dirname + "/samples/configuration.json";
    var paranoic;

    before(function () {
        paranoic = new Paranoic(filename);
        paranoic.setParameter('sample_path', __dirname + "/samples");
    });

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
});