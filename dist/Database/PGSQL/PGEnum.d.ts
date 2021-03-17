export declare class PGEnum {
    enumName: string;
    values: string[];
    defaultValue: string | null | undefined;
    constructor(instanceData?: Partial<PGEnum>);
    private deserialize;
    get columnName(): string;
    get typeName(): string;
    static TypeName(columnName: string): string;
    ddlRemove(): string;
    ddlDefinition(): string;
}
