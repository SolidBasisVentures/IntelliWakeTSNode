import { PGTable } from './PGTable';
export declare class PGIndex {
    columns: string[];
    isUnique: boolean;
    concurrently: boolean;
    using: string;
    constructor(instanceData?: PGIndex);
    private deserialize;
    name(pgTable: PGTable): string;
    ddlDefinition(pgTable: PGTable): string;
}
