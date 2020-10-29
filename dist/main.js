'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var intelliwaketsfoundation = require('@solidbasisventures/intelliwaketsfoundation');
var moment = require('moment');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

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
        this.numeric_precision = null;
        this.numeric_scale = null;
        this.datetime_precision = null;
        this.is_identity = 'NO';
        this.is_self_referencing = 'NO';
        this.identity_generation = null;
        this.array_dimensions = [];
        this.check = null;
        this.checkStringValues = [];
        this.column_comment = '';
        this.isAutoIncrement = true;
        this.jsType = function () {
            if (typeof _this.udt_name !== 'string') {
                return _this.udt_name.enumName;
            }
            else if (_this.booleanType()) {
                return 'boolean';
            }
            else if (_this.integerFloatType()) {
                return 'number';
            }
            else if (_this.booleanType()) {
                return 'boolean';
            }
            else {
                return 'string'; // Date or String or Enum
            }
        };
        this.enumType = function () {
            return typeof _this.udt_name !== 'string';
        };
        this.integerType = function () {
            return typeof _this.udt_name === 'string' && [PGColumn.TYPE_SMALLINT, PGColumn.TYPE_INTEGER, PGColumn.TYPE_BIGINT].includes(_this.udt_name.toLowerCase());
        };
        this.floatType = function () {
            return typeof _this.udt_name === 'string' && [PGColumn.TYPE_NUMERIC, PGColumn.TYPE_FLOAT8].includes(_this.udt_name.toLowerCase());
        };
        this.integerFloatType = function () {
            return _this.integerType() || _this.floatType();
        };
        this.booleanType = function () {
            return typeof _this.udt_name === 'string' && [PGColumn.TYPE_BOOLEAN].includes(_this.udt_name.toLowerCase());
        };
        this.generalStringType = function () {
            return typeof _this.udt_name !== 'string' || [PGColumn.TYPE_VARCHAR].includes(_this.udt_name.toLowerCase());
        };
        this.dateType = function () {
            return typeof _this.udt_name === 'string' && [
                PGColumn.TYPE_DATE,
                PGColumn.TYPE_TIME,
                PGColumn.TYPE_TIMETZ,
                PGColumn.TYPE_TIMESTAMP,
                PGColumn.TYPE_TIMESTAMPTZ
            ].includes(_this.udt_name.toLowerCase());
        };
        this.blobType = function () {
            return typeof _this.udt_name === 'string' && [PGColumn.TYPE_TEXT].includes(_this.udt_name.toLowerCase());
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
            if (instanceData.hasOwnProperty(key)) {
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
        var _a, _b, _c, _d;
        var ddl = '"' + this.column_name + '" ';
        ddl += typeof this.udt_name === 'string' ? this.udt_name : this.udt_name.columnName;
        if (this.array_dimensions.length > 0) {
            ddl += "[" + this.array_dimensions
                .map(function (array_dimension) { return (!!array_dimension ? array_dimension.toString() : ''); })
                .join('],[') + "] ";
        }
        else {
            if (this.floatType() && this.udt_name !== PGColumn.TYPE_FLOAT8) {
                ddl += '(' + this.numeric_precision + ',' + this.numeric_scale + ') ';
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
                if (!this.blobType() && typeof this.udt_name === 'string') {
                    ddl += '(' + ((_a = this.character_maximum_length) !== null && _a !== void 0 ? _a : 255) + ') ';
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
        if (this.array_dimensions.length > 0) {
            if (intelliwaketsfoundation.IsOn(this.is_nullable)) {
                ddl += "DEFAULT " + ((_b = this.column_default) !== null && _b !== void 0 ? _b : 'NULL') + " ";
            }
            else {
                ddl += "DEFAULT " + ((_c = this.column_default) !== null && _c !== void 0 ? _c : (typeof this.udt_name === 'string' ? '\'{}\'' : (_d = this.udt_name.defaultValue) !== null && _d !== void 0 ? _d : '\'{}')) + " ";
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
                else if (!this.column_default && typeof this.udt_name !== 'string' && !!this.udt_name.defaultValue) {
                    ddl += "DEFAULT '" + this.udt_name.defaultValue + "' ";
                }
                else {
                    if (!!this.column_default) {
                        if (this.integerFloatType() || this.dateType()) {
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
        if (!!this.check) {
            ddl += "CHECK (" + this.check + ") ";
        }
        else if (this.checkStringValues.length > 0) {
            ddl += "CHECK (" + (intelliwaketsfoundation.IsOn(this.is_nullable) ? this.column_name + ' IS NULL OR ' : '') + this.column_name + " IN ('" + this.checkStringValues.join('\', \'') + "')) ";
        }
        return ddl.trim();
    };
    PGColumn.TYPE_BOOLEAN = 'boolean';
    PGColumn.TYPE_NUMERIC = 'numeric';
    PGColumn.TYPE_FLOAT8 = 'float8';
    PGColumn.TYPE_SMALLINT = 'smallint';
    PGColumn.TYPE_INTEGER = 'integer';
    PGColumn.TYPE_BIGINT = 'bigint';
    PGColumn.TYPE_VARCHAR = 'varchar';
    PGColumn.TYPE_TEXT = 'text';
    PGColumn.TYPE_DATE = 'date';
    PGColumn.TYPE_TIME = 'time';
    PGColumn.TYPE_TIMETZ = 'timetz';
    PGColumn.TYPE_TIMESTAMP = 'timestamp';
    PGColumn.TYPE_TIMESTAMPTZ = 'timestampz';
    PGColumn.TYPE_UUID = 'uuid';
    PGColumn.TYPES_ALL = [
        PGColumn.TYPE_BOOLEAN,
        PGColumn.TYPE_NUMERIC,
        PGColumn.TYPE_FLOAT8,
        PGColumn.TYPE_SMALLINT,
        PGColumn.TYPE_INTEGER,
        PGColumn.TYPE_BIGINT,
        PGColumn.TYPE_VARCHAR,
        PGColumn.TYPE_TEXT,
        PGColumn.TYPE_DATE,
        PGColumn.TYPE_TIME,
        PGColumn.TYPE_TIMETZ,
        PGColumn.TYPE_TIMESTAMP,
        PGColumn.TYPE_TIMESTAMPTZ,
        PGColumn.TYPE_UUID
    ];
    return PGColumn;
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
    PGIndex.prototype.name = function (myTable) {
        return ('idx_' +
            myTable.name +
            '_' +
            this.columns
                .map(function (column) {
                return column
                    .replace(' ASC', '')
                    .replace(' DESC', '')
                    .replace(' NULLS', '')
                    .replace(' FIRST', '')
                    .replace(' LAST', '')
                    .trim();
            })
                .join('_'));
    };
    PGIndex.prototype.ddlDefinition = function (myTable) {
        var ddl = 'CREATE ';
        if (this.isUnique) {
            ddl += 'UNIQUE ';
        }
        ddl += 'INDEX ';
        ddl += "\"" + this.name(myTable) + "\" ";
        ddl += 'ON ';
        ddl += "\"" + myTable.name + "\" ";
        ddl += 'USING btree ';
        ddl += '(' + this.columns.join(',') + ');';
        return ddl;
    };
    return PGIndex;
}());

var PGForeignKey = /** @class */ (function () {
    function PGForeignKey(instanceData) {
        this.columnNames = [];
        this.primaryTable = '';
        this.primaryColumns = [];
        this.isUnique = false;
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
    PGForeignKey.prototype.fkName = function (myTable) {
        return myTable.name + '_' + this.columnNames.join('_') + '_fkey';
    };
    PGForeignKey.prototype.ddlConstraintDefinition = function (myTable) {
        return "\n\t\tDO $$\n\t\tBEGIN\n\t\t\tIF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '" + this.fkName(myTable) + "') THEN\n\t\t\t\tALTER TABLE \"" + myTable.name + "\"\n\t\t\t\t\tADD CONSTRAINT \"" + this.fkName(myTable) + "\"\n\t\t\t\t\tFOREIGN KEY (\"" + this.columnNames.join('","') + "\") REFERENCES \"" + this.primaryTable + "\"(\"" + this.primaryColumns.join('","') + "\") DEFERRABLE INITIALLY DEFERRED;\n\t\t\tEND IF;\n\t\tEND;\n\t\t$$;"; // was INITIALLY IMMEDIATE
    };
    return PGForeignKey;
}());

var TS_EOL = '\r\n';
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
    PGTable.prototype.addForeignKey = function (myForeignKey) {
        this.foreignKeys.push(myForeignKey);
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
    PGTable.prototype.addIndex = function (myIndex) {
        this.indexes.push(myIndex);
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
        var _a, _b, _c, _d;
        var text = this.tableHeaderText('Table Manager for');
        if (this.inherits.length > 0) {
            for (var _i = 0, _e = this.inherits; _i < _e.length; _i++) {
                var inherit = _e[_i];
                text += "import {I" + inherit + ", initial_" + inherit + "} from \"./I" + inherit + "\";" + TS_EOL;
            }
        }
        var enums = Array.from(new Set(this.columns
            .map(function (column) { return (typeof column.udt_name !== 'string' ? column.udt_name.enumName : ''); })
            .filter(function (enumName) { return !!enumName; })));
        if (enums.length > 0) {
            for (var _f = 0, enums_1 = enums; _f < enums_1.length; _f++) {
                var enumItem = enums_1[_f];
                text += "import {" + enumItem + "} from \"../Enums/" + enumItem + "\"" + TS_EOL;
            }
            text += TS_EOL;
        }
        text += "export interface I" + this.name;
        if (this.inherits.length > 0) {
            text += " extends I" + this.inherits.join(', I');
        }
        text += " {" + TS_EOL;
        var addComma = false;
        var addComment = '';
        for (var _g = 0, _h = this.columns; _g < _h.length; _g++) {
            var myColumn = _h[_g];
            if (addComma) {
                text += ',' + addComment + TS_EOL;
            }
            text += '\t';
            text += myColumn.column_name;
            text += ': ';
            text += myColumn.jsType();
            if (myColumn.array_dimensions.length > 0) {
                text += "[" + myColumn.array_dimensions.map(function () { return ''; }).join('],[') + "]";
            }
            if (intelliwaketsfoundation.IsOn((_a = myColumn.is_nullable) !== null && _a !== void 0 ? _a : 'YES')) {
                text += ' | null';
            }
            if (!!myColumn.column_comment) {
                addComment = ' // ' + PGTable.CleanComment(myColumn.column_comment);
            }
            else {
                addComment = '';
            }
            addComma = true;
        }
        text += addComment + TS_EOL;
        text += '}' + TS_EOL;
        text += TS_EOL;
        text += "export const initial_" + this.name + ": I" + this.name + " = {" + TS_EOL;
        addComma = false;
        addComment = '';
        if (this.inherits.length > 0) {
            text += "\t...initial_" + this.inherits.join("," + TS_EOL + "\t...initial_") + "," + TS_EOL;
        }
        for (var _j = 0, _k = this.columns; _j < _k.length; _j++) {
            var myColumn = _k[_j];
            if (addComma) {
                text += ',' + TS_EOL;
            }
            text += '\t';
            text += myColumn.column_name;
            text += ': ';
            if (myColumn.array_dimensions.length > 0) {
                if (intelliwaketsfoundation.IsOn(myColumn.is_nullable)) {
                    text += 'null';
                }
                else {
                    text += "[" + myColumn.array_dimensions.map(function () { return ''; }).join('],[') + "]";
                }
            }
            else {
                if (!myColumn.blobType()) {
                    if (intelliwaketsfoundation.IsOn(myColumn.is_identity) && myColumn.isAutoIncrement) {
                        text += '0';
                    }
                    else if (myColumn.booleanType()) {
                        if (intelliwaketsfoundation.IsOn(myColumn.is_nullable)) {
                            text += 'null';
                        }
                        else {
                            text += intelliwaketsfoundation.IsOn(myColumn.column_default) ? 'true' : 'false';
                        }
                    }
                    else if (!!myColumn.column_default ||
                        (typeof myColumn.udt_name !== 'string' && !!myColumn.udt_name.defaultValue)) {
                        if (myColumn.dateType()) {
                            text += "''";
                        }
                        else if (myColumn.integerFloatType() || myColumn.dateType()) {
                            text += myColumn.column_default;
                        }
                        else if (typeof myColumn.udt_name !== 'string') {
                            text +=
                                "'" + ((_c = (_b = myColumn.column_default) !== null && _b !== void 0 ? _b : myColumn.udt_name.defaultValue) !== null && _c !== void 0 ? _c : '') + "' as " + myColumn.jsType();
                        }
                        else {
                            text += "'" + ((_d = myColumn.column_default) !== null && _d !== void 0 ? _d : '') + "'";
                        }
                    }
                    else if (intelliwaketsfoundation.IsOn(myColumn.is_nullable)) {
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
            }
            addComma = true;
        }
        text += addComment + TS_EOL;
        text += '};' + TS_EOL;
        return text;
    };
    PGTable.prototype.tsTextTable = function () {
        var text = this.tableHeaderText('Table Class for');
        text += "import {initial_" + this.name + ", I" + this.name + "} from \"@Common/Tables/I" + this.name + "\";" + TS_EOL;
        text += "import {TTables} from \"../Database/Tables\";" + TS_EOL;
        text += "import {TConnection} from \"../Database/pgsqlConnection\";" + TS_EOL;
        text += "import {_CTable} from \"./_CTable\";" + TS_EOL;
        for (var _i = 0, _a = this.inherits; _i < _a.length; _i++) {
            var inherit = _a[_i];
            text += "import {_C" + inherit + "} from \"./_C" + inherit + "\";" + TS_EOL;
        }
        text += TS_EOL;
        text += "export class C" + this.name + " extends _CTable<I" + this.name + ">";
        if (this.inherits.length > 0) {
            text += ", C" + this.inherits.join(', C');
        }
        text += " {" + TS_EOL;
        text += "\tpublic readonly table: TTables;" + TS_EOL;
        text += TS_EOL;
        text += "\tconstructor(connection: TConnection, initialValues?: I" + this.name + " | any) {" + TS_EOL;
        text += "\t\tsuper(connection, initialValues, {...initial_" + this.name + "});" + TS_EOL;
        text += TS_EOL;
        text += "\t\tthis.table = '" + this.name + "';" + TS_EOL;
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
    PGTable.prototype.ddlCreateTableText = function (createForeignKeys, createIndexes) {
        var ddl = '';
        /** @noinspection SqlResolve */
        ddl += "DROP TABLE IF EXISTS " + this.name + " CASCADE;" + TS_EOL;
        ddl += "CREATE TABLE " + this.name + " (" + TS_EOL;
        var prevColumn = null;
        for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
            var myColumn = _a[_i];
            if (prevColumn !== null) {
                ddl += ',' + TS_EOL;
            }
            ddl += '\t' + myColumn.ddlDefinition();
            prevColumn = myColumn;
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
    PGTable.CleanComment = function (comment) {
        if (!comment) {
            return comment;
        }
        return comment.replace(/[\n\r]/g, ' ');
    };
    return PGTable;
}());

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
    PGEnum.prototype.ddlRemove = function () {
        return "DROP TYPE IF EXISTS " + this.columnName + " CASCADE ";
    };
    PGEnum.prototype.ddlDefinition = function () {
        return "CREATE TYPE " + this.columnName + " AS ENUM ('" + this.values.join("','") + "')";
    };
    return PGEnum;
}());

var PGParams = /** @class */ (function () {
    function PGParams() {
        this.lastPosition = 0;
        this.values = [];
    }
    PGParams.prototype.add = function (value) {
        this.lastPosition++;
        this.values.push(value);
        return '$' + this.lastPosition;
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
    return PGParams;
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
exports.PGColumn = PGColumn;
exports.PGEnum = PGEnum;
exports.PGForeignKey = PGForeignKey;
exports.PGIndex = PGIndex;
exports.PGParams = PGParams;
exports.PGTable = PGTable;
exports.PGWhereSearchClause = PGWhereSearchClause;
