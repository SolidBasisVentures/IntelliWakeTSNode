import { TConnection } from './PGSQL';
export declare class PGFunc {
    name: string;
    definition: string;
    constructor(instanceData?: Partial<PGFunc>);
    protected deserialize(instanceData: Partial<PGFunc>): void;
    static GetFromDB(connection: TConnection, name: string): Promise<PGFunc | null>;
    ddlDefinition(): string;
    writeToDB(connection: TConnection): Promise<import("pg").QueryResult<any> | null>;
}
