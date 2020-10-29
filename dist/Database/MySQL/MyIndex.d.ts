import { MyTable } from "./MyTable";
export declare class MyIndex {
    columns: string[];
    isUnique: boolean;
    using: string;
    constructor(instanceData?: MyIndex);
    private deserialize;
    name(myTable: MyTable): string;
    ddlDefinition(myTable: MyTable, altering: boolean): string;
}
