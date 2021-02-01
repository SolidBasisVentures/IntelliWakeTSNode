import { Connection } from "mysql";
import { MyTable } from './MyTable';
import { MyForeignKey } from './MyForeignKey';
import { MyIndex } from './MyIndex';
export declare namespace MySQL {
    const TableRowCount: (connection: Connection, table: string) => Promise<number>;
    const TableExists: (connection: Connection, table: string) => Promise<boolean>;
    const Tables: (connection: Connection) => Promise<string[]>;
    const TableColumnExists: (connection: Connection, table: string, column: string) => Promise<boolean>;
    const TableColumns: (connection: Connection, table: string) => Promise<string[]>;
    const TableFKs: (connection: Connection, table: string) => Promise<MyForeignKey[]>;
    const TableIndexes: (connection: Connection, table: string) => Promise<MyIndex[]>;
    const GetMyTable: (connection: Connection, table: string) => Promise<MyTable>;
}
