var expect = require('chai').expect;
var Paranoic = require('../');

describe('register by json', function () {
    var filename = __dirname + "/samples/services.json";
    var module_path = { base: __dirname };

    var con = new Paranoic(filename, module_path);

    describe('サービスを取得すると依存解決されたインスタンスを得る', function () {
        var foo, bar;

        before(function () {
            foo = con.get('foo');
            bar = con.get('bar');
        });

        it('foo で fs モジュールが使える', function () {
            expect(foo.exists(__filename)).to.be.true;
            expect(foo.exists("/path/to/invalid")).to.be.false;
        });

        it('bar で foo 経由の fs モジュールが使える', function () {
            expect(bar.foo.exists(__filename)).to.be.true;
            expect(bar.foo.exists("/path/to/invalid")).to.be.false;
        });

        it('bar の未定義サービスはそのまま文字列になる', function () {
            expect(bar.undef).to.equal('@undefined');
        });

        it('bar へリストが注入される', function () {
            expect(bar.list).to.be.instanceof(Array);
            expect(bar.list.length).to.equal(3);
        });

        it('bar へオブジェクトが注入される', function () {
            expect(bar.obj).to.be.instanceof(Object);
            expect(bar.obj.example).to.equal(42);
        });
    });
});