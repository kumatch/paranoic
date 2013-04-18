var expect = require('chai').expect;
var Paranoic = require('../');

var list = [ 1, 3, 5 ];
var obj = { example: 42 };

describe('register and inject dependencies with parameters', function () {
    var con = new Paranoic();

    before(function () {
        con.setParameter('name', "paranoia");
    });


    describe('モジュールパスを変数にしてサービスを登録', function () {
        before(function () {
            con.setParameter('module_path_root',  __dirname);
            con.setParameter('module_path_child', __dirname + '/samples');

            con.register('foo', {
                module: "#{module_path_root}/samples/di_with_parameter_foo",
                instance: {
                    arguments: [ "OK" ]
                }
            });

            con.register('bar', {
                module: "#{module_path_child}/di_with_parameter_bar",
                instance: {
                    arguments: [ "@foo" ]
                }
            });
        });

        it('モジュールパス変数および依存が適切に解決される', function () {
            var bar = con.get('bar');

            expect(bar.foo.name).to.equal('OK');
        });
    });

    describe('引数の文字列に変数を使ってサービスを登録', function () {
        before(function () {
            con.register('foo', {
                module: __dirname + "/samples/di_with_parameter_foo",
                instance: {
                    arguments: [ "Mr.#{name}" ]
                }
            });

            con.register('bar', {
                module: __dirname + "/samples/di_with_parameter_bar",
                instance: {
                    arguments: [ "@foo" ]
                }
            });
        });

        it('モジュールパス変数および依存が適切に解決される', function () {
            var bar = con.get('bar');

            expect(bar.foo.name).to.equal('Mr.paranoia');
        });
    });


    describe('追加実行 DI の関数および引数の値に変数を使ってサービスを登録', function () {
        before(function () {
            con.setParameter('setter1', 'Name');
            con.setParameter('setter2', 'setFoo');

            con.register('foo', {
                module: __dirname + "/samples/di_with_parameter_foo",
                instance: { },
                calls: [
                    { method: "set#{setter1}", arguments: [ "Mr.#{name}" ] }
                ]
            });

            con.register('bar', {
                module: __dirname + "/samples/di_with_parameter_bar",
                instance: { },
                calls: [
                    { method: "#{setter2}",   arguments: [ "@foo" ] }
                ]
            });
        });

        it('モジュールパス変数および依存が適切に解決される', function () {
            var bar = con.get('bar');

            expect(bar.foo.name).to.equal('Mr.paranoia');
        });
    });


    describe('プロパティセット DI に変数を使ってサービスを登録', function () {
        before(function () {
            con.register('foo', {
                module: __dirname + "/samples/di_with_parameter_foo",
                instance: { },
                properties: {
                    name: "Mr.#{name}"
                }
            });

            con.register('bar', {
                module: __dirname + "/samples/di_with_parameter_bar",
                instance: { },
                properties: {
                    foo: "@foo"
                }
            });
        });

        it('モジュールパス変数および依存が適切に解決される', function () {
            var bar = con.get('bar');

            expect(bar.foo.name).to.equal('Mr.paranoia');
        });
    });
});