var expect = require('chai').expect;
var Paranoic = require('../');

describe('register and create instance', function () {
    var con = new Paranoic();

    it('関数を登録して new 演算子でインスタンスを作成', function () {
        con.register('hello_new1', {
            module: __dirname + "/samples/hello_new",
            instance: {}
        });

        con.register('hello_new2', {
            module: __dirname + "/samples/hello_new",
            instance: {
                arguments: [ "paranoia" ]
            }
        });

        var hello1 = con.get('hello_new1');
        var hello2 = con.get('hello_new2');

        expect(hello1.say()).to.equal('hello, world');
        expect(hello2.say()).to.equal('hello, paranoia');
    });

    it('関数を登録して関数実行で結果を受け取る', function () {
        con.register('hello_call1', {
            module: __dirname + "/samples/hello_call",
            instance: {}
        });

        con.register('hello_call2', {
            module: __dirname + "/samples/hello_call",
            instance: {
                arguments: [ "paranoia" ]
            }
        });

        var hello1 = con.get('hello_call1');
        var hello2 = con.get('hello_call2');

        expect(hello1.say()).to.equal('hello, world');
        expect(hello2.say()).to.equal('hello, paranoia');
    });

    it('オブジェクトを登録して factory 関数実行で結果を受け取る', function () {
        con.register('hello_method_create1', {
            module: __dirname + "/samples/hello_method_create",
            instance: {
                method: "createInstance"
            }
        });

        con.register('hello_method_create2', {
            module: __dirname + "/samples/hello_method_create",
            instance: {
                method: "createInstance",
                arguments: [ "paranoia" ]
            }
        });

        var hello1 = con.get('hello_method_create1');
        var hello2 = con.get('hello_method_create2');

        expect(hello1.say()).to.equal('hello, world');
        expect(hello2.say()).to.equal('hello, paranoia');
    });
});
