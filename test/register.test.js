var expect = require('chai').expect;
var Paranoic = require('../');

describe('register and use', function () {
    var con = new Paranoic();

    it('組み込みモジュールを登録して使う', function () {
        con.register('fs', {
            module: "fs"
        });
        var fs = con.get('fs');

        expect(fs.existsSync(__filename)).to.be.true;
        expect(fs.existsSync("path/to/invalid")).to.be.false;
    });

    it('関数を登録して使う', function () {
        con.register('func', {
            module: __dirname + "/samples/hello_function"
        });
        var func = con.get('func');

        expect(func()).to.equal('hello');
    });

    it('オブジェクトを登録して使う', function () {
        con.register('obj', {
            module: __dirname + "/samples/foobarbaz_object"
        });
        var obj = con.get('obj');

        expect(obj.foo()).to.equal('Foo');
        expect(obj.bar()).to.equal('Bar');
        expect(obj.baz()).to.equal('Baz');
    });

    it('設定値を登録して使う', function () {
        con.register('config', {
            parameters: {
                number: 42,
                string: "a example string.",
                list: [ "foo", "bar", "baz" ],
                object: {
                    foo: 1,
                    bar: 2,
                    baz: 3
                }
            }
        });
        var config = con.get('config');

        expect(config.number).to.equal(42);
        expect(config.string).to.equal("a example string.");
        expect(config.list[2]).to.equal("baz");
        expect(config.object.bar).to.equal(2);
    });
});
