export declare class MSConstraintColumn {
    TABLE_NAME: string;
    COLUMN_NAME: string;
    CONSTRAINT_NAME: string;
    isPrimaryKey: boolean;
    constructor(instanceData?: MSConstraintColumn);
    private deserialize;
}
