import { Connection } from "mysql";
import { MyTable } from './MyTable';
import { MyForeignKey } from './MyForeignKey';
import { MyIndex } from './MyIndex';
export declare namespace MySQL {
    const TableRowCount: (connection: Connection, table: string) => Promise<number>;
    const TableExists: (connection: Connection, schema: string, table: string) => Promise<boolean>;
    const Tables: (connection: Connection, schema: string) => Promise<string[]>;
    const TableColumnExists: (connection: Connection, schema: string, table: string, column: string) => Promise<boolean>;
    const TableColumns: (connection: Connection, schema: string, table: string) => Promise<string[]>;
    const TableFKs: (connection: Connection, schema: string, table: string) => Promise<MyForeignKey[]>;
    const TableIndexes: (connection: Connection, schema: string, table: string) => Promise<MyIndex[]>;
    const GetMyTable: (connection: Connection, schema: string, table: string) => Promise<MyTable>;
}
