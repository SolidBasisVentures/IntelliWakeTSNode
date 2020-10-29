import { MyTable } from "./MyTable";
export declare class MyForeignKey {
    columnNames: string[];
    primaryTable: string;
    primaryColumns: string[];
    isUnique: boolean;
    onDelete: string;
    onUpdate: string;
    constructor(instanceData?: MyForeignKey);
    private deserialize;
    fkName(myTable: MyTable, prefix: string): string;
    ddlKeyDefinition(myTable: MyTable, altering: boolean): string;
    ddlConstraintDefinition(myTable: MyTable, altering: boolean): string;
}
