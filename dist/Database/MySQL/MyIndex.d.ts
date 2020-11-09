import { MyTable } from './MyTable';
export declare class MyIndex {
    columns: string[];
    isUnique: boolean;
    using: string;
    indexName: string;
    constructor(instanceData?: MyIndex);
    private deserialize;
    name(myTable: MyTable): string;
    ddlDefinition(myTable: MyTable, _altering: boolean): string;
}
