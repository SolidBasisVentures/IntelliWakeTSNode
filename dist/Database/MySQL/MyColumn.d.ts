import { MyTable } from './MyTable';
import { ColumnDefinition } from './ColumnDefinition';
export declare class MyColumn extends ColumnDefinition {
    isPK: boolean;
    isAutoIncrement: boolean;
    constructor(instanceData?: MyColumn);
    private deserialize;
    clean(): void;
    ddlDefinition(myTable: MyTable, _prevMyColumn: MyColumn | null, _altering: boolean): string;
}
