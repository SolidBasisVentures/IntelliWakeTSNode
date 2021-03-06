import { IMSColumn } from '@Common/Migration/Chronos/IMSColumn';
export declare class MSColumn implements IMSColumn {
    COLUMN_NAME: string;
    ORDINAL_POSITION: number;
    COLUMN_DEFAULT: string | null;
    IS_NULLABLE: 'YES' | 'NO' | '';
    DATA_TYPE: string;
    CHARACTER_MAXIMUM_LENGTH: number | null;
    CHARACTER_OCTET_LENGTH: number | null;
    NUMERIC_PRECISION: number | null;
    NUMERIC_PRECISION_RADIX: number | null;
    NUMERIC_SCALE: number | null;
    DATETIME_PRECISION: number | null;
    CHARACTER_SET_CATALOG: string | null;
    CHARACTER_SET_SCHEMA: string | null;
    CHARACTER_SET_NAME: string | null;
    COLLATION_CATALOG: string | null;
    COLLATION_SCHEMA: string | null;
    COLLATION_NAME: string | null;
    DOMAIN_CATALOG: string | null;
    DOMAIN_SCHEMA: string | null;
    DOMAIN_NAME: string | null;
    isKey: boolean;
    isIdentity: boolean;
    isIndexed: boolean;
    lenGTZero: boolean;
    overrideType: string;
    overrideSize: number;
    overrideScale: number;
    overrideDefault: string;
    overrideDefaultUpdate: string;
    overrideIsNullable: 'YES' | 'NO' | '';
    isBit: boolean;
    isTime: boolean;
    toUserID: boolean;
    toLangID: boolean;
    notPK: boolean;
    isPK: boolean;
    generatePKsMissing: boolean;
    moveToParent: boolean;
    cardinality: number | null;
    hasNullsOrZeros: boolean | null;
    newName: string;
    description: string;
    question: string;
    questionMe: boolean;
    readyToProcess: boolean;
    ignore: boolean;
    constructor(instanceData?: IMSColumn);
    private deserialize;
    calcName: () => string;
    calcIsNullable: () => string;
    clean: () => void;
    cleanSave: () => void;
    countCardinality: (tableName: string) => Promise<number>;
    hasNull: (tableName: string) => Promise<boolean>;
    hasZero: (tableName: string) => Promise<boolean>;
}
