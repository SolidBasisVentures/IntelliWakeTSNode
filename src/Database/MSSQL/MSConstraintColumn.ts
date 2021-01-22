export class MSConstraintColumn {
	public TABLE_NAME: string = "";
	public COLUMN_NAME: string = "";
	public CONSTRAINT_NAME: string = "";

	public isPrimaryKey = false;

    constructor(instanceData?: MSConstraintColumn) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: MSConstraintColumn) {
        const keys = Object.keys(this);

        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                (this as any)[key] = (instanceData as any)[key];
            }
        }
    }
}
