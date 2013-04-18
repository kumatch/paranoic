var expect = require('chai').expect;
var Paranoic = require('../');

describe('register by json', function () {
    var filename = __dirname + "/samples/services.json";
    var con;

    before(function () {
        con = new Paranoic(filename);
        con.setParameter('base', __dirname);
    });

    describe('サービスを取得すると依存解決されたインスタンスを得る', function () {
        var foo, bar;

        before(function () {
            foo = con.get('foo');
            bar = con.get('bar');
        });

        it('bar 経由で foo のプロパティに参照できる', function () {
            expect(bar.foo.name).to.equal('Mr.paranoia');
        });
    });
});