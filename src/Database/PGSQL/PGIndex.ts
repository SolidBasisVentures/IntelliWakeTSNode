import {PGTable} from './PGTable'

export class PGIndex {
	public columns: string[] = []
	public isUnique = false
	public concurrently = false
	public using = 'BTREE'

	constructor(instanceData?: PGIndex) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: PGIndex) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}

	public name(myTable: PGTable): string {
		return (
			'idx_' +
			myTable.name +
			'_' +
			this.columns
				.map((column) =>
					column
						.replace(' ASC', '')
						.replace(' DESC', '')
						.replace(' NULLS', '')
						.replace(' FIRST', '')
						.replace(' LAST', '')
						.trim()
				)
				.join('_')
		)
	}

	public ddlDefinition(myTable: PGTable): string {
		let ddl = 'CREATE '

		if (this.isUnique) {
			ddl += 'UNIQUE '
		}
		ddl += 'INDEX '
		ddl += `"${this.name(myTable)}" `
		ddl += 'ON '
		ddl += `"${myTable.name}" `
		ddl += 'USING btree '
		ddl += '(' + this.columns.join(',') + ');'

		return ddl
	}
}
