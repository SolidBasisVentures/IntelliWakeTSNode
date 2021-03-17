import { PGTable } from './PGTable';
export declare class PGForeignKey {
    columnNames: string[];
    primaryTable: string;
    primaryColumns: string[];
    onDelete: string;
    onUpdate: string;
    constructor(instanceData?: Partial<PGForeignKey>);
    private deserialize;
    fkName(pgTable: PGTable): string;
    ddlConstraintDefinition(pgTable: PGTable): string;
}
