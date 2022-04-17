"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const assert_1 = __importDefault(require("assert"));
require("should");
const testDate = new Date(Date.UTC(2012, 11, 14, 13, 6, 43, 152));
//@ts-ignore
const testArray = ['abc', 1, true, null, testDate, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NaN, 1n];
//@ts-ignore
const testIdentArray = ['abc', 'AbC', 1, true, testDate, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NaN, 1n];
const testObject = { a: 1, b: 2 };
const testNestedArray = [[1, 2], [3, 4], [5, 6]];
describe('format(fmt, ...)', function () {
    describe('%s', function () {
        it('should format as a simple string', function () {
            __1.format('some %s here', 'thing').should.equal('some thing here');
            __1.format('some %s thing %s', 'long', 'here').should.equal('some long thing here');
        });
        it('should format array of array as simple string', function () {
            __1.format('many %s %s', 'things', testNestedArray).should.equal('many things (1, 2), (3, 4), (5, 6)');
        });
        it('should format string using position field', function () {
            __1.format('some %1$s', 'thing').should.equal('some thing');
            __1.format('some %1$s %1$s', 'thing').should.equal('some thing thing');
            __1.format('some %1$s %s', 'thing', 'again').should.equal('some thing again');
            __1.format('some %1$s %2$s', 'thing', 'again').should.equal('some thing again');
            __1.format('some %1$s %2$s %1$s', 'thing', 'again').should.equal('some thing again thing');
            __1.format('some %1$s %2$s %s %1$s', 'thing', 'again', 'some').should.equal('some thing again some thing');
        });
        it('should not format string using position 0', function () {
            (function () {
                __1.format('some %0$s', 'thing');
            }).should.throw(Error);
        });
        it('should not format string using position field with too few arguments', function () {
            (function () {
                __1.format('some %2$s', 'thing');
            }).should.throw(Error);
        });
    });
    describe('%%', function () {
        it('should format as %', function () {
            __1.format('some %%', 'thing').should.equal('some %');
        });
        it('should not eat args', function () {
            __1.format('just %% a %s', 'test').should.equal('just % a test');
        });
        it('should not format % using position field', function () {
            __1.format('%1$%', 'thing').should.equal('%1$%');
        });
    });
    describe('%I', function () {
        it('should format as an identifier', function () {
            __1.format('some %I', 'foo/bar/baz').should.equal('some "foo/bar/baz"');
        });
        it('should format as an identifier', function () {
            __1.format('some %I', 'foo.bar').should.equal('some foo.bar');
        });
        it('should not format array of array as an identifier', function () {
            (function () {
                __1.format('many %I %I', 'foo/bar/baz', testNestedArray);
            }).should.throw(Error);
        });
        it('should format identifier using position field', function () {
            __1.format('some %1$I', 'thing').should.equal('some thing');
            __1.format('some %1$I %1$I', 'thing').should.equal('some thing thing');
            __1.format('some %1$I %I', 'thing', 'again').should.equal('some thing again');
            __1.format('some %1$I %2$I', 'thing', 'again').should.equal('some thing again');
            __1.format('some %1$I %2$I %1$I', 'thing', 'again').should.equal('some thing again thing');
            __1.format('some %1$I %2$I %I %1$I', 'thing', 'again', 'huh').should.equal('some thing again huh thing');
        });
        it('should not format identifier using position 0', function () {
            (function () {
                __1.format('some %0$I', 'thing');
            }).should.throw(Error);
        });
        it('should not format identifier using position field with too few arguments', function () {
            (function () {
                __1.format('some %2$I', 'thing');
            }).should.throw(Error);
        });
    });
    describe('%L', function () {
        it('should format as a literal', function () {
            __1.format('%L', "Tobi's").should.equal("'Tobi''s'");
        });
        it('should format array of array as a literal', function () {
            __1.format('%L', testNestedArray).should.equal("(1, 2), (3, 4), (5, 6)");
        });
        it('should format literal using position field', function () {
            __1.format('some %1$L', 'thing').should.equal("some 'thing'");
            __1.format('some %1$L %1$L', 'thing').should.equal("some 'thing' 'thing'");
            __1.format('some %1$L %L', 'thing', 'again').should.equal("some 'thing' 'again'");
            __1.format('some %1$L %2$L', 'thing', 'again').should.equal("some 'thing' 'again'");
            __1.format('some %1$L %2$L %1$L', 'thing', 'again').should.equal("some 'thing' 'again' 'thing'");
            __1.format('some %1$L %2$L %L %1$L', 'thing', 'again', 'some').should.equal("some 'thing' 'again' 'some' 'thing'");
        });
        it('should not format literal using position 0', function () {
            (function () {
                __1.format('some %0$L', 'thing');
            }).should.throw(Error);
        });
        it('should not format literal using position field with too few arguments', function () {
            (function () {
                __1.format('some %2$L', 'thing');
            }).should.throw(Error);
        });
    });
});
describe('formatWithArray(fmt, args)', function () {
    describe('%s', function () {
        it('should format as a simple string', function () {
            __1.formatWithArray('some %s here', ['thing']).should.equal('some thing here');
            __1.formatWithArray('some %s thing %s', ['long', 'here']).should.equal('some long thing here');
        });
        it('should format array of array as simple string', function () {
            __1.formatWithArray('many %s %s', ['things', testNestedArray]).should.equal('many things (1, 2), (3, 4), (5, 6)');
        });
    });
    describe('%%', function () {
        it('should format as %', function () {
            __1.formatWithArray('some %%', ['thing']).should.equal('some %');
        });
        it('should not eat args', function () {
            __1.formatWithArray('just %% a %s', ['test']).should.equal('just % a test');
            __1.formatWithArray('just %% a %s %s %s', ['test', 'again', 'and again']).should.equal('just % a test again and again');
        });
    });
    describe('%I', function () {
        it('should format as an identifier', function () {
            __1.formatWithArray('some %I', ['foo/bar/baz']).should.equal('some "foo/bar/baz"');
            __1.formatWithArray('some %I and %I', ['foo/bar/baz', '#hey']).should.equal('some "foo/bar/baz" and "#hey"');
        });
        it('should not format array of array as an identifier', function () {
            (function () {
                __1.formatWithArray('many %I %I', ['foo/bar/baz', testNestedArray]);
            }).should.throw(Error);
        });
    });
    describe('%L', function () {
        it('should format as a literal', function () {
            __1.formatWithArray('%L', ["Tobi's"]).should.equal("'Tobi''s'");
            __1.formatWithArray('%L %L', ["Tobi's", "birthday"]).should.equal("'Tobi''s' 'birthday'");
        });
        it('should format array of array as a literal', function () {
            __1.formatWithArray('%L', [testNestedArray]).should.equal("(1, 2), (3, 4), (5, 6)");
        });
    });
});
describe('quoteString(val)', function () {
    it('should coerce to a string', function () {
        __1.quoteString(undefined).should.equal('');
        __1.quoteString(null).should.equal('');
        __1.quoteString(true).should.equal('t');
        __1.quoteString(false).should.equal('f');
        __1.quoteString(0).should.equal('0');
        __1.quoteString(15).should.equal('15');
        __1.quoteString(-15).should.equal('-15');
        __1.quoteString(45.13).should.equal('45.13');
        __1.quoteString(-45.13).should.equal('-45.13');
        __1.quoteString('something').should.equal('something');
        __1.quoteString(testArray).should.equal('abc,1,t,2012-12-14 13:06:43.152+00,-Infinity,Infinity,NaN,1');
        __1.quoteString(testNestedArray).should.equal('(1, 2), (3, 4), (5, 6)');
        __1.quoteString(testDate).should.equal('2012-12-14 13:06:43.152+00');
        __1.quoteString(testObject).should.equal('{"a":1,"b":2}');
    });
});
describe('quoteIdent(val)', function () {
    it('should quote when necessary', function () {
        __1.quoteIdent('foo').should.equal('foo');
        __1.quoteIdent('_foo').should.equal('_foo');
        __1.quoteIdent('_foo_bar$baz').should.equal('_foo_bar$baz');
        __1.quoteIdent('test.some.stuff').should.equal('test.some.stuff');
        __1.quoteIdent('test."some".stuff').should.equal('"test.""some"".stuff"');
    });
    it('should quote reserved words', function () {
        __1.quoteIdent('desc').should.equal('"desc"');
        __1.quoteIdent('join').should.equal('"join"');
        __1.quoteIdent('cross').should.equal('"cross"');
    });
    it('should quote', function () {
        __1.quoteIdent(true).should.equal('"t"');
        __1.quoteIdent(false).should.equal('"f"');
        __1.quoteIdent(0).should.equal('"0"');
        __1.quoteIdent(15).should.equal('"15"');
        __1.quoteIdent(-15).should.equal('"-15"');
        __1.quoteIdent(45.13).should.equal('"45.13"');
        __1.quoteIdent(-45.13).should.equal('"-45.13"');
        __1.quoteIdent(testIdentArray).should.equal('abc,"AbC","1","t","2012-12-14 13:06:43.152+00","-Infinity","Infinity","NaN","1"');
        (function () {
            __1.quoteIdent(testNestedArray);
        }).should.throw(Error);
        __1.quoteIdent(testDate).should.equal('"2012-12-14 13:06:43.152+00"');
    });
    it('should throw when undefined', function (done) {
        try {
            __1.quoteIdent(undefined);
        }
        catch (err) {
            assert_1.default(err.message === 'SQL identifier cannot be null or undefined');
            done();
        }
    });
    it('should throw when null', function (done) {
        try {
            __1.quoteIdent(null);
        }
        catch (err) {
            assert_1.default(err.message === 'SQL identifier cannot be null or undefined');
            done();
        }
    });
    it('should throw when object', function (done) {
        try {
            __1.quoteIdent({});
        }
        catch (err) {
            assert_1.default(err.message === 'SQL identifier cannot be an object');
            done();
        }
    });
});
describe('quoteLiteral(val)', function () {
    it('should return NULL for null', function () {
        __1.quoteLiteral(null).should.equal('NULL');
        __1.quoteLiteral(undefined).should.equal('NULL');
    });
    it('should quote', function () {
        __1.quoteLiteral(true).should.equal("'t'");
        __1.quoteLiteral(false).should.equal("'f'");
        __1.quoteLiteral(0).should.equal('0');
        __1.quoteLiteral(15).should.equal('15');
        __1.quoteLiteral(-15).should.equal('-15');
        __1.quoteLiteral(45.13).should.equal('45.13');
        __1.quoteLiteral(-45.13).should.equal('-45.13');
        __1.quoteLiteral('hello world').should.equal("'hello world'");
        __1.quoteLiteral(testArray).should.equal("'abc',1,'t',NULL,'2012-12-14 13:06:43.152+00','-Infinity','Infinity','NaN',1");
        __1.quoteLiteral(testNestedArray).should.equal("(1, 2), (3, 4), (5, 6)");
        __1.quoteLiteral(testDate).should.equal("'2012-12-14 13:06:43.152+00'");
        __1.quoteLiteral(testObject).should.equal("'{\"a\":1,\"b\":2}'::jsonb");
    });
    it('should format quotes', function () {
        __1.quoteLiteral("O'Reilly").should.equal("'O''Reilly'");
    });
    it('should format backslashes', function () {
        __1.quoteLiteral('\\whoop\\').should.equal("E'\\\\whoop\\\\'");
    });
});
