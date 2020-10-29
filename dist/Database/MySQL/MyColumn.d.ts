import { MyTable } from "./MyTable";
import { ColumnDefinition } from "../ColumnDefinition";
export declare class MyColumn extends ColumnDefinition {
    isPK: boolean;
    isAutoIncrement: boolean;
    constructor(instanceData?: MyColumn);
    private deserialize;
    clean(): void;
    ddlDefinition(myTable: MyTable, prevMyColumn: MyColumn | null, altering: boolean): string;
}
