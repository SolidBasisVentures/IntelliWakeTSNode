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
    fkName(pgTable: PGTable): string;
    ddlConstraintDefinition(pgTable: PGTable): string;
}
