var expect = require('chai').expect;
var Paranoic = require('../');

describe('register and use', function () {
    var con = new Paranoic();

    describe('組み込みモジュール fs を登録して使う', function () {
        var service;

        before(function () {
            con.register('fs', {
                module: "fs"
            });
            service = con.get('fs');
        });

        it('このファイルの existsSync 結果は真', function () {
            expect(service.existsSync(__filename)).to.be.true;
        });

        it('存在しないファイルの existsSync 結果は偽', function () {
            expect(service.existsSync("path/to/invalid")).to.be.false;
        });
    });


    describe('hello を返す関数を登録して使う', function () {
        var service;

        before(function () {
            con.register('func', {
                module: __dirname + "/samples/hello_function"
            });
            service = con.get('func');
        });

        it('実行結果は hello', function () {
            expect(service()).to.equal('hello');
        });
    });

    describe('OK を返す foo 関数を持つオブジェクトを登録して使う', function () {
        var service;

        before(function () {
            con.register('obj', {
                module: __dirname + "/samples/foo_object"
            });
            service = con.get('obj');
        });

        it('foo() 結果は OK', function () {
            expect(service.foo()).to.equal('OK');
        });
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
