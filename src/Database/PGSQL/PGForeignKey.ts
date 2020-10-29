import {PGTable} from './PGTable'

export class PGForeignKey {
	public columnNames: string[] = []
	public primaryTable = ''
	public primaryColumns: string[] = []
	public isUnique = false

	public onDelete = 'RESTRICT'
	public onUpdate = 'RESTRICT'

	constructor(instanceData?: PGForeignKey) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: PGForeignKey) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}

	public fkName(myTable: PGTable) {
		return myTable.name + '_' + this.columnNames.join('_') + '_fkey'
	}

	public ddlConstraintDefinition(myTable: PGTable): string {
		return `
		DO $$
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${this.fkName(myTable)}') THEN
				ALTER TABLE "${myTable.name}"
					ADD CONSTRAINT "${this.fkName(myTable)}"
					FOREIGN KEY ("${this.columnNames.join('","')}") REFERENCES "${this.primaryTable}"("${this.primaryColumns.join(
			'","'
		)}") DEFERRABLE INITIALLY DEFERRED;
			END IF;
		END;
		$$;` // was INITIALLY IMMEDIATE
	}
}
