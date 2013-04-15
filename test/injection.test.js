var expect = require('chai').expect;
var Paranoic = require('../');

var list = [ 1, 3, 5 ];
var obj = { example: 42 };

describe('register and inject dependencies', function () {
    var con = new Paranoic();

    describe('コンストラクタによるDI', function () {
        before(function () {
            con.register('fs', {
                module: "fs"
            });

            con.register('foo', {
                module: __dirname + "/samples/di_construct_foo",
                instance: {
                    arguments: [ "@fs" ]
                }
            });

            con.register('bar', {
                module: __dirname + "/samples/di_construct_bar",
                instance: {
                    arguments: [ "@foo", "@undefined", list, obj ]
                }
            });
        });

        it('サービスを取得すると依存解決されたインスタンスを得る', function () {
            var foo = con.get('foo');
            expect(foo.exists(__filename)).to.be.true;
            expect(foo.exists("/path/to/invalid")).to.be.false;

            var bar = con.get('bar');
            expect(bar.foo.exists(__filename)).to.be.true;
            expect(bar.foo.exists("/path/to/invalid")).to.be.false;

            expect(bar.undef).to.equal('@undefined');

            expect(bar.list).to.be.instanceof(Array);
            expect(bar.list.length).to.equal(list.length);
            expect(bar.list[2]).to.equal(list[2]);

            expect(bar.obj).to.be.instanceof(Object);
            expect(bar.obj.example).to.equal(42);
        });
    });

    describe('追加実行によるDI', function () {
        before(function () {
            con.register('fs', {
                module: "fs"
            });

            con.register('foo', {
                module: __dirname + "/samples/di_calls_foo",
                instance: { },
                calls: [
                    { method: "setFs", arguments: [ "@fs" ] }
                ]
            });

            con.register('bar', {
                module: __dirname + "/samples/di_calls_bar",
                instance: { },
                calls: [
                    { method: "setFoo",   arguments: [ "@foo" ] },
                    { method: "setUndef", arguments: [ "@undefined" ] },
                    { method: "setList",  arguments: [ list ] },
                    { method: "setObj",   arguments: [ obj ] }
                ]
            });
        });

        it('サービスを取得すると依存解決されたインスタンスを得る', function () {
            var foo = con.get('foo');
            expect(foo.exists(__filename)).to.be.true;
            expect(foo.exists("/path/to/invalid")).to.be.false;

            var bar = con.get('bar');
            expect(bar.foo.exists(__filename)).to.be.true;
            expect(bar.foo.exists("/path/to/invalid")).to.be.false;

            expect(bar.undef).to.equal('@undefined');

            expect(bar.list).to.be.instanceof(Array);
            expect(bar.list.length).to.equal(list.length);
            expect(bar.list[2]).to.equal(list[2]);

            expect(bar.obj).to.be.instanceof(Object);
            expect(bar.obj.example).to.equal(42);
        });
    });

    describe('プロパティセットによるDI', function () {
        before(function () {
            con.register('fs', {
                module: "fs"
            });

            con.register('foo', {
                module: __dirname + "/samples/di_properties_foo",
                instance: { },
                properties: {
                    fs: "@fs"
                }
            });

            con.register('bar', {
                module: __dirname + "/samples/di_properties_bar",
                instance: { },
                properties: {
                    foo: "@foo",
                    undef: "@undefined",
                    list: list,
                    obj: obj
                }
            });
        });

        it('サービスを取得すると依存解決されたインスタンスを得る', function () {
            var foo = con.get('foo');

            expect(foo.exists(__filename)).to.be.true;
            expect(foo.exists("/path/to/invalid")).to.be.false;

            var bar = con.get('bar');

            expect(bar.foo.exists(__filename)).to.be.true;
            expect(bar.foo.exists("/path/to/invalid")).to.be.false;

            expect(bar.undef).to.equal('@undefined');

            expect(bar.list).to.be.instanceof(Array);
            expect(bar.list.length).to.equal(list.length);
            expect(bar.list[2]).to.equal(list[2]);

            expect(bar.obj).to.be.instanceof(Object);
            expect(bar.obj.example).to.equal(42);
        });
    });
});