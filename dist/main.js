'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var readline = require('readline');
var child_process = require('child_process');
var intelliwaketsfoundation = require('@solidbasisventures/intelliwaketsfoundation');
var path = require('path');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var readline__default = /*#__PURE__*/_interopDefaultLegacy(readline);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const KeyboardLine = (question, validAnswers) => __awaiter(void 0, void 0, void 0, function* () {
    const rl = readline__default['default'].createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(`${question} `, answer => {
        if (!validAnswers || validAnswers.includes(answer)) {
            resolve(answer);
            rl.close();
        }
    }));
});
const KeyboardKey = (question, validKeys) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => {
        if (!!question)
            console.log(question);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        const getData = (key) => {
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
    });
});
const ExecuteScript = (script) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        child_process.exec(script, (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                reject(error);
            }
            else {
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
                resolve(stdout);
            }
        }));
    });
});

const PaginatorResponseFromRequestCount = (paginatorRequest, rowCount) => PaginatorReturnRowCount(PaginatorInitializeResponseFromRequest(paginatorRequest), intelliwaketsfoundation.CleanNumber(rowCount));
const PaginatorInitializeResponseFromRequest = (paginatorRequest) => ({
    page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
    pageCount: 1,
    rowCount: 0,
    countPerPage: paginatorRequest.countPerPage,
    currentOffset: 1,
    rows: []
});
const PaginatorApplyRowCount = (paginatorResponse, rowCount) => {
    console.warn('"PaginatorApplyRowCount" will deprecate for "PaginatorReturnRowCount"');
    paginatorResponse.rowCount = intelliwaketsfoundation.CleanNumber(rowCount);
    if (+rowCount > 0) {
        paginatorResponse.pageCount = Math.floor((intelliwaketsfoundation.CleanNumber(rowCount) + (intelliwaketsfoundation.CleanNumber(paginatorResponse.countPerPage - 1))) / intelliwaketsfoundation.CleanNumber(paginatorResponse.countPerPage));
        if (intelliwaketsfoundation.CleanNumber(paginatorResponse.page) < 1)
            paginatorResponse.page = 1;
        if (intelliwaketsfoundation.CleanNumber(paginatorResponse.page) > intelliwaketsfoundation.CleanNumber(paginatorResponse.pageCount))
            paginatorResponse.page = intelliwaketsfoundation.CleanNumber(paginatorResponse.pageCount);
        paginatorResponse.currentOffset = (+paginatorResponse.page - 1) * +paginatorResponse.countPerPage;
    }
    else {
        paginatorResponse.pageCount = 0;
        paginatorResponse.currentOffset = 0;
        paginatorResponse.page = 1;
    }
};
const PaginatorReturnRowCount = (paginatorResponse, rowCount) => {
    let response = Object.assign({}, paginatorResponse);
    response.rowCount = intelliwaketsfoundation.CleanNumber(rowCount);
    response.page = intelliwaketsfoundation.CleanNumber(response.page);
    if (response.rowCount > 0) {
        response.pageCount = Math.floor((intelliwaketsfoundation.CleanNumber(rowCount) + (intelliwaketsfoundation.CleanNumber(response.countPerPage) - 1)) / intelliwaketsfoundation.CleanNumber(response.countPerPage));
        if (response.page < 1)
            response.page = 1;
        if (response.page > response.pageCount)
            response.page = response.pageCount;
        response.currentOffset = (response.page - 1) * response.countPerPage;
    }
    else {
        response.pageCount = 0;
        response.currentOffset = 0;
        response.page = 1;
    }
    return response;
};

class PGEnum {
    constructor(instanceData) {
        this.enumName = '';
        this.values = [];
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    get columnName() {
        return intelliwaketsfoundation.ToSnakeCase(this.enumName);
    }
    get typeName() {
        return this.enumName;
    }
    static TypeName(columnName) {
        return intelliwaketsfoundation.ToPascalCase(columnName);
    }
    ddlRemove() {
        return `DROP TYPE IF EXISTS ${this.columnName} CASCADE `;
    }
    ddlDefinition() {
        return `CREATE TYPE ${this.columnName} AS ENUM ('${this.values.join('\',\'')}')`;
    }
}

class PGColumn {
    constructor(instanceData) {
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
         * {enum: EDeclaration: default_value} or {enum: EDeclaration.default_value} or {enum: EDeclaration}
         * {interface: IDeclaration} or {interface: IDeclaration.initialDeclaration} */
        this.column_comment = '';
        this.isAutoIncrement = true;
        this.jsType = () => {
            if (typeof this.udt_name !== 'string') {
                return this.udt_name.enumName;
            }
            else if (this.jsonType()) {
                return 'any';
            }
            else if (this.booleanType()) {
                return 'boolean';
            }
            else if (this.integerFloatType()) {
                return 'number';
            }
            else if (this.udt_name === PGColumn.TYPE_POINT) {
                return '[number, number]';
            }
            else if (this.udt_name.startsWith('e_')) {
                return PGEnum.TypeName(this.udt_name);
            }
            else {
                return 'string'; // Date or String or Enum
            }
        };
        this.isArray = () => { var _a, _b, _c, _d, _e, _f; return !!intelliwaketsfoundation.ToArray(this.array_dimensions)[0] || ((_c = (_b = ((_a = this.column_default) !== null && _a !== void 0 ? _a : '')) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.includes('{}')) || ((_f = (_e = ((_d = this.column_default) !== null && _d !== void 0 ? _d : '')) === null || _e === void 0 ? void 0 : _e.toString()) === null || _f === void 0 ? void 0 : _f.includes('[]')); };
        this.isNullable = () => intelliwaketsfoundation.IsOn(this.is_nullable);
        this.enumType = () => {
            return typeof this.udt_name !== 'string';
        };
        this.integerType = () => {
            return (typeof this.udt_name === 'string') && (this.udt_name.toLowerCase().startsWith('int') || [PGColumn.TYPE_SMALLINT, PGColumn.TYPE_INTEGER, PGColumn.TYPE_BIGINT].includes(this.udt_name.toLowerCase()));
        };
        this.floatType = () => {
            return (typeof this.udt_name === 'string') && [PGColumn.TYPE_NUMERIC, PGColumn.TYPE_FLOAT8].includes(this.udt_name.toLowerCase());
        };
        this.integerFloatType = () => {
            return this.integerType() || this.floatType();
        };
        this.booleanType = () => {
            return (typeof this.udt_name === 'string') && [PGColumn.TYPE_BOOLEAN].includes(this.udt_name.toLowerCase());
        };
        this.jsonType = () => {
            return (typeof this.udt_name === 'string') && [PGColumn.TYPE_JSON, PGColumn.TYPE_JSONB].includes(this.udt_name.toLowerCase());
        };
        this.generalStringType = () => {
            return (typeof this.udt_name !== 'string') || [PGColumn.TYPE_VARCHAR].includes(this.udt_name.toLowerCase());
        };
        this.dateType = () => {
            return (typeof this.udt_name === 'string') && [
                PGColumn.TYPE_DATE,
                PGColumn.TYPE_TIME,
                PGColumn.TYPE_TIMETZ,
                PGColumn.TYPE_TIMESTAMP,
                PGColumn.TYPE_TIMESTAMPTZ
            ].includes(this.udt_name.toLowerCase());
        };
        this.dateOnlyType = () => {
            return (typeof this.udt_name === 'string') && [
                PGColumn.TYPE_DATE
            ].includes(this.udt_name.toLowerCase());
        };
        this.timeOnlyType = () => {
            return (typeof this.udt_name === 'string') && [
                PGColumn.TYPE_TIME,
                PGColumn.TYPE_TIMETZ
            ].includes(this.udt_name.toLowerCase());
        };
        this.dateTimeOnlyType = () => {
            return (typeof this.udt_name === 'string') && [
                PGColumn.TYPE_TIMESTAMP,
                PGColumn.TYPE_TIMESTAMPTZ
            ].includes(this.udt_name.toLowerCase());
        };
        this.blobType = () => {
            return (typeof this.udt_name === 'string') && [PGColumn.TYPE_TEXT].includes(this.udt_name.toLowerCase());
        };
        this.otherType = () => {
            return (!this.integerFloatType && !this.booleanType && !this.dateType() && !this.generalStringType() && !this.blobType());
        };
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key) && typeof instanceData !== 'function') {
                this[key] = instanceData[key];
            }
        }
    }
    clean() {
        //		if (this.dateType()) {
        //			if (IsEmpty(this.DATETIME_PRECISION) || this.DATETIME_PRECISION < 3 || this.DATETIME_PRECISION > 6) {
        //				this.DATETIME_PRECISION = 6;
        //			}
        //		}
    }
    ddlDefinition() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let ddl = '"' + this.column_name + '" ';
        ddl += (typeof this.udt_name === 'string') ? this.udt_name : this.udt_name.columnName;
        if (this.array_dimensions.length > 0) {
            ddl += `[${this.array_dimensions
                .map((array_dimension) => (!!array_dimension ? array_dimension.toString() : ''))
                .join('],[')}] `;
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
        if (!intelliwaketsfoundation.IsOn(this.is_nullable)) {
            ddl += 'NOT NULL ';
        }
        if (!!this.generatedAlwaysAs) {
            ddl += `GENERATED ALWAYS AS (${PGColumn.CleanComment(this.generatedAlwaysAs)}) STORED `;
        }
        else {
            if (typeof this.column_default === 'string' && this.column_default.toLowerCase().includes('null')) {
                this.column_default = null;
            }
            if ((this.column_default !== undefined && this.column_default !== null) || this.is_identity || this.isAutoIncrement) {
                if (!(this.dateType() && (!this.column_default || ((_c = this.column_default) !== null && _c !== void 0 ? _c : '').toString().toUpperCase().includes('NULL')))) {
                    if (this.array_dimensions.length > 0) {
                        if (intelliwaketsfoundation.IsOn(this.is_nullable)) {
                            ddl += `DEFAULT ${(_d = this.column_default) !== null && _d !== void 0 ? _d : 'NULL'} `;
                        }
                        else {
                            ddl += `DEFAULT ${(_e = this.column_default) !== null && _e !== void 0 ? _e : ((typeof this.udt_name === 'string') ? '\'{}\'' : (_f = this.udt_name.defaultValue) !== null && _f !== void 0 ? _f : '\'{}')} `;
                        }
                    }
                    else {
                        if (!this.blobType()) {
                            if (intelliwaketsfoundation.IsOn(this.is_identity)) {
                                if (this.isAutoIncrement) {
                                    if (!!this.identity_generation) {
                                        ddl += `GENERATED ${this.identity_generation} AS IDENTITY `;
                                    }
                                    else {
                                        ddl += `GENERATED BY DEFAULT AS IDENTITY `;
                                    }
                                }
                            }
                            else if (this.booleanType()) {
                                if (intelliwaketsfoundation.IsOn(this.is_nullable) || this.column_default === null) {
                                    ddl += `DEFAULT NULL `;
                                }
                                else {
                                    ddl += `DEFAULT ${intelliwaketsfoundation.IsOn(this.column_default) ? 'true' : 'false'} `;
                                }
                            }
                            else if (!this.column_default && (typeof this.udt_name !== 'string') && !!this.udt_name.defaultValue) {
                                ddl += `DEFAULT '${this.udt_name.defaultValue}' `;
                            }
                            else {
                                if (!!this.column_default) {
                                    if (this.integerFloatType() || this.dateType() || ((_g = this.column_default) !== null && _g !== void 0 ? _g : '').toString().includes('::') || ((_h = this.column_default) !== null && _h !== void 0 ? _h : '').toString().includes('()')) {
                                        ddl += `DEFAULT ${this.column_default} `;
                                    }
                                    else {
                                        ddl += `DEFAULT '${this.column_default}' `;
                                    }
                                }
                                else if (intelliwaketsfoundation.IsOn(this.is_nullable)) {
                                    ddl += `DEFAULT NULL `;
                                }
                                else {
                                    if (this.integerFloatType()) {
                                        ddl += `DEFAULT 0 `;
                                    }
                                    else if (this.dateType()) {
                                        ddl += `DEFAULT now() `;
                                        // if (!!this.datetime_precision) {
                                        // 	ddl += `(${this.datetime_precision} `;
                                        // } else {
                                        // 	ddl += ` `;
                                        // }
                                    }
                                    else {
                                        ddl += `DEFAULT '' `;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!!this.check) {
                ddl += `CHECK (${this.check}) `;
            }
            else if (this.checkStringValues.length > 0) {
                ddl += `CHECK (${intelliwaketsfoundation.IsOn(this.is_nullable) ? this.column_name + ' IS NULL OR ' : ''}${this.column_name} IN ('${this.checkStringValues.join('\', \'')}')) `;
            }
        }
        return ddl.trim();
    }
    static CleanComment(comment) {
        if (!comment) {
            return comment;
        }
        return comment.replace(/[\n\r]/g, ' ');
    }
}
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

class ColumnDefinition {
    constructor() {
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
        this.jsType = () => {
            if (this.booleanType()) {
                return 'boolean';
            }
            else if (this.integerFloatType()) {
                return 'number';
            }
            else if (this.booleanType()) {
                return 'boolean';
            }
            else {
                return 'string'; // Date or String
            }
        };
        this.integerType = () => {
            return [ColumnDefinition.TYPE_TINYINT, ColumnDefinition.TYPE_SMALLINT, ColumnDefinition.TYPE_MEDIUMINT, ColumnDefinition.TYPE_INT, ColumnDefinition.TYPE_BIGINT, ColumnDefinition.TYPE_BIT, ColumnDefinition.TYPE_YEAR].includes(this.DATA_TYPE.toUpperCase());
        };
        this.tinyintType = () => {
            return [ColumnDefinition.TYPE_TINYINT].includes(this.DATA_TYPE.toUpperCase());
        };
        this.floatType = () => {
            return [ColumnDefinition.TYPE_DECIMAL, ColumnDefinition.TYPE_NUMERIC, ColumnDefinition.TYPE_FLOAT, ColumnDefinition.TYPE_DOUBLE].includes(this.DATA_TYPE.toUpperCase());
        };
        this.integerFloatType = () => {
            return this.integerType() || this.floatType();
        };
        this.booleanType = () => {
            return [ColumnDefinition.TYPE_BIT].includes(this.DATA_TYPE.toUpperCase());
        };
        this.dateType = () => {
            return [ColumnDefinition.TYPE_DATE, ColumnDefinition.TYPE_TIME, ColumnDefinition.TYPE_DATETIME, ColumnDefinition.TYPE_TIMESTAMP].includes(this.DATA_TYPE.toUpperCase());
        };
        this.generalStringType = () => {
            return !this.integerFloatType() && !this.booleanType();
        };
        this.blobType = () => {
            return [ColumnDefinition.TYPE_TINYTEXT, ColumnDefinition.TYPE_TEXT, ColumnDefinition.TYPE_MEDIUMTEXT, ColumnDefinition.TYPE_LONGTEXT, ColumnDefinition.TYPE_TINYBLOB, ColumnDefinition.TYPE_BLOB, ColumnDefinition.TYPE_MEDIUMBLOB, ColumnDefinition.TYPE_LONGBLOB].includes(this.DATA_TYPE.toUpperCase());
        };
        this.otherType = () => {
            return [ColumnDefinition.TYPE_GEOMETRY, ColumnDefinition.TYPE_POINT, ColumnDefinition.TYPE_LINESTRING, ColumnDefinition.TYPE_POLYGON, ColumnDefinition.TYPE_GEOMETRYCOLLECTION, ColumnDefinition.TYPE_MULTILINESTRING, ColumnDefinition.TYPE_MULTIPOINT, ColumnDefinition.TYPE_MULTIPOLYGON].includes(this.DATA_TYPE.toUpperCase());
        };
    }
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

class PGForeignKey {
    constructor(instanceData) {
        this.columnNames = [];
        this.primaryTable = '';
        this.primaryColumns = [];
        this.onDelete = 'RESTRICT';
        this.onUpdate = 'RESTRICT';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    fkName(pgTable) {
        return pgTable.name + '_' + this.columnNames.map(column => column.substr(-25)).join('_') + '_fkey';
    }
    ddlConstraintDefinition(pgTable) {
        return `
		DO $$
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${this.fkName(pgTable)}') THEN
				ALTER TABLE "${pgTable.name}"
					ADD CONSTRAINT "${this.fkName(pgTable)}"
					FOREIGN KEY ("${this.columnNames.join('","')}") REFERENCES "${this.primaryTable}"("${this.primaryColumns.join('","')}") DEFERRABLE INITIALLY DEFERRED;
			END IF;
		END;
		$$;`; // was INITIALLY IMMEDIATE
    }
}

class PGIndex {
    constructor(instanceData) {
        this.columns = [];
        this.whereCondition = null;
        this.isUnique = false;
        this.concurrently = false;
        this.using = 'BTREE';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    name(pgTable) {
        return ('idx_' +
            pgTable.name.substr(-25) +
            '_' +
            this.columns
                .map((column) => column
                .replace(' ASC', '')
                .replace(' DESC', '')
                .replace(' NULLS', '')
                .replace(' FIRST', '')
                .replace(' LAST', '')
                .replace('(', '_')
                .replace(')', '_')
                .trim().substr(-25))
                .join('_'));
    }
    ddlDefinition(pgTable) {
        let ddl = 'CREATE ';
        if (this.isUnique) {
            ddl += 'UNIQUE ';
        }
        ddl += 'INDEX IF NOT EXISTS ';
        ddl += `"${this.name(pgTable)}" `;
        ddl += 'ON ';
        ddl += `"${pgTable.name}" `;
        ddl += 'USING btree ';
        ddl += '(' + this.columns.join(',') + ')';
        if (this.whereCondition) {
            ddl += ' WHERE ' + this.whereCondition;
        }
        ddl += ';';
        return ddl;
    }
}

const TS_EOL$1 = '\n'; // was \r\n
const initialFixedWidthMapOptions = {
    startPosition: 0
};
class PGTable {
    constructor(instanceData) {
        this.name = '';
        this.description = '';
        this.check = null;
        this.inherits = [];
        this.columns = [];
        this.indexes = [];
        this.foreignKeys = [];
        this.importWithTypes = false;
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                switch (key) {
                    case 'columns':
                        for (const column of instanceData[key]) {
                            this[key].push(new PGColumn(column));
                        }
                        break;
                    case 'indexes':
                        for (const index of instanceData[key]) {
                            this[key].push(new PGIndex(index));
                        }
                        break;
                    case 'foreignKeys':
                        for (const foreignKey of instanceData[key]) {
                            this[key].push(new PGForeignKey(foreignKey));
                        }
                        break;
                    default:
                        this[key] = instanceData[key];
                        break;
                }
            }
        }
    }
    indexOfColumn(columnName) {
        return this.columns.findIndex((column) => column.column_name === columnName);
    }
    indexesOfForeignKeyByColumn(columnName) {
        let indexes = [];
        for (let i = 0; i < this.foreignKeys.length; i++) {
            if (this.foreignKeys[i].columnNames.includes(columnName)) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    getForeignKeysByColumn(columnName) {
        let fks = [];
        const indexes = this.indexesOfForeignKeyByColumn(columnName);
        for (const index of indexes) {
            fks.push(this.foreignKeys[index]);
        }
        return fks;
    }
    removeForeignKeysByColumn(columnName) {
        this.foreignKeys = this.foreignKeys.filter((foreignKey) => !foreignKey.columnNames.includes(columnName));
    }
    renameForeignKeysByColumn(fromName, toName, pgTables) {
        const thisObject = this;
        this.foreignKeys.forEach(fk => {
            if (fk.columnNames.includes(fromName)) {
                fk.columnNames = [...fk.columnNames.filter(cN => cN !== fromName), toName];
            }
        });
        if (pgTables) {
            pgTables.filter(pgTable => pgTable.name !== thisObject.name).forEach(pgTable => {
                pgTable.foreignKeys.forEach(fk => {
                    if (fk.primaryTable === thisObject.name) {
                        if (fk.primaryColumns.includes(fromName)) {
                            fk.primaryColumns = [...fk.primaryColumns.filter(pC => pC !== fromName), toName];
                        }
                    }
                });
            });
        }
    }
    removeIndexsByColumn(columnName) {
        this.indexes = this.indexes.filter((index) => !index.columns.includes(columnName));
    }
    renameIndexsByColumn(fromName, toName) {
        this.indexes.forEach(idx => {
            if (idx.columns.includes(fromName)) {
                idx.columns = [...idx.columns.filter(cN => cN !== fromName), toName];
            }
        });
    }
    addForeignKey(pgForeignKey) {
        this.foreignKeys.push(pgForeignKey);
    }
    getColumn(columnName) {
        var _a;
        return (_a = this.columns.find((column) => column.column_name === columnName)) !== null && _a !== void 0 ? _a : null;
    }
    removeColumn(columnName) {
        const column = this.getColumn(columnName);
        if (!!column) {
            this.removeForeignKeysByColumn(columnName);
            this.removeIndexsByColumn(columnName);
            this.columns = this.columns.filter((column) => column.column_name !== columnName);
            this.reOrderColumns();
        }
    }
    renameColumn(fromName, toName, pgTables) {
        const column = this.getColumn(fromName);
        if (!!column) {
            column.column_name = toName;
            this.renameForeignKeysByColumn(fromName, toName, pgTables);
            this.renameIndexsByColumn(fromName, toName);
        }
    }
    addColumn(pgColumn) {
        const pgColumnToAdd = new PGColumn(pgColumn);
        if (!pgColumnToAdd.ordinal_position) {
            pgColumnToAdd.ordinal_position = 999999;
        }
        this.columns = this.columns.filter((column) => column.column_name !== pgColumnToAdd.column_name);
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].ordinal_position >= pgColumnToAdd.ordinal_position) {
                this.columns[i].ordinal_position++;
            }
        }
        this.columns.push(pgColumnToAdd);
        this.reOrderColumns();
    }
    reOrderColumns() {
        this.columns = this.columns.sort((a, b) => a.ordinal_position - b.ordinal_position);
        let position = 0;
        for (let i = 0; i < this.columns.length; i++) {
            position++;
            this.columns[i].ordinal_position = position;
        }
    }
    addIndex(pgIndex) {
        this.indexes.push(pgIndex);
    }
    tableHeaderText(forTableText, modifyStatement = 'DO NOT MODIFY') {
        let text = '/**' + TS_EOL$1;
        text += ' * Automatically generated: ' + intelliwaketsfoundation.YYYY_MM_DD_HH_mm_ss('now') + TS_EOL$1;
        text += ' * © ' + (new Date()).getFullYear() + ', Solid Basis Ventures, LLC.' + TS_EOL$1; // Must come after generated date so it doesn't keep regenerating
        text += ` * ${modifyStatement}` + TS_EOL$1;
        text += ' *' + TS_EOL$1;
        text += ' * ' + forTableText + ': ' + this.name + TS_EOL$1;
        if (!!this.description) {
            text += ' *' + TS_EOL$1;
            text += ' * ' + PGTable.CleanComment(this.description) + TS_EOL$1;
        }
        text += ' */' + TS_EOL$1;
        text += TS_EOL$1;
        return text;
    }
    /**
     * Generates type definitions for a table.
     *
     * @param options
     */
    tsText(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        let text = this.tableHeaderText('Table Manager for');
        if (options === null || options === void 0 ? void 0 : options.includeConstaint) {
            text += `import type {TObjectConstraint} from '@solidbasisventures/intelliwaketsfoundation'${TS_EOL$1}`;
        }
        if (this.inherits.length > 0) {
            for (const inherit of this.inherits) {
                if (this.importWithTypes) {
                    text += `import type {I${inherit}} from './I${inherit}'${TS_EOL$1}`;
                    text += `import {initial_${inherit}} from './I${inherit}'${TS_EOL$1}`;
                }
                else {
                    text += `import {I${inherit}, initial_${inherit}} from './I${inherit}'${TS_EOL$1}`;
                }
            }
        }
        const enums = Array.from(new Set([
            ...this.columns
                .map((column) => ({
                column_name: column.column_name,
                enum_name: (typeof column.udt_name !== 'string' ? column.udt_name.enumName : '')
            })),
            ...this.columns
                .map((column) => ({
                column_name: column.column_name,
                enum_name: (typeof column.udt_name === 'string' && column.udt_name.startsWith('e_') ? PGEnum.TypeName(column.udt_name) : '')
            })),
            ...this.columns
                .map(column => {
                var _a, _b, _c, _d, _e, _f;
                const regExp = /{([^}]*)}/;
                const results = regExp.exec(column.column_comment);
                if (!!results && !!results[1]) {
                    const commaItems = results[1].split(',');
                    for (const commaItem of commaItems) {
                        const items = commaItem.split(':');
                        if (((_a = items[0]) !== null && _a !== void 0 ? _a : '').toLowerCase().trim() === 'enum') {
                            const enumName = (_c = (_b = items[1]) === null || _b === void 0 ? void 0 : _b.split('.')[0]) === null || _c === void 0 ? void 0 : _c.trim();
                            let enumDefault = (_f = (_e = intelliwaketsfoundation.CoalesceFalsey((_d = items[1]) === null || _d === void 0 ? void 0 : _d.split('.')[1], items[2], column.column_default)) === null || _e === void 0 ? void 0 : _e.toString()) === null || _f === void 0 ? void 0 : _f.trim();
                            if (enumDefault === null || enumDefault === void 0 ? void 0 : enumDefault.startsWith('\'{}\'')) {
                                enumDefault = '[]';
                            }
                            // console.info(column.column_name, enumName, enumDefault)
                            if (!enumName) {
                                throw new Error('Enum requested in comment, but not specified  - Format {Enum: ETest} for nullable or {Enum: ETest.FirstValue}');
                            }
                            if (!intelliwaketsfoundation.IsOn(column.is_nullable) && !enumDefault && !column.array_dimensions.length) {
                                throw new Error('Not Nullable Enum requested in comment, but no default value specified - Format {Enum: ETest.FirstValue}');
                            }
                            return {
                                column_name: column.column_name,
                                enum_name: enumName,
                                default_value: column.array_dimensions.length > 0 ?
                                    (intelliwaketsfoundation.IsOn(column.is_nullable) ? 'null' : enumDefault !== null && enumDefault !== void 0 ? enumDefault : '[]') :
                                    (!enumDefault ? 'null' : `${enumName}.${enumDefault}`)
                            };
                        }
                    }
                }
                return { column_name: column.column_name, enum_name: '' };
            })
        ]
            .filter(enumName => !!enumName.enum_name)));
        const interfaces = Array.from(new Set([
            ...this.columns
                .map(column => {
                var _a, _b, _c, _d, _e, _f, _g;
                const regExp = /{([^}]*)}/;
                const results = regExp.exec(column.column_comment);
                if (!!results && !!results[1]) {
                    const commaItems = results[1].split(',');
                    for (const commaItem of commaItems) {
                        const items = commaItem.split(':');
                        if (((_a = items[0]) !== null && _a !== void 0 ? _a : '').toLowerCase().trim() === 'interface') {
                            const interfaceName = (_c = (_b = items[1]) === null || _b === void 0 ? void 0 : _b.split('.')[0]) === null || _c === void 0 ? void 0 : _c.trim();
                            let interfaceDefault = (_g = ((_f = (_e = intelliwaketsfoundation.CoalesceFalsey((_d = items[1]) === null || _d === void 0 ? void 0 : _d.split('.')[1], items[2], column.column_default)) === null || _e === void 0 ? void 0 : _e.toString()) === null || _f === void 0 ? void 0 : _f.trim())) !== null && _g !== void 0 ? _g : (intelliwaketsfoundation.IsOn(column.is_nullable) ? 'null' : '{}');
                            if (!interfaceName) {
                                throw new Error('Interface requested in comment, but not specified  - Format {Interface: ITest} for nullable or {Interface: ITest.initialValue}');
                            }
                            return {
                                column_name: column.column_name,
                                interface_name: interfaceName,
                                otherImportItem: interfaceDefault,
                                default_value: column.array_dimensions.length > 0 ?
                                    (intelliwaketsfoundation.IsOn(column.is_nullable) ? 'null' : interfaceDefault !== null && interfaceDefault !== void 0 ? interfaceDefault : '[]') :
                                    interfaceDefault
                            };
                        }
                    }
                }
                return { column_name: column.column_name, interface_name: '' };
            })
        ]
            .filter(enumName => !!enumName.interface_name)));
        const types = Array.from(new Set([
            ...this.columns
                .map(column => {
                var _a, _b, _c;
                const regExp = /{([^}]*)}/;
                const results = regExp.exec(column.column_comment);
                if (!!results && !!results[1]) {
                    const commaItems = results[1].split(',');
                    for (const commaItem of commaItems) {
                        const items = commaItem.split(':');
                        if (((_a = items[0]) !== null && _a !== void 0 ? _a : '').toLowerCase().trim() === 'type') {
                            const typeName = (_c = (_b = items[1]) === null || _b === void 0 ? void 0 : _b.split('.')[0]) === null || _c === void 0 ? void 0 : _c.trim();
                            if (!typeName) {
                                throw new Error('Type requested in comment, but not specified  - Format {type: TTest}');
                            }
                            return {
                                column_name: column.column_name,
                                type_name: typeName
                            };
                        }
                    }
                }
                return { column_name: column.column_name, type_name: '' };
            })
        ]
            .filter(enumName => !!enumName.type_name)));
        enums.map(enumItem => enumItem.enum_name).reduce((results, enumItem) => results.includes(enumItem) ? results : [...results, intelliwaketsfoundation.ReplaceAll('[]', '', enumItem)], [])
            .forEach(enumItem => {
            text += `import ${(this.importWithTypes &&
                !this.columns.some(column => {
                    var _a, _b, _c, _d;
                    return intelliwaketsfoundation.ReplaceAll(' ', '', (_a = column.column_comment) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(`{enum:${enumItem.toLowerCase()}`) &&
                        (intelliwaketsfoundation.ReplaceAll(' ', '', (_b = column.column_comment) !== null && _b !== void 0 ? _b : '').toLowerCase().includes(`{enum:${enumItem.toLowerCase()}.`) ||
                            (!!column.column_default &&
                                !((_c = column.column_default) !== null && _c !== void 0 ? _c : '').toString().includes('{}') &&
                                ((_d = column.column_default) !== null && _d !== void 0 ? _d : '').toString().toLowerCase() !== 'null'));
                })) ?
                'type ' : ''}{${enumItem}} from "../Enums/${enumItem}"${TS_EOL$1}`;
        });
        if (enums.length > 0) {
            text += TS_EOL$1;
        }
        interfaces.map(interfaceItem => interfaceItem).reduce((results, interfaceItem) => results.some(result => result.interface_name === interfaceItem.interface_name && (!!result.otherImportItem || !interfaceItem.otherImportItem)) ? results : [...results.filter(result => result.interface_name !== interfaceItem.interface_name), interfaceItem], [])
            .forEach(interfaceItem => {
            var _a;
            text += `import ${this.importWithTypes ? 'type ' : ''}{${interfaceItem.interface_name}${(!interfaceItem.otherImportItem || ((_a = interfaceItem === null || interfaceItem === void 0 ? void 0 : interfaceItem.otherImportItem) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'null') ? '' : `, ${interfaceItem.otherImportItem}`}} from "../Interfaces/${interfaceItem.interface_name}"${TS_EOL$1}`;
        });
        if (interfaces.length > 0) {
            text += TS_EOL$1;
        }
        types.map(typeItem => typeItem)
            .reduce((results, typeItem) => results.some(result => result.type_name === typeItem.type_name) ?
            results :
            [...results.filter(result => result.type_name !== typeItem.type_name), typeItem], [])
            .forEach(typeItem => {
            text += `import ${this.importWithTypes ? 'type ' : ''}{${typeItem.type_name}} from "../Types/${typeItem.type_name}"${TS_EOL$1}`;
        });
        if (types.length > 0) {
            text += TS_EOL$1;
        }
        text += `export interface I${this.name}`;
        if (this.inherits.length > 0) {
            text += ` extends I${this.inherits.join(', I')}`;
        }
        text += ` {` + TS_EOL$1;
        for (const pgColumn of this.columns) {
            // if (!!pgColumn.column_comment || !!pgColumn.generatedAlwaysAs) {
            if (!!PGTable.CleanComment(pgColumn.column_comment)) {
                text += `\t/** `;
                text += `${PGTable.CleanComment(pgColumn.column_comment)} `;
                text += `*/${TS_EOL$1}`;
            }
            // if (!!pgColumn.generatedAlwaysAs) {
            // 	text += `GENERATED AS: ${PGTable.CleanComment(pgColumn.generatedAlwaysAs)} `
            // }
            // }
            text += '\t';
            text += pgColumn.column_name;
            text += ': ';
            text += intelliwaketsfoundation.ReplaceAll('[]', '', (_d = (_b = (_a = enums.find(enumItem => enumItem.column_name === pgColumn.column_name)) === null || _a === void 0 ? void 0 : _a.enum_name) !== null && _b !== void 0 ? _b : (_c = interfaces.find(interfaceItem => interfaceItem.column_name === pgColumn.column_name)) === null || _c === void 0 ? void 0 : _c.interface_name) !== null && _d !== void 0 ? _d : pgColumn.jsType()).trim();
            if (pgColumn.array_dimensions.length > 0) {
                text += `[${pgColumn.array_dimensions.map(() => '').join('],[')}]`;
            }
            if (intelliwaketsfoundation.IsOn((_e = pgColumn.is_nullable) !== null && _e !== void 0 ? _e : 'YES')) {
                text += ' | null';
            }
            text += TS_EOL$1;
        }
        text += '}' + TS_EOL$1;
        text += TS_EOL$1;
        text += `export const initial_${this.name}: I${this.name} = {` + TS_EOL$1;
        let addComma = false;
        if (this.inherits.length > 0) {
            text += `\t...initial_${this.inherits.join(`,${TS_EOL$1}\t...initial_`)},${TS_EOL$1}`;
        }
        for (const pgColumn of this.columns) {
            if (addComma) {
                text += ',' + TS_EOL$1;
            }
            text += '\t';
            text += pgColumn.column_name;
            text += ': ';
            const itemDefault = (_g = (_f = enums.find(enumItem => enumItem.column_name === pgColumn.column_name)) === null || _f === void 0 ? void 0 : _f.default_value) !== null && _g !== void 0 ? _g : (_h = interfaces.find(interfaceItem => interfaceItem.column_name === pgColumn.column_name)) === null || _h === void 0 ? void 0 : _h.default_value;
            // if (pgColumn.column_name === 'inspect_roles') {
            // 	console.log('Column', pgColumn)
            // 	console.log('ItemDefault', itemDefault)
            // 	console.log('Arry Len', pgColumn.array_dimensions.length)
            // }
            if (!!itemDefault) {
                // console.log('HERE', enums.find(enumItem => enumItem.column_name === pgColumn.column_name))
                // console.log('THERE', pgColumn)
                if (itemDefault.endsWith('.') && intelliwaketsfoundation.IsOn(pgColumn.is_nullable) && !pgColumn.column_default) {
                    text += 'null';
                }
                else {
                    text += itemDefault;
                }
            }
            else if (pgColumn.array_dimensions.length > 0) {
                if (intelliwaketsfoundation.IsOn(pgColumn.is_nullable)) {
                    text += 'null';
                }
                else {
                    text += `[${pgColumn.array_dimensions.map(() => '').join('],[')}]`;
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
                            text += ((_j = pgColumn.column_default) !== null && _j !== void 0 ? _j : '{}').toString().substring(1, ((_k = pgColumn.column_default) !== null && _k !== void 0 ? _k : '').toString().indexOf('::') - 1);
                        }
                        else if (pgColumn.integerFloatType() || pgColumn.dateType()) {
                            text += pgColumn.column_default;
                        }
                        else if (typeof pgColumn.udt_name !== 'string') {
                            text +=
                                '\'' + ((_m = (_l = pgColumn.column_default) !== null && _l !== void 0 ? _l : pgColumn.udt_name.defaultValue) !== null && _m !== void 0 ? _m : '') + '\' as ' + pgColumn.jsType();
                        }
                        else if (!!pgColumn.column_default && pgColumn.column_default.toString().includes('::')) {
                            if (pgColumn.udt_name.startsWith('e_')) {
                                const colDefault = pgColumn.column_default.toString();
                                text += PGEnum.TypeName(pgColumn.udt_name);
                                text += '.';
                                text += colDefault.substr(1, colDefault.indexOf('::') - 2);
                                // text += ' as '
                                // text += PGEnum.TypeName(pgColumn.udt_name)
                            }
                            else {
                                text += '\'' + ((_o = pgColumn.column_default) !== null && _o !== void 0 ? _o : '').toString().substring(1, ((_p = pgColumn.column_default) !== null && _p !== void 0 ? _p : '').toString().indexOf('::') - 1) + '\'';
                            }
                        }
                        else {
                            text += '\'' + ((_q = pgColumn.column_default) !== null && _q !== void 0 ? _q : '') + '\'';
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
        }
        text += TS_EOL$1 + '}' + TS_EOL$1;
        if (options === null || options === void 0 ? void 0 : options.includeConstaint) {
            const constraint = {};
            for (const pgColumn of this.columns) {
                const fieldConstraint = {};
                if (pgColumn.booleanType()) {
                    fieldConstraint.type = 'boolean';
                    if (pgColumn.column_default && !pgColumn.isArray()) {
                        fieldConstraint.default = intelliwaketsfoundation.IsOn(pgColumn.column_default);
                    }
                }
                else if (pgColumn.integerFloatType()) {
                    fieldConstraint.type = 'number';
                    if (pgColumn.numeric_precision) {
                        fieldConstraint.length = intelliwaketsfoundation.CleanNumber(pgColumn.numeric_precision);
                    }
                    if (pgColumn.column_default && !pgColumn.isArray()) {
                        fieldConstraint.default = intelliwaketsfoundation.CleanNumber(pgColumn.column_default);
                    }
                }
                else if (pgColumn.jsonType()) {
                    fieldConstraint.type = 'object';
                }
                else if (pgColumn.dateOnlyType()) {
                    fieldConstraint.type = 'date';
                    if (pgColumn.column_default && !pgColumn.isArray()) {
                        fieldConstraint.default = 'now';
                    }
                }
                else if (pgColumn.dateTimeOnlyType()) {
                    fieldConstraint.type = 'datetime';
                    if (pgColumn.column_default && !pgColumn.isArray()) {
                        fieldConstraint.default = 'now';
                    }
                }
                else if (pgColumn.timeOnlyType()) {
                    fieldConstraint.type = 'time';
                    if (pgColumn.column_default && !pgColumn.isArray()) {
                        fieldConstraint.default = 'now';
                    }
                }
                else {
                    fieldConstraint.type = 'string';
                    if (pgColumn.character_maximum_length) {
                        fieldConstraint.length = pgColumn.character_maximum_length;
                    }
                    if (pgColumn.column_default && !pgColumn.isArray()) {
                        fieldConstraint.default = '';
                    }
                }
                fieldConstraint.nullable = intelliwaketsfoundation.IsOn(pgColumn.is_nullable);
                // if (pgColumn.column_name === 'features')
                // 	console.log(this.name, pgColumn.column_name, pgColumn.array_dimensions, pgColumn.column_default, pgColumn.udt_name)
                if (pgColumn.isArray()) {
                    fieldConstraint.isArray = true;
                    if (!fieldConstraint.nullable) {
                        fieldConstraint.default = [];
                    }
                }
                constraint[pgColumn.column_name] = fieldConstraint;
            }
            text += TS_EOL$1 + `export const Constraint_${this.name}: TObjectConstraint<I${this.name}> = ${JSON.stringify(constraint, undefined, 4)}` + TS_EOL$1;
        }
        return text;
    }
    /*export class Cprogress_report_test extends _CTable<Iprogress_report_test> {
    public readonly table: TTables

    constructor(responseContext: ResponseContext, initialValues?: Partial<Iprogress_report_test>) {
        super(responseContext, initialValues, {...initial_progress_report_test})

        this.table = 'progress_report_test'
    }
}*/
    static TSTables(tables) {
        let text = `export type TTables =`;
        text += TS_EOL$1;
        text += '\t';
        text += tables
            .filter(table => !!table)
            .sort((a, b) => intelliwaketsfoundation.SortCompare(a, b))
            .map(table => `'${table}'`)
            .join(TS_EOL$1 + '\t| ');
        text += TS_EOL$1;
        return text;
    }
    /**
     * Generates the text for a class that manages the table itself.  Must inherit from a local _CTable base class.
     *
     * @param relativePaths
     */
    tsTextTable(relativePaths) {
        var _a, _b, _c, _d, _e;
        const usePaths = {
            initials: intelliwaketsfoundation.RemoveEnding('/', (_a = relativePaths === null || relativePaths === void 0 ? void 0 : relativePaths.initials) !== null && _a !== void 0 ? _a : '@Common/Tables', true),
            tTables: intelliwaketsfoundation.RemoveEnding('/', (_b = relativePaths === null || relativePaths === void 0 ? void 0 : relativePaths.tTables) !== null && _b !== void 0 ? _b : '../Database', true),
            responseContext: intelliwaketsfoundation.RemoveEnding('/', (_c = relativePaths === null || relativePaths === void 0 ? void 0 : relativePaths.responseContext) !== null && _c !== void 0 ? _c : '../MiddleWare/ResponseContext', true),
            responseContextName: (_d = relativePaths === null || relativePaths === void 0 ? void 0 : relativePaths.responseContextName) !== null && _d !== void 0 ? _d : 'responseContext',
            responseContextClass: (_e = relativePaths === null || relativePaths === void 0 ? void 0 : relativePaths.responseContextClass) !== null && _e !== void 0 ? _e : 'ResponseContext',
            includeConstaint: !!(relativePaths === null || relativePaths === void 0 ? void 0 : relativePaths.includeConstaint)
        };
        let text = this.tableHeaderText('Table Class for', 'MODIFICATIONS WILL NOT BE OVERWRITTEN');
        if (this.importWithTypes) {
            text += `import {initial_${this.name}${usePaths.includeConstaint ? `, Constraint_${this.name}` : ''} from '${usePaths.initials}/I${this.name}'` + TS_EOL$1;
            text += `import type {I${this.name}} from '${usePaths.initials}/I${this.name}'` + TS_EOL$1;
        }
        else {
            text += `import {initial_${this.name}, I${this.name}} from '${usePaths.initials}/I${this.name}'` + TS_EOL$1;
        }
        text += `import ${this.importWithTypes ? 'type ' : ''}{TTables} from '${usePaths.tTables}/TTables'` + TS_EOL$1;
        text += `import {_CTable} from './_CTable'` + TS_EOL$1;
        text += `import ${this.importWithTypes ? 'type ' : ''}{${usePaths.responseContextClass}} from '${usePaths.responseContext}'` + TS_EOL$1;
        for (const inherit of this.inherits) {
            text += `import {_C${inherit}} from "./_C${inherit}"` + TS_EOL$1;
        }
        text += TS_EOL$1;
        text += `export class C${this.name} extends _CTable<I${this.name}>`;
        if (this.inherits.length > 0) {
            text += `, C${this.inherits.join(', C')}`;
        }
        text += ` {` + TS_EOL$1;
        text += `\tpublic readonly table: TTables` + TS_EOL$1;
        text += TS_EOL$1;
        text += `\tconstructor(${usePaths.responseContextName}: ${usePaths.responseContextClass}) {` + TS_EOL$1;
        text += `\t\tsuper(${usePaths.responseContextName}, {...initial_${this.name}})` + TS_EOL$1;
        text += TS_EOL$1;
        if (usePaths.includeConstaint) {
            text += `\t\tthis.constraint = 'Constraint_${this.name}'` + TS_EOL$1;
        }
        text += `\t\tthis.table = '${this.name}'` + TS_EOL$1;
        text += `\t}` + TS_EOL$1;
        text += `}` + TS_EOL$1;
        return text;
    }
    ddlPrimaryKey() {
        let found = false;
        let ddl = `PRIMARY KEY ("`;
        for (const column of this.columns) {
            if (intelliwaketsfoundation.IsOn(column.is_identity)) {
                if (found) {
                    ddl += `","`;
                }
                ddl += column.column_name;
                found = true;
            }
        }
        if (found) {
            ddl += `")`;
            return ddl;
        }
        return null;
    }
    ddlCreateTableText(createForeignKeys, createIndexes, dropFirst = true) {
        let ddl = '';
        /** @noinspection SqlResolve */
        if (dropFirst) {
            ddl += `DROP TABLE IF EXISTS ${this.name} CASCADE;` + TS_EOL$1;
        }
        ddl += `CREATE TABLE ${this.name}
				(` + TS_EOL$1;
        let prevColumn = null;
        for (const pgColumn of this.columns) {
            if (prevColumn !== null) {
                ddl += ',' + TS_EOL$1;
            }
            ddl += '\t' + pgColumn.ddlDefinition();
            prevColumn = pgColumn;
        }
        const pk = this.ddlPrimaryKey();
        if (!!pk) {
            ddl += ',' + TS_EOL$1 + '\t' + pk;
        }
        if (!!this.check) {
            const checkItems = (typeof this.check === 'string' ? [this.check] : this.check).filter((item) => !!item);
            for (const checkItem of checkItems) {
                ddl += `,${TS_EOL$1}\tCHECK (${checkItem})`;
            }
        }
        ddl += TS_EOL$1;
        ddl += ')';
        if (this.inherits.length > 0) {
            ddl += TS_EOL$1 + `INHERITS (${this.inherits.join(',')})`;
        }
        ddl += ';';
        if (createIndexes) {
            ddl += this.ddlCreateIndexes();
        }
        if (createForeignKeys) {
            ddl += this.ddlCreateForeignKeysText();
        }
        for (const pgColumn of this.columns.filter(col => !!col.column_comment)) {
            ddl += TS_EOL$1 + `COMMENT ON COLUMN ${this.name}.${pgColumn.column_name} IS '${PGTable.CleanComment(pgColumn.column_comment, false)}';`;
        }
        return ddl;
    }
    ddlCreateIndexes() {
        let ddl = '';
        for (const index of this.indexes) {
            ddl += TS_EOL$1 + index.ddlDefinition(this);
        }
        return ddl;
    }
    ddlCreateForeignKeysText() {
        let ddl = '';
        for (const foreignKey of this.foreignKeys) {
            ddl += foreignKey.ddlConstraintDefinition(this) + TS_EOL$1;
        }
        return ddl;
    }
    static CleanComment(comment, stripBrackets = true) {
        if (!comment) {
            return comment;
        }
        // noinspection RegExpRedundantEscape
        return stripBrackets ? comment.replace(/[\n\r]/g, ' ').replace(/\{(.+?)\}/g, '').trim() : comment.replace(/[\n\r]/g, ' ').trim();
    }
    fixedWidthMap(options) {
        var _a;
        const useOptions = Object.assign(Object.assign({}, initialFixedWidthMapOptions), options);
        let currentPosition = useOptions.startPosition;
        let validColumn = !useOptions.startColumnName;
        let fixedWidthMaps = [];
        for (const column of this.columns) {
            if (useOptions.stopBeforeColumnName && column.column_name.toLowerCase() === useOptions.stopBeforeColumnName.toLowerCase()) {
                break;
            }
            if (!validColumn) {
                if (column.column_name.toLowerCase() === useOptions.startColumnName) {
                    validColumn = true;
                }
            }
            if (validColumn) {
                const colLength = (_a = column.character_maximum_length) !== null && _a !== void 0 ? _a : 0;
                if (!colLength) {
                    console.warn('Could not determine length for FixedWidthMap', column.column_name, column.udt_name);
                }
                fixedWidthMaps.push({
                    column_name: column.column_name,
                    startPosition: currentPosition,
                    positionWidth: colLength
                });
                currentPosition += colLength;
            }
            if (useOptions.lastColumnName && column.column_name.toLowerCase() === useOptions.lastColumnName.toLowerCase()) {
                break;
            }
        }
        return fixedWidthMaps;
    }
}

class PGTableMy extends PGTable {
    constructor(instanceData, myTable) {
        super(instanceData);
        this.myTable = myTable;
    }
}
exports.MyToPG = void 0;
(function (MyToPG) {
    MyToPG.GetPGTable = (myTable) => {
        const pgTable = new PGTableMy();
        pgTable.name = myTable.name.toLowerCase();
        for (const myColumn of myTable.columns) {
            const pgColumn = MyToPG.GetPGColumn(myColumn);
            pgTable.columns.push(pgColumn);
        }
        for (const myForeignKey of myTable.foreignKeys) {
            const pgForeignKey = MyToPG.GetPGForeignKey(myForeignKey);
            pgTable.foreignKeys.push(pgForeignKey);
        }
        for (const myIndex of myTable.indexes) {
            const pgIndex = MyToPG.GetPGIndex(myIndex);
            pgTable.indexes.push(pgIndex);
        }
        pgTable.myTable = myTable;
        return pgTable;
    };
    MyToPG.GetPGColumn = (myColumn) => {
        var _a;
        const pgColumn = new PGColumn();
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
    MyToPG.GetPGForeignKey = (myForeignKey) => {
        const pgForeignKey = new PGForeignKey();
        pgForeignKey.columnNames = myForeignKey.columnNames.map(col => col.toLowerCase());
        pgForeignKey.primaryTable = myForeignKey.primaryTable.toLowerCase();
        pgForeignKey.primaryColumns = myForeignKey.primaryColumns.map(col => col.toLowerCase());
        return pgForeignKey;
    };
    MyToPG.GetPGIndex = (myIndex) => {
        const pgIndex = new PGIndex();
        pgIndex.columns = myIndex.columns.map(col => col.toLowerCase());
        pgIndex.isUnique = myIndex.isUnique;
        pgIndex.whereCondition = myIndex.where;
        return pgIndex;
    };
    MyToPG.UDTNameFromDataType = (columnName) => {
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

class MyColumn extends ColumnDefinition {
    constructor(instanceData) {
        super();
        this.isPK = false;
        this.isAutoIncrement = false;
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    clean() {
        //		if (this.dateType()) {
        //			if (IsEmpty(this.DATETIME_PRECISION) || this.DATETIME_PRECISION < 3 || this.DATETIME_PRECISION > 6) {
        //				this.DATETIME_PRECISION = 6;
        //			}
        //		}
    }
    ddlDefinition(myTable, _prevMyColumn, _altering) {
        var _a;
        let ddl = '`' + this.COLUMN_NAME + '` ';
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
    }
}

class MyForeignKey {
    constructor(instanceData) {
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
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    fkName(myTable, prefix) {
        return prefix + '_' + myTable.name.substr(-25) + '_' + this.columnNames.map(column => column.substr(0, -10)).join('_');
    }
    ddlKeyDefinition(myTable, altering) {
        let ddl = '';
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
    }
    ddlConstraintDefinition(myTable, altering) {
        let ddl = '';
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
    }
}

class MyIndex {
    constructor(instanceData) {
        this.columns = [];
        this.isUnique = false;
        this.using = 'BTREE';
        this.indexName = '';
        this.where = null;
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    name(myTable) {
        return 'idx_' + myTable.name.substr(-25) + '_' + this.columns.map(column => column.substr(0, -25)).join('_');
    }
    // @ts-ignore
    ddlDefinition(myTable, _altering) {
        let ddl = '';
        if (this.isUnique) {
            ddl += 'UNIQUE ';
        }
        ddl += 'KEY ';
        ddl += '`' + this.name(myTable) + '` ';
        ddl += '(`' + this.columns.join('`,`') + '`)';
        return ddl;
    }
}

const TS_EOL = '\r\n';
class MyTable {
    constructor(instanceData) {
        this.name = '';
        this.description = '';
        this.ENGINE = 'InnoDB';
        this.CHARSET = 'utf8mb4';
        this.COLLATE = 'utf8mb4_unicode_ci';
        this.ROW_FORMAT = 'COMPACT';
        this.columns = [];
        this.indexes = [];
        this.foreignKeys = [];
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                switch (key) {
                    case 'columns':
                        for (const column of instanceData[key]) {
                            this[key].push(new MyColumn(column));
                        }
                        break;
                    case 'indexes':
                        for (const index of instanceData[key]) {
                            this[key].push(new MyIndex(index));
                        }
                        break;
                    case 'foreignKeys':
                        for (const foreignKey of instanceData[key]) {
                            this[key].push(new MyForeignKey(foreignKey));
                        }
                        break;
                    default:
                        this[key] = instanceData[key];
                        break;
                }
            }
        }
    }
    indexOfColumn(columnName) {
        return this.columns.findIndex(column => column.COLUMN_NAME === columnName);
    }
    indexesOfForeignKeyByColumn(columnName) {
        let indexes = [];
        for (let i = 0; i < this.foreignKeys.length; i++) {
            if (this.foreignKeys[i].columnNames.includes(columnName)) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    getForeignKeysByColumn(columnName) {
        let fks = [];
        const indexes = this.indexesOfForeignKeyByColumn(columnName);
        for (const index of indexes) {
            fks.push(this.foreignKeys[index]);
        }
        return fks;
    }
    removeForeignKeysByColumn(columnName) {
        this.foreignKeys = this.foreignKeys.filter(foreignKey => !foreignKey.columnNames.includes(columnName));
    }
    addForeignKey(myForeignKey) {
        this.foreignKeys.push(myForeignKey);
    }
    getColumn(columnName) {
        var _a;
        return (_a = this.columns.find(column => column.COLUMN_NAME === columnName)) !== null && _a !== void 0 ? _a : null;
    }
    removeColumn(columnName) {
        const column = this.getColumn(columnName);
        if (!!column) {
            this.removeForeignKeysByColumn(columnName);
            this.columns.filter(column => column.COLUMN_NAME !== columnName);
            this.reOrderColumns();
        }
    }
    addColumn(myColumn) {
        if (!myColumn.ORDINAL_POSITION) {
            myColumn.ORDINAL_POSITION = 999999;
        }
        this.columns = this.columns.filter(column => column.COLUMN_NAME !== myColumn.COLUMN_NAME);
        for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].ORDINAL_POSITION >= myColumn.ORDINAL_POSITION) {
                this.columns[i].ORDINAL_POSITION++;
            }
        }
        this.columns.push(myColumn);
        this.reOrderColumns();
    }
    reOrderColumns() {
        this.columns = this.columns.sort((a, b) => a.ORDINAL_POSITION - b.ORDINAL_POSITION);
        let position = 0;
        for (let i = 0; i < this.columns.length; i++) {
            position++;
            this.columns[i].ORDINAL_POSITION = position;
        }
    }
    addIndex(myIndex) {
        this.indexes.push(myIndex);
    }
    tableHeaderText(forTableText) {
        let text = '/**' + TS_EOL;
        text += ' * Automatically generated: ' + intelliwaketsfoundation.YYYY_MM_DD_HH_mm_ss('now') + TS_EOL;
        text += ' * © ' + (new Date()).getFullYear() + ', Solid Basis Ventures, LLC.' + TS_EOL; // Must come after generated date so it doesn't keep regenerating
        text += ' * DO NOT MODIFY' + TS_EOL;
        text += ' *' + TS_EOL;
        text += ' * ' + forTableText + ': ' + this.name + TS_EOL;
        if (!!this.description) {
            text += ' *' + TS_EOL;
            text += ' * ' + MyTable.CleanComment(this.description) + TS_EOL;
        }
        text += ' */' + TS_EOL;
        text += TS_EOL;
        return text;
    }
    tsText() {
        var _a;
        let text = this.tableHeaderText('Table Manager for');
        text += `export interface I${this.name} {` + TS_EOL;
        let addComma = false;
        let addComment = '';
        for (const myColumn of this.columns) {
            if (addComma) {
                text += ',' + addComment + TS_EOL;
            }
            text += '\t';
            text += myColumn.COLUMN_NAME;
            text += ': ';
            text += myColumn.jsType();
            if (intelliwaketsfoundation.IsOn((_a = myColumn.IS_NULLABLE) !== null && _a !== void 0 ? _a : 'YES')) {
                text += ' | null';
            }
            if (!!myColumn.COLUMN_COMMENT) {
                addComment = ' // ' + MyTable.CleanComment(myColumn.COLUMN_COMMENT);
            }
            else {
                addComment = '';
            }
            addComma = true;
        }
        text += addComment + TS_EOL;
        text += '}' + TS_EOL;
        text += TS_EOL;
        text += `export const initial_${this.name}: I${this.name} = {` + TS_EOL;
        addComma = false;
        addComment = '';
        for (const myColumn of this.columns) {
            if (addComma) {
                text += ',' + TS_EOL;
            }
            text += '\t';
            text += myColumn.COLUMN_NAME;
            text += ': ';
            if (!myColumn.blobType()) {
                if (myColumn.isAutoIncrement || myColumn.EXTRA === 'auto_increment') {
                    text += '0';
                }
                else if (!!myColumn.COLUMN_DEFAULT) {
                    if (myColumn.booleanType()) {
                        text += (intelliwaketsfoundation.IsOn(myColumn.COLUMN_DEFAULT) ? 'true' : 'false');
                    }
                    else if (myColumn.dateType()) {
                        text += '\'\'';
                    }
                    else if (myColumn.integerFloatType() || myColumn.dateType()) {
                        text += myColumn.COLUMN_DEFAULT;
                    }
                    else {
                        text += '\'' + myColumn.COLUMN_DEFAULT + '\'';
                    }
                }
                else if (intelliwaketsfoundation.IsOn(myColumn.IS_NULLABLE)) {
                    text += 'null';
                }
                else {
                    if (myColumn.booleanType()) {
                        text += 'true';
                    }
                    else if (myColumn.integerFloatType()) {
                        text += '0';
                    }
                    else if (myColumn.dateType()) {
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
            addComma = true;
        }
        text += addComment + TS_EOL;
        text += '};' + TS_EOL;
        return text;
    }
    tsTextTable() {
        let text = this.tableHeaderText('Table Class for');
        text += `import {initial_${this.name}, I${this.name}} from "../../../app/src/Common/Tables/${this.name}";` + TS_EOL;
        text += `import {TTables} from "../Database/Tables";` + TS_EOL;
        text += `import {TConnection} from "../Database/mysqlConnection";` + TS_EOL;
        text += `import {_Table} from "./_Table";` + TS_EOL;
        text += TS_EOL;
        text += `export class C${this.name} extends _CTable<I${this.name}> {` + TS_EOL;
        text += `\tpublic readonly table: TTables;` + TS_EOL;
        text += TS_EOL;
        text += `\tconstructor(connection: TConnection, initialValues?: I${this.name} | any) {` + TS_EOL;
        text += `\t\tsuper(connection, initialValues, initial_${this.name});` + TS_EOL;
        text += TS_EOL;
        text += `\t\tthis.table = '${this.name}';` + TS_EOL;
        text += `\t}` + TS_EOL;
        text += `}` + TS_EOL;
        return text;
    }
    ddlPrimaryKey(_altering) {
        let found = false;
        let ddl = 'PRIMARY KEY (`';
        for (const column of this.columns) {
            if (column.isPK) {
                if (found) {
                    ddl += '`,`';
                }
                ddl += column.COLUMN_NAME;
                found = true;
            }
        }
        if (found) {
            ddl += '`)';
            return ddl;
        }
        return null;
    }
    ddlText(process, includeFKs, altering = false) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let ddl = '';
            if (!altering) {
                if (altering) {
                    /** @noinspection SqlResolve */
                    ddl += `DROP TABLE ${this.name} CASCADE;` + TS_EOL;
                }
                ddl += `CREATE TABLE ${this.name}
              (` + TS_EOL;
                let prevColumn = null;
                for (const myColumn of this.columns) {
                    if (prevColumn !== null) {
                        ddl += ',' + TS_EOL;
                    }
                    ddl += '\t' + myColumn.ddlDefinition(this, prevColumn, altering);
                    prevColumn = myColumn;
                }
                const pk = this.ddlPrimaryKey(altering);
                if (!!pk) {
                    ddl += ',' + TS_EOL + '\t' + pk;
                }
                for (const index of this.indexes) {
                    ddl += ',' + TS_EOL + '\t' + index.ddlDefinition(this, altering);
                }
                if (includeFKs) {
                    for (const foreignKey of this.foreignKeys) {
                        ddl += ',' + TS_EOL + '\t' + foreignKey.ddlKeyDefinition(this, altering);
                    }
                    for (const foreignKey of this.foreignKeys) {
                        ddl += ',' + TS_EOL + '\t' + foreignKey.ddlConstraintDefinition(this, altering);
                    }
                }
                ddl += TS_EOL;
                ddl += ') ';
                ddl += 'ENGINE=' + ((_a = this.ENGINE) !== null && _a !== void 0 ? _a : 'InnoDB') + ' ';
                ddl += 'DEFAULT CHARSET=' + ((_b = this.CHARSET) !== null && _b !== void 0 ? _b : 'utf8mb4') + ' ';
                ddl += 'COLLATE=' + ((_c = this.COLLATE) !== null && _c !== void 0 ? _c : 'utf8mb4_unicode_ci') + ' ';
                ddl += 'ROW_FORMAT=' + ((_d = this.ROW_FORMAT) !== null && _d !== void 0 ? _d : 'COMPACT');
                ddl += ';';
            }
            else {
                let needsComma = false;
                ddl += `ALTER TABLE ${this.name}` + TS_EOL;
                if (includeFKs) {
                    for (const index of this.indexes) {
                        // if (!await SQL.IndexExists(connection, this.name, index.name(this))) {
                        if (needsComma) {
                            ddl += ',' + TS_EOL;
                        }
                        needsComma = true;
                        ddl += '\t' + index.ddlDefinition(this, altering);
                        // }
                    }
                    for (const foreignKey of this.foreignKeys) {
                        // if (!await SQL.IndexExists(connection, this.name, foreignKey.fkName(this, 'idx'))) {
                        if (needsComma) {
                            ddl += ',' + TS_EOL;
                        }
                        needsComma = true;
                        ddl += '\t' + foreignKey.ddlKeyDefinition(this, altering);
                        // }
                    }
                    for (const foreignKey of this.foreignKeys) {
                        // if (!await SQL.ConstraintExists(connection, this.name, foreignKey.fkName(this, 'fk'))) {
                        if (needsComma) {
                            ddl += ',' + TS_EOL;
                        }
                        needsComma = true;
                        ddl += '\t' + foreignKey.ddlConstraintDefinition(this, altering);
                        // }
                    }
                }
                if (needsComma) {
                    ddl += TS_EOL;
                    ddl += ';';
                    // } else {
                    //     ddl = '';
                }
            }
            return ddl;
        });
    }
    save() {
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].clean();
        }
        MyTable.SetPermissions();
        fs__default['default'].mkdirSync(MyTable.TS_INTERFACE_DIR + '/New/', { recursive: true });
        fs__default['default'].mkdirSync(MyTable.TS_CLASS_DIR + '/New/', { recursive: true });
        MyTable.writeFileIfDifferent(MyTable.DEFINITIONS_DIR + '/' + this.name + '.json', JSON.stringify(this), false);
        MyTable.writeFileIfDifferent(MyTable.TS_INTERFACE_DIR + '/New/I' + this.name + '.ts', this.tsText(), true);
        MyTable.writeFileIfDifferent(MyTable.TS_CLASS_DIR + '/New/C' + this.name + '.ts', this.tsTextTable(), true, true);
    }
    static ExistsNewTS() {
        var _a, _b;
        return (fs__default['default'].existsSync(MyTable.TS_INTERFACE_DIR + '/New') && ((_a = fs__default['default'].readdirSync(MyTable.TS_INTERFACE_DIR + '/New')) !== null && _a !== void 0 ? _a : []).filter(file => file.endsWith('.ts')).length > 0) || (fs__default['default'].existsSync(MyTable.TS_CLASS_DIR + '/New') && ((_b = fs__default['default'].readdirSync(MyTable.TS_CLASS_DIR + '/New')) !== null && _b !== void 0 ? _b : []).filter(file => file.endsWith('.ts')).length > 0);
    }
    moveInNewTS() {
        // Note: this may break the server as it could change the definition of certain files.  Do this AFTER the connections have been closed!
        let fileName = MyTable.TS_INTERFACE_DIR + '/New/I' + this.name + '.ts';
        if (fs__default['default'].existsSync(fileName)) {
            fs__default['default'].renameSync(fileName, fileName.replace('/New/', '/'));
        }
        fileName = MyTable.TS_CLASS_DIR + '/New/C' + this.name + '.ts';
        if (fs__default['default'].existsSync(fileName)) {
            fs__default['default'].renameSync(fileName, fileName.replace('/New/', '/'));
        }
    }
    static writeFileIfDifferent(fileName, data, useSBVCheck, skipIfExists = false) {
        MyTable.SetPermissions();
        if (skipIfExists && (fs__default['default'].existsSync(fileName.replace('/New/', '/')) || fs__default['default'].existsSync(fileName))) {
            return;
        }
        if (useSBVCheck) {
            let newSBVPos = data.indexOf('Solid Basis Ventures');
            if (newSBVPos) {
                if (fs__default['default'].existsSync(fileName.replace('/New/', '/')) && (!fileName.includes('/New/') || !fs__default['default'].existsSync(fileName))) {
                    const originalData = fs__default['default'].readFileSync(fileName.replace('/New/', '/'), 'utf8');
                    const originalSBVPos = originalData.indexOf('Solid Basis Ventures');
                    const originalCheck = originalData.substr(originalSBVPos);
                    const newCheck = data.substr(newSBVPos);
                    if (originalCheck === newCheck) {
                        return true;
                    }
                }
            }
        }
        else {
            if (fs__default['default'].existsSync(fileName)) {
                const originalData = fs__default['default'].readFileSync(fileName, 'utf8');
                if (originalData === data) {
                    return true;
                }
            }
        }
        return fs__default['default'].writeFileSync(fileName, data);
    }
    static writeFileIfNotExists(fileName, data) {
        MyTable.SetPermissions();
        if (!fs__default['default'].existsSync(fileName)) {
            fs__default['default'].writeFileSync(fileName, data);
        }
    }
    syncToDB(includeFKs, altering = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const ddl = yield this.ddlText(true, includeFKs, altering);
            return !!ddl;
        });
    }
    static SaveAll(myTables) {
        for (let i = 0; i < myTables.length; i++) {
            myTables[i].save();
        }
    }
    static Load(fileName) {
        MyTable.SetPermissions();
        let calcFileName = fileName;
        if (!calcFileName.endsWith('.json')) {
            calcFileName += '.json';
        }
        if (!calcFileName.startsWith(MyTable.DEFINITIONS_DIR)) {
            calcFileName = MyTable.DEFINITIONS_DIR + '/' + calcFileName;
        }
        return new MyTable(JSON.parse(fs__default['default'].readFileSync(calcFileName)));
    }
    static LoadAll() {
        MyTable.SetPermissions();
        let files = fs__default['default'].readdirSync(MyTable.DEFINITIONS_DIR);
        let myTables = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                const myTable = MyTable.Load(file);
                if (!!myTable) {
                    myTables.push(myTable);
                }
            }
        }
        return myTables;
    }
    // noinspection JSUnusedLocalSymbols
    static DeleteAll() {
        MyTable.SetPermissions();
        let files = fs__default['default'].readdirSync(MyTable.DEFINITIONS_DIR);
        for (const file of files) {
            if (file.endsWith('.json')) {
                fs__default['default'].unlinkSync(MyTable.DEFINITIONS_DIR + '/' + file);
            }
        }
        files = fs__default['default'].readdirSync(MyTable.TS_INTERFACE_DIR);
        for (const file of files) {
            if (file.endsWith('.json')) {
                fs__default['default'].unlinkSync(MyTable.TS_INTERFACE_DIR + '/' + file);
            }
        }
    }
    // static ArePermissionsSet = false;
    static SetPermissions() {
        // if (!self::ArePermissionsSet) {
        // 	self::ArePermissionsSet = true;
        //
        // 	exec('chmod a+rwx -R ' + MyTable.TS_INTERFACE_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.TABLES_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.TRAITS_DIR);
        // 	exec('chmod a+rwx -R ' + MyTable.DEFINITIONS_DIR);
        // }
    }
    static CleanComment(comment) {
        if (!comment) {
            return comment;
        }
        return comment.replace(/[\n\r]/g, ' ');
    }
}
MyTable.DEFINITIONS_DIR = path__default['default'].resolve('./') + '/src/Assets/Tables';
MyTable.TS_INTERFACE_DIR = path__default['default'].resolve('./') + '/../app/src/Common/Tables';
MyTable.TS_CLASS_DIR = path__default['default'].resolve('./') + '/src/Tables';

exports.MySQL = void 0;
(function (MySQL) {
    MySQL.TableRowCount = (connection, table) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            connection.query(`SELECT COUNT(*) AS count FROM ${table}`, (error, results, _fields) => {
                var _a, _b;
                if (error)
                    throw error;
                resolve((_b = ((_a = (results !== null && results !== void 0 ? results : [])[0]) !== null && _a !== void 0 ? _a : {})['count']) !== null && _b !== void 0 ? _b : 0);
            });
        });
    });
    MySQL.TableExists = (connection, table) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            connection.query(`SELECT COUNT(*) AS count
                      FROM information_schema.tables
                      WHERE TABLE_SCHEMA = '${connection.config.database}'
                        AND TABLE_NAME = '${table}'`, (error, results, _fields) => {
                var _a, _b;
                if (error)
                    throw error;
                resolve(((_b = ((_a = (results !== null && results !== void 0 ? results : [])[0]) !== null && _a !== void 0 ? _a : {})['count']) !== null && _b !== void 0 ? _b : 0) > 0);
            });
        });
    });
    MySQL.Tables = (connection) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            connection.query(`SELECT TABLE_NAME
                      FROM information_schema.tables
                      WHERE TABLE_SCHEMA = '${connection.config.database}'`, (error, results, _fields) => {
                var _a;
                if (error)
                    throw error;
                resolve(((_a = results) !== null && _a !== void 0 ? _a : []).map((result) => result.TABLE_NAME).sort((a, b) => a.localeCompare(b)));
            });
        });
    });
    MySQL.TableColumnExists = (connection, table, column) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            connection.query(`SELECT COUNT(*) AS count
                      FROM information_schema.COLUMNS
                      WHERE TABLE_SCHEMA = '${connection.config.database}'
                        AND TABLE_NAME = '${table}'
                        AND COLUMN_NAME = '${column}'`, (error, results, _fields) => {
                var _a, _b;
                if (error)
                    throw error;
                resolve(((_b = ((_a = (results !== null && results !== void 0 ? results : [])[0]) !== null && _a !== void 0 ? _a : {})['count']) !== null && _b !== void 0 ? _b : 0) > 0);
            });
        });
    });
    MySQL.TableColumns = (connection, table) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            connection.query(`SELECT *
                      FROM information_schema.COLUMNS
                      WHERE TABLE_SCHEMA = '${connection.config.database}'
                        AND TABLE_NAME = '${table}'
                        ORDER BY ORDINAL_POSITION`, (error, results, _fields) => {
                var _a;
                if (error)
                    throw error;
                resolve([...((_a = results) !== null && _a !== void 0 ? _a : [])]);
            });
        });
    });
    MySQL.TableFKs = (connection, table) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            connection.query(`SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME
				FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
				WHERE REFERENCED_TABLE_SCHEMA = '${connection.config.database}'
				  AND TABLE_NAME = '${table}'`, (error, results, _fields) => {
                if (error)
                    throw error;
                let myForeignKeys = [];
                for (const result of results) {
                    const prevFK = myForeignKeys.find(fk => fk.keyName === result.CONSTRAINT_NAME);
                    if (!!prevFK) {
                        prevFK.columnNames = [...prevFK.columnNames, result.COLUMN_NAME];
                        prevFK.primaryColumns = [...prevFK.primaryColumns, result.REFERENCED_COLUMN_NAME];
                    }
                    else {
                        const myForeignKey = new MyForeignKey();
                        myForeignKey.keyName = result.CONSTRAINT_NAME;
                        myForeignKey.columnNames = [result.COLUMN_NAME];
                        myForeignKey.primaryTable = result.REFERENCED_TABLE_NAME;
                        myForeignKey.primaryColumns = [result.REFERENCED_COLUMN_NAME];
                        myForeignKeys.push(myForeignKey);
                    }
                }
                resolve(myForeignKeys);
            });
        });
    });
    MySQL.TableIndexes = (connection, table) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve) => {
            connection.query(`SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
				FROM INFORMATION_SCHEMA.STATISTICS
				WHERE TABLE_SCHEMA = '${connection.config.database}'
					AND TABLE_NAME = '${table}'
				ORDER BY INDEX_NAME`, (error, results, _fields) => {
                if (error)
                    throw error;
                let myIndexes = [];
                for (const result of results) {
                    const prevIndex = myIndexes.find(idx => idx.indexName === result.INDEX_NAME);
                    if (!!prevIndex) {
                        prevIndex.columns = [...prevIndex.columns, result.COLUMN_NAME];
                    }
                    else {
                        const myIndex = new MyIndex();
                        myIndex.indexName = result.INDEX_NAME;
                        myIndex.columns = [result.COLUMN_NAME];
                        myIndex.isUnique = !intelliwaketsfoundation.IsOn(result.NON_UNIQUE);
                        myIndexes.push(myIndex);
                    }
                }
                resolve(myIndexes);
            });
        });
    });
    MySQL.GetMyTable = (connection, table) => __awaiter(this, void 0, void 0, function* () {
        const myTable = new MyTable();
        myTable.name = table;
        const columns = yield MySQL.TableColumns(connection, table);
        for (const column of columns) {
            const myColumn = new MyColumn(column);
            myTable.columns.push(myColumn);
        }
        myTable.foreignKeys = yield MySQL.TableFKs(connection, table);
        myTable.indexes = yield MySQL.TableIndexes(connection, table);
        return myTable;
    });
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

class PGParams {
    constructor() {
        this.lastPosition = 0;
        this.values = [];
    }
    reset() {
        this.lastPosition = 0;
        this.values = [];
    }
    add(value) {
        // const idx = this.values.indexOf(value)
        //
        // if (idx >= 0) {
        // 	return `$${idx + 1}`
        // }
        this.lastPosition++;
        this.values.push(value);
        return `$${this.lastPosition}`;
    }
    addLike(value) {
        return this.add(`%${value}%`);
    }
    addEqualNullable(field, value) {
        if (value === null || value === undefined) {
            return `${field} IS NULL`;
        }
        else {
            return `${field} = ${this.add(value)}`;
        }
    }
    replaceSQLWithValues(sql) {
        let returnSQL = sql;
        for (let i = this.values.length; i > 0; i--) {
            returnSQL = intelliwaketsfoundation.ReplaceAll(`$${i}`, typeof this.values[i - 1] === 'string' ? `'${this.values[i - 1]}'` : this.values[i - 1], returnSQL);
        }
        return returnSQL;
    }
}

// noinspection SqlNoDataSourceInspection
exports.PGSQL = void 0;
(function (PGSQL) {
    PGSQL.SetDBMSAlert = (milliseconds) => {
        if (!milliseconds) {
            delete process.env.DB_MS_ALERT;
        }
        else {
            process.env.DB_MS_ALERT = milliseconds.toString();
        }
    };
    PGSQL.query = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.DB_MS_ALERT) {
                return yield connection.query(sql, values);
            }
            else {
                const start = Date.now();
                const response = yield connection.query(sql, values);
                const ms = Date.now() - start;
                if (ms > intelliwaketsfoundation.CleanNumber(process.env.DB_MS_ALERT)) {
                    console.log('----- Long SQL Query', ms / 1000, 'ms');
                    console.log(sql);
                    console.log(values);
                }
                return response;
            }
        }
        catch (err) {
            console.log('------------ SQL Query');
            console.log(intelliwaketsfoundation.DateFormat('LocalDateTime', 'now', 'America/New_York'));
            console.log(err.message);
            console.log(sql);
            console.log(values);
            throw err;
        }
        // return await new Promise((resolve, reject) => {
        // 	// const stackTrace = new Error().stack
        // 	const res = await connection.query(sql, values)
        // 	connection
        // 		.query(sql, values)
        // 		.then(res => {
        // 			resolve({rows: res.rows, fields: res.fields, rowCount: res.rowCount})
        // 		})
        // 		.catch(err => {
        // 			// console.log('------------ SQL')
        // 			// console.log(sql)
        // 			// console.log(values)
        // 			// console.log(err)
        // 			// console.log(stackTrace)
        // 			// throw 'SQL Error'
        // 			reject(`${err.message}\n${sql}\n${JSON.stringify(values ?? {})}`)
        // 		})
        // })
    });
    PGSQL.timeout = (ms) => __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    });
    // export const PGQueryValuesStream = async <T = any>(
    // 	connection: TConnection,
    // 	sql: string,
    // 	values: any,
    // 	row?: (row: T) => void
    // ): Promise<void> => {
    // 	return new Promise(async (resolve, reject) => {
    // 		let actualRow: (row: T) => void
    // 		let actualValues: any
    //
    // 		if (!!row) {
    // 			actualRow = row
    // 			actualValues = values
    // 		} else {
    // 			actualRow = values
    // 			values = []
    // 		}
    //
    // 		let loadCount = 0
    // 		let processedCount = 0
    //
    // 		const query = new QueryStream(sql, actualValues)
    // 		const stream = connection.query(query)
    // 		stream.on('data', async (row: any) => {
    // 			loadCount++
    // 			let paused = false
    //
    // 			if (loadCount > processedCount + 100) {
    // 				stream.pause()
    // 				paused = true
    // 			}
    // 			await actualRow(row)
    // 			processedCount++
    // 			if (paused) {
    // 				stream.resume()
    // 			}
    // 		})
    // 		stream.on('error', (err: Error) => {
    // 			reject(err)
    // 		})
    // 		stream.on('end', async () => {
    // 			await timeout(100)
    // 			while (processedCount < loadCount) {
    // 				await timeout(100)
    // 			}
    //
    // 			resolve()
    // 		})
    // 	})
    // }
    //
    // export const PGQueryStream = async <T = any>(
    // 	connection: TConnection,
    // 	sql: string,
    // 	row: (row: T) => void
    // ): Promise<void> => PGQueryValuesStream<T>(connection, sql, [], row)
    PGSQL.TableRowCount = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const data = yield PGSQL.query(connection, `SELECT COUNT(*) AS count
											  FROM ${(!!schema ? `${schema}.` : '') + table}`, undefined);
        return (_c = ((_b = ((_a = data.rows) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : {})['count']) !== null && _c !== void 0 ? _c : 0;
    });
    PGSQL.CurrentSchema = (schema) => schema !== null && schema !== void 0 ? schema : 'public';
    PGSQL.TableExists = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        var _d, _e, _f;
        const sql = `SELECT COUNT(*) AS count
					 FROM information_schema.tables
					 WHERE table_schema = '${PGSQL.CurrentSchema(schema)}'
					   AND table_name = '${table}'`;
        const data = yield PGSQL.query(connection, sql, undefined);
        return ((_f = ((_e = ((_d = data.rows) !== null && _d !== void 0 ? _d : [])[0]) !== null && _e !== void 0 ? _e : {})['count']) !== null && _f !== void 0 ? _f : 0) > 0;
    });
    PGSQL.TableColumnExists = (connection, table, column, schema) => __awaiter(this, void 0, void 0, function* () {
        var _g, _h, _j;
        const sql = `SELECT COUNT(*) AS count
					 FROM information_schema.COLUMNS
					 WHERE table_schema = '${PGSQL.CurrentSchema(schema)}'
					   AND table_name = '${table}'
					   AND column_name = '${column}'`;
        const data = yield PGSQL.query(connection, sql, undefined);
        return ((_j = ((_h = ((_g = data.rows) !== null && _g !== void 0 ? _g : [])[0]) !== null && _h !== void 0 ? _h : {})['count']) !== null && _j !== void 0 ? _j : 0) > 0;
    });
    PGSQL.TriggerExists = (connection, trigger, schema) => __awaiter(this, void 0, void 0, function* () {
        var _k, _l, _m;
        const sql = `SELECT COUNT(*) AS count
					 FROM information_schema.triggers
					 WHERE trigger_schema = '${PGSQL.CurrentSchema(schema)}'
					   AND trigger_name = '${trigger}'`;
        const data = yield PGSQL.query(connection, sql, undefined);
        return ((_m = ((_l = ((_k = data.rows) !== null && _k !== void 0 ? _k : [])[0]) !== null && _l !== void 0 ? _l : {})['count']) !== null && _m !== void 0 ? _m : 0) > 0;
    });
    PGSQL.TableResetIncrement = (connection, table, column, toID) => __awaiter(this, void 0, void 0, function* () {
        if (!!toID) {
            return PGSQL.Execute(connection, `SELECT setval(pg_get_serial_sequence('${table}', '${column}'), ${toID});
			`);
        }
        else {
            return PGSQL.Execute(connection, `SELECT SETVAL(PG_GET_SERIAL_SEQUENCE('${table}', '${column}'), MAX(${column}))
				 FROM ${table};
				`);
        }
    });
    PGSQL.ConstraintExists = (connection, constraint, schema) => __awaiter(this, void 0, void 0, function* () {
        var _o, _p, _q;
        const sql = `
			SELECT COUNT(*) AS count
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${PGSQL.CurrentSchema(schema)}'
			  AND constraint_name = '${constraint}'`;
        const data = yield PGSQL.query(connection, sql, undefined);
        return ((_q = ((_p = ((_o = data.rows) !== null && _o !== void 0 ? _o : [])[0]) !== null && _p !== void 0 ? _p : {})['count']) !== null && _q !== void 0 ? _q : 0) > 0;
    });
    PGSQL.FKConstraints = (connection, schema) => __awaiter(this, void 0, void 0, function* () {
        const sql = `
			SELECT table_name, constraint_name
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${PGSQL.CurrentSchema(schema)}'
			  AND constraint_type = 'FOREIGN KEY'`;
        return PGSQL.FetchMany(connection, sql);
    });
    PGSQL.Functions = (connection, schema) => __awaiter(this, void 0, void 0, function* () {
        const sql = `
			SELECT routines.routine_name
			FROM information_schema.routines
			WHERE routines.specific_schema = '${PGSQL.CurrentSchema(schema)}'
			  AND routine_type = 'FUNCTION'
			ORDER BY routines.routine_name`;
        return (yield PGSQL.FetchArray(connection, sql)).filter(func => func.startsWith('func_'));
    });
    PGSQL.IndexExists = (connection, tablename, indexName, schema) => __awaiter(this, void 0, void 0, function* () {
        var _r, _s, _t;
        const sql = `SELECT COUNT(*) AS count
					 FROM pg_indexes
					 WHERE schemaname = '${PGSQL.CurrentSchema(schema)}'
					   AND tablename = '${tablename}'
					   AND indexname = '${indexName}'`;
        const data = yield PGSQL.query(connection, sql, undefined);
        return ((_t = ((_s = ((_r = data.rows) !== null && _r !== void 0 ? _r : [])[0]) !== null && _s !== void 0 ? _s : {})['count']) !== null && _t !== void 0 ? _t : 0) > 0;
    });
    PGSQL.GetByID = (connection, table, id) => __awaiter(this, void 0, void 0, function* () {
        var _u, _v;
        if (!id) {
            return Promise.resolve(null);
        }
        else {
            // noinspection SqlResolve
            const sql = `SELECT *
						 FROM ${table}
						 WHERE id = $1`;
            const data = yield PGSQL.query(connection, sql, [id]);
            return !!((_u = data.rows) !== null && _u !== void 0 ? _u : [])[0] ? Object.assign({}, ((_v = data.rows) !== null && _v !== void 0 ? _v : [])[0]) : null;
        }
    });
    /**
     * Returns a number from the sql who's only column returned is "count"
     *
     * @param connection
     * @param sql
     * @param values
     * @constructor
     */
    PGSQL.GetCountSQL = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        var _w, _x, _y, _z, _0;
        const data = yield PGSQL.query(connection, sql, values);
        return intelliwaketsfoundation.CleanNumber((_y = ((_x = ((_w = data.rows) !== null && _w !== void 0 ? _w : [])[0]) !== null && _x !== void 0 ? _x : {})['count']) !== null && _y !== void 0 ? _y : ((_0 = ((_z = data.rows) !== null && _z !== void 0 ? _z : [])[0]) !== null && _0 !== void 0 ? _0 : {})[0], 0);
        // return isNaN(value) ? 0 : parseInt(value)
    });
    PGSQL.FetchOne = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        var _1, _2;
        // noinspection SqlResolve
        const data = yield PGSQL.query(connection, sql, values);
        return !!((_1 = data.rows) !== null && _1 !== void 0 ? _1 : [])[0] ? Object.assign({}, ((_2 = data.rows) !== null && _2 !== void 0 ? _2 : [])[0]) : null;
    });
    PGSQL.FetchOneValue = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        var _3, _4;
        return (_4 = Object.values((_3 = (yield PGSQL.FetchOne(connection, sql, values))) !== null && _3 !== void 0 ? _3 : {})[0]) !== null && _4 !== void 0 ? _4 : null;
    });
    PGSQL.FetchMany = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        var _5;
        // noinspection SqlResolve
        const data = yield PGSQL.query(connection, sql, values);
        return (_5 = data.rows) !== null && _5 !== void 0 ? _5 : [];
    });
    PGSQL.FetchArray = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        var _6;
        const data = yield PGSQL.query(connection, sql, values);
        return ((_6 = data.rows) !== null && _6 !== void 0 ? _6 : []).map((row) => row[Object.keys(row)[0]]);
    });
    /**
     * Pass a SQL command with a "SELECT 1 FROM..." and it will check if it exists
     *
     * @param connection
     * @param sql
     * @param values
     * @constructor
     */
    PGSQL.FetchExists = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        var _7, _8;
        // noinspection SqlResolve
        const data = yield PGSQL.query(connection, `SELECT EXISTS (${sql}) as does_exist`, values);
        return !!((_8 = ((_7 = data.rows) !== null && _7 !== void 0 ? _7 : [])[0]) === null || _8 === void 0 ? void 0 : _8.does_exist);
    });
    PGSQL.InsertAndGetReturning = (connection, table, values) => __awaiter(this, void 0, void 0, function* () {
        var _9;
        let newValues = Object.assign({}, values);
        if (!newValues.id) {
            delete newValues.id;
            // delete newValues.added_date;
            // delete newValues.modified_date;
        }
        let params = new PGParams();
        const sql = `
			INSERT INTO ${table}
				("${Object.keys(newValues).join('","')}")
			VALUES (${Object.values(newValues)
            .map(value => params.add(value))
            .join(',')})
			RETURNING *`;
        const results = yield PGSQL.query(connection, sql, params.values);
        return ((_9 = results.rows) !== null && _9 !== void 0 ? _9 : [])[0];
    });
    PGSQL.InsertAndGetID = (connection, table, values) => __awaiter(this, void 0, void 0, function* () {
        var _10;
        let newValues = Object.assign({}, values);
        if (!newValues.id) {
            delete newValues.id;
            // delete newValues.added_date;
            // delete newValues.modified_date;
        }
        let params = new PGParams();
        const sql = `
			INSERT INTO ${table}
				("${Object.keys(newValues).join('","')}")
			VALUES (${Object.values(newValues)
            .map(value => params.add(value))
            .join(',')})
			RETURNING id`;
        const results = yield PGSQL.query(connection, sql, params.values);
        const id = (_10 = results.rows[0]) === null || _10 === void 0 ? void 0 : _10.id;
        if (!id)
            throw new Error('Could not load ID');
        return id;
    });
    PGSQL.InsertBulk = (connection, table, values) => __awaiter(this, void 0, void 0, function* () {
        let params = new PGParams();
        const sql = `
			INSERT INTO ${table}
				("${Object.keys(values).join('","')}")
			VALUES (${Object.values(values)
            .map(value => params.add(value))
            .join(',')})`;
        yield PGSQL.query(connection, sql, params.values);
    });
    PGSQL.UpdateAndGetReturning = (connection, table, whereValues, updateValues) => __awaiter(this, void 0, void 0, function* () {
        let params = new PGParams();
        // noinspection SqlResolve
        const sql = `UPDATE ${table}
					 SET ${PGSQL.BuildSetComponents(updateValues, params)}
					 WHERE ${PGSQL.BuildWhereComponents(whereValues, params)}
					 RETURNING *`;
        const data = yield PGSQL.query(connection, sql, params.values);
        // @ts-ignore
        return data.rows[0];
    });
    PGSQL.BuildWhereComponents = (whereValues, params) => Object.keys(whereValues)
        .map(key => (whereValues[key] === undefined || whereValues[key] === null) ? `"${key}" IS NULL` : `"${key}"=${params.add(whereValues[key])}`)
        .join(' AND ');
    PGSQL.BuildSetComponents = (setValues, params) => Object.keys(setValues)
        .map(key => `"${key}"=${params.add(setValues[key])}`)
        .join(',');
    PGSQL.Save = (connection, table, values) => __awaiter(this, void 0, void 0, function* () {
        if (!values.id) {
            return PGSQL.InsertAndGetReturning(connection, table, values);
        }
        else {
            let whereValues = { id: values.id };
            return PGSQL.UpdateAndGetReturning(connection, table, whereValues, values);
        }
    });
    PGSQL.Delete = (connection, table, whereValues) => __awaiter(this, void 0, void 0, function* () {
        let params = new PGParams();
        // noinspection SqlResolve
        const sql = `DELETE
					 FROM ${table}
					 WHERE ${PGSQL.BuildWhereComponents(whereValues, params)}`;
        yield PGSQL.query(connection, sql, params.values);
    });
    PGSQL.ExecuteRaw = (connection, sql) => __awaiter(this, void 0, void 0, function* () { return PGSQL.Execute(connection, sql); });
    PGSQL.Execute = (connection, sql, values) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.DB_MS_ALERT) {
                return yield connection.query(sql, values);
            }
            else {
                const start = Date.now();
                const response = yield connection.query(sql, values);
                const ms = Date.now() - start;
                if (ms > intelliwaketsfoundation.CleanNumber(process.env.DB_MS_ALERT)) {
                    console.log('----- Long SQL Query', ms / 1000, 'ms');
                    console.log(sql);
                    console.log(values);
                }
                return response;
            }
        }
        catch (err) {
            console.log('------------ SQL Execute');
            console.log(err.message);
            console.log(sql);
            console.log(values);
            throw new Error(err.message);
        }
    });
    PGSQL.TruncateAllTables = (connection, exceptions = [], includeCascade = false) => __awaiter(this, void 0, void 0, function* () {
        let tables = yield PGSQL.TablesArray(connection);
        yield PGSQL.Execute(connection, 'START TRANSACTION');
        yield PGSQL.Execute(connection, 'SET CONSTRAINTS ALL DEFERRED');
        try {
            for (const table of tables) {
                if (exceptions.includes(table)) {
                    yield PGSQL.Execute(connection, `TRUNCATE TABLE ${table} RESTART IDENTITY` + (includeCascade ? ' CASCADE' : ''), undefined);
                }
            }
            yield PGSQL.Execute(connection, 'COMMIT');
        }
        catch (err) {
            yield PGSQL.Execute(connection, 'ROLLBACK');
            return false;
        }
        return true;
    });
    PGSQL.TruncateTables = (connection, tables, includeCascade = false) => __awaiter(this, void 0, void 0, function* () {
        for (const table of tables) {
            yield PGSQL.Execute(connection, `TRUNCATE TABLE ${table} RESTART IDENTITY` + (includeCascade ? ' CASCADE' : ''));
        }
    });
    PGSQL.TablesArray = (connection, schema) => __awaiter(this, void 0, void 0, function* () {
        return PGSQL.FetchArray(connection, `
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${PGSQL.CurrentSchema(schema)}'
				  AND table_type = 'BASE TABLE'`);
    });
    PGSQL.ViewsArray = (connection, schema) => __awaiter(this, void 0, void 0, function* () {
        return yield PGSQL.FetchArray(connection, `
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${PGSQL.CurrentSchema(schema)}'
				  AND table_type = 'VIEW'`);
    });
    PGSQL.ViewsMatArray = (connection, schema) => __awaiter(this, void 0, void 0, function* () {
        return yield PGSQL.FetchArray(connection, `
				SELECT matviewname
				FROM pg_matviews
				WHERE schemaname = '${PGSQL.CurrentSchema(schema)}'`);
    });
    PGSQL.TypesArray = (connection) => __awaiter(this, void 0, void 0, function* () {
        return yield PGSQL.FetchArray(connection, `
				SELECT typname
				FROM pg_type
				WHERE typcategory = 'E'
				ORDER BY typname`);
    });
    PGSQL.FunctionsArray = (connection, schema) => __awaiter(this, void 0, void 0, function* () {
        return yield PGSQL.FetchArray(connection, `
				SELECT f.proname
				FROM pg_catalog.pg_proc f
						 INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${PGSQL.CurrentSchema(schema)}'
				  AND f.proname ILIKE 'func_%'`);
    });
    PGSQL.FunctionsOIDArray = (connection, schema) => __awaiter(this, void 0, void 0, function* () {
        return yield PGSQL.FetchArray(connection, `
				SELECT f.oid
				FROM pg_catalog.pg_proc f
						 INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${PGSQL.CurrentSchema(schema)}'
				  AND f.proname ILIKE 'func_%'`);
    });
    PGSQL.ExtensionsArray = (connection) => __awaiter(this, void 0, void 0, function* () {
        return yield PGSQL.FetchArray(connection, `
				SELECT extname
				FROM pg_extension
				WHERE extname != 'plpgsql'`);
    });
    PGSQL.TableData = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        return PGSQL.FetchOne(connection, `
				SELECT *
				FROM information_schema.tables
				WHERE table_schema = '${PGSQL.CurrentSchema(schema)}'
				  AND table_type = 'BASE TABLE'
				  AND table_name = $1`, [table]);
    });
    PGSQL.TableColumnsData = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        return PGSQL.FetchMany(connection, `
				SELECT *
				FROM information_schema.columns
				WHERE table_schema = '${PGSQL.CurrentSchema(schema)}'
				  AND table_name = $1
				ORDER BY ordinal_position`, [table]);
    });
    PGSQL.TableFKsData = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        return PGSQL.FetchMany(connection, `
				SELECT tc.table_schema,
					   tc.constraint_name,
					   tc.table_name,
					   MAX(tc.enforced),
					   JSON_AGG(kcu.column_name) AS "columnNames",
					   MAX(ccu.table_schema)     AS foreign_table_schema,
					   MAX(ccu.table_name)       AS "primaryTable",
					   JSON_AGG(ccu.column_name) AS "primaryColumns"
				FROM information_schema.table_constraints AS tc
						 JOIN information_schema.key_column_usage AS kcu
							  ON tc.constraint_name = kcu.constraint_name
								  AND tc.table_schema = kcu.table_schema
						 JOIN information_schema.constraint_column_usage AS ccu
							  ON ccu.constraint_name = tc.constraint_name
								  AND ccu.table_schema = tc.table_schema
				WHERE tc.table_schema = '${PGSQL.CurrentSchema(schema)}'
				  AND tc.constraint_type = 'FOREIGN KEY'
				  AND tc.table_name = $1
				GROUP BY tc.table_schema,
						 tc.constraint_name,
						 tc.table_name`, [table]);
    });
    PGSQL.TableIndexesData = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        return PGSQL.FetchMany(connection, `
				SELECT *
				FROM pg_indexes
				WHERE schemaname = '${PGSQL.CurrentSchema(schema)}'
				  AND tablename = $1
				  AND (indexname NOT ILIKE '%_pkey'
					OR indexdef ILIKE '%(%,%)%')`, [table]);
    });
    PGSQL.ViewData = (connection, view) => __awaiter(this, void 0, void 0, function* () {
        var _11, _12;
        return ((_12 = (_11 = (yield PGSQL.FetchOne(connection, `
          select pg_get_viewdef($1, true) as viewd`, [view]))) === null || _11 === void 0 ? void 0 : _11.viewd) !== null && _12 !== void 0 ? _12 : null);
    });
    PGSQL.ViewsMatData = (connection, viewMat) => __awaiter(this, void 0, void 0, function* () {
        var _13, _14;
        return ((_14 = (_13 = (yield PGSQL.FetchOne(connection, `
          select pg_get_viewdef($1, true) as viewd`, [viewMat]))) === null || _13 === void 0 ? void 0 : _13.viewd) !== null && _14 !== void 0 ? _14 : null);
    });
    PGSQL.FunctionData = (connection, func) => __awaiter(this, void 0, void 0, function* () {
        var _15, _16;
        return ((_16 = (_15 = (yield PGSQL.FetchOne(connection, `
          select pg_get_functiondef($1) as viewd`, [func]))) === null || _15 === void 0 ? void 0 : _15.viewd) !== null && _16 !== void 0 ? _16 : null);
    });
    PGSQL.TypeData = (connection, type) => __awaiter(this, void 0, void 0, function* () {
        return PGSQL.FetchArray(connection, `
                SELECT unnest(enum_range(NULL::${type}))`);
    });
    PGSQL.SortColumnSort = (sortColumn) => {
        let sort = '';
        if (!!sortColumn.primarySort) {
            sort += 'ORDER BY ';
            if (!sortColumn.primaryAscending) {
                sort += `${AltColumn(sortColumn.primarySort)} DESC`;
            }
            else {
                switch (sortColumn.primaryEmptyToBottom) {
                    case 'string':
                        sort += `NULLIF(${sortColumn.primarySort}, '')`;
                        break;
                    case 'number':
                        sort += `NULLIF(${sortColumn.primarySort}, 0)`;
                        break;
                    default:
                        // null, so do not empty to bottom
                        sort += `${AltColumn(sortColumn.primarySort)}`;
                        break;
                }
            }
            if (!!sortColumn.primaryEmptyToBottom)
                sort += ' NULLS LAST';
            if (!!sortColumn.secondarySort) {
                sort += ', ';
                if (!sortColumn.secondaryAscending) {
                    sort += `${AltColumn(sortColumn.secondarySort)} DESC`;
                }
                else {
                    switch (sortColumn.secondaryEmptyToBottom) {
                        case 'string':
                            sort += `NULLIF(${sortColumn.secondarySort}, '')`;
                            break;
                        case 'number':
                            sort += `NULLIF(${sortColumn.secondarySort}, 0)`;
                            break;
                        default:
                            // null, so do not empty to bottom
                            sort += `${AltColumn(sortColumn.secondarySort)}`;
                            break;
                    }
                }
                if (!!sortColumn.secondaryEmptyToBottom)
                    sort += ' NULLS LAST';
            }
        }
        return sort;
    };
    PGSQL.PaginatorOrderBy = (paginatorRequest) => PGSQL.SortColumnSort(paginatorRequest.sortColumns);
    PGSQL.LimitOffset = (limit, offset) => ` LIMIT ${limit} OFFSET ${offset} `;
    PGSQL.PaginatorLimitOffset = (paginatorResponse) => PGSQL.LimitOffset(paginatorResponse.countPerPage, paginatorResponse.currentOffset);
    const AltColumn = (column) => {
        if (column === 'appointment_date') {
            return `concat_ws(' ', appointment_date, appointment_time)`;
        }
        else {
            return column;
        }
    };
    PGSQL.CalcOffsetFromPage = (page, pageSize, totalRecords) => {
        if (intelliwaketsfoundation.CleanNumber(totalRecords) > 0) {
            const pages = PGSQL.CalcPageCount(pageSize, totalRecords);
            if (intelliwaketsfoundation.CleanNumber(page) < 1) {
                page = 1;
            }
            if (intelliwaketsfoundation.CleanNumber(page) > intelliwaketsfoundation.CleanNumber(pages)) {
                page = pages;
            }
            return (intelliwaketsfoundation.CleanNumber(page) - 1) * intelliwaketsfoundation.CleanNumber(pageSize);
        }
        else {
            // noinspection JSUnusedAssignment
            page = 1;
            return 0;
        }
    };
    PGSQL.CalcPageCount = (pageSize, totalRecords) => {
        if (intelliwaketsfoundation.CleanNumber(totalRecords) > 0) {
            return Math.floor((intelliwaketsfoundation.CleanNumber(totalRecords) + (intelliwaketsfoundation.CleanNumber(pageSize) - 1)) / intelliwaketsfoundation.CleanNumber(pageSize));
        }
        else {
            return 0;
        }
    };
    PGSQL.ResetIDs = (connection) => __awaiter(this, void 0, void 0, function* () {
        let tables = yield PGSQL.TablesArray(connection);
        for (const table of tables) {
            if (yield PGSQL.TableColumnExists(connection, table, 'id')) {
                yield PGSQL.TableResetIncrement(connection, table, 'id');
            }
        }
    });
    PGSQL.GetTypes = (connection) => __awaiter(this, void 0, void 0, function* () {
        const enumItems = yield PGSQL.TypesArray(connection);
        let enums = [];
        for (const enumItem of enumItems) {
            enums.push(new PGEnum({
                enumName: enumItem,
                values: yield PGSQL.TypeData(connection, enumItem),
                defaultValue: undefined
            }));
        }
        return enums;
    });
    PGSQL.TableColumnComments = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        return PGSQL.FetchMany(connection, `
			SELECT cols.column_name,
				   (SELECT pg_catalog.COL_DESCRIPTION(c.oid, cols.ordinal_position::INT)
					FROM pg_catalog.pg_class c
					WHERE c.oid = (SELECT cols.table_name::REGCLASS::OID)
					  AND c.relname = cols.table_name) AS column_comment

			FROM information_schema.columns cols
			WHERE cols.table_schema = '${PGSQL.CurrentSchema(schema)}'
			  AND cols.table_name = '${table}'`);
    });
    PGSQL.GetPGTable = (connection, table, schema) => __awaiter(this, void 0, void 0, function* () {
        var _17, _18, _19, _20, _21;
        const pgTable = new PGTable();
        pgTable.name = table;
        const columnComments = yield PGSQL.TableColumnComments(connection, table, schema);
        const columns = yield PGSQL.TableColumnsData(connection, table, schema);
        for (const column of columns) {
            const pgColumn = new PGColumn(Object.assign(Object.assign({}, column), { generatedAlwaysAs: column.generation_expression, isAutoIncrement: intelliwaketsfoundation.IsOn(column.identity_increment), udt_name: column.udt_name.toString().startsWith('_') ? column.udt_name.toString().substr(1) : column.udt_name, array_dimensions: column.udt_name.toString().startsWith('_') ? [null] : [], column_default: (((_17 = column.column_default) !== null && _17 !== void 0 ? _17 : '').toString().startsWith('\'NULL\'') || ((_18 = column.column_default) !== null && _18 !== void 0 ? _18 : '').toString().startsWith('NULL::')) ? null : ((_19 = column.column_default) !== null && _19 !== void 0 ? _19 : '').toString().startsWith('\'\'::') ? '' : column.column_default, column_comment: (_21 = (_20 = columnComments.find(col => col.column_name === column.column_name)) === null || _20 === void 0 ? void 0 : _20.column_comment) !== null && _21 !== void 0 ? _21 : '' }));
            pgTable.columns.push(pgColumn);
        }
        const fks = yield PGSQL.TableFKsData(connection, table);
        for (const fk of fks) {
            const pgForeignKey = new PGForeignKey({
                columnNames: fk.columnNames.reduce((results, columnName) => results.includes(columnName) ? results : [...results, columnName], []),
                primaryTable: fk.primaryTable,
                primaryColumns: fk.primaryColumns.reduce((results, primaryColumn) => results.includes(primaryColumn) ? results : [...results, primaryColumn], [])
            });
            pgTable.foreignKeys.push(pgForeignKey);
        }
        const indexes = yield PGSQL.TableIndexesData(connection, table);
        for (const index of indexes) {
            const indexDef = index.indexdef;
            const wherePos = indexDef.toUpperCase().indexOf(' WHERE ');
            const pgIndex = new PGIndex({
                columns: indexDef
                    .substring(indexDef.indexOf('(') + 1, wherePos > 0 ? wherePos - 1 : indexDef.length - 1)
                    .split(',')
                    .map(idx => idx.trim())
                    .filter(idx => !!idx),
                isUnique: indexDef.includes(' UNIQUE '),
                whereCondition: wherePos > 0 ? indexDef.substring(wherePos + 7).trim() : null
            });
            pgTable.indexes.push(pgIndex);
        }
        return pgTable;
    });
    PGSQL.CleanSQL = (sql) => intelliwaketsfoundation.ReplaceAll(';', '', sql);
})(exports.PGSQL || (exports.PGSQL = {}));

class PGView {
    constructor(instanceData) {
        this.name = '';
        this.definition = '';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = (instanceData)[key];
            }
        }
    }
    static GetFromDB(connection, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = yield exports.PGSQL.ViewData(connection, name);
            if (!!definition) {
                return new PGView({ name: name, definition: definition });
            }
            return null;
        });
    }
    ddlDefinition() { return `CREATE OR REPLACE VIEW ${this.name} AS ${this.definition}`; }
    writeToDB(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this.name && !!this.definition) {
                return exports.PGSQL.Execute(connection, this.ddlDefinition());
            }
            return null;
        });
    }
}

class PGMatView {
    constructor(instanceData) {
        this.name = '';
        this.definition = '';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    static GetFromDB(connection, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = yield exports.PGSQL.ViewsMatData(connection, name);
            if (!!definition) {
                return new PGMatView({ name: name, definition: definition });
            }
            return null;
        });
    }
    ddlDefinition() { return `CREATE MATERIALIZED VIEW ${this.name} AS ${this.definition}`; }
    writeToDB(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this.name && !!this.definition) {
                return yield exports.PGSQL.Execute(connection, this.ddlDefinition());
            }
            return null;
        });
    }
}

class PGFunc {
    constructor(instanceData) {
        this.name = '';
        this.definition = '';
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }
    deserialize(instanceData) {
        const keys = Object.keys(this);
        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        }
    }
    static GetFromDB(connection, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const definition = yield exports.PGSQL.ViewData(connection, name);
            if (!!definition) {
                return new PGFunc({ name: name, definition: definition });
            }
            return null;
        });
    }
    ddlDefinition() { return this.definition; }
    writeToDB(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this.name && !!this.definition) {
                return exports.PGSQL.Execute(connection, this.ddlDefinition());
            }
            return null;
        });
    }
}

const PGWhereSearchClause = (search, params, fields, startWithAnd = true) => {
    let where = '';
    let andAdded = false;
    if (!!search && fields.length > 0) {
        const terms = intelliwaketsfoundation.SearchTerms(search);
        for (const term of terms) {
            if (andAdded || startWithAnd)
                where += 'AND ';
            andAdded = true;
            where += `CONCAT_WS('|',` + fields.join(',') + `) ILIKE ${params.addLike(term)} `;
        }
    }
    return where;
};

exports.ColumnDefinition = ColumnDefinition;
exports.ExecuteScript = ExecuteScript;
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
exports.PaginatorResponseFromRequestCount = PaginatorResponseFromRequestCount;
exports.PaginatorReturnRowCount = PaginatorReturnRowCount;
exports.initialFixedWidthMapOptions = initialFixedWidthMapOptions;
