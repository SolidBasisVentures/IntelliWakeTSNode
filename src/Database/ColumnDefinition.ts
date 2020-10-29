export class ColumnDefinition {
    public COLUMN_NAME = "";
    public ORDINAL_POSITION = 0;
    public COLUMN_DEFAULT: string | number | null = null;
    public IS_NULLABLE = "YES";
    public DATA_TYPE = "";
    public CHARACTER_MAXIMUM_LENGTH: number | null = null;
    public CHARACTER_OCTET_LENGTH: number | null = null;
    public NUMERIC_PRECISION: number | null = null;
    public NUMERIC_SCALE: number | null = null;
    public DATETIME_PRECISION: number | null = null;
    public COLUMN_TYPE : string | null= null;  // Full definition (e.g. varchar(55))
    public COLUMN_KEY: string | null = null;  // PRI
    public EXTRA: string | null = null;  // on update CURRENT_TIMESTAMP(3) OR auto_increment
    public COLUMN_COMMENT: string | null = null;
    public CHARACTER_SET_NAME: string | null = null;
    public COLLATION_NAME: string | null = null;

    static readonly TYPE_TINYINT = 'TINYINT';
    static readonly TYPE_SMALLINT = 'SMALLINT';
    static readonly TYPE_MEDIUMINT = 'MEDIUMINT';
    static readonly TYPE_INT = 'INT';
    static readonly TYPE_BIGINT = 'BIGINT';
    static readonly TYPE_DECIMAL = 'DECIMAL';
    static readonly TYPE_NUMERIC = 'NUMERIC';
    static readonly TYPE_FLOAT = 'FLOAT';
    static readonly TYPE_DOUBLE = 'DOUBLE';
    static readonly TYPE_BIT = 'BIT';

    static readonly TYPE_CHAR = 'CHAR';
    static readonly TYPE_VARCHAR = 'VARCHAR';
    static readonly TYPE_BINARY = 'BINARY';
    static readonly TYPE_VARBINARY = 'VARBINARY';
    static readonly TYPE_TINYBLOB = 'TINYBLOB';
    static readonly TYPE_BLOB = 'BLOB';
    static readonly TYPE_MEDIUMBLOB = 'MEDIUMBLOB';
    static readonly TYPE_LONGBLOB = 'LONGBLOB';
    static readonly TYPE_TINYTEXT = 'TINYTEXT';
    static readonly TYPE_TEXT = 'TEXT';
    static readonly TYPE_MEDIUMTEXT = 'MEDIUMTEXT';
    static readonly TYPE_LONGTEXT = 'LONGTEXT';
    static readonly TYPE_ENUM = 'ENUM';
    static readonly TYPE_SET = 'SET';

    static readonly TYPE_DATE = 'DATE';
    static readonly TYPE_TIME = 'TIME';
    static readonly TYPE_DATETIME = 'DATETIME';
    static readonly TYPE_TIMESTAMP = 'TIMESTAMP';
    static readonly TYPE_YEAR = 'YEAR';

    static readonly TYPE_GEOMETRY = 'GEOMETRY';
    static readonly TYPE_POINT = 'POINT';
    static readonly TYPE_LINESTRING = 'LINESTRING';
    static readonly TYPE_POLYGON = 'POLYGON';
    static readonly TYPE_GEOMETRYCOLLECTION = 'GEOMETRYCOLLECTION';
    static readonly TYPE_MULTILINESTRING = 'MULTILINESTRING';
    static readonly TYPE_MULTIPOINT = 'MULTIPOINT';
    static readonly TYPE_MULTIPOLYGON = 'MULTIPOLYGON';

    static readonly TYPE_JSON = 'JSON';

    public jsType = (): string => {
        if (this.booleanType()) {
            return 'boolean';
        } else if (this.integerFloatType()) {
            return 'number';
        } else if (this.booleanType()) {
            return 'boolean';
        } else {
            return 'string'; // Date or String
        }
    }

    public integerType = (): boolean => {
        return [ColumnDefinition.TYPE_TINYINT, ColumnDefinition.TYPE_SMALLINT, ColumnDefinition.TYPE_MEDIUMINT, ColumnDefinition.TYPE_INT, ColumnDefinition.TYPE_BIGINT, ColumnDefinition.TYPE_BIT, ColumnDefinition.TYPE_YEAR].includes(this.DATA_TYPE.toUpperCase());
    }

    public tinyintType = (): boolean => {
        return [ColumnDefinition.TYPE_TINYINT].includes(this.DATA_TYPE.toUpperCase());
    }

    public floatType = (): boolean => {
        return [ColumnDefinition.TYPE_DECIMAL, ColumnDefinition.TYPE_NUMERIC, ColumnDefinition.TYPE_FLOAT, ColumnDefinition.TYPE_DOUBLE].includes(this.DATA_TYPE.toUpperCase());
    }

    public integerFloatType = (): boolean => {
        return this.integerType() || this.floatType();
    }

    public booleanType = (): boolean => {
        return [ColumnDefinition.TYPE_BIT].includes(this.DATA_TYPE.toUpperCase());
    }

    public dateType = (): boolean => {
        return [ColumnDefinition.TYPE_DATE, ColumnDefinition.TYPE_TIME, ColumnDefinition.TYPE_DATETIME, ColumnDefinition.TYPE_TIMESTAMP].includes(this.DATA_TYPE.toUpperCase());
    }

    public generalStringType = (): boolean => {
        return !this.integerFloatType() && !this.booleanType();
    }

    public blobType = (): boolean => {
        return [ColumnDefinition.TYPE_TINYTEXT, ColumnDefinition.TYPE_TEXT, ColumnDefinition.TYPE_MEDIUMTEXT, ColumnDefinition.TYPE_LONGTEXT, ColumnDefinition.TYPE_TINYBLOB, ColumnDefinition.TYPE_BLOB, ColumnDefinition.TYPE_MEDIUMBLOB, ColumnDefinition.TYPE_LONGBLOB].includes(this.DATA_TYPE.toUpperCase());
    }

    public otherType = (): boolean => {
        return [ColumnDefinition.TYPE_GEOMETRY, ColumnDefinition.TYPE_POINT, ColumnDefinition.TYPE_LINESTRING, ColumnDefinition.TYPE_POLYGON, ColumnDefinition.TYPE_GEOMETRYCOLLECTION, ColumnDefinition.TYPE_MULTILINESTRING, ColumnDefinition.TYPE_MULTIPOINT, ColumnDefinition.TYPE_MULTIPOLYGON].includes(this.DATA_TYPE.toUpperCase());
    }
}
