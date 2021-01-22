import {databasePoolMS} from './mssqlConnection'
import {IMSForeignKey} from '@Common/Migration/Chronos/IMSForeignKey'
import {toSnakeCase} from '../../Generics/Functions'

export class MSForeignKey implements IMSForeignKey {
	public primaryTable = ''
	public primaryColumn = ''
	public foreignTable = ''
	public foreignColumn = ''
	public deleteAction = ''
	public updateAction = ''
	public originalFK = false
	public noIssues: number | null = null

	constructor(instanceData?: IMSForeignKey) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: IMSForeignKey) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}

	public clean() {
		this.primaryTable = toSnakeCase(this.primaryTable)
		this.primaryColumn = toSnakeCase(this.primaryColumn)
		this.foreignTable = toSnakeCase(this.foreignTable)
		this.foreignColumn = toSnakeCase(this.foreignColumn)
	}

	public async missingFKCounts(): Promise<number> {
		return new Promise((resolve) => {
			let sql = `SELECT COUNT(DISTINCT "${this.foreignColumn}") AS count FROM "${this.foreignTable}" WHERE "${this.foreignColumn}" IS NOT NULL AND "${this.foreignColumn}" > 0 AND NOT EXISTS (SELECT 1 FROM "${this.primaryTable}" WHERE "${this.foreignTable}"."${this.foreignColumn}" = "${this.primaryTable}"."${this.primaryColumn}")`

			databasePoolMS
				.request()
				.query(sql)
				.then((results) => {
					console.log(results)
					if (!!results && !!results.recordsets[0]) {
						resolve((results.recordsets[0] as any)['count'] ?? 0)
					}
					resolve(-1)
				})
				.catch(() => {
					sql = `SELECT COUNT(DISTINCT "${this.foreignColumn}") AS count FROM "${this.foreignTable}" WHERE "${this.foreignColumn}" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "${this.primaryTable}" WHERE "${this.foreignTable}"."${this.foreignColumn}" = "${this.primaryTable}"."${this.primaryColumn}")`

					databasePoolMS
						.request()
						.query(sql)
						.then((results) => {
							if (!!results && !!results.recordsets[0]) {
								resolve((results.recordsets[0] as any)['count'] ?? 0)
							}

							resolve(-1)
						})
						.catch(() => {
							resolve(-1)
						})
				})
		})
	}
}
