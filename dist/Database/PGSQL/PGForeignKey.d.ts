import { PGTable } from './PGTable';
export declare class PGForeignKey {
    columnNames: string[];
    primaryTable: string;
    primaryColumns: string[];
    isUnique: boolean;
    onDelete: string;
    onUpdate: string;
    constructor(instanceData?: PGForeignKey);
    private deserialize;
    fkName(myTable: PGTable): string;
    ddlConstraintDefinition(myTable: PGTable): string;
}
