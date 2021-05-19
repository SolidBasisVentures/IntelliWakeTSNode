import { PGTable } from './PGTable';
export declare class PGIndex {
    columns: string[];
    where: string | null;
    isUnique: boolean;
    concurrently: boolean;
    using: string;
    constructor(instanceData?: Partial<PGIndex>);
    private deserialize;
    name(pgTable: PGTable): string;
    ddlDefinition(pgTable: PGTable): string;
}
