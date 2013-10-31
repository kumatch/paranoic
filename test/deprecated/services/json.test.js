var expect = require('chai').expect;
var Paranoic = require('../');

describe('[deprecated] register by json', function () {
    var filename = __dirname + "/samples/configuration.json";
    var con;

    before(function () {
        con = new Paranoic(filename);
        con.setParameter('sample_path', __dirname + "/samples");
    });

    it('use a service of function arguments injection', function () {
        var service = con.get('foo');

        expect(service.exists(__filename)).be.true;
        expect(service.exists("/path/to/invalid")).be.false;
    });

    it('use a service of method calls injection', function () {
        var service = con.get('bar');

        expect(service.name).be.equals("OK");
        expect(service.exists(__filename)).be.true;
        expect(service.exists("/path/to/invalid")).be.false;
    });

    it('use a service of properies injection', function () {
        var service = con.get('baz');

        expect(service.name).be.equals("OK");
        expect(service.exists(__filename)).be.true;
        expect(service.exists("/path/to/invalid")).be.false;
    });
});