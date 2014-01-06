var expect = require('chai').expect;
var Paranoic = require('../..');

describe('set a persistence service', function () {
    var paranoic, container;

    beforeEach(function () {
        paranoic = new Paranoic();
        container = paranoic.createContainer();

        container.set('fs', require('fs'));
    });


    it('and get a persistence service', function () {
        var fs = container.get('fs');
        expect(fs.existsSync(__filename)).to.be.ok;
    });
});