import mssql from 'mssql';
export declare const MSConfig: {
    user: string;
    password: string;
    server: string;
    port: number;
    database: string;
    schema: string;
    options: {
        enableArithAbort: boolean;
        useUTC: boolean;
    };
};
export declare const MSConfigSchema = "dbo";
export declare const databasePoolMS: mssql.ConnectionPool;
export declare namespace MSSQL {
    const GetMissingValues: (primaryTable: string, primaryColumn: string, foreignTable: string, foreignColumn: string, offset?: number, count?: number, search?: string) => Promise<any[]>;
    const GetMissingValuesCount: (primaryTable: string, primaryColumn: string, foreignTable: string, foreignColumn: string, offset?: number, count?: number, search?: string) => Promise<number>;
    const FetchAll: (sql: string) => Promise<any[]>;
    const FetchAllArray: (sql: string) => Promise<any[]>;
    const Fetch: (sql: string) => Promise<any>;
    const Execute: (sql: string) => Promise<any>;
    const Table_Exists: (tableName: string) => Promise<boolean>;
    const Table_Column_Exists: (tableName: string, columnName: string) => Promise<boolean>;
    const GetColumnValues: (table: string, column: string, offset?: number, count?: number, search?: string, distinct?: number) => Promise<string[]>;
    const GetColumnValuesCount: (table: string, column: string, offset?: number, count?: number, search?: string, distinct?: number) => Promise<number>;
    const StreamSQL: (mssql: string, each: (_row: any) => Promise<void>) => Promise<number | null>;
}
