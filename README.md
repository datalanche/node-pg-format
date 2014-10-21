node-pg-format
==============

Node.js implementation of [PostgreSQL format()](http://www.postgresql.org/docs/9.3/static/functions-string.html#FUNCTIONS-STRING-FORMAT) to safely create dynamic SQL queries. SQL identifiers and literals are escaped to help prevent SQL injection. The behavior is equivalent to [PostgreSQL format()](http://www.postgresql.org/docs/9.3/static/functions-string.html#FUNCTIONS-STRING-FORMAT) except when handling Javascript arrays and objects.

## Install

    npm install pg-format
    
## Example
```js
var format = require('pg-format');
var sql = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
console.log(sql); // SELECT * FROM my_table WHERE my_col = '34' LIMIT 10
```

## API

## Arrays and Objects
Javascript arrays and objects can be used for literals (%L) and strings (%s), but not identifiers (%I). For arrays, each element is escaped, if appropriate, and concatenated to a comma-delimited string. For objects, ```JSON.stringify()``` is called and the resuling string is escaped if appropriate. See the examples below.

```js
var format = require('pg-format');

var myArray = [ 1, 2, 3 ];
var myObject = { a: 1, b: 2 };

var sql = format('SELECT * FROM t WHERE c1 IN(%L) AND c2 = %L', myArray, myObject);
console.log(sql); // SELECT * FROM t WHERE c1 IN('1','2','3') AND c2 = '{"a":1,"b":2}'
```
