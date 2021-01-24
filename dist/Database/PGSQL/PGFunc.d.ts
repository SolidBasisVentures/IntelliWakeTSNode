import { PGSQL, TConnection } from './PGSQL';
export declare class PGFunc {
    name: string;
    definition: string;
    constructor(instanceData?: any);
    protected deserialize(instanceData: any): void;
    static GetFromDB(connection: TConnection, name: string): Promise<PGFunc | null>;
    ddlDefinition(): string;
    writeToDB(connection: TConnection): Promise<PGSQL.TQueryResults<unknown> | null>;
}
