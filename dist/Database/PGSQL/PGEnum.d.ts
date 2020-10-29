export declare class PGEnum {
    enumName: string;
    values: string[];
    defaultValue: string | null | undefined;
    constructor(instanceData?: PGEnum);
    private deserialize;
    get columnName(): string;
    ddlRemove(): string;
    ddlDefinition(): string;
}
