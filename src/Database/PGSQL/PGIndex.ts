import {PGTable} from './PGTable'

export class PGIndex {
	public columns: string[] = []
	public whereCondition: string | null = null
	public isUnique = false
	public concurrently = false
	public using = 'BTREE'

	constructor(instanceData?: Partial<PGIndex>) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: Partial<PGIndex>) {
		const keys = Object.keys(this)
		
		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}

	public name(pgTable: PGTable): string {
		return (
			'idx_' +
			pgTable.name.substr(-25) +
			'_' +
			this.columns
				.map((column) =>
					column
						.replace(' ASC', '')
						.replace(' DESC', '')
						.replace(' NULLS', '')
						.replace(' FIRST', '')
						.replace(' LAST', '')
						.replace('(', '_')
						.replace(')', '_')
						.trim().substr(-25)
				)
				.join('_')
		)
	}

	public ddlDefinition(pgTable: PGTable): string {
		let ddl = 'CREATE '

		if (this.isUnique) {
			ddl += 'UNIQUE '
		}
		ddl += 'INDEX IF NOT EXISTS '
		ddl += `"${this.name(pgTable)}" `
		ddl += 'ON '
		ddl += `"${pgTable.name}" `
		ddl += 'USING btree '
		ddl += '(' + this.columns.join(',') + ')'
		if (this.whereCondition) {
			ddl += ' WHERE ' + this.whereCondition
		}
		ddl += ';'

		return ddl
	}
}
