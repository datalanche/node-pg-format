'use strict';

// reserved Postgres words
var reservedMap = require(__dirname + '/reserved.js');

var fmtPattern = {
    ident: 'I',
    literal: 'L',
    string: 's',
};

// convert to Postgres default ISO 8601 format
function formatDate(date) {
    date = date.replace('T', ' ');
    date = date.replace('Z', '+00');
    return date;
}

function isReserved(value) {
    if (reservedMap[value.toUpperCase()]) {
        return true;
    }
    return false;
}

function arrayToList(useSpace, array, formatter) {
    var sql = '';
    var temp = [];

    sql += useSpace ? ' (' : '(';
    for (var i = 0; i < array.length; i++) {
      sql += (i === 0 ? '' : ', ') + formatter(array[i]);
    }
    sql += ')';

    return sql;
}

// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
function quoteIdent(value) {

    if (value === undefined || value === null) {
        throw new Error('SQL identifier cannot be null or undefined');
    } else if (value === false) {
        return '"f"';
    } else if (value === true) {
        return '"t"';
    } else if (value instanceof Date) {
        return '"' + formatDate(value.toISOString()) + '"';
    } else if (value instanceof Buffer) {
        throw new Error('SQL identifier cannot be a buffer');
    } else if (Array.isArray(value) === true) {
        var temp = [];
        for (var i = 0; i < value.length; i++) {
            if (Array.isArray(value[i]) === true) {
                throw new Error('Nested array to grouped list conversion is not supported for SQL identifier');
            } else {
                temp.push(quoteIdent(value[i]));
            }
        }
        return temp.toString();
    } else if (value === Object(value)) {
        throw new Error('SQL identifier cannot be an object');
    }

    var ident = value.toString().slice(0); // create copy

    // do not quote a valid, unquoted identifier
    if (/^[a-z_][a-z0-9_$]*$/.test(ident) === true && isReserved(ident) === false) {
        return ident;
    }

    var quoted = '"';

    for (var i = 0; i < ident.length; i++) {
        var c = ident[i];
        if (c === '"') {
            quoted += c + c;
        } else {
            quoted += c;
        }
    }

    quoted += '"';

    return quoted;
};

// Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
function quoteLiteral(value) {

    var literal = null;
    var explicitCast = null;

    if (value === undefined || value === null) {
        return 'NULL';
    } else if (value === false) {
        return "'f'";
    } else if (value === true) {
        return "'t'";
    } else if (value instanceof Date) {
        return "'" + formatDate(value.toISOString()) + "'";
    } else if (value instanceof Buffer) {
        return "E'\\\\x" + value.toString('hex') + "'";
    } else if (Array.isArray(value) === true) {
        var temp = [];
        for (var i = 0; i < value.length; i++) {
            if (Array.isArray(value[i]) === true) {
                temp.push(arrayToList(i !== 0, value[i], quoteLiteral))
            } else {
                temp.push(quoteLiteral(value[i]));
            }
        }
        return temp.toString();
    } else if (value === Object(value)) {
        explicitCast = 'jsonb';
        literal = JSON.stringify(value);
    } else {
        literal = value.toString().slice(0); // create copy
    }

    var hasBackslash = false;
    var quoted = '\'';

    for (var i = 0; i < literal.length; i++) {
        var c = literal[i];
        if (c === '\'') {
            quoted += c + c;
        } else if (c === '\\') {
            quoted += c + c;
            hasBackslash = true;
        } else {
            quoted += c;
        }
    }

    quoted += '\'';

    if (hasBackslash === true) {
        quoted = 'E' + quoted;
    }

    if (explicitCast) {
        quoted += '::' + explicitCast;
    }

    return quoted;
};

function quoteString(value) {

    if (value === undefined || value === null) {
        return '';
    } else if (value === false) {
        return 'f';
    } else if (value === true) {
        return 't';
    } else if (value instanceof Date) {
        return formatDate(value.toISOString());
    } else if (value instanceof Buffer) {
        return '\\x' + value.toString('hex');
    } else if (Array.isArray(value) === true) {
        var temp = [];
        for (var i = 0; i < value.length; i++) {
            if (value[i] !== null && value[i] !== undefined) {
                if (Array.isArray(value[i]) === true) {
                    temp.push(arrayToList(i !== 0, value[i], quoteString));
                } else {
                    temp.push(quoteString(value[i]));
                }
            }
        }
        return temp.toString();
    } else if (value === Object(value)) {
        return JSON.stringify(value);
    }

    return value.toString().slice(0); // return copy
}

function config(cfg) {

    // default
    fmtPattern.ident = 'I';
    fmtPattern.literal = 'L';
    fmtPattern.string = 's';

    if (cfg && cfg.pattern) {
        if (cfg.pattern.ident) { fmtPattern.ident = cfg.pattern.ident; }
        if (cfg.pattern.literal) { fmtPattern.literal = cfg.pattern.literal; }
        if (cfg.pattern.string) { fmtPattern.string = cfg.pattern.string; }
    }
}

function formatWithArray(fmt, parameters) {

    var index = 0;
    var params = parameters;

    var re = '%(%|(\\d+\\$)?[';
    re += fmtPattern.ident;
    re += fmtPattern.literal;
    re += fmtPattern.string;
    re += '])';
    re = new RegExp(re, 'g');

    return fmt.replace(re, function(_, type) {

        if (type === '%') {
            return '%';
        }

        var position = index;
        var tokens = type.split('$');

        if (tokens.length > 1) {
            position = parseInt(tokens[0]) - 1;
            type = tokens[1];
        }

        if (position < 0) {
            throw new Error('specified argument 0 but arguments start at 1');
        } else if (position > params.length - 1) {
            throw new Error('too few arguments');
        }

        index = position + 1;

        if (type === fmtPattern.ident) {
            return quoteIdent(params[position]);
        } else if (type === fmtPattern.literal) {
            return quoteLiteral(params[position]);
        } else if (type === fmtPattern.string) {
            return quoteString(params[position]);
        }
    });
}

function format(fmt) {
    var args = Array.prototype.slice.call(arguments);
    args = args.slice(1); // first argument is fmt
    return formatWithArray(fmt, args);
}

exports = module.exports = format;
exports.config = config;
exports.ident = quoteIdent;
exports.literal = quoteLiteral;
exports.string = quoteString;
exports.withArray = formatWithArray;