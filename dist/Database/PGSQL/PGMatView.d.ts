import { TConnection } from './PGSQL';
export declare class PGMatView {
    name: string;
    definition: string;
    constructor(instanceData?: any);
    protected deserialize(instanceData: any): void;
    static GetFromDB(connection: TConnection, name: string): Promise<PGMatView | null>;
    ddlDefinition(): string;
    writeToDB(connection: TConnection): Promise<import("pg").QueryResult<any> | null>;
}
