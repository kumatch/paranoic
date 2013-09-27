var expect = require('chai').expect;
var Paranoic = require('../');

describe('Parameter', function () {
    var con;

    beforeEach(function () {
        con = new Paranoic();
    });

    it('use number parameter', function () {
        var name = 'foo';
        var value = 42;

        con.setParameter(name, value);

        expect(con.getParameter(name)).to.equal(value);
        expect(con.getParameter(name)).to.be.a('number');
        expect(con.hasParameter(name)).to.be.true;
    });

    it('use string parameter', function () {
        var name = 'foo';
        var value = "a sample string.";

        con.setParameter(name, value);

        expect(con.getParameter(name)).to.equal(value);
        expect(con.getParameter(name)).to.be.a('string');
        expect(con.hasParameter(name)).to.be.true;
    });

    it('use array parameter', function () {
        var name = 'foo';
        var value = [ "foo", "bar", "baz" ];

        con.setParameter(name, value);

        expect(con.getParameter(name)).to.equal(value);
        expect(con.getParameter(name)).to.be.a('array');
        expect(con.hasParameter(name)).to.be.true;
    });

    it('use object parameter', function () {
        var name = 'foo';
        var value = { foo: 10, bar: 20, baz: 30 };

        con.setParameter(name, value);

        expect(con.getParameter(name)).to.equal(value);
        expect(con.getParameter(name)).to.be.a('object');
        expect(con.hasParameter(name)).to.be.true;
    });

    it('set no parameter', function () {
        var name = 'foo';

        expect(con.getParameter(name)).to.be.a('undefined');
        expect(con.hasParameter(name)).to.be.false;
    });

    it('overwrite parameter', function () {
        var name = 'foo';
        var value1 = 10;
        var value2 = 20;

        con.setParameter(name, value1);

        expect(con.getParameter(name)).to.equal(value1);
        expect(con.getParameter(name)).to.not.equal(value2);
        expect(con.hasParameter(name)).to.be.true;

        con.setParameter(name, value2);

        expect(con.getParameter(name)).to.not.equal(value1);
        expect(con.getParameter(name)).to.equal(value2);
        expect(con.hasParameter(name)).to.be.true;
    });

    it('remove parameter', function () {
        var name = 'foo';
        var value = 10;

        con.setParameter(name, value);

        expect(con.getParameter(name)).to.equal(value);
        expect(con.getParameter(name)).to.be.a('number');
        expect(con.hasParameter(name)).to.be.true;

        con.removeParameter(name);

        expect(con.getParameter(name)).to.be.a('undefined');
        expect(con.hasParameter(name)).to.be.false;
    });


    describe('set nested parameter', function () {
        var value = 42;

        beforeEach(function () {
            con.setParameter("a.b.c", value);
            con.setParameter("d", {
                e: {
                    f: value
                }
            });
        });

        it('access to a dot key parameter', function () {
            var a_b_c = con.getParameter('a.b.c');
            var a_b = con.getParameter('a.b');
            var a = con.getParameter('a');

            expect(a_b_c).to.equal(value);
            expect(a_b.c).to.equal(value);
            expect(a.b.c).to.equal(value);
        });

        it('access to a nested object parameter', function () {
            var d = con.getParameter('d');
            var d_e = con.getParameter('d.e');
            var d_e_f = con.getParameter('d.e.f');

            expect(d.e.f).to.equal(value);
            expect(d_e.f).to.equal(value);
            expect(d_e_f).to.equal(value);
        });

    });


    describe('extends parameter object', function () {
        var value = 42;

        beforeEach(function () {
            con.extendParameters({
                a: {
                    b: {
                        c: value
                    }
                },

                d: {
                    e: {
                        f: value
                    }
                }
            });
        });

        it('access to parameters', function () {
            var a = con.getParameter('a');
            var a_b_c = con.getParameter('a.b.c');

            var d = con.getParameter('d');
            var d_e_f = con.getParameter('d.e.f');

            expect(a.b.c).to.equal(value);
            expect(a_b_c).to.equal(value);
            expect(d.e.f).to.equal(value);
            expect(d_e_f).to.equal(value);
        });
    });
});
