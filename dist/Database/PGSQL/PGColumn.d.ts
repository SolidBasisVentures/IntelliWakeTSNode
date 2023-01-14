import { PGEnum } from './PGEnum';
export interface IPGColumn {
    column_name: string;
    ordinal_position: number;
    column_default: string | number | boolean | null | undefined;
    is_nullable: 'YES' | 'NO';
    udt_name: string | PGEnum;
    character_maximum_length: number | null;
    character_octet_length: number | null;
    /** Total number of digits */
    numeric_precision: number | null;
    /** Number of digits after the decimal point */
    numeric_scale: number | null;
    datetime_precision: number | null;
    is_identity: 'YES' | 'NO';
    is_self_referencing: 'YES' | 'NO';
    identity_generation: 'BY DEFAULT' | null;
    array_dimensions: (number | null)[];
    check: string | null;
    checkStringValues: string[];
    generatedAlwaysAs: string | null;
    /** Comment on column, except for within {}'s
     * {} can contain comma separated values
     * {enum: EDeclaration: default_value} or {enum: EDeclaration.default_value} or {enum: EDeclaration}
     * {interface: IDeclaration} or {interface: IDeclaration.initialDeclaration} */
    column_comment: string;
    isAutoIncrement: boolean;
}
export declare class PGColumn implements IPGColumn {
    column_name: string;
    ordinal_position: number;
    column_default: string | number | boolean | null | undefined;
    is_nullable: 'YES' | 'NO';
    udt_name: string | PGEnum;
    character_maximum_length: number | null;
    character_octet_length: number | null;
    /** Total number of digits */
    numeric_precision: number | null;
    /** Number of digits after the decimal point */
    numeric_scale: number | null;
    datetime_precision: number | null;
    is_identity: 'YES' | 'NO';
    is_self_referencing: 'YES' | 'NO';
    identity_generation: 'BY DEFAULT' | null;
    array_dimensions: (number | null)[];
    check: string | null;
    checkStringValues: string[];
    generatedAlwaysAs: string | null;
    /** Comment on column, except for within {}'s
     * {} can contain comma separated values
     * {enum: EDeclaration: default_value} or {enum: EDeclaration.default_value} or {enum: EDeclaration}
     * {interface: IDeclaration} or {interface: IDeclaration.initialDeclaration} */
    column_comment: string;
    isAutoIncrement: boolean;
    static readonly TYPE_BOOLEAN = "bool";
    static readonly TYPE_NUMERIC = "numeric";
    static readonly TYPE_FLOAT8 = "float8";
    static readonly TYPE_POINT = "point";
    static readonly TYPE_SMALLINT = "smallint";
    static readonly TYPE_INTEGER = "integer";
    static readonly TYPE_BIGINT = "bigint";
    static readonly TYPE_VARCHAR = "varchar";
    static readonly TYPE_TEXT = "text";
    static readonly TYPE_JSON = "json";
    static readonly TYPE_JSONB = "jsonb";
    static readonly TYPE_DATE = "date";
    static readonly TYPE_TIME = "time";
    static readonly TYPE_TIMETZ = "timetz";
    static readonly TYPE_TIMESTAMP = "timestamp";
    static readonly TYPE_TIMESTAMPTZ = "timestamptz";
    static readonly TYPE_BYTEA = "bytea";
    static readonly TYPE_UUID = "uuid";
    static readonly TYPES_ALL: string[];
    jsType: () => string;
    isArray: () => boolean;
    isNullable: () => boolean;
    enumType: () => boolean;
    integerType: () => boolean;
    floatType: () => boolean;
    integerFloatType: () => boolean;
    booleanType: () => boolean;
    jsonType: () => boolean;
    generalStringType: () => boolean;
    dateType: () => boolean;
    dateOnlyType: () => boolean;
    timeOnlyType: () => boolean;
    dateTimeOnlyType: () => boolean;
    blobType: () => boolean;
    otherType: () => boolean;
    constructor(instanceData?: Partial<IPGColumn>);
    private deserialize;
    clean(): void;
    ddlDefinition(): string;
    static CleanComment(comment: string): string;
}
