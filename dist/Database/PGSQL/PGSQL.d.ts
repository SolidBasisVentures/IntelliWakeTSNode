import { IPaginatorRequest, IPaginatorResponse, ISortColumn } from '@solidbasisventures/intelliwaketsfoundation';
import { PGTable } from './PGTable';
import { PGParams } from './PGParams';
import { PGEnum } from './PGEnum';
import { Client, FieldDef, Pool, PoolClient } from 'pg';
export declare type TConnection = Pool | PoolClient | Client;
export declare namespace PGSQL {
    interface IOffsetAndCount {
        offset: number;
        countPerPage: number;
    }
    type TQueryResults<T> = {
        rows?: Array<T>;
        fields?: FieldDef[];
        rowCount?: number;
    };
    const query: <T>(connection: TConnection, sql: string, values?: any) => Promise<TQueryResults<T>>;
    const timeout: (ms: number) => Promise<unknown>;
    const PGQueryValuesStream: <T = any>(connection: TConnection, sql: string, values: any, row?: ((row: T) => void) | undefined) => Promise<void>;
    const PGQueryStream: <T = any>(connection: TConnection, sql: string, row: (row: T) => void) => Promise<void>;
    const TableRowCount: (connection: TConnection, table: string) => Promise<number>;
    const TableExists: (connection: TConnection, table: string) => Promise<boolean>;
    const TableColumnExists: (connection: TConnection, table: string, column: string) => Promise<boolean>;
    const TriggerExists: (connection: TConnection, trigger: string) => Promise<boolean>;
    const TableResetIncrement: (connection: TConnection, table: string, column: string, toID?: number | undefined) => Promise<import("pg").QueryResult<any>>;
    const ConstraintExists: (connection: TConnection, constraint: string) => Promise<boolean>;
    interface IConstraints {
        table_name: string;
        constraint_name: string;
    }
    const FKConstraints: (connection: TConnection) => Promise<IConstraints[]>;
    const Functions: (connection: TConnection) => Promise<string[]>;
    const IndexExists: (connection: TConnection, tablename: string, indexName: string) => Promise<boolean>;
    const GetByID: <T>(connection: TConnection, table: string, id: number | null) => Promise<T | null>;
    /**
     * Returns a number from the sql who's only column returned is "count"
     */
    const GetCountSQL: (connection: TConnection, sql: string, values?: any) => Promise<number>;
    const FetchOne: <T>(connection: TConnection, sql: string, values?: any) => Promise<T | null>;
    const FetchMany: <T>(connection: TConnection, sql: string, values?: any) => Promise<T[]>;
    const FetchArray: <T>(connection: TConnection, sql: string, values?: any) => Promise<T[]>;
    const InsertAndGetReturning: (connection: TConnection, table: string, values: any) => Promise<any | null>;
    const InsertBulk: (connection: TConnection, table: string, values: any) => Promise<void>;
    const UpdateAndGetReturning: (connection: TConnection, table: string, whereValues: any, updateValues: any) => Promise<any | null>;
    const BuildWhereComponents: (whereValues: any, params: PGParams) => string;
    const BuildSetComponents: (setValues: any, params: PGParams) => string;
    const Save: (connection: TConnection, table: string, values: any) => Promise<any | null>;
    const Delete: (connection: TConnection, table: string, whereValues: any) => Promise<void>;
    const ExecuteRaw: (connection: TConnection, sql: string) => Promise<import("pg").QueryResult<any>>;
    const Execute: (connection: TConnection, sql: string, values?: any) => Promise<import("pg").QueryResult<any>>;
    const TruncateAllTables: (connection: TConnection, exceptions?: string[]) => Promise<boolean>;
    const TruncateTables: (connection: TConnection, tables: string[]) => Promise<void>;
    const TablesArray: (connection: TConnection) => Promise<string[]>;
    const ViewsArray: (connection: TConnection) => Promise<string[]>;
    const ViewsMatArray: (connection: TConnection) => Promise<string[]>;
    const TypesArray: (connection: TConnection) => Promise<string[]>;
    const FunctionsArray: (connection: TConnection) => Promise<string[]>;
    const FunctionsOIDArray: (connection: TConnection) => Promise<any[]>;
    const ExtensionsArray: (connection: TConnection) => Promise<string[]>;
    const TableData: (connection: TConnection, table: string) => Promise<any>;
    const TableColumnsData: (connection: TConnection, table: string) => Promise<any[]>;
    const TableFKsData: (connection: TConnection, table: string) => Promise<any[]>;
    const TableIndexesData: (connection: TConnection, table: string) => Promise<any[]>;
    const ViewData: (connection: TConnection, view: string) => Promise<string | null>;
    const ViewsMatData: (connection: TConnection, viewMat: string) => Promise<any>;
    const FunctionData: (connection: TConnection, func: string) => Promise<any>;
    const TypeData: (connection: TConnection, type: string) => Promise<string[]>;
    const SortColumnSort: (sortColumn: ISortColumn) => string;
    const PaginatorSortColumns: (paginatorRequest: IPaginatorRequest) => string;
    const LimitOffset: (limit: number, offset: number) => string;
    const PaginatorLimitOffset: (paginatorResponse: IPaginatorResponse) => string;
    const CalcOffsetFromPage: (page: number, pageSize: number, totalRecords: number) => number;
    const CalcPageCount: (pageSize: number, totalRecords: number) => number;
    const ResetIDs: (connection: TConnection) => Promise<void>;
    const GetTypes: (connection: TConnection) => Promise<PGEnum[]>;
    const GetPGTable: (connection: TConnection, table: string) => Promise<PGTable>;
}
