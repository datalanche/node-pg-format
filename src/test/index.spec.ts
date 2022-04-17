import {
  format,
  formatWithArray,
  quoteIdent,
  quoteLiteral,
  quoteString,
  config
} from '..';
import assert from 'assert';
import 'should';



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
      format('some %s here', 'thing').should.equal('some thing here');
      format('some %s thing %s', 'long', 'here').should.equal('some long thing here');
    });


    it('should format array of array as simple string', function () {
      format('many %s %s', 'things', testNestedArray).should.equal('many things (1, 2), (3, 4), (5, 6)');
    });

    it('should format string using position field', function () {
      format('some %1$s', 'thing').should.equal('some thing');
      format('some %1$s %1$s', 'thing').should.equal('some thing thing');
      format('some %1$s %s', 'thing', 'again').should.equal('some thing again');
      format('some %1$s %2$s', 'thing', 'again').should.equal('some thing again');
      format('some %1$s %2$s %1$s', 'thing', 'again').should.equal('some thing again thing');
      format('some %1$s %2$s %s %1$s', 'thing', 'again', 'some').should.equal('some thing again some thing');
    });

    it('should not format string using position 0', function () {
      (function () {
        format('some %0$s', 'thing');
      }).should.throw(Error);
    });

    it('should not format string using position field with too few arguments', function () {
      (function () {
        format('some %2$s', 'thing');
      }).should.throw(Error);
    });
  });

  describe('%%', function () {
    it('should format as %', function () {
      format('some %%', 'thing').should.equal('some %');
    });

    it('should not eat args', function () {
      format('just %% a %s', 'test').should.equal('just % a test');
    });

    it('should not format % using position field', function () {
      format('%1$%', 'thing').should.equal('%1$%');
    });
  });

  describe('%I', function () {
    it('should format as an identifier', function () {
      format('some %I', 'foo/bar/baz').should.equal('some "foo/bar/baz"');
    });

    it('should format as an identifier', function () {
      format('some %I', 'foo.bar').should.equal('some foo.bar');
    });

    it('should not format array of array as an identifier', function () {
      (function () {
        format('many %I %I', 'foo/bar/baz', testNestedArray);
      }).should.throw(Error);
    });

    it('should format identifier using position field', function () {
      format('some %1$I', 'thing').should.equal('some thing');
      format('some %1$I %1$I', 'thing').should.equal('some thing thing');
      format('some %1$I %I', 'thing', 'again').should.equal('some thing again');
      format('some %1$I %2$I', 'thing', 'again').should.equal('some thing again');
      format('some %1$I %2$I %1$I', 'thing', 'again').should.equal('some thing again thing');
      format('some %1$I %2$I %I %1$I', 'thing', 'again', 'huh').should.equal('some thing again huh thing');
    });

    it('should not format identifier using position 0', function () {
      (function () {
        format('some %0$I', 'thing');
      }).should.throw(Error);
    });

    it('should not format identifier using position field with too few arguments', function () {
      (function () {
        format('some %2$I', 'thing');
      }).should.throw(Error);
    });
  });

  describe('%L', function () {
    it('should format as a literal', function () {
      format('%L', "Tobi's").should.equal("'Tobi''s'");
    });

    it('should format array of array as a literal', function () {
      format('%L', testNestedArray).should.equal("(1, 2), (3, 4), (5, 6)");
    });

    it('should format literal using position field', function () {
      format('some %1$L', 'thing').should.equal("some 'thing'");
      format('some %1$L %1$L', 'thing').should.equal("some 'thing' 'thing'");
      format('some %1$L %L', 'thing', 'again').should.equal("some 'thing' 'again'");
      format('some %1$L %2$L', 'thing', 'again').should.equal("some 'thing' 'again'");
      format('some %1$L %2$L %1$L', 'thing', 'again').should.equal("some 'thing' 'again' 'thing'");
      format('some %1$L %2$L %L %1$L', 'thing', 'again', 'some').should.equal("some 'thing' 'again' 'some' 'thing'");
    });

    it('should not format literal using position 0', function () {
      (function () {
        format('some %0$L', 'thing');
      }).should.throw(Error);
    });

    it('should not format literal using position field with too few arguments', function () {
      (function () {
        format('some %2$L', 'thing');
      }).should.throw(Error);
    });
  });
});

describe('formatWithArray(fmt, args)', function () {
  describe('%s', function () {
    it('should format as a simple string', function () {
      formatWithArray('some %s here', ['thing']).should.equal('some thing here');
      formatWithArray('some %s thing %s', ['long', 'here']).should.equal('some long thing here');
    });

    it('should format array of array as simple string', function () {
      formatWithArray('many %s %s', ['things', testNestedArray]).should.equal('many things (1, 2), (3, 4), (5, 6)');
    });
  });

  describe('%%', function () {
    it('should format as %', function () {
      formatWithArray('some %%', ['thing']).should.equal('some %');
    });

    it('should not eat args', function () {
      formatWithArray('just %% a %s', ['test']).should.equal('just % a test');
      formatWithArray('just %% a %s %s %s', ['test', 'again', 'and again']).should.equal('just % a test again and again');
    });
  });

  describe('%I', function () {
    it('should format as an identifier', function () {
      formatWithArray('some %I', ['foo/bar/baz']).should.equal('some "foo/bar/baz"');
      formatWithArray('some %I and %I', ['foo/bar/baz', '#hey']).should.equal('some "foo/bar/baz" and "#hey"');
    });

    it('should not format array of array as an identifier', function () {
      (function () {
        formatWithArray('many %I %I', ['foo/bar/baz', testNestedArray]);
      }).should.throw(Error);
    });
  });

  describe('%L', function () {
    it('should format as a literal', function () {
      formatWithArray('%L', ["Tobi's"]).should.equal("'Tobi''s'");
      formatWithArray('%L %L', ["Tobi's", "birthday"]).should.equal("'Tobi''s' 'birthday'");
    });

    it('should format array of array as a literal', function () {
      formatWithArray('%L', [testNestedArray]).should.equal("(1, 2), (3, 4), (5, 6)");
    });
  });
});

describe('quoteString(val)', function () {
  it('should coerce to a string', function () {
    quoteString(undefined).should.equal('');
    quoteString(null).should.equal('');
    quoteString(true).should.equal('t');
    quoteString(false).should.equal('f');
    quoteString(0).should.equal('0');
    quoteString(15).should.equal('15');
    quoteString(-15).should.equal('-15');
    quoteString(45.13).should.equal('45.13');
    quoteString(-45.13).should.equal('-45.13');
    quoteString('something').should.equal('something');
    quoteString(testArray).should.equal('abc,1,t,2012-12-14 13:06:43.152+00,-Infinity,Infinity,NaN,1');
    quoteString(testNestedArray).should.equal('(1, 2), (3, 4), (5, 6)');
    quoteString(testDate).should.equal('2012-12-14 13:06:43.152+00');
    quoteString(testObject).should.equal('{"a":1,"b":2}');
  });
});

describe('quoteIdent(val)', function () {
  it('should quote when necessary', function () {
    quoteIdent('foo').should.equal('foo');
    quoteIdent('_foo').should.equal('_foo');
    quoteIdent('_foo_bar$baz').should.equal('_foo_bar$baz');
    quoteIdent('test.some.stuff').should.equal('test.some.stuff');
    quoteIdent('test."some".stuff').should.equal('"test.""some"".stuff"');
  });

  it('should quote reserved words', function () {
    quoteIdent('desc').should.equal('"desc"');
    quoteIdent('join').should.equal('"join"');
    quoteIdent('cross').should.equal('"cross"');
  });

  it('should quote', function () {
    quoteIdent(true).should.equal('"t"');
    quoteIdent(false).should.equal('"f"');
    quoteIdent(0).should.equal('"0"');
    quoteIdent(15).should.equal('"15"');
    quoteIdent(-15).should.equal('"-15"');
    quoteIdent(45.13).should.equal('"45.13"');
    quoteIdent(-45.13).should.equal('"-45.13"');
    quoteIdent(testIdentArray).should.equal('abc,AbC,"1","t","2012-12-14 13:06:43.152+00","-Infinity",Infinity,NaN,"1"');
    (function () {
      quoteIdent(testNestedArray)
    }).should.throw(Error);
    quoteIdent(testDate).should.equal('"2012-12-14 13:06:43.152+00"');
  });

  it('should throw when undefined', function (done) {
    try {
      quoteIdent(undefined);
    } catch (err: any) {
      assert(err.message === 'SQL identifier cannot be null or undefined');
      done();
    }
  });

  it('should throw when null', function (done) {
    try {
      quoteIdent(null);
    } catch (err: any) {
      assert(err.message === 'SQL identifier cannot be null or undefined');
      done();
    }
  });

  it('should throw when object', function (done) {
    try {
      quoteIdent({});
    } catch (err: any) {
      assert(err.message === 'SQL identifier cannot be an object');
      done();
    }
  });
});

describe('quoteLiteral(val)', function () {
  it('should return NULL for null', function () {
    quoteLiteral(null).should.equal('NULL');
    quoteLiteral(undefined).should.equal('NULL');
  });

  it('should quote', function () {
    quoteLiteral(true).should.equal("'t'");
    quoteLiteral(false).should.equal("'f'");
    quoteLiteral(0).should.equal('0');
    quoteLiteral(15).should.equal('15');
    quoteLiteral(-15).should.equal('-15');
    quoteLiteral(45.13).should.equal('45.13');
    quoteLiteral(-45.13).should.equal('-45.13');
    quoteLiteral('hello world').should.equal("'hello world'");
    quoteLiteral(testArray).should.equal("'abc',1,'t',NULL,'2012-12-14 13:06:43.152+00','-Infinity','Infinity','NaN',1");
    quoteLiteral(testNestedArray).should.equal("(1, 2), (3, 4), (5, 6)");
    quoteLiteral(testDate).should.equal("'2012-12-14 13:06:43.152+00'");
    quoteLiteral(testObject).should.equal("'{\"a\":1,\"b\":2}'::jsonb");
  });

  it('should format quotes', function () {
    quoteLiteral("O'Reilly").should.equal("'O''Reilly'");
  });

  it('should format backslashes', function () {
    quoteLiteral('\\whoop\\').should.equal("E'\\\\whoop\\\\'");
  });
});