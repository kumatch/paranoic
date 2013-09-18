var expect = require('chai').expect;
var Paranoic = require('../');

var num = 42;
var str = "a example string.";
var list = [ "foo", "bar", "baz" ];
var obj = { foo: 1, bar: 2, baz: 3 };

describe('Parameter', function () {
    var con = new Paranoic();

    describe('数値、文字列、リスト、オブジェクトを個々に登録して', function () {
        before(function () {
            con.setParameter('number', num);
            con.setParameter('string', str);
            con.setParameter('list', list);
            con.setParameter('object', obj);
        });

        it('数値を取得する', function () {
            expect(con.getParameter('number')).to.equal(num);
            expect(con.getParameter('number')).to.be.a('number');
            expect(con.hasParameter('number')).to.be.true;
        });
        it('文字列を取得する', function () {
            expect(con.getParameter('string')).to.equal(str);
            expect(con.getParameter('string')).to.be.a('string');
            expect(con.hasParameter('string')).to.be.true;
        });
        it('リストを取得する', function () {
            expect(con.getParameter('list')).to.equal(list);
            expect(con.getParameter('list')).to.be.instanceof(Array);
            expect(con.hasParameter('list')).to.be.true;
        });
        it('オブジェクトを取得する', function () {
            expect(con.getParameter('object')).to.equal(obj);
            expect(con.getParameter('object')).to.be.instanceof(Object);
            expect(con.hasParameter('object')).to.be.true;
        });
        it('存在しないパラメータは取得できない', function () {
            expect(con.getParameter('invalid')).to.be.undefined;
            expect(con.hasParameter('invalid')).to.be.false;
        });


        describe('登録済み数値を上書き更新すると', function () {
            var num2 = 12345;

            before(function () {
                con.setParameter('number', num2);
            });

            it('数値取得は上書き後のものになる', function () {
                expect(con.getParameter('number')).to.equal(num2);
            });
        });
    });

    // describe('オブジェクトを階層的に foo.bar.baz として登録して', function () {
    //     before(function () {
    //         con.setParameter('foo.bar.baz', obj);
    //     });

    //     it('foo.bar.baz で登録オブジェクトを得る', function () {
    //         expect(con.getParameter('foo.bar.baz')).to.deep.equal(obj);
    //     });

    //     it('foo.bar で bar 名に登録オブジェクトを要素にもつオブジェクトを得る', function () {
    //         expect(con.getParameter('foo.bar')).to.deep.equal({ bar: obj });
    //     });
    // });
});
