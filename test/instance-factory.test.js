var expect = require('chai').expect;
var instanceFactory = require('../lib/instance-factory');

describe('Creates instance', function () {
    var name = "foo";
    var age = 20;

    function verify(obj) {
        expect(obj.getName()).to.equals(name);
        expect(obj.age).to.equals(age);
    }

    it('use new', function () {
        function Foo () {
            this.name = name;
            this.age = age;
        }
        Foo.prototype.getName = function () {
            return this.name;
        };

        verify( instanceFactory.create(Foo, [ name, age ]) );
    });

    it('function', function () {
        var Foo = function (name, age) {
            return {
                name: name,
                age: age,
                getName: function () {
                    return this.name;
                }
            };
        };

        verify( instanceFactory.create(Foo, [ name, age ]) );
    });

    it('object method', function () {
        var Foo = {
            create: function (name, age) {
                return {
                    name: name,
                    age: age,
                    getName: function () {
                        return this.name;
                    }
                };
            }
        };

        verify( instanceFactory.create(Foo, [ name, age ], "create") );
    });


    it('functions object method', function () {
        function Foo (name, age) {
            this.name = name + name;
            this.age = age + 10;
        }
        Foo.create = function (name, age) {
            return {
                name: name,
                age: age,
                getName: function () {
                    return this.name;
                }
            };
        };

        verify( instanceFactory.create(Foo, [ name, age ], "create") );
    });
});
