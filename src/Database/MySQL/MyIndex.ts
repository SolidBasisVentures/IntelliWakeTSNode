import {MyTable} from "./MyTable";

export class MyIndex {
	public columns: string[] = [];
	public isUnique = false;
	public using = "BTREE";

    constructor(instanceData?: MyIndex) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: MyIndex) {
        const keys = Object.keys(this);

        for (const key of keys) {
            if (instanceData.hasOwnProperty(key)) {
                (this as any)[key] = (instanceData as any)[key];
            }
        }
    }

	public name(myTable: MyTable): string {
		return 'idx_' + myTable.name + '_' + this.columns.join('_');
	}

	// @ts-ignore
	public ddlDefinition(myTable: MyTable, altering: boolean): string {
		let ddl = '';

		if (this.isUnique) {
			ddl += 'UNIQUE ';
		}
		ddl += 'KEY ';
		ddl += '`' + this.name(myTable) + '` ';
		ddl += '(`' + this.columns.join('`,`') + '`)';

		return ddl;
	}
}
