import { TConnection } from './PGSQL';
export declare class PGMatView {
    name: string;
    definition: string;
    constructor(instanceData?: Partial<PGMatView>);
    protected deserialize(instanceData: Partial<PGMatView>): void;
    static GetFromDB(connection: TConnection, name: string): Promise<PGMatView | null>;
    ddlDefinition(): string;
    writeToDB(connection: TConnection): Promise<import("pg").QueryResult<any> | null>;
}
