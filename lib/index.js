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
            temp.push(quoteIdent(value[i]));
        }
        return temp.toString();
    } else if (value === Object(value)) {
        throw new Error('SQL identifier cannot be an object');
    } else {
        value = value.toString();
    }

    // do not quote a valid, unquoted identifier
    if (/^[a-z_][a-z0-9_$]*$/.test(value) === true && isReserved(value) === false) {
        return value;
    }

    var quoted = '"';

    for (var i = 0; i < value.length; i++) {
        var c = value[i];
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
            temp.push(quoteLiteral(value[i]));
        }
        return temp.toString();
    } else if (value === Object(value)) {
        value = JSON.stringify(value);
    } else {
        value = value.toString();
    }

    var hasBackslash = false;
    var quoted = '\'';

    for (var i = 0; i < value.length; i++) {
        var c = value[i];
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
                temp.push(quoteString(value[i]));
            }
        }
        return temp.toString();
    } else if (value === Object(value)) {
        return JSON.stringify(value);
    }

    return value.toString();
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
    var i = 1;
    var params = parameters;

    var re = '%([%';
    re += fmtPattern.ident;
    re += fmtPattern.literal;
    re += fmtPattern.string;
    re += '])';
    re = new RegExp(re, 'g');

    return fmt.replace(re, function(_, type) {

        if (type === '%') {
            return '%';
        }

        var param = params[i++];

        if (type === fmtPattern.ident) {
            return quoteIdent(param);
        } else if (type === fmtPattern.literal) {
            return quoteLiteral(param);
        } else if (type === fmtPattern.string) {
            return quoteString(param);
        }
    });
}

function format(fmt) {
    return formatWithArray(fmt, arguments);
}

exports = module.exports = format;
exports.config = config;
exports.ident = quoteIdent;
exports.literal = quoteLiteral;
exports.string = quoteString;
exports.withArray = formatWithArray;