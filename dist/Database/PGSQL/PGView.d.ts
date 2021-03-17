import { TConnection } from './PGSQL';
export declare class PGView {
    name: string;
    definition: string;
    constructor(instanceData?: Partial<PGView>);
    protected deserialize(instanceData: Partial<PGView>): void;
    static GetFromDB(connection: TConnection, name: string): Promise<PGView | null>;
    ddlDefinition(): string;
    writeToDB(connection: TConnection): Promise<import("pg").QueryResult<any> | null>;
}
