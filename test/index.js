//
// Original source from https://github.com/segmentio/pg-escape
//
var assert = require('assert');
var format = require(__dirname + '/../lib');
var should = require('should');

var testDate = new Date(Date.UTC(2012, 11, 14, 13, 6, 43, 152));
var testArray = [ 'abc', 1, true, null, testDate ];
var testIdentArray = [ 'abc', 'AbC', 1, true, testDate ];
var testObject = { a: 1, b: 2 };
var testNestedArray = [ [1, 2], [3, 4], [5, 6] ];

describe('format(fmt, ...)', function() {
    describe('%s', function() {
        it('should format as a simple string', function() {
            format('some %s here', 'thing').should.equal('some thing here');
            format('some %s thing %s', 'long', 'here').should.equal('some long thing here');
        });

        it('should format array of array as simple string', function() {
            format('many %s %s', 'things', testNestedArray).should.equal('many things (1, 2), (3, 4), (5, 6)');
        });

        it('should format string using position field', function() {
            format('some %1$s', 'thing').should.equal('some thing');
            format('some %1$s %1$s', 'thing').should.equal('some thing thing');
            format('some %1$s %s', 'thing', 'again').should.equal('some thing again');
            format('some %1$s %2$s', 'thing', 'again').should.equal('some thing again');
            format('some %1$s %2$s %1$s', 'thing', 'again').should.equal('some thing again thing');
            format('some %1$s %2$s %s %1$s', 'thing', 'again', 'some').should.equal('some thing again some thing');
        });

        it('should not format string using position 0', function() {
            (function() {
                format('some %0$s', 'thing');
            }).should.throw(Error);
        });

        it('should not format identifier using position field with too few arguments', function() {
            (function() {
                format('some %2$s', 'thing');
            }).should.throw(Error);
        });
    });

    describe('%%', function() {
        it('should format as %', function() {
            format('some %%', 'thing').should.equal('some %');
        });

        it('should not eat args', function() {
            format('just %% a %s', 'test').should.equal('just % a test');
        });

        it('should not format % using position field', function() {
            format('%1$%', 'thing').should.equal('%1$%');
        });
    });

    describe('%I', function() {
        it('should format as an identifier', function() {
            format('some %I', 'foo/bar/baz').should.equal('some "foo/bar/baz"');
        });

        it('should not format array of array as an identifier', function() {
            (function() {
                format('many %I %I', 'foo/bar/baz', testNestedArray);
            }).should.throw(Error);
        });

        it('should format identifier using position field', function() {
            format('some %1$I', 'thing').should.equal('some thing');
            format('some %1$I %1$I', 'thing').should.equal('some thing thing');
            format('some %1$I %I', 'thing', 'again').should.equal('some thing again');
            format('some %1$I %2$I', 'thing', 'again').should.equal('some thing again');
            format('some %1$I %2$I %1$I', 'thing', 'again').should.equal('some thing again thing');
            format('some %1$I %2$I %I %1$I', 'thing', 'again', 'huh').should.equal('some thing again huh thing');
        });

        it('should not format identifier using position 0', function() {
            (function() {
                format('some %0$I', 'thing');
            }).should.throw(Error);
        });

        it('should not format identifier using position field with too few arguments', function() {
            (function() {
                format('some %2$I', 'thing');
            }).should.throw(Error);
        });
    });

    describe('%L', function() {
        it('should format as a literal', function() {
            format('%L', "Tobi's").should.equal("'Tobi''s'");
        });

        it('should format array of array as a literal', function() {
            format('%L', testNestedArray).should.equal("('1', '2'), ('3', '4'), ('5', '6')");
        });

        it('should format literal using position field', function() {
            format('some %1$L', 'thing').should.equal("some 'thing'");
            format('some %1$L %1$L', 'thing').should.equal("some 'thing' 'thing'");
            format('some %1$L %L', 'thing', 'again').should.equal("some 'thing' 'again'");
            format('some %1$L %2$L', 'thing', 'again').should.equal("some 'thing' 'again'");
            format('some %1$L %2$L %1$L', 'thing', 'again').should.equal("some 'thing' 'again' 'thing'");
            format('some %1$L %2$L %L %1$L', 'thing', 'again', 'some').should.equal("some 'thing' 'again' 'some' 'thing'");
        });

        it('should not format literal using position 0', function() {
            (function() {
                format('some %0$L', 'thing');
            }).should.throw(Error);
        });

        it('should not format literal using position field with too few arguments', function() {
            (function() {
                format('some %2$L', 'thing');
            }).should.throw(Error);
        });
    });
});

describe('format.withArray(fmt, args)', function() {
    describe('%s', function() {
        it('should format as a simple string', function() {
            format.withArray('some %s here', [ 'thing' ]).should.equal('some thing here');
            format.withArray('some %s thing %s', [ 'long', 'here' ]).should.equal('some long thing here');
        });

        it('should format array of array as simple string', function() {
            format.withArray('many %s %s', ['things', testNestedArray]).should.equal('many things (1, 2), (3, 4), (5, 6)');
        });
    });

    describe('%%', function() {
        it('should format as %', function() {
            format.withArray('some %%', [ 'thing' ]).should.equal('some %');
        });

        it('should not eat args', function() {
            format.withArray('just %% a %s', [ 'test' ]).should.equal('just % a test');
            format.withArray('just %% a %s %s %s', [ 'test', 'again', 'and again' ]).should.equal('just % a test again and again');
        });
    });

    describe('%I', function() {
        it('should format as an identifier', function() {
            format.withArray('some %I', [ 'foo/bar/baz' ]).should.equal('some "foo/bar/baz"');
            format.withArray('some %I and %I', [ 'foo/bar/baz', '#hey' ]).should.equal('some "foo/bar/baz" and "#hey"');
        });

        it('should not format array of array as an identifier', function() {
            (function() {
                format.withArray('many %I %I', ['foo/bar/baz', testNestedArray]);
            }).should.throw(Error);
        });
    });

    describe('%L', function() {
        it('should format as a literal', function() {
            format.withArray('%L', [ "Tobi's" ]).should.equal("'Tobi''s'");
            format.withArray('%L %L', [ "Tobi's", "birthday" ]).should.equal("'Tobi''s' 'birthday'");
        });

        it('should format array of array as a literal', function() {
            format.withArray('%L', [testNestedArray]).should.equal("('1', '2'), ('3', '4'), ('5', '6')");
        });
    });
});

describe('format.string(val)', function() {
    it('should coerce to a string', function() {
        format.string(undefined).should.equal('');
        format.string(null).should.equal('');
        format.string(true).should.equal('t');
        format.string(false).should.equal('f');
        format.string(0).should.equal('0');
        format.string(15).should.equal('15');
        format.string(-15).should.equal('-15');
        format.string(45.13).should.equal('45.13');
        format.string(-45.13).should.equal('-45.13');
        format.string('something').should.equal('something');
        format.string(testArray).should.equal('abc,1,t,2012-12-14 13:06:43.152+00');
        format.string(testNestedArray).should.equal('(1, 2), (3, 4), (5, 6)');
        format.string(testDate).should.equal('2012-12-14 13:06:43.152+00');
        format.string(testObject).should.equal('{"a":1,"b":2}');
    });
});

describe('format.ident(val)', function() {
    it('should quote when necessary', function() {
        format.ident('foo').should.equal('foo');
        format.ident('_foo').should.equal('_foo');
        format.ident('_foo_bar$baz').should.equal('_foo_bar$baz');
        format.ident('test.some.stuff').should.equal('"test.some.stuff"');
        format.ident('test."some".stuff').should.equal('"test.""some"".stuff"');
    });

    it('should quote reserved words', function() {
        format.ident('desc').should.equal('"desc"');
        format.ident('join').should.equal('"join"');
        format.ident('cross').should.equal('"cross"');
    });

    it('should quote', function() {
        format.ident(true).should.equal('"t"');
        format.ident(false).should.equal('"f"');
        format.ident(0).should.equal('"0"');
        format.ident(15).should.equal('"15"');
        format.ident(-15).should.equal('"-15"');
        format.ident(45.13).should.equal('"45.13"');
        format.ident(-45.13).should.equal('"-45.13"');
        format.ident(testIdentArray).should.equal('abc,"AbC","1","t","2012-12-14 13:06:43.152+00"');
        (function() {
            format.ident(testNestedArray)
        }).should.throw(Error);
        format.ident(testDate).should.equal('"2012-12-14 13:06:43.152+00"');
    });

    it('should throw when undefined', function (done) {
        try {
            format.ident(undefined);
        } catch (err) {
            assert(err.message === 'SQL identifier cannot be null or undefined');
            done();
        }
    });

    it('should throw when null', function (done) {
        try {
            format.ident(null);
        } catch (err) {
            assert(err.message === 'SQL identifier cannot be null or undefined');
            done();
        }
    });

    it('should throw when object', function (done) {
        try {
            format.ident({});
        } catch (err) {
            assert(err.message === 'SQL identifier cannot be an object');
            done();
        }
    });
});

describe('format.literal(val)', function() {
    it('should return NULL for null', function() {
        format.literal(null).should.equal('NULL');
        format.literal(undefined).should.equal('NULL');
    });

    it('should quote', function() {
        format.literal(true).should.equal("'t'");
        format.literal(false).should.equal("'f'");
        format.literal(0).should.equal("'0'");
        format.literal(15).should.equal("'15'");
        format.literal(-15).should.equal("'-15'");
        format.literal(45.13).should.equal("'45.13'");
        format.literal(-45.13).should.equal("'-45.13'");
        format.literal('hello world').should.equal("'hello world'");
        format.literal(testArray).should.equal("'abc','1','t',NULL,'2012-12-14 13:06:43.152+00'");
        format.literal(testNestedArray).should.equal("('1', '2'), ('3', '4'), ('5', '6')");
        format.literal(testDate).should.equal("'2012-12-14 13:06:43.152+00'");
        format.literal(testObject).should.equal("'{\"a\":1,\"b\":2}'::jsonb");
    });

    it('should format quotes', function() {
        format.literal("O'Reilly").should.equal("'O''Reilly'");
    });

    it('should format backslashes', function() {
        format.literal('\\whoop\\').should.equal("E'\\\\whoop\\\\'");
    });
});