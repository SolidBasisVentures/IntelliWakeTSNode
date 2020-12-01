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

	public fkName(pgTable: PGTable) {
		return pgTable.name + '_' + this.columnNames.map(column => column.substr(-10)).join('_') + '_fkey'
	}

	public ddlConstraintDefinition(pgTable: PGTable): string {
		return `
		DO $$
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${this.fkName(pgTable)}') THEN
				ALTER TABLE "${pgTable.name}"
					ADD CONSTRAINT "${this.fkName(pgTable)}"
					FOREIGN KEY ("${this.columnNames.join('","')}") REFERENCES "${this.primaryTable}"("${this.primaryColumns.join(
			'","'
		)}") DEFERRABLE INITIALLY DEFERRED;
			END IF;
		END;
		$$;` // was INITIALLY IMMEDIATE
	}
}
