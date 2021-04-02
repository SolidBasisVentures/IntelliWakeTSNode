'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var readline = require('readline');
var intelliwaketsfoundation = require('@solidbasisventures/intelliwaketsfoundation');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var QueryStream = require('pg-query-stream');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var readline__default = /*#__PURE__*/_interopDefaultLegacy(readline);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var QueryStream__default = /*#__PURE__*/_interopDefaultLegacy(QueryStream);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var KeyboardLine = function (question, validAnswers) { return __awaiter(void 0, void 0, void 0, function () {
    var rl;
    return __generator(this, function (_a) {
        rl = readline__default['default'].createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return [2 /*return*/, new Promise(function (resolve) {
                return rl.question(question + " ", function (answer) {
                    if (!validAnswers || validAnswers.includes(answer)) {
                        resolve(answer);
                        rl.close();
                    }
                });
            })];
    });
}); };
var KeyboardKey = function (question, validKeys) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                if (!!question)
                    console.log(question);
                process.stdin.setRawMode(true);
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                var getData = function (key) {
                    if (key === '\u0003')
                        process.exit();
                    if (!validKeys || (Array.isArray(validKeys) ? validKeys.includes(key) : validKeys(key))) {
                        process.stdin.setRawMode(false);
                        process.stdin.pause();
                        process.stdin.removeListener('data', getData);
                        resolve(key);
                    }
                };
                process.stdin.on('data', getData);
            })];
    });
}); };

var PaginatorInitializeResponseFromRequest = function (paginatorRequest) { return ({
    page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
    pageCount: 1,
    rowCount: 0,
    countPerPage: paginatorRequest.countPerPage,
    currentOffset: 1,
    rows: []
}); };
var PaginatorApplyRowCount = function (paginatorResponse, rowCount) {
    paginatorResponse.rowCount = +rowCount;
    if (+rowCount > 0) {
        paginatorResponse.pageCount = Math.floor((+rowCount + (+paginatorResponse.countPerPage - 1)) / +paginatorResponse.countPerPage);
        if (+paginatorResponse.page < 1)
            paginatorResponse.page = 1;
        if (+paginatorResponse.page > +paginatorResponse.pageCount)
            paginatorResponse.page = +paginatorResponse.pageCount;
        paginatorResponse.currentOffset = (+paginatorResponse.page - 1) * +paginatorResponse.pageCount;
    }
    else {
        paginatorResponse.pageCount = 0;
        paginatorResponse.currentOffset = 0;
        paginatorResponse.page = 1;
    }
};

var PGEnum = /** @class */ (function () {
    function PGEnum(instanceData) {
        this.enumName = '';
        this.values = [];
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGEnum.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    Object.defineProperty(PGEnum.prototype, "columnName", {
        get: function () {
            return intelliwaketsfoundation.ToSnakeCase(this.enumName);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PGEnum.prototype, "typeName", {
        get: function () {
            return this.enumName;
        },
        enumerable: false,
        configurable: true
    });
    PGEnum.TypeName = function (columnName) {
        return intelliwaketsfoundation.ToPascalCase(columnName);
    };
    PGEnum.prototype.ddlRemove = function () {
        return "DROP TYPE IF EXISTS " + this.columnName + " CASCADE ";
    };
    PGEnum.prototype.ddlDefinition = function () {
        return "CREATE TYPE " + this.columnName + " AS ENUM ('" + this.values.join('\',\'') + "')";
    };
    return PGEnum;
}());

var PGColumn = /** @class */ (function () {
    function PGColumn(instanceData) {
        var _this = this;
        this.column_name = '';
        this.ordinal_position = 0;
        this.column_default = null;
        this.is_nullable = 'YES';
        this.udt_name = '';
        this.character_maximum_length = null;
        this.character_octet_length = null;
        /** Total number of digits */
        this.numeric_precision = null;
        /** Number of digits after the decimal point */
        this.numeric_scale = null;
        this.datetime_precision = null;
        this.is_identity = 'NO';
        this.is_self_referencing = 'NO';
        this.identity_generation = null;
        this.array_dimensions = [];
        this.check = null;
        this.checkStringValues = [];
        this.generatedAlwaysAs = null;
        /** Comment on column, except for within {}'s
         * {} can contain comma separated values
         * {enum: EDeclaration: default_value} or {enum: EDeclaration.default_value} or {enum: EDeclaration} */
        this.column_comment = '';
        this.isAutoIncrement = true;
        this.jsType = function () {
            if (typeof _this.udt_name !== 'string') {
                return _this.udt_name.enumName;
            }
            else if (_this.jsonType()) {
                return 'object';
            }
            else if (_this.booleanType()) {
                return 'boolean';
            }
            else if (_this.integerFloatType()) {
                return 'number';
            }
            else if (_this.udt_name === PGColumn.TYPE_POINT) {
                return '[number, number]';
            }
            else if (_this.udt_name.startsWith('e_')) {
                return PGEnum.TypeName(_this.udt_name);
            }
            else {
                return 'string'; // Date or String or Enum
            }
        };
        this.enumType = function () {
            return typeof _this.udt_name !== 'string';
        };
        this.integerType = function () {
            return (typeof _this.udt_name === 'string') && (_this.udt_name.toLowerCase().startsWith('int') || [PGColumn.TYPE_SMALLINT, PGColumn.TYPE_INTEGER, PGColumn.TYPE_BIGINT].includes(_this.udt_name.toLowerCase()));
        };
        this.floatType = function () {
            return (typeof _this.udt_name === 'string') && [PGColumn.TYPE_NUMERIC, PGColumn.TYPE_FLOAT8].includes(_this.udt_name.toLowerCase());
        };
        this.integerFloatType = function () {
            return _this.integerType() || _this.floatType();
        };
        this.booleanType = function () {
            return (typeof _this.udt_name === 'string') && [PGColumn.TYPE_BOOLEAN].includes(_this.udt_name.toLowerCase());
        };
        this.jsonType = function () {
            return (typeof _this.udt_name === 'string') && [PGColumn.TYPE_JSON, PGColumn.TYPE_JSONB].includes(_this.udt_name.toLowerCase());
        };
        this.generalStringType = function () {
            return (typeof _this.udt_name !== 'string') || [PGColumn.TYPE_VARCHAR].includes(_this.udt_name.toLowerCase());
        };
        this.dateType = function () {
            return (typeof _this.udt_name === 'string') && [
                PGColumn.TYPE_DATE,
                PGColumn.TYPE_TIME,
                PGColumn.TYPE_TIMETZ,
                PGColumn.TYPE_TIMESTAMP,
                PGColumn.TYPE_TIMESTAMPTZ
            ].includes(_this.udt_name.toLowerCase());
        };
        this.blobType = function () {
            return (typeof _this.udt_name === 'string') && [PGColumn.TYPE_TEXT].includes(_this.udt_name.toLowerCase());
        };
        this.otherType = function () {
            return (!_this.integerFloatType && !_this.booleanType && !_this.dateType() && !_this.generalStringType() && !_this.blobType());
        };
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGColumn.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key) && typeof instanceData !== 'function') {
                this[key] = instanceData[key];
            }
        }
    };
    PGColumn.prototype.clean = function () {
        //		if (this.dateType()) {
        //			if (IsEmpty(this.DATETIME_PRECISION) || this.DATETIME_PRECISION < 3 || this.DATETIME_PRECISION > 6) {
        //				this.DATETIME_PRECISION = 6;
        //			}
        //		}
    };
    PGColumn.prototype.ddlDefinition = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var ddl = '"' + this.column_name + '" ';
        ddl += (typeof this.udt_name === 'string') ? this.udt_name : this.udt_name.columnName;
        if (this.array_dimensions.length > 0) {
            ddl += "[" + this.array_dimensions
                .map(function (array_dimension) { return (!!array_dimension ? array_dimension.toString() : ''); })
                .join('],[') + "] ";
        }
        else {
            if (this.udt_name !== PGColumn.TYPE_POINT) {
                if (this.floatType() && this.udt_name !== PGColumn.TYPE_FLOAT8) {
                    ddl += '(' + this.numeric_precision + ',' + ((_a = this.numeric_scale) !== null && _a !== void 0 ? _a : 0) + ') ';
                }
                else if (this.dateType()) {
                    if (!!this.datetime_precision) {
                        ddl += '(' + this.datetime_precision + ') ';
                    }
                    else {
                        ddl += ' ';
                    }
                }
                else if (this.generalStringType()) {
                    if (!this.blobType() && (typeof this.udt_name === 'string')) {
                        ddl += '(' + ((_b = this.character_maximum_length) !== null && _b !== void 0 ? _b : 255) + ') ';
                    }
                    else {
                        ddl += ' ';
                    }
                }
                else {
                    ddl += ' ';
                }
            }
            else {
                ddl += ' ';
            }
        }
        if (!!this.generatedAlwaysAs) {
            ddl += "GENERATED ALWAYS AS " + PGColumn.CleanComment(this.generatedAlwaysAs) + " STORED ";
        }
        else {
            if (!intelliwaketsfoundation.IsOn(this.is_nullable)) {
                ddl += 'NOT NULL ';
            }
            if (typeof this.column_default === 'string' && this.column_default.toLowerCase().includes('null')) {
                this.column_default = null;
            }
            if ((this.column_default !== undefined && this.column_default !== null) || this.is_identity || this.isAutoIncrement) {
                if (!(this.dateType() && (!this.column_default || ((_c = this.column_default) !== null && _c !== void 0 ? _c : '').toString().toUpperCase().includes('NULL')))) {
                    if (this.array_dimensions.length > 0) {
                        if (intelliwaketsfoundation.IsOn(this.is_nullable)) {
                            ddl += "DEFAULT " + ((_d = this.column_default) !== null && _d !== void 0 ? _d : 'NULL') + " ";
                        }
                        else {
                            ddl += "DEFAULT " + ((_e = this.column_default) !== null && _e !== void 0 ? _e : ((typeof this.udt_name === 'string') ? '\'{}\'' : (_f = this.udt_name.defaultValue) !== null && _f !== void 0 ? _f : '\'{}')) + " ";
                        }
                    }
                    else {
                        if (!this.blobType()) {
                            if (intelliwaketsfoundation.IsOn(this.is_identity)) {
                                if (this.isAutoIncrement) {
                                    if (!!this.identity_generation) {
                                        ddl += "GENERATED " + this.identity_generation + " AS IDENTITY ";
                                    }
                                    else {
                                        ddl += "GENERATED BY DEFAULT AS IDENTITY ";
                                    }
                                }
                            }
                            else if (this.booleanType()) {
                                if (intelliwaketsfoundation.IsOn(this.is_nullable) || this.column_default === null) {
                                    ddl += "DEFAULT NULL ";
                                }
                                else {
                                    ddl += "DEFAULT " + (intelliwaketsfoundation.IsOn(this.column_default) ? 'true' : 'false') + " ";
                                }
                            }
                            else if (!this.column_default && (typeof this.udt_name !== 'string') && !!this.udt_name.defaultValue) {
                                ddl += "DEFAULT '" + this.udt_name.defaultValue + "' ";
                            }
                            else {
                                if (!!this.column_default) {
                                    if (this.integerFloatType() || this.dateType() || ((_g = this.column_default) !== null && _g !== void 0 ? _g : '').toString().includes('::') || ((_h = this.column_default) !== null && _h !== void 0 ? _h : '').toString().includes('()')) {
                                        ddl += "DEFAULT " + this.column_default + " ";
                                    }
                                    else {
                                        ddl += "DEFAULT '" + this.column_default + "' ";
                                    }
                                }
                                else if (intelliwaketsfoundation.IsOn(this.is_nullable)) {
                                    ddl += "DEFAULT NULL ";
                                }
                                else {
                                    if (this.integerFloatType()) {
                                        ddl += "DEFAULT 0 ";
                                    }
                                    else if (this.dateType()) {
                                        ddl += "DEFAULT now() ";
                                        // if (!!this.datetime_precision) {
                                        // 	ddl += `(${this.datetime_precision} `;
                                        // } else {
                                        // 	ddl += ` `;
                                        // }
                                    }
                                    else {
                                        ddl += "DEFAULT '' ";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!!this.check) {
                ddl += "CHECK (" + this.check + ") ";
            }
            else if (this.checkStringValues.length > 0) {
                ddl += "CHECK (" + (intelliwaketsfoundation.IsOn(this.is_nullable) ? this.column_name + ' IS NULL OR ' : '') + this.column_name + " IN ('" + this.checkStringValues.join('\', \'') + "')) ";
            }
        }
        return ddl.trim();
    };
    PGColumn.CleanComment = function (comment) {
        if (!comment) {
            return comment;
        }
        return comment.replace(/[\n\r]/g, ' ');
    };
    PGColumn.TYPE_BOOLEAN = 'bool'; // Changed from boolean
    PGColumn.TYPE_NUMERIC = 'numeric';
    PGColumn.TYPE_FLOAT8 = 'float8';
    PGColumn.TYPE_POINT = 'point';
    PGColumn.TYPE_SMALLINT = 'smallint';
    PGColumn.TYPE_INTEGER = 'integer';
    PGColumn.TYPE_BIGINT = 'bigint';
    PGColumn.TYPE_VARCHAR = 'varchar';
    PGColumn.TYPE_TEXT = 'text';
    PGColumn.TYPE_JSON = 'json';
    PGColumn.TYPE_JSONB = 'jsonb';
    PGColumn.TYPE_DATE = 'date';
    PGColumn.TYPE_TIME = 'time';
    PGColumn.TYPE_TIMETZ = 'timetz';
    PGColumn.TYPE_TIMESTAMP = 'timestamp';
    PGColumn.TYPE_TIMESTAMPTZ = 'timestamptz';
    PGColumn.TYPE_BYTEA = 'bytea';
    PGColumn.TYPE_UUID = 'uuid';
    PGColumn.TYPES_ALL = [
        PGColumn.TYPE_BOOLEAN,
        PGColumn.TYPE_NUMERIC,
        PGColumn.TYPE_FLOAT8,
        PGColumn.TYPE_POINT,
        PGColumn.TYPE_SMALLINT,
        PGColumn.TYPE_INTEGER,
        PGColumn.TYPE_BIGINT,
        PGColumn.TYPE_VARCHAR,
        PGColumn.TYPE_TEXT,
        PGColumn.TYPE_JSON,
        PGColumn.TYPE_JSONB,
        PGColumn.TYPE_DATE,
        PGColumn.TYPE_TIME,
        PGColumn.TYPE_TIMETZ,
        PGColumn.TYPE_TIMESTAMP,
        PGColumn.TYPE_TIMESTAMPTZ,
        PGColumn.TYPE_UUID
    ];
    return PGColumn;
}());

var ColumnDefinition = /** @class */ (function () {
    function ColumnDefinition() {
        var _this = this;
        this.COLUMN_NAME = "";
        this.ORDINAL_POSITION = 0;
        this.COLUMN_DEFAULT = null;
        this.IS_NULLABLE = "YES";
        this.DATA_TYPE = "";
        this.CHARACTER_MAXIMUM_LENGTH = null;
        this.CHARACTER_OCTET_LENGTH = null;
        this.NUMERIC_PRECISION = null;
        this.NUMERIC_SCALE = null;
        this.DATETIME_PRECISION = null;
        this.COLUMN_TYPE = null; // Full definition (e.g. varchar(55))
        this.COLUMN_KEY = null; // PRI
        this.EXTRA = null; // on update CURRENT_TIMESTAMP(3) OR auto_increment
        this.COLUMN_COMMENT = null;
        this.CHARACTER_SET_NAME = null;
        this.COLLATION_NAME = null;
        this.jsType = function () {
            if (_this.booleanType()) {
                return 'boolean';
            }
            else if (_this.integerFloatType()) {
                return 'number';
            }
            else if (_this.booleanType()) {
                return 'boolean';
            }
            else {
                return 'string'; // Date or String
            }
        };
        this.integerType = function () {
            return [ColumnDefinition.TYPE_TINYINT, ColumnDefinition.TYPE_SMALLINT, ColumnDefinition.TYPE_MEDIUMINT, ColumnDefinition.TYPE_INT, ColumnDefinition.TYPE_BIGINT, ColumnDefinition.TYPE_BIT, ColumnDefinition.TYPE_YEAR].includes(_this.DATA_TYPE.toUpperCase());
        };
        this.tinyintType = function () {
            return [ColumnDefinition.TYPE_TINYINT].includes(_this.DATA_TYPE.toUpperCase());
        };
        this.floatType = function () {
            return [ColumnDefinition.TYPE_DECIMAL, ColumnDefinition.TYPE_NUMERIC, ColumnDefinition.TYPE_FLOAT, ColumnDefinition.TYPE_DOUBLE].includes(_this.DATA_TYPE.toUpperCase());
        };
        this.integerFloatType = function () {
            return _this.integerType() || _this.floatType();
        };
        this.booleanType = function () {
            return [ColumnDefinition.TYPE_BIT].includes(_this.DATA_TYPE.toUpperCase());
        };
        this.dateType = function () {
            return [ColumnDefinition.TYPE_DATE, ColumnDefinition.TYPE_TIME, ColumnDefinition.TYPE_DATETIME, ColumnDefinition.TYPE_TIMESTAMP].includes(_this.DATA_TYPE.toUpperCase());
        };
        this.generalStringType = function () {
            return !_this.integerFloatType() && !_this.booleanType();
        };
        this.blobType = function () {
            return [ColumnDefinition.TYPE_TINYTEXT, ColumnDefinition.TYPE_TEXT, ColumnDefinition.TYPE_MEDIUMTEXT, ColumnDefinition.TYPE_LONGTEXT, ColumnDefinition.TYPE_TINYBLOB, ColumnDefinition.TYPE_BLOB, ColumnDefinition.TYPE_MEDIUMBLOB, ColumnDefinition.TYPE_LONGBLOB].includes(_this.DATA_TYPE.toUpperCase());
        };
        this.otherType = function () {
            return [ColumnDefinition.TYPE_GEOMETRY, ColumnDefinition.TYPE_POINT, ColumnDefinition.TYPE_LINESTRING, ColumnDefinition.TYPE_POLYGON, ColumnDefinition.TYPE_GEOMETRYCOLLECTION, ColumnDefinition.TYPE_MULTILINESTRING, ColumnDefinition.TYPE_MULTIPOINT, ColumnDefinition.TYPE_MULTIPOLYGON].includes(_this.DATA_TYPE.toUpperCase());
        };
    }
    ColumnDefinition.TYPE_TINYINT = 'TINYINT';
    ColumnDefinition.TYPE_SMALLINT = 'SMALLINT';
    ColumnDefinition.TYPE_MEDIUMINT = 'MEDIUMINT';
    ColumnDefinition.TYPE_INT = 'INT';
    ColumnDefinition.TYPE_BIGINT = 'BIGINT';
    ColumnDefinition.TYPE_DECIMAL = 'DECIMAL';
    ColumnDefinition.TYPE_NUMERIC = 'NUMERIC';
    ColumnDefinition.TYPE_FLOAT = 'FLOAT';
    ColumnDefinition.TYPE_DOUBLE = 'DOUBLE';
    ColumnDefinition.TYPE_BIT = 'BIT';
    ColumnDefinition.TYPE_CHAR = 'CHAR';
    ColumnDefinition.TYPE_VARCHAR = 'VARCHAR';
    ColumnDefinition.TYPE_BINARY = 'BINARY';
    ColumnDefinition.TYPE_VARBINARY = 'VARBINARY';
    ColumnDefinition.TYPE_TINYBLOB = 'TINYBLOB';
    ColumnDefinition.TYPE_BLOB = 'BLOB';
    ColumnDefinition.TYPE_MEDIUMBLOB = 'MEDIUMBLOB';
    ColumnDefinition.TYPE_LONGBLOB = 'LONGBLOB';
    ColumnDefinition.TYPE_TINYTEXT = 'TINYTEXT';
    ColumnDefinition.TYPE_TEXT = 'TEXT';
    ColumnDefinition.TYPE_MEDIUMTEXT = 'MEDIUMTEXT';
    ColumnDefinition.TYPE_LONGTEXT = 'LONGTEXT';
    ColumnDefinition.TYPE_ENUM = 'ENUM';
    ColumnDefinition.TYPE_SET = 'SET';
    ColumnDefinition.TYPE_DATE = 'DATE';
    ColumnDefinition.TYPE_TIME = 'TIME';
    ColumnDefinition.TYPE_DATETIME = 'DATETIME';
    ColumnDefinition.TYPE_TIMESTAMP = 'TIMESTAMP';
    ColumnDefinition.TYPE_YEAR = 'YEAR';
    ColumnDefinition.TYPE_GEOMETRY = 'GEOMETRY';
    ColumnDefinition.TYPE_POINT = 'POINT';
    ColumnDefinition.TYPE_LINESTRING = 'LINESTRING';
    ColumnDefinition.TYPE_POLYGON = 'POLYGON';
    ColumnDefinition.TYPE_GEOMETRYCOLLECTION = 'GEOMETRYCOLLECTION';
    ColumnDefinition.TYPE_MULTILINESTRING = 'MULTILINESTRING';
    ColumnDefinition.TYPE_MULTIPOINT = 'MULTIPOINT';
    ColumnDefinition.TYPE_MULTIPOLYGON = 'MULTIPOLYGON';
    ColumnDefinition.TYPE_JSON = 'JSON';
    return ColumnDefinition;
}());

var PGForeignKey = /** @class */ (function () {
    function PGForeignKey(instanceData) {
        this.columnNames = [];
        this.primaryTable = '';
        this.primaryColumns = [];
        this.onDelete = 'RESTRICT';
        this.onUpdate = 'RESTRICT';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGForeignKey.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    PGForeignKey.prototype.fkName = function (pgTable) {
        return pgTable.name + '_' + this.columnNames.map(function (column) { return column.substr(-25); }).join('_') + '_fkey';
    };
    PGForeignKey.prototype.ddlConstraintDefinition = function (pgTable) {
        return "\n\t\tDO $$\n\t\tBEGIN\n\t\t\tIF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '" + this.fkName(pgTable) + "') THEN\n\t\t\t\tALTER TABLE \"" + pgTable.name + "\"\n\t\t\t\t\tADD CONSTRAINT \"" + this.fkName(pgTable) + "\"\n\t\t\t\t\tFOREIGN KEY (\"" + this.columnNames.join('","') + "\") REFERENCES \"" + this.primaryTable + "\"(\"" + this.primaryColumns.join('","') + "\") DEFERRABLE INITIALLY DEFERRED;\n\t\t\tEND IF;\n\t\tEND;\n\t\t$$;"; // was INITIALLY IMMEDIATE
    };
    return PGForeignKey;
}());

var PGIndex = /** @class */ (function () {
    function PGIndex(instanceData) {
        this.columns = [];
        this.isUnique = false;
        this.concurrently = false;
        this.using = 'BTREE';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGIndex.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    PGIndex.prototype.name = function (pgTable) {
        return ('idx_' +
            pgTable.name.substr(-25) +
            '_' +
            this.columns
                .map(function (column) {
                return column
                    .replace(' ASC', '')
                    .replace(' DESC', '')
                    .replace(' NULLS', '')
                    .replace(' FIRST', '')
                    .replace(' LAST', '')
                    .replace('(', '_')
                    .replace(')', '_')
                    .trim().substr(-25);
            })
                .join('_'));
    };
    PGIndex.prototype.ddlDefinition = function (pgTable) {
        var ddl = 'CREATE ';
        if (this.isUnique) {
            ddl += 'UNIQUE ';
        }
        ddl += 'INDEX IF NOT EXISTS ';
        ddl += "\"" + this.name(pgTable) + "\" ";
        ddl += 'ON ';
        ddl += "\"" + pgTable.name + "\" ";
        ddl += 'USING btree ';
        ddl += '(' + this.columns.join(',') + ');';
        return ddl;
    };
    return PGIndex;
}());

var TS_EOL = '\n'; // was \r\n
var PGTable = /** @class */ (function () {
    function PGTable(instanceData) {
        this.name = '';
        this.description = '';
        this.check = null;
        this.inherits = [];
        this.columns = [];
        this.indexes = [];
        this.foreignKeys = [];
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGTable.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                switch (key) {
                    case 'columns':
                        for (var _a = 0, _b = instanceData[key]; _a < _b.length; _a++) {
                            var column = _b[_a];
                            this[key].push(new PGColumn(column));
                        }
                        break;
                    case 'indexes':
                        for (var _c = 0, _d = instanceData[key]; _c < _d.length; _c++) {
                            var index = _d[_c];
                            this[key].push(new PGIndex(index));
                        }
                        break;
                    case 'foreignKeys':
                        for (var _e = 0, _f = instanceData[key]; _e < _f.length; _e++) {
                            var foreignKey = _f[_e];
                            this[key].push(new PGForeignKey(foreignKey));
                        }
                        break;
                    default:
                        this[key] = instanceData[key];
                        break;
                }
            }
        }
    };
    PGTable.prototype.indexOfColumn = function (columnName) {
        return this.columns.findIndex(function (column) { return column.column_name === columnName; });
    };
    PGTable.prototype.indexesOfForeignKeyByColumn = function (columnName) {
        var indexes = [];
        for (var i = 0; i < this.foreignKeys.length; i++) {
            if (this.foreignKeys[i].columnNames.includes(columnName)) {
                indexes.push(i);
            }
        }
        return indexes;
    };
    PGTable.prototype.getForeignKeysByColumn = function (columnName) {
        var fks = [];
        var indexes = this.indexesOfForeignKeyByColumn(columnName);
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var index = indexes_1[_i];
            fks.push(this.foreignKeys[index]);
        }
        return fks;
    };
    PGTable.prototype.removeForeignKeysByColumn = function (columnName) {
        this.foreignKeys = this.foreignKeys.filter(function (foreignKey) { return !foreignKey.columnNames.includes(columnName); });
    };
    PGTable.prototype.removeIndexsByColumn = function (columnName) {
        this.indexes = this.indexes.filter(function (index) { return !index.columns.includes(columnName); });
    };
    PGTable.prototype.addForeignKey = function (pgForeignKey) {
        this.foreignKeys.push(pgForeignKey);
    };
    PGTable.prototype.getColumn = function (columnName) {
        var _a;
        return (_a = this.columns.find(function (column) { return column.column_name === columnName; })) !== null && _a !== void 0 ? _a : null;
    };
    PGTable.prototype.removeColumn = function (columnName) {
        var column = this.getColumn(columnName);
        if (!!column) {
            this.removeForeignKeysByColumn(columnName);
            this.columns.filter(function (column) { return column.column_name !== columnName; });
            this.reOrderColumns();
        }
    };
    PGTable.prototype.addColumn = function (pgColumn) {
        var pgColumnToAdd = new PGColumn(pgColumn);
        if (!pgColumnToAdd.ordinal_position) {
            pgColumnToAdd.ordinal_position = 999999;
        }
        this.columns = this.columns.filter(function (column) { return column.column_name !== pgColumnToAdd.column_name; });
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].ordinal_position >= pgColumnToAdd.ordinal_position) {
                this.columns[i].ordinal_position++;
            }
        }
        this.columns.push(pgColumnToAdd);
        this.reOrderColumns();
    };
    PGTable.prototype.reOrderColumns = function () {
        this.columns = this.columns.sort(function (a, b) { return a.ordinal_position - b.ordinal_position; });
        var position = 0;
        for (var i = 0; i < this.columns.length; i++) {
            position++;
            this.columns[i].ordinal_position = position;
        }
    };
    PGTable.prototype.addIndex = function (pgIndex) {
        this.indexes.push(pgIndex);
    };
    PGTable.prototype.tableHeaderText = function (forTableText) {
        var text = '/**' + TS_EOL;
        text += ' * Automatically generated: ' + moment__default['default']().format('Y-MM-DD HH:mm:ss') + TS_EOL;
        text += ' * © ' + moment__default['default']().format('Y') + ', Solid Basis Ventures, LLC.' + TS_EOL; // Must come after generated date so it doesn't keep regenerating
        text += ' * DO NOT MODIFY' + TS_EOL;
        text += ' *' + TS_EOL;
        text += ' * ' + forTableText + ': ' + this.name + TS_EOL;
        if (!!this.description) {
            text += ' *' + TS_EOL;
            text += ' * ' + PGTable.CleanComment(this.description) + TS_EOL;
        }
        text += ' */' + TS_EOL;
        text += TS_EOL;
        return text;
    };
    PGTable.prototype.tsText = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var text = this.tableHeaderText('Table Manager for');
        if (this.inherits.length > 0) {
            for (var _i = 0, _m = this.inherits; _i < _m.length; _i++) {
                var inherit = _m[_i];
                text += "import {I" + inherit + ", initial_" + inherit + "} from \"./I" + inherit + "\"" + TS_EOL;
            }
        }
        var enums = Array.from(new Set(__spreadArrays(this.columns
            .map(function (column) { return ({ column_name: column.column_name, enum_name: (typeof column.udt_name !== 'string' ? column.udt_name.enumName : '') }); }), this.columns
            .map(function (column) { return ({ column_name: column.column_name, enum_name: (typeof column.udt_name === 'string' && column.udt_name.startsWith('e_') ? PGEnum.TypeName(column.udt_name) : '') }); }), this.columns
            .map(function (column) {
            var _a, _b, _c, _d, _e, _f;
            var regExp = /{([^}]*)}/;
            var results = regExp.exec(column.column_comment);
            if (!!results && !!results[1]) {
                var commaItems = results[1].split(',');
                for (var _i = 0, commaItems_1 = commaItems; _i < commaItems_1.length; _i++) {
                    var commaItem = commaItems_1[_i];
                    var items = commaItem.split(':');
                    if (((_a = items[0]) !== null && _a !== void 0 ? _a : '').toLowerCase().trim() === 'enum') {
                        return {
                            column_name: column.column_name,
                            enum_name: ((_c = ((_b = items[1]) !== null && _b !== void 0 ? _b : '').split('.')[0]) !== null && _c !== void 0 ? _c : '').trim(),
                            default_value: ((_d = items[2]) !== null && _d !== void 0 ? _d : ((_f = ((_e = items[1]) !== null && _e !== void 0 ? _e : '').split('.')[1]) !== null && _f !== void 0 ? _f : '')).trim()
                        };
                    }
                }
            }
            return { column_name: column.column_name, enum_name: '' };
        })).filter(function (enumName) { return !!enumName.enum_name; })));
        enums.map(function (enumItem) { return enumItem.enum_name; }).reduce(function (results, enumItem) { return results.includes(enumItem) ? results : __spreadArrays(results, [enumItem]); }, [])
            .forEach(function (enumItem) {
            text += "import {" + enumItem + "} from \"../Enums/" + enumItem + "\"" + TS_EOL;
        });
        if (enums.length > 0) {
            text += TS_EOL;
        }
        text += "export interface I" + this.name;
        if (this.inherits.length > 0) {
            text += " extends I" + this.inherits.join(', I');
        }
        text += " {" + TS_EOL;
        var _loop_1 = function (pgColumn) {
            // if (!!pgColumn.column_comment || !!pgColumn.generatedAlwaysAs) {
            if (!!PGTable.CleanComment(pgColumn.column_comment)) {
                text += "\t/** ";
                text += PGTable.CleanComment(pgColumn.column_comment) + " ";
                text += "*/" + TS_EOL;
            }
            // if (!!pgColumn.generatedAlwaysAs) {
            // 	text += `GENERATED AS: ${PGTable.CleanComment(pgColumn.generatedAlwaysAs)} `
            // }
            // }
            text += '\t';
            text += pgColumn.column_name;
            text += ': ';
            text += (_b = (_a = enums.find(function (enumItem) { return enumItem.column_name === pgColumn.column_name; })) === null || _a === void 0 ? void 0 : _a.enum_name) !== null && _b !== void 0 ? _b : pgColumn.jsType();
            if (pgColumn.array_dimensions.length > 0) {
                text += "[" + pgColumn.array_dimensions.map(function () { return ''; }).join('],[') + "]";
            }
            if (intelliwaketsfoundation.IsOn((_c = pgColumn.is_nullable) !== null && _c !== void 0 ? _c : 'YES')) {
                text += ' | null';
            }
            text += TS_EOL;
        };
        for (var _o = 0, _p = this.columns; _o < _p.length; _o++) {
            var pgColumn = _p[_o];
            _loop_1(pgColumn);
        }
        text += '}' + TS_EOL;
        text += TS_EOL;
        text += "export const initial_" + this.name + ": I" + this.name + " = {" + TS_EOL;
        var addComma = false;
        if (this.inherits.length > 0) {
            text += "\t...initial_" + this.inherits.join("," + TS_EOL + "\t...initial_") + "," + TS_EOL;
        }
        var _loop_2 = function (pgColumn) {
            if (addComma) {
                text += ',' + TS_EOL;
            }
            text += '\t';
            text += pgColumn.column_name;
            text += ': ';
            var enumDefault = (_d = enums.find(function (enumItem) { return enumItem.column_name === pgColumn.column_name; })) === null || _d === void 0 ? void 0 : _d.default_value;
            if (!!enumDefault) {
                text += enumDefault;
            }
            else if (pgColumn.array_dimensions.length > 0) {
                if (intelliwaketsfoundation.IsOn(pgColumn.is_nullable)) {
                    text += 'null';
                }
                else {
                    text += "[" + pgColumn.array_dimensions.map(function () { return ''; }).join('],[') + "]";
                }
            }
            else {
                if (!pgColumn.blobType()) {
                    if (intelliwaketsfoundation.IsOn(pgColumn.is_identity) && pgColumn.isAutoIncrement) {
                        text += '0';
                    }
                    else if (pgColumn.booleanType()) {
                        if (intelliwaketsfoundation.IsOn(pgColumn.is_nullable)) {
                            text += 'null';
                        }
                        else {
                            text += intelliwaketsfoundation.IsOn(pgColumn.column_default) ? 'true' : 'false';
                        }
                    }
                    else if (!!pgColumn.column_default ||
                        (typeof pgColumn.udt_name !== 'string' && !!pgColumn.udt_name.defaultValue)) {
                        if (pgColumn.dateType()) {
                            text += '\'\'';
                        }
                        else if (pgColumn.jsonType()) {
                            text += ((_e = pgColumn.column_default) !== null && _e !== void 0 ? _e : '{}').toString().substring(1, ((_f = pgColumn.column_default) !== null && _f !== void 0 ? _f : '').toString().indexOf('::') - 1);
                        }
                        else if (pgColumn.integerFloatType() || pgColumn.dateType()) {
                            text += pgColumn.column_default;
                        }
                        else if (typeof pgColumn.udt_name !== 'string') {
                            text +=
                                '\'' + ((_h = (_g = pgColumn.column_default) !== null && _g !== void 0 ? _g : pgColumn.udt_name.defaultValue) !== null && _h !== void 0 ? _h : '') + '\' as ' + pgColumn.jsType();
                        }
                        else if (!!pgColumn.column_default && pgColumn.column_default.toString().includes('::')) {
                            if (pgColumn.udt_name.startsWith('e_')) {
                                var colDefault = pgColumn.column_default.toString();
                                text += PGEnum.TypeName(pgColumn.udt_name);
                                text += '.';
                                text += colDefault.substr(1, colDefault.indexOf('::') - 2);
                                // text += ' as '
                                // text += PGEnum.TypeName(pgColumn.udt_name)
                            }
                            else {
                                text += '\'' + ((_j = pgColumn.column_default) !== null && _j !== void 0 ? _j : '').toString().substring(1, ((_k = pgColumn.column_default) !== null && _k !== void 0 ? _k : '').toString().indexOf('::') - 1) + '\'';
                            }
                        }
                        else {
                            text += '\'' + ((_l = pgColumn.column_default) !== null && _l !== void 0 ? _l : '') + '\'';
                        }
                    }
                    else if (intelliwaketsfoundation.IsOn(pgColumn.is_nullable)) {
                        text += 'null';
                    }
                    else {
                        if (pgColumn.booleanType()) {
                            text += 'true';
                        }
                        else if (pgColumn.integerFloatType()) {
                            text += '0';
                        }
                        else if (pgColumn.dateType()) {
                            text += '\'\'';
                        }
                        else {
                            text += '\'\'';
                        }
                    }
                }
                else {
                    text += '\'\'';
                }
            }
            addComma = true;
        };
        for (var _q = 0, _r = this.columns; _q < _r.length; _q++) {
            var pgColumn = _r[_q];
            _loop_2(pgColumn);
        }
        text += TS_EOL + '}' + TS_EOL; // Removed semi
        return text;
    };
    /*export class Cprogress_report_test extends _CTable<Iprogress_report_test> {
    public readonly table: TTables

    constructor(responseContext: ResponseContext, initialValues?: Partial<Iprogress_report_test>) {
        super(responseContext, initialValues, {...initial_progress_report_test})

        this.table = 'progress_report_test'
    }
}*/
    PGTable.prototype.tsTextTable = function () {
        var text = this.tableHeaderText('Table Class for');
        text += "import {initial_" + this.name + ", I" + this.name + "} from '@Common/Tables/I" + this.name + "'" + TS_EOL;
        text += "import {TTables} from '../Database/Tables'" + TS_EOL;
        text += "import {_CTable} from './_CTable'" + TS_EOL;
        text += "import {ResponseContext} from '../MiddleWare/ResponseContext'" + TS_EOL;
        for (var _i = 0, _a = this.inherits; _i < _a.length; _i++) {
            var inherit = _a[_i];
            text += "import {_C" + inherit + "} from \"./_C" + inherit + "\"" + TS_EOL;
        }
        text += TS_EOL;
        text += "export class C" + this.name + " extends _CTable<I" + this.name + ">";
        if (this.inherits.length > 0) {
            text += ", C" + this.inherits.join(', C');
        }
        text += " {" + TS_EOL;
        text += "\tpublic readonly table: TTables" + TS_EOL;
        text += TS_EOL;
        text += "\tconstructor(responseContext: ResponseContext, initialValues?: Partial<I" + this.name + ">) {" + TS_EOL;
        text += "\t\tsuper(responseContext, initialValues, {...initial_" + this.name + "})" + TS_EOL;
        text += TS_EOL;
        text += "\t\tthis.table = '" + this.name + "'" + TS_EOL;
        text += "\t}" + TS_EOL;
        text += "}" + TS_EOL;
        return text;
    };
    PGTable.prototype.ddlPrimaryKey = function () {
        var found = false;
        var ddl = "PRIMARY KEY (\"";
        for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            if (intelliwaketsfoundation.IsOn(column.is_identity)) {
                if (found) {
                    ddl += "\",\"";
                }
                ddl += column.column_name;
                found = true;
            }
        }
        if (found) {
            ddl += "\")";
            return ddl;
        }
        return null;
    };
    PGTable.prototype.ddlCreateTableText = function (createForeignKeys, createIndexes, dropFirst) {
        if (dropFirst === void 0) { dropFirst = true; }
        var ddl = '';
        /** @noinspection SqlResolve */
        if (dropFirst) {
            ddl += "DROP TABLE IF EXISTS " + this.name + " CASCADE;" + TS_EOL;
        }
        ddl += "CREATE TABLE " + this.name + " (" + TS_EOL;
        var prevColumn = null;
        for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
            var pgColumn = _a[_i];
            if (prevColumn !== null) {
                ddl += ',' + TS_EOL;
            }
            ddl += '\t' + pgColumn.ddlDefinition();
            prevColumn = pgColumn;
        }
        var pk = this.ddlPrimaryKey();
        if (!!pk) {
            ddl += ',' + TS_EOL + '\t' + pk;
        }
        if (!!this.check) {
            var checkItems = (typeof this.check === 'string' ? [this.check] : this.check).filter(function (item) { return !!item; });
            for (var _b = 0, checkItems_1 = checkItems; _b < checkItems_1.length; _b++) {
                var checkItem = checkItems_1[_b];
                ddl += "," + TS_EOL + "\tCHECK (" + checkItem + ")";
            }
        }
        ddl += TS_EOL;
        ddl += ')';
        if (this.inherits.length > 0) {
            ddl += TS_EOL + ("INHERITS (" + this.inherits.join(',') + ")");
        }
        ddl += ';';
        if (createIndexes) {
            ddl += this.ddlCreateIndexes();
        }
        if (createForeignKeys) {
            ddl += this.ddlCreateForeignKeysText();
        }
        for (var _c = 0, _d = this.columns.filter(function (col) { return !!col.column_comment; }); _c < _d.length; _c++) {
            var pgColumn = _d[_c];
            ddl += TS_EOL + ("COMMENT ON COLUMN " + this.name + "." + pgColumn.column_name + " IS '" + PGTable.CleanComment(pgColumn.column_comment, false) + "';");
        }
        return ddl;
    };
    PGTable.prototype.ddlCreateIndexes = function () {
        var ddl = '';
        for (var _i = 0, _a = this.indexes; _i < _a.length; _i++) {
            var index = _a[_i];
            ddl += TS_EOL + index.ddlDefinition(this);
        }
        return ddl;
    };
    PGTable.prototype.ddlCreateForeignKeysText = function () {
        var ddl = '';
        for (var _i = 0, _a = this.foreignKeys; _i < _a.length; _i++) {
            var foreignKey = _a[_i];
            ddl += foreignKey.ddlConstraintDefinition(this) + TS_EOL;
        }
        return ddl;
    };
    PGTable.CleanComment = function (comment, stripBrackets) {
        if (stripBrackets === void 0) { stripBrackets = true; }
        if (!comment) {
            return comment;
        }
        // noinspection RegExpRedundantEscape
        return stripBrackets ? comment.replace(/[\n\r]/g, ' ').replace(/\{(.+?)\}/g, "").trim() : comment.replace(/[\n\r]/g, ' ').trim();
    };
    return PGTable;
}());

var PGTableMy = /** @class */ (function (_super) {
    __extends(PGTableMy, _super);
    function PGTableMy(instanceData, myTable) {
        var _this = _super.call(this, instanceData) || this;
        _this.myTable = myTable;
        return _this;
    }
    return PGTableMy;
}(PGTable));
(function (MyToPG) {
    MyToPG.GetPGTable = function (myTable) {
        var pgTable = new PGTableMy();
        pgTable.name = myTable.name.toLowerCase();
        for (var _i = 0, _a = myTable.columns; _i < _a.length; _i++) {
            var myColumn = _a[_i];
            var pgColumn = MyToPG.GetPGColumn(myColumn);
            pgTable.columns.push(pgColumn);
        }
        for (var _b = 0, _c = myTable.foreignKeys; _b < _c.length; _b++) {
            var myForeignKey = _c[_b];
            var pgForeignKey = MyToPG.GetPGForeignKey(myForeignKey);
            pgTable.foreignKeys.push(pgForeignKey);
        }
        for (var _d = 0, _e = myTable.indexes; _d < _e.length; _d++) {
            var myIndex = _e[_d];
            var pgIndex = MyToPG.GetPGIndex(myIndex);
            pgTable.indexes.push(pgIndex);
        }
        pgTable.myTable = myTable;
        return pgTable;
    };
    MyToPG.GetPGColumn = function (myColumn) {
        var _a;
        var pgColumn = new PGColumn();
        pgColumn.column_name = myColumn.COLUMN_NAME;
        pgColumn.ordinal_position = myColumn.ORDINAL_POSITION;
        pgColumn.udt_name = MyToPG.UDTNameFromDataType(myColumn.DATA_TYPE);
        pgColumn.is_nullable = intelliwaketsfoundation.IsOn(myColumn.IS_NULLABLE) ? 'YES' : 'NO';
        pgColumn.column_default = (pgColumn.udt_name === PGColumn.TYPE_BOOLEAN) ?
            myColumn.COLUMN_DEFAULT === null ?
                null : intelliwaketsfoundation.IsOn(myColumn.COLUMN_DEFAULT) : myColumn.COLUMN_DEFAULT;
        pgColumn.character_maximum_length = myColumn.CHARACTER_MAXIMUM_LENGTH;
        pgColumn.numeric_precision = myColumn.NUMERIC_PRECISION;
        pgColumn.numeric_scale = myColumn.NUMERIC_SCALE;
        pgColumn.datetime_precision = myColumn.DATETIME_PRECISION;
        pgColumn.isAutoIncrement = myColumn.EXTRA === 'auto_increment';
        pgColumn.is_identity = myColumn.COLUMN_KEY === 'PRI' ? 'YES' : 'NO';
        pgColumn.column_comment = (_a = myColumn.COLUMN_COMMENT) !== null && _a !== void 0 ? _a : '';
        return pgColumn;
    };
    MyToPG.GetPGForeignKey = function (myForeignKey) {
        var pgForeignKey = new PGForeignKey();
        pgForeignKey.columnNames = myForeignKey.columnNames.map(function (col) { return col.toLowerCase(); });
        pgForeignKey.primaryTable = myForeignKey.primaryTable.toLowerCase();
        pgForeignKey.primaryColumns = myForeignKey.primaryColumns.map(function (col) { return col.toLowerCase(); });
        return pgForeignKey;
    };
    MyToPG.GetPGIndex = function (myIndex) {
        var pgIndex = new PGIndex();
        pgIndex.columns = myIndex.columns.map(function (col) { return col.toLowerCase(); });
        pgIndex.isUnique = myIndex.isUnique;
        return pgIndex;
    };
    MyToPG.UDTNameFromDataType = function (columnName) {
        switch (columnName.toUpperCase()) {
            case ColumnDefinition.TYPE_TINYINT:
                return PGColumn.TYPE_BOOLEAN;
            case ColumnDefinition.TYPE_FLOAT:
                return PGColumn.TYPE_FLOAT8;
            case ColumnDefinition.TYPE_DATETIME:
                return PGColumn.TYPE_TIMESTAMP;
            case ColumnDefinition.TYPE_INT:
            case ColumnDefinition.TYPE_SMALLINT:
                return PGColumn.TYPE_INTEGER;
            case ColumnDefinition.TYPE_BINARY:
                return PGColumn.TYPE_BYTEA;
            case ColumnDefinition.TYPE_DECIMAL:
            case ColumnDefinition.TYPE_DOUBLE:
                return PGColumn.TYPE_NUMERIC;
            case ColumnDefinition.TYPE_MEDIUMTEXT:
                return PGColumn.TYPE_TEXT;
            default:
                return columnName.toLowerCase();
        }
    };
})(exports.MyToPG || (exports.MyToPG = {}));

var MyColumn = /** @class */ (function (_super) {
    __extends(MyColumn, _super);
    function MyColumn(instanceData) {
        var _this = _super.call(this) || this;
        _this.isPK = false;
        _this.isAutoIncrement = false;
        if (instanceData) {
            _this.deserialize(instanceData);
        }
        return _this;
    }
    MyColumn.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    MyColumn.prototype.clean = function () {
        //		if (this.dateType()) {
        //			if (IsEmpty(this.DATETIME_PRECISION) || this.DATETIME_PRECISION < 3 || this.DATETIME_PRECISION > 6) {
        //				this.DATETIME_PRECISION = 6;
        //			}
        //		}
    };
    MyColumn.prototype.ddlDefinition = function (myTable, _prevMyColumn, _altering) {
        var _a;
        var ddl = '`' + this.COLUMN_NAME + '` ';
        ddl += this.DATA_TYPE;
        if (this.integerType()) {
            switch (this.DATA_TYPE) {
                case ColumnDefinition.TYPE_BIT:
                    ddl += ' ';
                    break;
                case ColumnDefinition.TYPE_TINYINT:
                    ddl += '(4) ';
                    break;
                case ColumnDefinition.TYPE_SMALLINT:
                    ddl += '(6) ';
                    break;
                case ColumnDefinition.TYPE_MEDIUMINT:
                    ddl += '(8) ';
                    break;
                case ColumnDefinition.TYPE_INT:
                    ddl += '(11) ';
                    break;
                case ColumnDefinition.TYPE_BIGINT:
                    ddl += '(20) ';
                    break;
                default:
                    ddl += '(' + this.NUMERIC_PRECISION + ') ';
                    break;
            }
        }
        else if (this.floatType()) {
            ddl += '(' + this.NUMERIC_PRECISION + ',' + this.NUMERIC_SCALE + ') ';
        }
        else if (this.booleanType()) {
            ddl += '(1) ';
        }
        else if (this.DATA_TYPE === ColumnDefinition.TYPE_DATE) {
            ddl += ' ';
        }
        else if (this.dateType()) {
            if (((_a = this.DATETIME_PRECISION) !== null && _a !== void 0 ? _a : 0) > 0) {
                ddl += '(' + this.DATETIME_PRECISION + ') ';
            }
            else {
                ddl += ' ';
            }
            //			if (mb_strtoupper(this.DATA_TYPE) === ColumnDefinition.TYPE_DATE) {
            //				ddl += ' ';
            //			} else {
            //				ddl += '(' + this.DATETIME_PRECISION + ') ';
            //			}
        }
        else if (this.generalStringType()) {
            if (!this.blobType()) {
                ddl += '(' + this.CHARACTER_MAXIMUM_LENGTH + ') ';
            }
            else {
                ddl += ' ';
            }
            ddl += 'CHARACTER SET ' + (!!this.CHARACTER_SET_NAME ? this.CHARACTER_SET_NAME : myTable.CHARSET) + ' ';
            ddl += 'COLLATE ' + (!!this.COLLATION_NAME ? this.COLLATION_NAME : myTable.COLLATE) + ' ';
        }
        if (!intelliwaketsfoundation.IsOn(this.IS_NULLABLE)) {
            ddl += 'NOT NULL ';
        }
        if (!this.blobType()) {
            if (this.isAutoIncrement || this.EXTRA === 'auto_increment') {
                ddl += 'AUTO_INCREMENT ';
            }
            else if (!!this.COLUMN_DEFAULT) {
                if (this.integerFloatType() || this.dateType()) {
                    ddl += 'DEFAULT ' + this.COLUMN_DEFAULT + ' ';
                }
                else {
                    ddl += 'DEFAULT \'' + this.COLUMN_DEFAULT + '\' ';
                }
            }
            else if (intelliwaketsfoundation.IsOn(this.IS_NULLABLE)) {
                ddl += 'DEFAULT NULL ';
            }
            else {
                if (this.integerFloatType()) {
                    ddl += 'DEFAULT 0 ';
                }
                else if (this.dateType()) {
                    if (this.COLUMN_TYPE != ColumnDefinition.TYPE_DATE) {
                        ddl += 'DEFAULT CURRENT_TIMESTAMP';
                        if (!!this.DATETIME_PRECISION) {
                            ddl += '(' + this.DATETIME_PRECISION + ') ';
                        }
                        else {
                            ddl += ' ';
                        }
                        //					if (mb_strtoupper(this.DATA_TYPE) === ColumnDefinition.TYPE_DATE) {
                        //						ddl += "DEFAULT (CURRENT_DATE) ";
                        //					} else {
                        //						ddl += "DEFAULT CURRENT_TIMESTAMP(" + this.DATETIME_PRECISION + ") ";
                        //					}
                    }
                }
                else {
                    ddl += 'DEFAULT \'\' ';
                }
            }
        }
        if (!!this.EXTRA && this.EXTRA !== 'auto_increment') {
            ddl += this.EXTRA + ' ';
        }
        if (!!this.COLUMN_COMMENT) {
            ddl += 'COMMENT \'' + this.COLUMN_COMMENT + '\' ';
        }
        return ddl.trim();
    };
    return MyColumn;
}(ColumnDefinition));

var MyForeignKey = /** @class */ (function () {
    function MyForeignKey(instanceData) {
        this.columnNames = [];
        this.primaryTable = '';
        this.primaryColumns = [];
        this.isUnique = false;
        this.keyName = '';
        this.onDelete = 'RESTRICT';
        this.onUpdate = 'RESTRICT';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    MyForeignKey.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    MyForeignKey.prototype.fkName = function (myTable, prefix) {
        return prefix + '_' + myTable.name.substr(-25) + '_' + this.columnNames.map(function (column) { return column.substr(0, -10); }).join('_');
    };
    MyForeignKey.prototype.ddlKeyDefinition = function (myTable, altering) {
        var ddl = '';
        if (altering) {
            ddl += 'ADD ';
        }
        if (this.isUnique) {
            ddl += 'UNIQUE ';
        }
        ddl += 'KEY ';
        ddl += '`' + this.fkName(myTable, 'idx') + '` ';
        ddl += '(`' + this.columnNames.join('`,`') + '`)';
        return ddl;
    };
    MyForeignKey.prototype.ddlConstraintDefinition = function (myTable, altering) {
        var ddl = '';
        if (altering) {
            ddl += 'ADD ';
        }
        ddl += 'CONSTRAINT ';
        ddl += '`' + this.fkName(myTable, 'fk') + '` ';
        ddl += 'FOREIGN KEY ';
        ddl += '(`' + this.columnNames.join('`,`') + '`) ';
        ddl += 'REFERENCES ';
        ddl += '`' + this.primaryTable + '` ';
        ddl += '(`' + this.primaryColumns.join('`,`') + '`)';
        return ddl;
    };
    return MyForeignKey;
}());

var MyIndex = /** @class */ (function () {
    function MyIndex(instanceData) {
        this.columns = [];
        this.isUnique = false;
        this.using = 'BTREE';
        this.indexName = '';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    MyIndex.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    MyIndex.prototype.name = function (myTable) {
        return 'idx_' + myTable.name.substr(-25) + '_' + this.columns.map(function (column) { return column.substr(0, -25); }).join('_');
    };
    // @ts-ignore
    MyIndex.prototype.ddlDefinition = function (myTable, _altering) {
        var ddl = '';
        if (this.isUnique) {
            ddl += 'UNIQUE ';
        }
        ddl += 'KEY ';
        ddl += '`' + this.name(myTable) + '` ';
        ddl += '(`' + this.columns.join('`,`') + '`)';
        return ddl;
    };
    return MyIndex;
}());

var TS_EOL$1 = '\r\n';
var MyTable = /** @class */ (function () {
    function MyTable(instanceData) {
        this.name = "";
        this.description = "";
        this.ENGINE = "InnoDB";
        this.CHARSET = "utf8mb4";
        this.COLLATE = "utf8mb4_unicode_ci";
        this.ROW_FORMAT = "COMPACT";
        this.columns = [];
        this.indexes = [];
        this.foreignKeys = [];
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    MyTable.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                switch (key) {
                    case 'columns':
                        for (var _a = 0, _b = instanceData[key]; _a < _b.length; _a++) {
                            var column = _b[_a];
                            this[key].push(new MyColumn(column));
                        }
                        break;
                    case 'indexes':
                        for (var _c = 0, _d = instanceData[key]; _c < _d.length; _c++) {
                            var index = _d[_c];
                            this[key].push(new MyIndex(index));
                        }
                        break;
                    case 'foreignKeys':
                        for (var _e = 0, _f = instanceData[key]; _e < _f.length; _e++) {
                            var foreignKey = _f[_e];
                            this[key].push(new MyForeignKey(foreignKey));
                        }
                        break;
                    default:
                        this[key] = instanceData[key];
                        break;
                }
            }
        }
    };
    MyTable.prototype.indexOfColumn = function (columnName) {
        return this.columns.findIndex(function (column) { return column.COLUMN_NAME === columnName; });
    };
    MyTable.prototype.indexesOfForeignKeyByColumn = function (columnName) {
        var indexes = [];
        for (var i = 0; i < this.foreignKeys.length; i++) {
            if (this.foreignKeys[i].columnNames.includes(columnName)) {
                indexes.push(i);
            }
        }
        return indexes;
    };
    MyTable.prototype.getForeignKeysByColumn = function (columnName) {
        var fks = [];
        var indexes = this.indexesOfForeignKeyByColumn(columnName);
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var index = indexes_1[_i];
            fks.push(this.foreignKeys[index]);
        }
        return fks;
    };
    MyTable.prototype.removeForeignKeysByColumn = function (columnName) {
        this.foreignKeys = this.foreignKeys.filter(function (foreignKey) { return !foreignKey.columnNames.includes(columnName); });
    };
    MyTable.prototype.addForeignKey = function (myForeignKey) {
        this.foreignKeys.push(myForeignKey);
    };
    MyTable.prototype.getColumn = function (columnName) {
        var _a;
        return (_a = this.columns.find(function (column) { return column.COLUMN_NAME === columnName; })) !== null && _a !== void 0 ? _a : null;
    };
    MyTable.prototype.removeColumn = function (columnName) {
        var column = this.getColumn(columnName);
        if (!!column) {
            this.removeForeignKeysByColumn(columnName);
            this.columns.filter(function (column) { return column.COLUMN_NAME !== columnName; });
            this.reOrderColumns();
        }
    };
    MyTable.prototype.addColumn = function (myColumn) {
        if (!myColumn.ORDINAL_POSITION) {
            myColumn.ORDINAL_POSITION = 999999;
        }
        this.columns = this.columns.filter(function (column) { return column.COLUMN_NAME !== myColumn.COLUMN_NAME; });
        for (var i = 0; i < this.columns.length; i++) {
            if (this.columns[i].ORDINAL_POSITION >= myColumn.ORDINAL_POSITION) {
                this.columns[i].ORDINAL_POSITION++;
            }
        }
        this.columns.push(myColumn);
        this.reOrderColumns();
    };
    MyTable.prototype.reOrderColumns = function () {
        this.columns = this.columns.sort(function (a, b) {
            return a.ORDINAL_POSITION - b.ORDINAL_POSITION;
        });
        var position = 0;
        for (var i = 0; i < this.columns.length; i++) {
            position++;
            this.columns[i].ORDINAL_POSITION = position;
        }
    };
    MyTable.prototype.addIndex = function (myIndex) {
        this.indexes.push(myIndex);
    };
    MyTable.prototype.tableHeaderText = function (forTableText) {
        var text = "/**" + TS_EOL$1;
        text += " * Automatically generated: " + moment__default['default']().format('Y-MM-DD HH:mm:ss') + TS_EOL$1;
        text += " * © " + moment__default['default']().format('Y') + ", Solid Basis Ventures, LLC." + TS_EOL$1; // Must come after generated date so it doesn't keep regenerating
        text += " * DO NOT MODIFY" + TS_EOL$1;
        text += " *" + TS_EOL$1;
        text += " * " + forTableText + ": " + this.name + TS_EOL$1;
        if (!!this.description) {
            text += " *" + TS_EOL$1;
            text += " * " + MyTable.CleanComment(this.description) + TS_EOL$1;
        }
        text += " */" + TS_EOL$1;
        text += TS_EOL$1;
        return text;
    };
    MyTable.prototype.tsText = function () {
        var _a;
        var text = this.tableHeaderText("Table Manager for");
        text += "export interface I" + this.name + " {" + TS_EOL$1;
        var addComma = false;
        var addComment = "";
        for (var _i = 0, _b = this.columns; _i < _b.length; _i++) {
            var myColumn = _b[_i];
            if (addComma) {
                text += "," + addComment + TS_EOL$1;
            }
            text += "\t";
            text += myColumn.COLUMN_NAME;
            text += ": ";
            text += myColumn.jsType();
            if (intelliwaketsfoundation.IsOn((_a = myColumn.IS_NULLABLE) !== null && _a !== void 0 ? _a : 'YES')) {
                text += ' | null';
            }
            if (!!myColumn.COLUMN_COMMENT) {
                addComment = " // " + MyTable.CleanComment(myColumn.COLUMN_COMMENT);
            }
            else {
                addComment = "";
            }
            addComma = true;
        }
        text += addComment + TS_EOL$1;
        text += "}" + TS_EOL$1;
        text += TS_EOL$1;
        text += "export const initial_" + this.name + ": I" + this.name + " = {" + TS_EOL$1;
        addComma = false;
        addComment = "";
        for (var _c = 0, _d = this.columns; _c < _d.length; _c++) {
            var myColumn = _d[_c];
            if (addComma) {
                text += "," + TS_EOL$1;
            }
            text += "\t";
            text += myColumn.COLUMN_NAME;
            text += ": ";
            if (!myColumn.blobType()) {
                if (myColumn.isAutoIncrement || myColumn.EXTRA === 'auto_increment') {
                    text += "0";
                }
                else if (!!myColumn.COLUMN_DEFAULT) {
                    if (myColumn.booleanType()) {
                        text += (intelliwaketsfoundation.IsOn(myColumn.COLUMN_DEFAULT) ? 'true' : 'false');
                    }
                    else if (myColumn.dateType()) {
                        text += "''";
                    }
                    else if (myColumn.integerFloatType() || myColumn.dateType()) {
                        text += myColumn.COLUMN_DEFAULT;
                    }
                    else {
                        text += "'" + myColumn.COLUMN_DEFAULT + "'";
                    }
                }
                else if (intelliwaketsfoundation.IsOn(myColumn.IS_NULLABLE)) {
                    text += "null";
                }
                else {
                    if (myColumn.booleanType()) {
                        text += "true";
                    }
                    else if (myColumn.integerFloatType()) {
                        text += "0";
                    }
                    else if (myColumn.dateType()) {
                        text += "''";
                    }
                    else {
                        text += "''";
                    }
                }
            }
            else {
                text += "''";
            }
            addComma = true;
        }
        text += addComment + TS_EOL$1;
        text += "};" + TS_EOL$1;
        return text;
    };
    MyTable.prototype.tsTextTable = function () {
        var text = this.tableHeaderText("Table Class for");
        text += "import {initial_" + this.name + ", I" + this.name + "} from \"../../../app/src/Common/Tables/" + this.name + "\";" + TS_EOL$1;
        text += "import {TTables} from \"../Database/Tables\";" + TS_EOL$1;
        text += "import {TConnection} from \"../Database/mysqlConnection\";" + TS_EOL$1;
        text += "import {_Table} from \"./_Table\";" + TS_EOL$1;
        text += TS_EOL$1;
        text += "export class C" + this.name + " extends _CTable<I" + this.name + "> {" + TS_EOL$1;
        text += "\tpublic readonly table: TTables;" + TS_EOL$1;
        text += TS_EOL$1;
        text += "\tconstructor(connection: TConnection, initialValues?: I" + this.name + " | any) {" + TS_EOL$1;
        text += "\t\tsuper(connection, initialValues, initial_" + this.name + ");" + TS_EOL$1;
        text += TS_EOL$1;
        text += "\t\tthis.table = '" + this.name + "';" + TS_EOL$1;
        text += "\t}" + TS_EOL$1;
        text += "}" + TS_EOL$1;
        return text;
    };
    // @ts-ignore
    MyTable.prototype.ddlPrimaryKey = function (altering) {
        var found = false;
        var ddl = "PRIMARY KEY (`";
        for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            if (column.isPK) {
                if (found) {
                    ddl += "`,`";
                }
                ddl += column.COLUMN_NAME;
                found = true;
            }
        }
        if (found) {
            ddl += "`)";
            return ddl;
        }
        return null;
    };
    MyTable.prototype.ddlText = function (process, includeFKs, altering) {
        var _a, _b, _c, _d;
        if (altering === void 0) { altering = false; }
        return __awaiter(this, void 0, void 0, function () {
            var ddl, prevColumn, _i, _e, myColumn, pk, _f, _g, index, _h, _j, foreignKey, _k, _l, foreignKey, needsComma, _m, _o, index, _p, _q, foreignKey, _r, _s, foreignKey;
            return __generator(this, function (_t) {
                ddl = "";
                if (!altering) {
                    if (altering) {
                        /** @noinspection SqlResolve */
                        ddl += "DROP TABLE " + this.name + " CASCADE;" + TS_EOL$1;
                    }
                    ddl += "CREATE TABLE " + this.name + " (" + TS_EOL$1;
                    prevColumn = null;
                    for (_i = 0, _e = this.columns; _i < _e.length; _i++) {
                        myColumn = _e[_i];
                        if (prevColumn !== null) {
                            ddl += "," + TS_EOL$1;
                        }
                        ddl += "\t" + myColumn.ddlDefinition(this, prevColumn, altering);
                        prevColumn = myColumn;
                    }
                    pk = this.ddlPrimaryKey(altering);
                    if (!!pk) {
                        ddl += "," + TS_EOL$1 + "\t" + pk;
                    }
                    for (_f = 0, _g = this.indexes; _f < _g.length; _f++) {
                        index = _g[_f];
                        ddl += "," + TS_EOL$1 + "\t" + index.ddlDefinition(this, altering);
                    }
                    if (includeFKs) {
                        for (_h = 0, _j = this.foreignKeys; _h < _j.length; _h++) {
                            foreignKey = _j[_h];
                            ddl += "," + TS_EOL$1 + "\t" + foreignKey.ddlKeyDefinition(this, altering);
                        }
                        for (_k = 0, _l = this.foreignKeys; _k < _l.length; _k++) {
                            foreignKey = _l[_k];
                            ddl += "," + TS_EOL$1 + "\t" + foreignKey.ddlConstraintDefinition(this, altering);
                        }
                    }
                    ddl += TS_EOL$1;
                    ddl += ') ';
                    ddl += 'ENGINE=' + ((_a = this.ENGINE) !== null && _a !== void 0 ? _a : 'InnoDB') + ' ';
                    ddl += 'DEFAULT CHARSET=' + ((_b = this.CHARSET) !== null && _b !== void 0 ? _b : 'utf8mb4') + ' ';
                    ddl += 'COLLATE=' + ((_c = this.COLLATE) !== null && _c !== void 0 ? _c : 'utf8mb4_unicode_ci') + ' ';
                    ddl += 'ROW_FORMAT=' + ((_d = this.ROW_FORMAT) !== null && _d !== void 0 ? _d : 'COMPACT');
                    ddl += ';';
                }
                else {
                    needsComma = false;
                    ddl += "ALTER TABLE " + this.name + TS_EOL$1;
                    if (includeFKs) {
                        for (_m = 0, _o = this.indexes; _m < _o.length; _m++) {
                            index = _o[_m];
                            // if (!await SQL.IndexExists(connection, this.name, index.name(this))) {
                            if (needsComma) {
                                ddl += "," + TS_EOL$1;
                            }
                            needsComma = true;
                            ddl += "\t" + index.ddlDefinition(this, altering);
                            // }
                        }
                        for (_p = 0, _q = this.foreignKeys; _p < _q.length; _p++) {
                            foreignKey = _q[_p];
                            // if (!await SQL.IndexExists(connection, this.name, foreignKey.fkName(this, 'idx'))) {
                            if (needsComma) {
                                ddl += "," + TS_EOL$1;
                            }
                            needsComma = true;
                            ddl += "\t" + foreignKey.ddlKeyDefinition(this, altering);
                            // }
                        }
                        for (_r = 0, _s = this.foreignKeys; _r < _s.length; _r++) {
                            foreignKey = _s[_r];
                            // if (!await SQL.ConstraintExists(connection, this.name, foreignKey.fkName(this, 'fk'))) {
                            if (needsComma) {
                                ddl += "," + TS_EOL$1;
                            }
                            needsComma = true;
                            ddl += "\t" + foreignKey.ddlConstraintDefinition(this, altering);
                            // }
                        }
                    }
                    if (needsComma) {
                        ddl += TS_EOL$1;
                        ddl += ';';
                        // } else {
                        //     ddl = '';
                    }
                }
                return [2 /*return*/, ddl];
            });
        });
    };
    MyTable.prototype.save = function () {
        for (var i = 0; i < this.columns.length; i++) {
            this.columns[i].clean();
        }
        MyTable.SetPermissions();
        fs__default['default'].mkdirSync(MyTable.TS_INTERFACE_DIR + '/New/', { recursive: true });
        fs__default['default'].mkdirSync(MyTable.TS_CLASS_DIR + '/New/', { recursive: true });
        MyTable.writeFileIfDifferent(MyTable.DEFINITIONS_DIR + '/' + this.name + '.json', JSON.stringify(this), false);
        MyTable.writeFileIfDifferent(MyTable.TS_INTERFACE_DIR + '/New/I' + this.name + '.ts', this.tsText(), true);
        MyTable.writeFileIfDifferent(MyTable.TS_CLASS_DIR + '/New/C' + this.name + '.ts', this.tsTextTable(), true, true);
    };
    MyTable.ExistsNewTS = function () {
        var _a, _b;
        return (fs__default['default'].existsSync(MyTable.TS_INTERFACE_DIR + '/New') && ((_a = fs__default['default'].readdirSync(MyTable.TS_INTERFACE_DIR + '/New')) !== null && _a !== void 0 ? _a : []).filter(function (file) { return file.endsWith('.ts'); }).length > 0) || (fs__default['default'].existsSync(MyTable.TS_CLASS_DIR + '/New') && ((_b = fs__default['default'].readdirSync(MyTable.TS_CLASS_DIR + '/New')) !== null && _b !== void 0 ? _b : []).filter(function (file) { return file.endsWith('.ts'); }).length > 0);
    };
    MyTable.prototype.moveInNewTS = function () {
        // Note: this may break the server as it could change the definition of certain files.  Do this AFTER the connections have been closed!
        var fileName = MyTable.TS_INTERFACE_DIR + '/New/I' + this.name + '.ts';
        if (fs__default['default'].existsSync(fileName)) {
            fs__default['default'].renameSync(fileName, fileName.replace('/New/', '/'));
        }
        fileName = MyTable.TS_CLASS_DIR + '/New/C' + this.name + '.ts';
        if (fs__default['default'].existsSync(fileName)) {
            fs__default['default'].renameSync(fileName, fileName.replace('/New/', '/'));
        }
    };
    MyTable.writeFileIfDifferent = function (fileName, data, useSBVCheck, skipIfExists) {
        if (skipIfExists === void 0) { skipIfExists = false; }
        MyTable.SetPermissions();
        if (skipIfExists && (fs__default['default'].existsSync(fileName.replace('/New/', '/')) || fs__default['default'].existsSync(fileName))) {
            return;
        }
        if (useSBVCheck) {
            var newSBVPos = data.indexOf("Solid Basis Ventures");
            if (newSBVPos) {
                if (fs__default['default'].existsSync(fileName.replace('/New/', '/')) && (!fileName.includes('/New/') || !fs__default['default'].existsSync(fileName))) {
                    var originalData = fs__default['default'].readFileSync(fileName.replace('/New/', '/'), 'utf8');
                    var originalSBVPos = originalData.indexOf("Solid Basis Ventures");
                    var originalCheck = originalData.substr(originalSBVPos);
                    var newCheck = data.substr(newSBVPos);
                    if (originalCheck === newCheck) {
                        return true;
                    }
                }
            }
        }
        else {
            if (fs__default['default'].existsSync(fileName)) {
                var originalData = fs__default['default'].readFileSync(fileName, 'utf8');
                if (originalData === data) {
                    return true;
                }
            }
        }
        return fs__default['default'].writeFileSync(fileName, data);
    };
    MyTable.writeFileIfNotExists = function (fileName, data) {
        MyTable.SetPermissions();
        if (!fs__default['default'].existsSync(fileName)) {
            fs__default['default'].writeFileSync(fileName, data);
        }
    };
    MyTable.prototype.syncToDB = function (includeFKs, altering) {
        if (altering === void 0) { altering = false; }
        return __awaiter(this, void 0, void 0, function () {
            var ddl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ddlText(true, includeFKs, altering)];
                    case 1:
                        ddl = _a.sent();
                        return [2 /*return*/, !!ddl];
                }
            });
        });
    };
    MyTable.SaveAll = function (myTables) {
        for (var i = 0; i < myTables.length; i++) {
            myTables[i].save();
        }
    };
    MyTable.Load = function (fileName) {
        MyTable.SetPermissions();
        var calcFileName = fileName;
        if (!calcFileName.endsWith('.json')) {
            calcFileName += '.json';
        }
        if (!calcFileName.startsWith(MyTable.DEFINITIONS_DIR)) {
            calcFileName = MyTable.DEFINITIONS_DIR + "/" + calcFileName;
        }
        return new MyTable(JSON.parse(fs__default['default'].readFileSync(calcFileName)));
    };
    MyTable.LoadAll = function () {
        MyTable.SetPermissions();
        var files = fs__default['default'].readdirSync(MyTable.DEFINITIONS_DIR);
        var myTables = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (file.endsWith('.json')) {
                var myTable = MyTable.Load(file);
                if (!!myTable) {
                    myTables.push(myTable);
                }
            }
        }
        return myTables;
    };
    // noinspection JSUnusedLocalSymbols
    MyTable.DeleteAll = function () {
        MyTable.SetPermissions();
        var files = fs__default['default'].readdirSync(MyTable.DEFINITIONS_DIR);
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            if (file.endsWith('.json')) {
                fs__default['default'].unlinkSync(MyTable.DEFINITIONS_DIR + "/" + file);
            }
        }
        files = fs__default['default'].readdirSync(MyTable.TS_INTERFACE_DIR);
        for (var _a = 0, files_3 = files; _a < files_3.length; _a++) {
            var file = files_3[_a];
            if (file.endsWith('.json')) {
                fs__default['default'].unlinkSync(MyTable.TS_INTERFACE_DIR + "/" + file);
            }
        }
    };
    // static ArePermissionsSet = false;
    MyTable.SetPermissions = function () {
        // if (!self::ArePermissionsSet) {
        // 	self::ArePermissionsSet = true;
        //
        // 	exec('chmod a+rwx -R ' + MyTable.TS_INTERFACE_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.TABLES_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.TRAITS_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.DEFINITIONS_DIR);
        // }
    };
    MyTable.CleanComment = function (comment) {
        if (!comment) {
            return comment;
        }
        return comment.replace(/[\n\r]/g, ' ');
    };
    MyTable.DEFINITIONS_DIR = path.resolve("./") + "/src/Assets/Tables";
    MyTable.TS_INTERFACE_DIR = path.resolve("./") + "/../app/src/Common/Tables";
    MyTable.TS_CLASS_DIR = path.resolve("./") + "/src/Tables";
    return MyTable;
}());

(function (MySQL) {
    var _this = this;
    MySQL.TableRowCount = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        connection.query("SELECT COUNT(*) AS count FROM " + table, function (error, results, _fields) {
                            var _a, _b;
                            if (error)
                                throw error;
                            resolve((_b = ((_a = (results !== null && results !== void 0 ? results : [])[0]) !== null && _a !== void 0 ? _a : {})['count']) !== null && _b !== void 0 ? _b : 0);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    MySQL.TableExists = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        connection.query("SELECT COUNT(*) AS count\n                      FROM information_schema.tables\n                      WHERE TABLE_SCHEMA = '" + connection.config.database + "'\n                        AND TABLE_NAME = '" + table + "'", function (error, results, _fields) {
                            var _a, _b;
                            if (error)
                                throw error;
                            resolve(((_b = ((_a = (results !== null && results !== void 0 ? results : [])[0]) !== null && _a !== void 0 ? _a : {})['count']) !== null && _b !== void 0 ? _b : 0) > 0);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    MySQL.Tables = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        connection.query("SELECT TABLE_NAME\n                      FROM information_schema.tables\n                      WHERE TABLE_SCHEMA = '" + connection.config.database + "'", function (error, results, _fields) {
                            var _a;
                            if (error)
                                throw error;
                            resolve(((_a = results) !== null && _a !== void 0 ? _a : []).map(function (result) { return result.TABLE_NAME; }).sort(function (a, b) { return a.localeCompare(b); }));
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    MySQL.TableColumnExists = function (connection, table, column) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        connection.query("SELECT COUNT(*) AS count\n                      FROM information_schema.COLUMNS\n                      WHERE TABLE_SCHEMA = '" + connection.config.database + "'\n                        AND TABLE_NAME = '" + table + "'\n                        AND COLUMN_NAME = '" + column + "'", function (error, results, _fields) {
                            var _a, _b;
                            if (error)
                                throw error;
                            resolve(((_b = ((_a = (results !== null && results !== void 0 ? results : [])[0]) !== null && _a !== void 0 ? _a : {})['count']) !== null && _b !== void 0 ? _b : 0) > 0);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    MySQL.TableColumns = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        connection.query("SELECT *\n                      FROM information_schema.COLUMNS\n                      WHERE TABLE_SCHEMA = '" + connection.config.database + "'\n                        AND TABLE_NAME = '" + table + "'\n                        ORDER BY ORDINAL_POSITION", function (error, results, _fields) {
                            var _a;
                            if (error)
                                throw error;
                            resolve(__spreadArrays(((_a = results) !== null && _a !== void 0 ? _a : [])));
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    MySQL.TableFKs = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        connection.query("SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME\n\t\t\t\tFROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE\n\t\t\t\tWHERE REFERENCED_TABLE_SCHEMA = '" + connection.config.database + "'\n\t\t\t\t  AND TABLE_NAME = '" + table + "'", function (error, results, _fields) {
                            if (error)
                                throw error;
                            var myForeignKeys = [];
                            var _loop_1 = function (result) {
                                var prevFK = myForeignKeys.find(function (fk) { return fk.keyName === result.CONSTRAINT_NAME; });
                                if (!!prevFK) {
                                    prevFK.columnNames = __spreadArrays(prevFK.columnNames, [result.COLUMN_NAME]);
                                    prevFK.primaryColumns = __spreadArrays(prevFK.primaryColumns, [result.REFERENCED_COLUMN_NAME]);
                                }
                                else {
                                    var myForeignKey = new MyForeignKey();
                                    myForeignKey.keyName = result.CONSTRAINT_NAME;
                                    myForeignKey.columnNames = [result.COLUMN_NAME];
                                    myForeignKey.primaryTable = result.REFERENCED_TABLE_NAME;
                                    myForeignKey.primaryColumns = [result.REFERENCED_COLUMN_NAME];
                                    myForeignKeys.push(myForeignKey);
                                }
                            };
                            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                                var result = results_1[_i];
                                _loop_1(result);
                            }
                            resolve(myForeignKeys);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    MySQL.TableIndexes = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        connection.query("SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE\n\t\t\t\tFROM INFORMATION_SCHEMA.STATISTICS\n\t\t\t\tWHERE TABLE_SCHEMA = '" + connection.config.database + "'\n\t\t\t\t\tAND TABLE_NAME = '" + table + "'\n\t\t\t\tORDER BY INDEX_NAME", function (error, results, _fields) {
                            if (error)
                                throw error;
                            var myIndexes = [];
                            var _loop_2 = function (result) {
                                var prevIndex = myIndexes.find(function (idx) { return idx.indexName === result.INDEX_NAME; });
                                if (!!prevIndex) {
                                    prevIndex.columns = __spreadArrays(prevIndex.columns, [result.COLUMN_NAME]);
                                }
                                else {
                                    var myIndex = new MyIndex();
                                    myIndex.indexName = result.INDEX_NAME;
                                    myIndex.columns = [result.COLUMN_NAME];
                                    myIndex.isUnique = !intelliwaketsfoundation.IsOn(result.NON_UNIQUE);
                                    myIndexes.push(myIndex);
                                }
                            };
                            for (var _i = 0, results_2 = results; _i < results_2.length; _i++) {
                                var result = results_2[_i];
                                _loop_2(result);
                            }
                            resolve(myIndexes);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    MySQL.GetMyTable = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        var myTable, columns, _i, columns_1, column, myColumn, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    myTable = new MyTable();
                    myTable.name = table;
                    return [4 /*yield*/, MySQL.TableColumns(connection, table)];
                case 1:
                    columns = _c.sent();
                    for (_i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                        column = columns_1[_i];
                        myColumn = new MyColumn(column);
                        myTable.columns.push(myColumn);
                    }
                    _a = myTable;
                    return [4 /*yield*/, MySQL.TableFKs(connection, table)];
                case 2:
                    _a.foreignKeys = _c.sent();
                    _b = myTable;
                    return [4 /*yield*/, MySQL.TableIndexes(connection, table)];
                case 3:
                    _b.indexes = _c.sent();
                    return [2 /*return*/, myTable];
            }
        });
    }); };
    // export const TriggerExists = async (connection: TConnection, trigger: string): Promise<boolean> => {
    // 	return await new Promise((resolve) => {
    // 		const sql = `SELECT COUNT(*) AS count
    //                     FROM information_schema.triggers
    //                     WHERE trigger_schema = 'public'
    //                       AND trigger_catalog = '${connection.config.database}'
    //                       AND trigger_name = '${trigger}'`
    // 		query(connection, sql, undefined)
    // 			.then((data) => {
    // 				resolve(((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
    // 			})
    // 			.catch(() => {
    // 				console.log('...Trigger Exists', trigger)
    // 				resolve(false)
    // 			})
    // 	})
    // }
    //
    // export const TableResetIncrement = async (
    // 	connection: TConnection,
    // 	table: string,
    // 	column: string,
    // 	toID?: number
    // ): Promise<boolean> => {
    // 	const max =
    // 		toID ??
    // 		+((await SQL.FetchOne<{id: number}>(connection, `SELECT MAX(${column}) AS id FROM ${table}`))?.id ?? 0) + 1
    //
    // 	if (!!max) {
    // 		// console.log(table, column, max.id);
    // 		return await SQL.Execute(connection, `ALTER TABLE ${table} ALTER COLUMN ${column} RESTART WITH ${max}`)
    // 	}
    //
    // 	return true
    // }
    //
    // export const ConstraintExists = async (connection: TConnection, constraint: string): Promise<boolean> => {
    // 	return await new Promise((resolve) => {
    // 		const sql = `
    // 			SELECT COUNT(*) AS count
    //                     FROM information_schema.table_constraints
    //                     WHERE constraint_schema = 'public'
    //                       AND constraint_catalog = '${connection.config.database}'
    //                       AND constraint_name = '${constraint}'`
    // 		query(connection, sql, undefined)
    // 			.then((data) => {
    // 				resolve(((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
    // 			})
    // 			.catch(() => {
    // 				console.log('...Constraint Exists', constraint)
    // 				resolve(false)
    // 			})
    // 	})
    // }
    //
    // export interface IConstraints {
    // 	table_name: string
    // 	constraint_name: string
    // }
    //
    // export const FKConstraints = async (connection: TConnection): Promise<IConstraints[]> => {
    // 	const sql = `
    // 		SELECT table_name, constraint_name
    //                     FROM information_schema.table_constraints
    //                     WHERE constraint_schema = 'public'
    //                       AND constraint_catalog = '${connection.config.database}'
    //                       AND constraint_type = 'FOREIGN KEY'`
    //
    // 	return await SQL.FetchMany<IConstraints>(connection, sql)
    // }
    //
    // export const Functions = async (connection: TConnection): Promise<string[]> => {
    // 	const sql = `
    // 			SELECT routines.routine_name
    // 			  FROM information_schema.routines
    // 			  WHERE routines.specific_schema='public'
    // 			  AND routine_type='FUNCTION'
    // 			  AND routine_catalog='${connection.config.database}'
    // 			  ORDER BY routines.routine_name`
    //
    // 	return (await SQL.FetchArray<string>(connection, sql)).filter((func) => func.startsWith('transcom'))
    // }
    //
    // export const IndexExists = async (
    // 	connection: TConnection,
    // 	tablename: string,
    // 	indexName: string
    // ): Promise<boolean> => {
    // 	return await new Promise((resolve) => {
    // 		const sql = `SELECT COUNT(*) AS count
    //                     FROM pg_indexes
    //                     WHERE schemaname = 'public'
    //                       AND tablename = '${tablename}'
    //                       AND indexname = '${indexName}'`
    // 		query(connection, sql, undefined)
    // 			.then((data) => {
    // 				resolve(((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
    // 			})
    // 			.catch(() => {
    // 				console.log('...Index Exists', tablename, indexName)
    // 				resolve(false)
    // 			})
    // 	})
    // }
    //
    // export const GetByID = async <T>(connection: TConnection, table: TTables, id: number | null): Promise<T | null> => {
    // 	return await new Promise((resolve) => {
    // 		if (!id) {
    // 			resolve(null)
    // 		} else {
    // 			// noinspection SqlResolve
    // 			const sql = `SELECT * FROM ${table} WHERE id = $1`
    // 			query<T>(connection, sql, [id])
    // 				.then((data) => {
    // 					const result = !!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null
    //
    // 					resolve(result)
    // 					// resolve(!!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null)
    // 				})
    // 				.catch(() => {
    // 					console.log('...GetByID', table, id)
    // 					resolve(null)
    // 				})
    // 		}
    // 	})
    // }
    //
    // export const GetCountSQL = async (connection: TConnection, sql: string, values?: any): Promise<number> => {
    // 	return await new Promise((resolve) => {
    // 		query(connection, sql, values)
    // 			.then((data) => {
    // 				const value = (((data.rows ?? [])[0] ?? {}) as any)['count']
    // 				resolve(isNaN(value) ? 0 : parseInt(value))
    // 			})
    // 			.catch(() => {
    // 				console.log('... GetCNTSQL')
    // 				resolve(0)
    // 			})
    // 	})
    // }
    //
    // export const FetchOne = async <T>(connection: TConnection, sql: string, values?: any): Promise<T | null> => {
    // 	return await new Promise((resolve) => {
    // 		// noinspection SqlResolve
    // 		query<T>(connection, sql, values)
    // 			.then((data) => {
    // 				resolve(!!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null)
    // 			})
    // 			.catch(() => {
    // 				console.log('...FetchOne')
    // 				resolve(null)
    // 			})
    // 	})
    // }
    //
    // export const FetchMany = async <T>(connection: TConnection, sql: string, values?: any): Promise<Array<T>> => {
    // 	return await new Promise((resolve) => {
    // 		// noinspection SqlResolve
    // 		query<T>(connection, sql, values)
    // 			.then((data) => {
    // 				resolve(data.rows ?? [])
    // 			})
    // 			.catch(() => {
    // 				console.log('...FetchMany')
    // 				resolve([])
    // 			})
    // 	})
    // }
    //
    // export const FetchArray = async <T>(connection: TConnection, sql: string, values?: any): Promise<Array<T>> => {
    // 	return await new Promise((resolve) => {
    // 		query(connection, sql, values)
    // 			.then((data) => {
    // 				resolve((data.rows ?? []).map((row) => (row as any)[Object.keys(row as any)[0]] as T))
    // 			})
    // 			.catch(() => {
    // 				console.log('...FetchArray')
    // 				resolve([])
    // 			})
    // 	})
    // }
    //
    // export const InsertAndGetReturning = async (
    // 	connection: TConnection,
    // 	table: TTables,
    // 	values: any
    // ): Promise<any | null> => {
    // 	return await new Promise((resolve) => {
    // 		let newValues = {...values}
    // 		if (!newValues.id) {
    // 			delete newValues.id
    // 			// delete newValues.added_date;
    // 			// delete newValues.modified_date;
    // 		}
    //
    // 		let params = new PGParams()
    //
    // 		const sql = `
    // 			INSERT INTO ${table}
    // 			    ("${Object.keys(newValues).join('","')}")
    // 			    VALUES
    // 			    (${Object.values(newValues)
    // 			.map((value) => params.add(value))
    // 			.join(',')})
    // 			    RETURNING *`
    //
    // 		query(connection, sql, params.values)
    // 			.then((results) => {
    // 				resolve(((results.rows as any[]) ?? [])[0])
    // 			})
    // 			.catch(() => {
    // 				console.log('...InsertAndGetID', table)
    // 				resolve(null)
    // 			})
    // 	})
    // }
    //
    // export const InsertBulk = async (connection: TConnection, table: TTables, values: any): Promise<boolean> => {
    // 	return await new Promise((resolve) => {
    // 		let params = new PGParams()
    //
    // 		const sql = `
    // 			INSERT INTO ${table}
    // 			    ("${Object.keys(values).join('","')}")
    // 			    VALUES
    // 			    (${Object.values(values)
    // 			.map((value) => params.add(value))
    // 			.join(',')})`
    //
    // 		query(connection, sql, params.values)
    // 			.then(() => {
    // 				resolve(true)
    // 			})
    // 			.catch(() => {
    // 				console.log('...InsertBulk', table)
    // 				resolve(false)
    // 			})
    // 	})
    // }
    //
    // export const UpdateAndGetReturning = async (
    // 	connection: TConnection,
    // 	table: TTables,
    // 	whereValues: any,
    // 	updateValues: any
    // ): Promise<any | null> => {
    // 	return await new Promise((resolve) => {
    // 		let params = new PGParams()
    //
    // 		// noinspection SqlResolve
    // 		const sql = `UPDATE ${table} SET ${BuildSetComponents(updateValues, params)} WHERE ${BuildWhereComponents(
    // 			whereValues,
    // 			params
    // 		)} RETURNING *`
    // 		query(connection, sql, params.values)
    // 			.then((results) => {
    // 				// @ts-ignore
    // 				resolve(results.rows[0])
    // 			})
    // 			.catch(() => {
    // 				console.log('...Update', table)
    // 				resolve(null)
    // 			})
    // 	})
    // }
    //
    // export const BuildWhereComponents = (whereValues: any, params: PGParams): string =>
    // 	Object.keys(whereValues)
    // 		.map((key) => `"${key}"=${params.add(whereValues[key])}`)
    // 		.join(' AND ')
    //
    // export const BuildSetComponents = (setValues: any, params: PGParams): string =>
    // 	Object.keys(setValues)
    // 		.map((key) => `"${key}"=${params.add(setValues[key])}`)
    // 		.join(',')
    //
    // export const Save = async (connection: TConnection, table: TTables, values: any): Promise<any | null> => {
    // 	return await new Promise(async (resolve) => {
    // 		if (!values.id) {
    // 			resolve(await InsertAndGetReturning(connection, table, values))
    // 		} else {
    // 			let whereValues = {id: values.id}
    //
    // 			resolve(await UpdateAndGetReturning(connection, table, whereValues, values))
    // 		}
    // 	})
    // }
    //
    // export const Delete = async (connection: TConnection, table: TTables, whereValues: any): Promise<boolean> => {
    // 	return await new Promise((resolve) => {
    // 		let params = new PGParams()
    //
    // 		// noinspection SqlResolve
    // 		const sql = `DELETE FROM ${table} WHERE ${BuildWhereComponents(whereValues, params)}`
    // 		query(connection, sql, params.values)
    // 			.then(() => {
    // 				// @ts-ignore
    // 				resolve(true)
    // 			})
    // 			.catch(() => {
    // 				console.log('...DELETE', table)
    // 				resolve(false)
    // 			})
    // 	})
    // }
    //
    // export const ExecuteRaw = async (connection: TConnection | null, sql: string): Promise<boolean> => {
    // 	return await new Promise((resolve) => {
    // 		const tConnection = connection ?? databasePool
    // 		query(tConnection, sql, undefined)
    // 			.then(() => {
    // 				resolve(true)
    // 			})
    // 			.catch(() => {
    // 				console.log('...ExecuteRaw')
    // 				// console.log(());
    // 				// throw Error(().message);
    // 				resolve(false)
    // 			})
    // 	})
    // }
    //
    // export const Execute = async (connection: TConnection, sql: string, values?: any): Promise<boolean> => {
    // 	return await new Promise((resolve) => {
    // 		query(connection, sql, values)
    // 			.then(() => {
    // 				resolve(true)
    // 			})
    // 			.catch(() => {
    // 				console.log('...Execute')
    // 				resolve(false)
    // 			})
    // 	})
    // }
    //
    // export const TruncateAllTables = async (connection: TConnection, exceptions: string[] = []): Promise<boolean> => {
    // 	// if (Settings.IsTestDataENV()) {
    //
    // 	const dbVersion = await Csettings.GetSetting(connection, 'DBVersion', null, 0)
    // 	const htmlVersion = await Csettings.GetSetting(connection, 'HTMLVersion', null, 0)
    //
    // 	let tables = await TablesArray(connection)
    //
    // 	await Transaction(async (connection) => {
    // 		await Execute(connection, 'SET CONSTRAINTS ALL DEFERRED', undefined)
    //
    // 		for (const table of tables) {
    // 			if (exceptions.includes(table)) {
    // 				await Execute(connection, `TRUNCATE TABLE ${table}`, undefined)
    // 			}
    // 		}
    //
    // 		return true
    // 	})
    //
    // 	await Csettings.SetSetting(connection, 'DBVersion', dbVersion, 0)
    // 	await Csettings.SetSetting(connection, 'HTMLVersion', htmlVersion, 0)
    //
    // 	return true
    // }
    //
    // export const TruncateTables = async (connection: TConnection, tables: string[]) => {
    // 	for (const table of tables) {
    // 		await Execute(connection, `TRUNCATE TABLE ${table}`)
    // 	}
    // }
    //
    // export const TablesArray = async (connection: TConnection): Promise<string[]> => {
    // 	return await FetchArray<string>(
    // 		connection,
    // 		`
    //       	SELECT table_name
    // 			  FROM information_schema.tables
    // 			  WHERE table_schema = 'public'
    // 			    AND table_type = 'BASE TABLE'
    // 				AND table_catalog = '${connection.config.database}'`
    // 	)
    // }
    //
    // export const ViewsArray = async (connection: TConnection): Promise<string[]> => {
    // 	return (
    // 		await FetchArray<string>(
    // 			connection,
    // 			`
    //       	SELECT table_name
    // 			  FROM information_schema.tables
    // 			  WHERE table_schema = 'public'
    // 			    AND table_type = 'VIEW'
    // 				AND table_catalog = '${connection.config.database}'`
    // 		)
    // 	).filter((vw) => vw.startsWith('transcom'))
    // }
    //
    // export const TypesArray = async (connection: TConnection): Promise<string[]> => {
    // 	return (
    // 		await FetchArray<string>(
    // 			connection,
    // 			`
    //               SELECT typname
    //               FROM pg_type
    //               where typcategory = 'E'
    //               order by typname`
    // 		)
    // 	).filter((typ) => typ.startsWith('transcom'))
    // }
    //
    // export const SortColumnSort = (sortColumn: ISortColumn): string => {
    // 	let sort = ''
    //
    // 	if (!!sortColumn.primarySort) {
    // 		sort += 'ORDER BY '
    // 		if (!sortColumn.primaryAscending) {
    // 			sort += `${sortColumn.primarySort} DESC`
    // 		} else {
    // 			switch (sortColumn.primaryEmptyToBottom) {
    // 				case 'string':
    // 					sort += `NULLIF(${sortColumn.primarySort}, '')`
    // 					break
    // 				case 'number':
    // 					sort += `NULLIF(${sortColumn.primarySort}, 0)`
    // 					break
    // 				default:
    // 					// null, so do not empty to bottom
    // 					sort += `${sortColumn.primarySort}`
    // 					break
    // 			}
    // 		}
    //
    // 		if (!!sortColumn.primaryEmptyToBottom) sort += ' NULLS LAST'
    //
    // 		if (!!sortColumn.secondarySort) {
    // 			sort += ', '
    // 			if (!sortColumn.secondaryAscending) {
    // 				sort += `${sortColumn.secondarySort} DESC`
    // 			} else {
    // 				switch (sortColumn.secondaryEmptyToBottom) {
    // 					case 'string':
    // 						sort += `NULLIF(${sortColumn.secondarySort}, '')`
    // 						break
    // 					case 'number':
    // 						sort += `NULLIF(${sortColumn.secondarySort}, 0)`
    // 						break
    // 					default:
    // 						// null, so do not empty to bottom
    // 						sort += `${sortColumn.secondarySort}`
    // 						break
    // 				}
    // 			}
    //
    // 			if (!!sortColumn.secondaryEmptyToBottom) sort += ' NULLS LAST'
    // 		}
    // 	}
    //
    // 	return sort
    // }
    //
    // export const CalcOffsetFromPage = (page: number, pageSize: number, totalRecords: number): number => {
    // 	if (totalRecords > 0) {
    // 		const pages = CalcPageCount(+pageSize, +totalRecords)
    //
    // 		if (page < 1) {
    // 			page = 1
    // 		}
    // 		if (page > pages) {
    // 			page = pages
    // 		}
    //
    // 		return (page - 1) * pageSize
    // 	} else {
    // 		// noinspection JSUnusedAssignment
    // 		page = 1
    //
    // 		return 0
    // 	}
    // }
    //
    // export const CalcPageCount = (pageSize: number, totalRecords: number): number => {
    // 	if (totalRecords > 0) {
    // 		return Math.floor((totalRecords + (pageSize - 1)) / pageSize)
    // 	} else {
    // 		return 0
    // 	}
    // }
})(exports.MySQL || (exports.MySQL = {}));

var PGParams = /** @class */ (function () {
    function PGParams() {
        this.lastPosition = 0;
        this.values = [];
    }
    PGParams.prototype.add = function (value) {
        // const idx = this.values.indexOf(value)
        //
        // if (idx >= 0) {
        // 	return `$${idx + 1}`
        // }
        this.lastPosition++;
        this.values.push(value);
        return "$" + this.lastPosition;
    };
    PGParams.prototype.addLike = function (value) {
        return this.add("%" + value + "%");
    };
    PGParams.prototype.addEqualNullable = function (field, value) {
        if (value === null || value === undefined) {
            return field + " IS NULL";
        }
        else {
            return field + " = " + this.add(value);
        }
    };
    PGParams.prototype.replaceSQLWithValues = function (sql) {
        var returnSQL = sql;
        for (var i = this.values.length; i > 0; i--) {
            returnSQL = intelliwaketsfoundation.ReplaceAll("$" + i, typeof this.values[i - 1] === 'string' ? "'" + this.values[i - 1] + "'" : this.values[i - 1], returnSQL);
        }
        return returnSQL;
    };
    return PGParams;
}());

(function (PGSQL) {
    var _this = this;
    PGSQL.query = function (connection, sql, values) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, connection.query(sql, values)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    console.log('------------ SQL Query');
                    console.log(err_1.message);
                    console.log(sql);
                    console.log(values);
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    PGSQL.timeout = function (ms) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                })];
        });
    }); };
    PGSQL.PGQueryValuesStream = function (connection, sql, values, row) { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var actualRow, actualValues, loadCount, processedCount, query, stream;
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (!!row) {
                            actualRow = row;
                            actualValues = values;
                        }
                        else {
                            actualRow = values;
                            values = [];
                        }
                        loadCount = 0;
                        processedCount = 0;
                        query = new QueryStream__default['default'](sql, actualValues);
                        stream = connection.query(query);
                        stream.on('data', function (row) { return __awaiter(_this, void 0, void 0, function () {
                            var paused;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        loadCount++;
                                        paused = false;
                                        if (loadCount > processedCount + 100) {
                                            stream.pause();
                                            paused = true;
                                        }
                                        return [4 /*yield*/, actualRow(row)];
                                    case 1:
                                        _a.sent();
                                        processedCount++;
                                        if (paused) {
                                            stream.resume();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        stream.on('error', function (err) {
                            reject(err);
                        });
                        stream.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, PGSQL.timeout(100)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        if (!(processedCount < loadCount)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, PGSQL.timeout(100)];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 2];
                                    case 4:
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); })];
        });
    }); };
    PGSQL.PGQueryStream = function (connection, sql, row) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, PGSQL.PGQueryValuesStream(connection, sql, [], row)];
    }); }); };
    PGSQL.TableRowCount = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, PGSQL.query(connection, "SELECT COUNT(*) AS count\n                                          FROM " + table, undefined)];
                case 1:
                    data = _d.sent();
                    return [2 /*return*/, (_c = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count']) !== null && _c !== void 0 ? _c : 0];
            }
        });
    }); };
    PGSQL.TableExists = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        var sql, data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sql = "SELECT COUNT(*) AS count\n                 FROM information_schema.tables\n                 WHERE table_schema = 'public'\n                   AND table_name = '" + table + "'";
                    return [4 /*yield*/, PGSQL.query(connection, sql, undefined)];
                case 1:
                    data = _d.sent();
                    return [2 /*return*/, ((_c = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count']) !== null && _c !== void 0 ? _c : 0) > 0];
            }
        });
    }); };
    PGSQL.TableColumnExists = function (connection, table, column) { return __awaiter(_this, void 0, void 0, function () {
        var sql, data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sql = "SELECT COUNT(*) AS count\n                 FROM information_schema.COLUMNS\n                 WHERE table_schema = 'public'\n                   AND table_name = '" + table + "'\n                   AND column_name = '" + column + "'";
                    return [4 /*yield*/, PGSQL.query(connection, sql, undefined)];
                case 1:
                    data = _d.sent();
                    return [2 /*return*/, ((_c = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count']) !== null && _c !== void 0 ? _c : 0) > 0];
            }
        });
    }); };
    PGSQL.TriggerExists = function (connection, trigger) { return __awaiter(_this, void 0, void 0, function () {
        var sql, data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sql = "SELECT COUNT(*) AS count\n                 FROM information_schema.triggers\n                 WHERE trigger_schema = 'public'\n                   AND trigger_name = '" + trigger + "'";
                    return [4 /*yield*/, PGSQL.query(connection, sql, undefined)];
                case 1:
                    data = _d.sent();
                    return [2 /*return*/, ((_c = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count']) !== null && _c !== void 0 ? _c : 0) > 0];
            }
        });
    }); };
    PGSQL.TableResetIncrement = function (connection, table, column, toID) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!!toID) {
                return [2 /*return*/, PGSQL.Execute(connection, "SELECT setval(pg_get_serial_sequence('" + table + "', '" + column + "'), " + toID + ");\n\t\t\t")];
            }
            else {
                return [2 /*return*/, PGSQL.Execute(connection, "SELECT SETVAL(PG_GET_SERIAL_SEQUENCE('" + table + "', '" + column + "'), MAX(" + column + "))\n         FROM " + table + ";\n\t\t\t\t")];
            }
        });
    }); };
    PGSQL.ConstraintExists = function (connection, constraint) { return __awaiter(_this, void 0, void 0, function () {
        var sql, data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sql = "\n        SELECT COUNT(*) AS count\n        FROM information_schema.table_constraints\n        WHERE constraint_schema = 'public'\n          AND constraint_name = '" + constraint + "'";
                    return [4 /*yield*/, PGSQL.query(connection, sql, undefined)];
                case 1:
                    data = _d.sent();
                    return [2 /*return*/, ((_c = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count']) !== null && _c !== void 0 ? _c : 0) > 0];
            }
        });
    }); };
    PGSQL.FKConstraints = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        var sql;
        return __generator(this, function (_a) {
            sql = "\n        SELECT table_name, constraint_name\n        FROM information_schema.table_constraints\n        WHERE constraint_schema = 'public'\n          AND constraint_type = 'FOREIGN KEY'";
            return [2 /*return*/, PGSQL.FetchMany(connection, sql)];
        });
    }); };
    PGSQL.Functions = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        var sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "\n        SELECT routines.routine_name\n        FROM information_schema.routines\n        WHERE routines.specific_schema = 'public'\n          AND routine_type = 'FUNCTION'\n        ORDER BY routines.routine_name";
                    return [4 /*yield*/, PGSQL.FetchArray(connection, sql)];
                case 1: return [2 /*return*/, (_a.sent()).filter(function (func) { return func.startsWith('func_'); })];
            }
        });
    }); };
    PGSQL.IndexExists = function (connection, tablename, indexName) { return __awaiter(_this, void 0, void 0, function () {
        var sql, data;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sql = "SELECT COUNT(*) AS count\n                 FROM pg_indexes\n                 WHERE schemaname = 'public'\n                   AND tablename = '" + tablename + "'\n                   AND indexname = '" + indexName + "'";
                    return [4 /*yield*/, PGSQL.query(connection, sql, undefined)];
                case 1:
                    data = _d.sent();
                    return [2 /*return*/, ((_c = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count']) !== null && _c !== void 0 ? _c : 0) > 0];
            }
        });
    }); };
    PGSQL.GetByID = function (connection, table, id) { return __awaiter(_this, void 0, void 0, function () {
        var sql, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!!id) return [3 /*break*/, 1];
                    return [2 /*return*/, Promise.resolve(null)];
                case 1:
                    sql = "SELECT *\n                   FROM " + table + "\n                   WHERE id = $1";
                    return [4 /*yield*/, PGSQL.query(connection, sql, [id])];
                case 2:
                    data = _c.sent();
                    return [2 /*return*/, !!((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0] ? __assign({}, ((_b = data.rows) !== null && _b !== void 0 ? _b : [])[0]) : null];
            }
        });
    }); };
    /**
     * Returns a number from the sql who's only column returned is "count"
     */
    PGSQL.GetCountSQL = function (connection, sql, values) { return __awaiter(_this, void 0, void 0, function () {
        var data, value;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, PGSQL.query(connection, sql, values)];
                case 1:
                    data = _c.sent();
                    value = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count'];
                    return [2 /*return*/, isNaN(value) ? 0 : parseInt(value)];
            }
        });
    }); };
    PGSQL.FetchOne = function (connection, sql, values) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, PGSQL.query(connection, sql, values)];
                case 1:
                    data = _c.sent();
                    return [2 /*return*/, !!((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0] ? __assign({}, ((_b = data.rows) !== null && _b !== void 0 ? _b : [])[0]) : null];
            }
        });
    }); };
    PGSQL.FetchMany = function (connection, sql, values) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, PGSQL.query(connection, sql, values)];
                case 1:
                    data = _b.sent();
                    return [2 /*return*/, (_a = data.rows) !== null && _a !== void 0 ? _a : []];
            }
        });
    }); };
    PGSQL.FetchArray = function (connection, sql, values) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, PGSQL.query(connection, sql, values)];
                case 1:
                    data = _b.sent();
                    return [2 /*return*/, ((_a = data.rows) !== null && _a !== void 0 ? _a : []).map(function (row) { return row[Object.keys(row)[0]]; })];
            }
        });
    }); };
    PGSQL.InsertAndGetReturning = function (connection, table, values) { return __awaiter(_this, void 0, void 0, function () {
        var newValues, params, sql, results;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    newValues = __assign({}, values);
                    if (!newValues.id) {
                        delete newValues.id;
                        // delete newValues.added_date;
                        // delete newValues.modified_date;
                    }
                    params = new PGParams();
                    sql = "\n        INSERT INTO " + table + "\n            (\"" + Object.keys(newValues).join('","') + "\")\n        VALUES (" + Object.values(newValues)
                        .map(function (value) { return params.add(value); })
                        .join(',') + ")\n        RETURNING *";
                    return [4 /*yield*/, PGSQL.query(connection, sql, params.values)];
                case 1:
                    results = _b.sent();
                    return [2 /*return*/, ((_a = results.rows) !== null && _a !== void 0 ? _a : [])[0]];
            }
        });
    }); };
    PGSQL.InsertBulk = function (connection, table, values) { return __awaiter(_this, void 0, void 0, function () {
        var params, sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = new PGParams();
                    sql = "\n        INSERT INTO " + table + "\n            (\"" + Object.keys(values).join('","') + "\")\n        VALUES (" + Object.values(values)
                        .map(function (value) { return params.add(value); })
                        .join(',') + ")";
                    return [4 /*yield*/, PGSQL.query(connection, sql, params.values)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    PGSQL.UpdateAndGetReturning = function (connection, table, whereValues, updateValues) { return __awaiter(_this, void 0, void 0, function () {
        var params, sql, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = new PGParams();
                    sql = "UPDATE " + table + "\n                 SET " + PGSQL.BuildSetComponents(updateValues, params) + "\n                 WHERE " + PGSQL.BuildWhereComponents(whereValues, params) + "\n                 RETURNING *";
                    return [4 /*yield*/, PGSQL.query(connection, sql, params.values)
                        // @ts-ignore
                    ];
                case 1:
                    data = _a.sent();
                    // @ts-ignore
                    return [2 /*return*/, data.rows[0]];
            }
        });
    }); };
    PGSQL.BuildWhereComponents = function (whereValues, params) {
        return Object.keys(whereValues)
            .map(function (key) { return "\"" + key + "\"=" + params.add(whereValues[key]); })
            .join(' AND ');
    };
    PGSQL.BuildSetComponents = function (setValues, params) {
        return Object.keys(setValues)
            .map(function (key) { return "\"" + key + "\"=" + params.add(setValues[key]); })
            .join(',');
    };
    PGSQL.Save = function (connection, table, values) { return __awaiter(_this, void 0, void 0, function () {
        var whereValues;
        return __generator(this, function (_a) {
            if (!values.id) {
                return [2 /*return*/, PGSQL.InsertAndGetReturning(connection, table, values)];
            }
            else {
                whereValues = { id: values.id };
                return [2 /*return*/, PGSQL.UpdateAndGetReturning(connection, table, whereValues, values)];
            }
        });
    }); };
    PGSQL.Delete = function (connection, table, whereValues) { return __awaiter(_this, void 0, void 0, function () {
        var params, sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = new PGParams();
                    sql = "DELETE\n                 FROM " + table + "\n                 WHERE " + PGSQL.BuildWhereComponents(whereValues, params);
                    return [4 /*yield*/, PGSQL.query(connection, sql, params.values)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    PGSQL.ExecuteRaw = function (connection, sql) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, PGSQL.Execute(connection, sql)];
    }); }); };
    PGSQL.Execute = function (connection, sql, values) { return __awaiter(_this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, connection.query(sql, values)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_2 = _a.sent();
                    console.log('------------ SQL Execute');
                    console.log(err_2.message);
                    console.log(sql);
                    console.log(values);
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    PGSQL.TruncateAllTables = function (connection, exceptions) {
        if (exceptions === void 0) { exceptions = []; }
        return __awaiter(_this, void 0, void 0, function () {
            var tables, _i, tables_1, table;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, PGSQL.TablesArray(connection)];
                    case 1:
                        tables = _a.sent();
                        return [4 /*yield*/, PGSQL.Execute(connection, 'SET CONSTRAINTS ALL DEFERRED', undefined)];
                    case 2:
                        _a.sent();
                        _i = 0, tables_1 = tables;
                        _a.label = 3;
                    case 3:
                        if (!(_i < tables_1.length)) return [3 /*break*/, 6];
                        table = tables_1[_i];
                        if (!exceptions.includes(table)) return [3 /*break*/, 5];
                        return [4 /*yield*/, PGSQL.Execute(connection, "TRUNCATE TABLE " + table, undefined)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, true];
                }
            });
        });
    };
    PGSQL.TruncateTables = function (connection, tables) { return __awaiter(_this, void 0, void 0, function () {
        var _i, tables_2, table;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, tables_2 = tables;
                    _a.label = 1;
                case 1:
                    if (!(_i < tables_2.length)) return [3 /*break*/, 4];
                    table = tables_2[_i];
                    return [4 /*yield*/, PGSQL.Execute(connection, "TRUNCATE TABLE " + table)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    PGSQL.TablesArray = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, PGSQL.FetchArray(connection, "\n          SELECT table_name\n          FROM information_schema.tables\n          WHERE table_schema = 'public'\n            AND table_type = 'BASE TABLE'")];
        });
    }); };
    PGSQL.ViewsArray = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchArray(connection, "\n          SELECT table_name\n          FROM information_schema.tables\n          WHERE table_schema = 'public'\n            AND table_type = 'VIEW'")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    PGSQL.ViewsMatArray = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchArray(connection, "\n          SELECT matviewname\n          FROM pg_matviews\n          WHERE schemaname = 'public'")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    PGSQL.TypesArray = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchArray(connection, "\n          SELECT typname\n          FROM pg_type\n          WHERE typcategory = 'E'\n          ORDER BY typname")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    PGSQL.FunctionsArray = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchArray(connection, "\n          SELECT f.proname\n          FROM pg_catalog.pg_proc f\n                   INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)\n          WHERE n.nspname = 'public'\n            AND f.proname ILIKE 'func_%'")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    PGSQL.FunctionsOIDArray = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchArray(connection, "\n          SELECT f.oid\n          FROM pg_catalog.pg_proc f\n                   INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)\n          WHERE n.nspname = 'public'\n            AND f.proname ILIKE 'func_%'")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    PGSQL.ExtensionsArray = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchArray(connection, "\n          SELECT extname\n          FROM pg_extension\n          WHERE extname != 'plpgsql'")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    PGSQL.TableData = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, PGSQL.FetchOne(connection, "\n          SELECT *\n          FROM information_schema.tables\n          WHERE table_schema = 'public'\n            AND table_type = 'BASE TABLE'\n            AND table_name = $1", [table])];
        });
    }); };
    PGSQL.TableColumnsData = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, PGSQL.FetchMany(connection, "\n          SELECT *\n          FROM information_schema.columns\n          WHERE table_schema = 'public'\n            AND table_name = $1\n          ORDER BY ordinal_position", [table])];
        });
    }); };
    PGSQL.TableFKsData = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, PGSQL.FetchMany(connection, "\n          SELECT tc.table_schema,\n                 tc.constraint_name,\n                 tc.table_name,\n                 MAX(tc.enforced),\n                 JSON_AGG(kcu.column_name) AS \"columnNames\",\n                 MAX(ccu.table_schema)     AS foreign_table_schema,\n                 MAX(ccu.table_name)       AS \"primaryTable\",\n                 JSON_AGG(ccu.column_name) AS \"primaryColumns\"\n          FROM information_schema.table_constraints AS tc\n                   JOIN information_schema.key_column_usage AS kcu\n                        ON tc.constraint_name = kcu.constraint_name\n                            AND tc.table_schema = kcu.table_schema\n                   JOIN information_schema.constraint_column_usage AS ccu\n                        ON ccu.constraint_name = tc.constraint_name\n                            AND ccu.table_schema = tc.table_schema\n          WHERE tc.table_schema = 'public'\n            AND tc.constraint_type = 'FOREIGN KEY'\n            AND tc.table_name = $1\n          GROUP BY tc.table_schema,\n                   tc.constraint_name,\n                   tc.table_name", [table])];
        });
    }); };
    PGSQL.TableIndexesData = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, PGSQL.FetchMany(connection, "\n          SELECT *\n          FROM pg_indexes\n          WHERE schemaname = 'public'\n            AND tablename = $1\n            AND (indexname NOT ILIKE '%_pkey'\n              OR indexdef ILIKE '%(%,%)%')", [table])];
        });
    }); };
    PGSQL.ViewData = function (connection, view) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchOne(connection, "\n          select pg_get_viewdef($1, true) as viewd", [view])];
                case 1: return [2 /*return*/, ((_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.viewd) !== null && _b !== void 0 ? _b : null)];
            }
        });
    }); };
    PGSQL.ViewsMatData = function (connection, viewMat) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchOne(connection, "\n          select pg_get_viewdef($1, true) as viewd", [viewMat])];
                case 1: return [2 /*return*/, ((_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.viewd) !== null && _b !== void 0 ? _b : null)];
            }
        });
    }); };
    PGSQL.FunctionData = function (connection, func) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, PGSQL.FetchOne(connection, "\n          select pg_get_functiondef($1) as viewd", [func])];
                case 1: return [2 /*return*/, ((_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.viewd) !== null && _b !== void 0 ? _b : null)];
            }
        });
    }); };
    PGSQL.TypeData = function (connection, type) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, PGSQL.FetchArray(connection, "\n                SELECT unnest(enum_range(NULL::" + type + "))")];
        });
    }); };
    PGSQL.SortColumnSort = function (sortColumn) {
        var sort = '';
        if (!!sortColumn.primarySort) {
            sort += 'ORDER BY ';
            if (!sortColumn.primaryAscending) {
                sort += AltColumn(sortColumn.primarySort) + " DESC";
            }
            else {
                switch (sortColumn.primaryEmptyToBottom) {
                    case 'string':
                        sort += "NULLIF(" + sortColumn.primarySort + ", '')";
                        break;
                    case 'number':
                        sort += "NULLIF(" + sortColumn.primarySort + ", 0)";
                        break;
                    default:
                        // null, so do not empty to bottom
                        sort += "" + AltColumn(sortColumn.primarySort);
                        break;
                }
            }
            if (!!sortColumn.primaryEmptyToBottom)
                sort += ' NULLS LAST';
            if (!!sortColumn.secondarySort) {
                sort += ', ';
                if (!sortColumn.secondaryAscending) {
                    sort += AltColumn(sortColumn.secondarySort) + " DESC";
                }
                else {
                    switch (sortColumn.secondaryEmptyToBottom) {
                        case 'string':
                            sort += "NULLIF(" + sortColumn.secondarySort + ", '')";
                            break;
                        case 'number':
                            sort += "NULLIF(" + sortColumn.secondarySort + ", 0)";
                            break;
                        default:
                            // null, so do not empty to bottom
                            sort += "" + AltColumn(sortColumn.secondarySort);
                            break;
                    }
                }
                if (!!sortColumn.secondaryEmptyToBottom)
                    sort += ' NULLS LAST';
            }
        }
        return sort;
    };
    PGSQL.PaginatorOrderBy = function (paginatorRequest) { return PGSQL.SortColumnSort(paginatorRequest.sortColumns); };
    PGSQL.LimitOffset = function (limit, offset) { return " LIMIT " + limit + " OFFSET " + offset + " "; };
    PGSQL.PaginatorLimitOffset = function (paginatorResponse) { return PGSQL.LimitOffset(paginatorResponse.countPerPage, paginatorResponse.currentOffset); };
    var AltColumn = function (column) {
        if (column === 'appointment_date') {
            return "concat_ws(' ', appointment_date, appointment_time)";
        }
        else {
            return column;
        }
    };
    PGSQL.CalcOffsetFromPage = function (page, pageSize, totalRecords) {
        if (totalRecords > 0) {
            var pages = PGSQL.CalcPageCount(+pageSize, +totalRecords);
            if (page < 1) {
                page = 1;
            }
            if (page > pages) {
                page = pages;
            }
            return (page - 1) * pageSize;
        }
        else {
            // noinspection JSUnusedAssignment
            page = 1;
            return 0;
        }
    };
    PGSQL.CalcPageCount = function (pageSize, totalRecords) {
        if (totalRecords > 0) {
            return Math.floor((totalRecords + (pageSize - 1)) / pageSize);
        }
        else {
            return 0;
        }
    };
    PGSQL.ResetIDs = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        var tables, _i, tables_3, table;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PGSQL.TablesArray(connection)];
                case 1:
                    tables = _a.sent();
                    _i = 0, tables_3 = tables;
                    _a.label = 2;
                case 2:
                    if (!(_i < tables_3.length)) return [3 /*break*/, 6];
                    table = tables_3[_i];
                    return [4 /*yield*/, PGSQL.TableColumnExists(connection, table, 'id')];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 5];
                    return [4 /*yield*/, PGSQL.TableResetIncrement(connection, table, 'id')];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    PGSQL.GetTypes = function (connection) { return __awaiter(_this, void 0, void 0, function () {
        var enumItems, enums, _i, enumItems_1, enumItem, _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, PGSQL.TypesArray(connection)];
                case 1:
                    enumItems = _e.sent();
                    enums = [];
                    _i = 0, enumItems_1 = enumItems;
                    _e.label = 2;
                case 2:
                    if (!(_i < enumItems_1.length)) return [3 /*break*/, 5];
                    enumItem = enumItems_1[_i];
                    _b = (_a = enums).push;
                    _c = PGEnum.bind;
                    _d = {
                        enumName: enumItem
                    };
                    return [4 /*yield*/, PGSQL.TypeData(connection, enumItem)];
                case 3:
                    _b.apply(_a, [new (_c.apply(PGEnum, [void 0, (_d.values = _e.sent(),
                                _d.defaultValue = undefined,
                                _d)]))()]);
                    _e.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, enums];
            }
        });
    }); };
    PGSQL.TableColumnComments = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, PGSQL.FetchMany(connection, "\n        SELECT cols.column_name,\n               (\n                   SELECT pg_catalog.COL_DESCRIPTION(c.oid, cols.ordinal_position::INT)\n                   FROM pg_catalog.pg_class c\n                   WHERE c.oid = (SELECT cols.table_name::REGCLASS::OID)\n                     AND c.relname = cols.table_name\n               ) AS column_comment\n\n        FROM information_schema.columns cols\n        WHERE cols.table_schema = 'public'\n          AND cols.table_name = '" + table + "'")];
        });
    }); };
    PGSQL.GetPGTable = function (connection, table) { return __awaiter(_this, void 0, void 0, function () {
        var pgTable, columnComments, columns, _loop_1, _i, columns_1, column, fks, _a, fks_1, fk, pgForeignKey, indexes, _b, indexes_1, index, indexDef, pgIndex;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    pgTable = new PGTable();
                    pgTable.name = table;
                    return [4 /*yield*/, PGSQL.TableColumnComments(connection, table)];
                case 1:
                    columnComments = _h.sent();
                    return [4 /*yield*/, PGSQL.TableColumnsData(connection, table)];
                case 2:
                    columns = _h.sent();
                    _loop_1 = function (column) {
                        var pgColumn = new PGColumn(__assign(__assign({}, column), { isAutoIncrement: intelliwaketsfoundation.IsOn(column.identity_increment), udt_name: column.udt_name.toString().startsWith('_') ? column.udt_name.toString().substr(1) : column.udt_name, array_dimensions: column.udt_name.toString().startsWith('_') ? [null] : [], column_default: (((_c = column.column_default) !== null && _c !== void 0 ? _c : '').toString().startsWith('\'NULL\'') || ((_d = column.column_default) !== null && _d !== void 0 ? _d : '').toString().startsWith('NULL::')) ? null : ((_e = column.column_default) !== null && _e !== void 0 ? _e : '').toString().startsWith('\'\'::') ? '' : column.column_default, column_comment: (_g = (_f = columnComments.find(function (col) { return col.column_name === column.column_name; })) === null || _f === void 0 ? void 0 : _f.column_comment) !== null && _g !== void 0 ? _g : '' }));
                        pgTable.columns.push(pgColumn);
                    };
                    for (_i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                        column = columns_1[_i];
                        _loop_1(column);
                    }
                    return [4 /*yield*/, PGSQL.TableFKsData(connection, table)];
                case 3:
                    fks = _h.sent();
                    for (_a = 0, fks_1 = fks; _a < fks_1.length; _a++) {
                        fk = fks_1[_a];
                        pgForeignKey = new PGForeignKey({
                            columnNames: fk.columnNames,
                            primaryTable: fk.primaryTable,
                            primaryColumns: fk.primaryColumns
                        });
                        pgTable.foreignKeys.push(pgForeignKey);
                    }
                    return [4 /*yield*/, PGSQL.TableIndexesData(connection, table)];
                case 4:
                    indexes = _h.sent();
                    for (_b = 0, indexes_1 = indexes; _b < indexes_1.length; _b++) {
                        index = indexes_1[_b];
                        indexDef = index.indexdef;
                        pgIndex = new PGIndex({
                            columns: indexDef
                                .substring(indexDef.indexOf('(') + 1, indexDef.length - 1)
                                .split(',')
                                .map(function (idx) { return idx.trim(); })
                                .filter(function (idx) { return !!idx; }),
                            isUnique: index.indexdef.includes(' UNIQUE ')
                        });
                        pgTable.indexes.push(pgIndex);
                    }
                    return [2 /*return*/, pgTable];
            }
        });
    }); };
})(exports.PGSQL || (exports.PGSQL = {}));

var PGView = /** @class */ (function () {
    function PGView(instanceData) {
        this.name = '';
        this.definition = '';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGView.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = (instanceData)[key];
            }
        }
    };
    PGView.GetFromDB = function (connection, name) {
        return __awaiter(this, void 0, void 0, function () {
            var definition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.PGSQL.ViewData(connection, name)];
                    case 1:
                        definition = _a.sent();
                        if (!!definition) {
                            return [2 /*return*/, new PGView({ name: name, definition: definition })];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    PGView.prototype.ddlDefinition = function () { return "CREATE OR REPLACE VIEW " + this.name + " AS " + this.definition; };
    PGView.prototype.writeToDB = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!!this.name && !!this.definition) {
                    return [2 /*return*/, exports.PGSQL.Execute(connection, this.ddlDefinition())];
                }
                return [2 /*return*/, null];
            });
        });
    };
    return PGView;
}());

var PGMatView = /** @class */ (function () {
    function PGMatView(instanceData) {
        this.name = '';
        this.definition = '';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGMatView.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    PGMatView.GetFromDB = function (connection, name) {
        return __awaiter(this, void 0, void 0, function () {
            var definition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.PGSQL.ViewsMatData(connection, name)];
                    case 1:
                        definition = _a.sent();
                        if (!!definition) {
                            return [2 /*return*/, new PGMatView({ name: name, definition: definition })];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    PGMatView.prototype.ddlDefinition = function () { return "CREATE MATERIALIZED VIEW " + this.name + " AS " + this.definition; };
    PGMatView.prototype.writeToDB = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!!this.name && !!this.definition)) return [3 /*break*/, 2];
                        return [4 /*yield*/, exports.PGSQL.Execute(connection, this.ddlDefinition())];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    return PGMatView;
}());

var PGFunc = /** @class */ (function () {
    function PGFunc(instanceData) {
        this.name = '';
        this.definition = '';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    PGFunc.prototype.deserialize = function (instanceData) {
        var keys = Object.keys(this);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    };
    PGFunc.GetFromDB = function (connection, name) {
        return __awaiter(this, void 0, void 0, function () {
            var definition;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.PGSQL.ViewData(connection, name)];
                    case 1:
                        definition = _a.sent();
                        if (!!definition) {
                            return [2 /*return*/, new PGFunc({ name: name, definition: definition })];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    PGFunc.prototype.ddlDefinition = function () { return this.definition; };
    PGFunc.prototype.writeToDB = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!!this.name && !!this.definition) {
                    return [2 /*return*/, exports.PGSQL.Execute(connection, this.ddlDefinition())];
                }
                return [2 /*return*/, null];
            });
        });
    };
    return PGFunc;
}());

var PGWhereSearchClause = function (search, params, fields, startWithAnd) {
    if (startWithAnd === void 0) { startWithAnd = true; }
    var where = '';
    var andAdded = false;
    if (!!search && fields.length > 0) {
        var terms = intelliwaketsfoundation.SearchTerms(search);
        for (var _i = 0, terms_1 = terms; _i < terms_1.length; _i++) {
            var term = terms_1[_i];
            if (andAdded || startWithAnd)
                where += 'AND ';
            andAdded = true;
            where += "CONCAT_WS('|'," + fields.join(',') + (") ILIKE " + params.addLike(term) + " ");
        }
    }
    return where;
};

exports.ColumnDefinition = ColumnDefinition;
exports.KeyboardKey = KeyboardKey;
exports.KeyboardLine = KeyboardLine;
exports.MyColumn = MyColumn;
exports.MyForeignKey = MyForeignKey;
exports.MyIndex = MyIndex;
exports.MyTable = MyTable;
exports.PGColumn = PGColumn;
exports.PGEnum = PGEnum;
exports.PGForeignKey = PGForeignKey;
exports.PGFunc = PGFunc;
exports.PGIndex = PGIndex;
exports.PGMatView = PGMatView;
exports.PGParams = PGParams;
exports.PGTable = PGTable;
exports.PGTableMy = PGTableMy;
exports.PGView = PGView;
exports.PGWhereSearchClause = PGWhereSearchClause;
exports.PaginatorApplyRowCount = PaginatorApplyRowCount;
exports.PaginatorInitializeResponseFromRequest = PaginatorInitializeResponseFromRequest;
