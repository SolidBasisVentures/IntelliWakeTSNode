'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var intelliwaketsfoundation = require('@solidbasisventures/intelliwaketsfoundation');
var moment = require('moment');
var path = require('path');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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
            return (typeof _this.udt_name === 'string') && [PGColumn.TYPE_SMALLINT, PGColumn.TYPE_INTEGER, PGColumn.TYPE_BIGINT].includes(_this.udt_name.toLowerCase());
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
        var _a, _b, _c, _d, _e;
        var ddl = '"' + this.column_name + '" ';
        ddl += (typeof this.udt_name === 'string') ? this.udt_name : this.udt_name.columnName;
        if (this.array_dimensions.length > 0) {
            ddl += "[" + this.array_dimensions
                .map(function (array_dimension) { return (!!array_dimension ? array_dimension.toString() : ''); })
                .join('],[') + "] ";
        }
        else {
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
        if (!intelliwaketsfoundation.IsOn(this.is_nullable)) {
            ddl += 'NOT NULL ';
        }
        if (this.column_default !== undefined) {
            if (this.array_dimensions.length > 0) {
                if (intelliwaketsfoundation.IsOn(this.is_nullable)) {
                    ddl += "DEFAULT " + ((_c = this.column_default) !== null && _c !== void 0 ? _c : 'NULL') + " ";
                }
                else {
                    ddl += "DEFAULT " + ((_d = this.column_default) !== null && _d !== void 0 ? _d : ((typeof this.udt_name === 'string') ? '\'{}\'' : (_e = this.udt_name.defaultValue) !== null && _e !== void 0 ? _e : '\'{}')) + " ";
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
    PGColumn.TYPE_TIMESTAMPTZ = 'timestamptz';
    PGColumn.TYPE_BYTEA = 'bytea';
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
    PGIndex.prototype.name = function (pgTable) {
        return ('idx_' +
            pgTable.name.substr(-10) +
            '_' +
            this.columns
                .map(function (column) {
                return column
                    .replace(' ASC', '')
                    .replace(' DESC', '')
                    .replace(' NULLS', '')
                    .replace(' FIRST', '')
                    .replace(' LAST', '')
                    .trim().substr(-10);
            })
                .join('_'));
    };
    PGIndex.prototype.ddlDefinition = function (pgTable) {
        var ddl = 'CREATE ';
        if (this.isUnique) {
            ddl += 'UNIQUE ';
        }
        ddl += 'INDEX ';
        ddl += "\"" + this.name(pgTable) + "\" ";
        ddl += 'ON ';
        ddl += "\"" + pgTable.name + "\" ";
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
    PGForeignKey.prototype.fkName = function (pgTable) {
        return pgTable.name + '_' + this.columnNames.map(function (column) { return column.substr(-10); }).join('_') + '_fkey';
    };
    PGForeignKey.prototype.ddlConstraintDefinition = function (pgTable) {
        return "\n\t\tDO $$\n\t\tBEGIN\n\t\t\tIF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '" + this.fkName(pgTable) + "') THEN\n\t\t\t\tALTER TABLE \"" + pgTable.name + "\"\n\t\t\t\t\tADD CONSTRAINT \"" + this.fkName(pgTable) + "\"\n\t\t\t\t\tFOREIGN KEY (\"" + this.columnNames.join('","') + "\") REFERENCES \"" + this.primaryTable + "\"(\"" + this.primaryColumns.join('","') + "\") DEFERRABLE INITIALLY DEFERRED;\n\t\t\tEND IF;\n\t\tEND;\n\t\t$$;"; // was INITIALLY IMMEDIATE
    };
    return PGForeignKey;
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
        var _a, _b, _c, _d;
        var text = this.tableHeaderText('Table Manager for');
        if (this.inherits.length > 0) {
            for (var _i = 0, _e = this.inherits; _i < _e.length; _i++) {
                var inherit = _e[_i];
                text += "import {I" + inherit + ", initial_" + inherit + "} from \"./I" + inherit + "\"" + TS_EOL;
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
            var pgColumn = _h[_g];
            if (addComma) {
                text += '' + addComment + TS_EOL; // Removed comment
            }
            text += '\t';
            text += pgColumn.column_name;
            text += ': ';
            text += pgColumn.jsType();
            if (pgColumn.array_dimensions.length > 0) {
                text += "[" + pgColumn.array_dimensions.map(function () { return ''; }).join('],[') + "]";
            }
            if (intelliwaketsfoundation.IsOn((_a = pgColumn.is_nullable) !== null && _a !== void 0 ? _a : 'YES')) {
                text += ' | null';
            }
            if (!!pgColumn.column_comment) {
                addComment = ' // ' + PGTable.CleanComment(pgColumn.column_comment);
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
            var pgColumn = _k[_j];
            if (addComma) {
                text += ',' + TS_EOL;
            }
            text += '\t';
            text += pgColumn.column_name;
            text += ': ';
            if (pgColumn.array_dimensions.length > 0) {
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
                            text += "''";
                        }
                        else if (pgColumn.integerFloatType() || pgColumn.dateType()) {
                            text += pgColumn.column_default;
                        }
                        else if (typeof pgColumn.udt_name !== 'string') {
                            text +=
                                "'" + ((_c = (_b = pgColumn.column_default) !== null && _b !== void 0 ? _b : pgColumn.udt_name.defaultValue) !== null && _c !== void 0 ? _c : '') + "' as " + pgColumn.jsType();
                        }
                        else {
                            text += "'" + ((_d = pgColumn.column_default) !== null && _d !== void 0 ? _d : '') + "'";
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
        text += '}' + TS_EOL; // Removed semi
        return text;
    };
    PGTable.prototype.tsTextTable = function () {
        var text = this.tableHeaderText('Table Class for');
        text += "import {initial_" + this.name + ", I" + this.name + "} from \"@Common/Tables/I" + this.name + "\"" + TS_EOL;
        text += "import {TTables} from \"../Database/Tables\"" + TS_EOL;
        text += "import {TConnection} from \"../Database/pgsqlConnection\"" + TS_EOL;
        text += "import {_CTable} from \"./_CTable\"" + TS_EOL;
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
        text += "\tconstructor(connection: TConnection, initialValues?: I" + this.name + " | any) {" + TS_EOL;
        text += "\t\tsuper(connection, initialValues, {...initial_" + this.name + "})" + TS_EOL;
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
    PGTable.prototype.ddlCreateTableText = function (createForeignKeys, createIndexes) {
        var ddl = '';
        /** @noinspection SqlResolve */
        ddl += "DROP TABLE IF EXISTS " + this.name + " CASCADE;" + TS_EOL;
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

(function (MyToPG) {
    MyToPG.GetPGTable = function (myTable) {
        var pgTable = new PGTable();
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
        return prefix + '_' + myTable.name.substr(-10) + '_' + this.columnNames.map(function (column) { return column.substr(0, -10); }).join('_');
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
        return 'idx_' + myTable.name.substr(-15) + '_' + this.columns.map(function (column) { return column.substr(0, -15); }).join('_');
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
                        connection.query("SELECT COUNT(*) AS count\n                      FROM information_schema.tables\n                      WHERE TABLE_SCHEMA = '" + process.env.MYSQLDATABASE + "'\n                        AND TABLE_NAME = '" + table + "'", function (error, results, _fields) {
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
                        connection.query("SELECT TABLE_NAME\n                      FROM information_schema.tables\n                      WHERE TABLE_SCHEMA = '" + process.env.MYSQLDATABASE + "'", function (error, results, _fields) {
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
                        connection.query("SELECT COUNT(*) AS count\n                      FROM information_schema.COLUMNS\n                      WHERE TABLE_SCHEMA = '" + process.env.MYSQLDATABASE + "'\n                        AND TABLE_NAME = '" + table + "'\n                        AND COLUMN_NAME = '" + column + "'", function (error, results, _fields) {
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
                        connection.query("SELECT *\n                      FROM information_schema.COLUMNS\n                      WHERE TABLE_SCHEMA = '" + process.env.MYSQLDATABASE + "'\n                        AND TABLE_NAME = '" + table + "'\n                        ORDER BY ORDINAL_POSITION", function (error, results, _fields) {
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
                        connection.query("SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME\n\t\t\t\tFROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE\n\t\t\t\tWHERE REFERENCED_TABLE_SCHEMA = '" + process.env.MYSQLDATABASE + "'\n\t\t\t\t  AND TABLE_NAME = '" + table + "'", function (error, results, _fields) {
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
                        connection.query("SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE\n\t\t\t\tFROM INFORMATION_SCHEMA.STATISTICS\n\t\t\t\tWHERE TABLE_SCHEMA = '" + process.env.MYSQLDATABASE + "'\n\t\t\t\t\tAND TABLE_NAME = '" + table + "'\n\t\t\t\tORDER BY INDEX_NAME", function (error, results, _fields) {
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
    //                       AND trigger_catalog = '${process.env.MYSQLDATABASE}'
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
    //                       AND constraint_catalog = '${process.env.MYSQLDATABASE}'
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
    //                       AND constraint_catalog = '${process.env.MYSQLDATABASE}'
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
    // 			  AND routine_catalog='${process.env.MYSQLDATABASE}'
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
    // 				AND table_catalog = '${process.env.MYSQLDATABASE}'`
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
    // 				AND table_catalog = '${process.env.MYSQLDATABASE}'`
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
exports.MyColumn = MyColumn;
exports.MyForeignKey = MyForeignKey;
exports.MyIndex = MyIndex;
exports.MyTable = MyTable;
exports.PGColumn = PGColumn;
exports.PGEnum = PGEnum;
exports.PGForeignKey = PGForeignKey;
exports.PGIndex = PGIndex;
exports.PGParams = PGParams;
exports.PGTable = PGTable;
exports.PGWhereSearchClause = PGWhereSearchClause;
