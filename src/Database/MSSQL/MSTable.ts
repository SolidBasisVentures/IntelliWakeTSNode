import {MSColumn} from './MSColumn'
import {databasePoolMS, MSConfig} from './mssqlConnection'
import {MSForeignKey} from './MSForeignKey'
import fs from 'fs'
import path from 'path'
import {IMSTable} from '@Common/Migration/Chronos/IMSTable'
import {toSnakeCase} from '../../Generics/Functions'

const tableJSONDir = path.resolve('./') + '/src/Migration/Chronos/Tables'

export class MSTable implements IMSTable {
	public groupName = ''
	public stepNo = 0
	public name = ''

	public inherits: string[] = []

	public columns: MSColumn[] = []

	public rowCount: number | null = null

	public newName = ''
	public description = ''
	public migrationNotes = ''

	public originalForeignKeys: MSForeignKey[] = []

	public newForeignKeys: MSForeignKey[] = []

	public skip = false
	public redo = false
	public ignore = false

	constructor(instanceData?: IMSTable) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: IMSTable) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				switch (key) {
					case 'columns':
						for (const column of (instanceData as any)[key] as MSColumn[]) {
							;(this as any)[key].push(new MSColumn(column))
						}
						break
					case 'originalForeignKeys':
					case 'newForeignKeys':
						for (const foreignKey of (instanceData as any)[key] as MSForeignKey[]) {
							;(this as any)[key].push(new MSForeignKey(foreignKey))
						}
						break
					default:
						;(this as any)[key] = (instanceData as any)[key]
						break
				}
			}
		}
	}

	public calcName(): string {
		if ((this.newName ?? '').length > 0) {
			return toSnakeCase(this.newName)
		}

		return toSnakeCase(this.name)
	}

	public async populateRowCount(): Promise<number> {
		let sql = `SELECT count(*) AS count FROM "${this.name}"`

		let results = await databasePoolMS.request().query(sql)
		if (!!results && !!results.recordsets[0]) {
			return (results.recordsets[0] as any)['count'] ?? 0
		}

		return 0
	}

	public areCardinalitiesPopulated(): boolean {
		let allArePopulated = true

		for (const column of this.columns) {
			if (column.cardinality === null) {
				allArePopulated = false
				break
			}
		}

		return allArePopulated
	}

	public hasFKForColumn(columnName: string): boolean {
		for (const foreignKey of this.originalForeignKeys) {
			if (foreignKey.foreignColumn === columnName) {
				return true
			}
		}

		for (const foreignKey of this.newForeignKeys) {
			if (foreignKey.foreignColumn === columnName) {
				return true
			}
		}

		return false
	}

	static FindMSTable(tableName: string, msTables: MSTable[]): MSTable | null {
		for (const msTable of msTables) {
			if (msTable.name === tableName || msTable.newName === tableName) {
				return msTable
			}
		}

		return null
	}

	public findMSColumn(columnName: string): MSColumn | null {
		for (const column of this.columns) {
			if (column.COLUMN_NAME === columnName || column.newName === columnName) {
				return column
			}
		}

		return null
	}

	public save(): boolean {
		// unset(this.overrideSize);
		for (let i = 0; i < this.columns.length; i++) {
			this.columns[i].clean()
			this.columns[i].cleanSave()
		}

		for (const fk of this.originalForeignKeys) {
			fk.clean()
		}

		for (const fk of this.newForeignKeys) {
			fk.clean()
		}

		this.newName = toSnakeCase(this.calcName())

		const json = JSON.stringify(this)

		MSTable.SetPermissions()

		fs.writeFileSync(tableJSONDir + '/' + this.name + '.json', json)

		return true
	}

	static SaveAll(msTables: MSTable[]) {
		// actions = "";
		for (const msTable of msTables) {
			msTable.save()
			// if (!publics::IsEmpty(msTable.migrationNotes)) {
			//     actions .= '# ' . msTable.name . PHP_EOL;
			//     actions .= msTable.migrationNotes . PHP_EOL;
			// }
		}

		// file_put_contents(__dir__ . '/MigrationNotes.md', actions);
	}

	static Load(fileName: string): MSTable | null {
		MSTable.SetPermissions()

		let calcFileName = fileName

		if (!calcFileName.endsWith('.json')) {
			calcFileName += '.json'
		}

		if (!calcFileName.startsWith(tableJSONDir)) {
			calcFileName = tableJSONDir + '/' + calcFileName
		}

		return new MSTable(JSON.parse(fs.readFileSync(calcFileName) as any) as MSTable)
	}

	/** @return MSTable[] */
	static LoadAll(): MSTable[] {
		MSTable.SetPermissions()

		let msTables: MSTable[] = []

		const tableJSONFiles = fs.readdirSync(tableJSONDir) as string[]

		// console.log(tableJSONFiles);

		for (const tableJSONFile of tableJSONFiles) {
			const msTable = MSTable.Load(tableJSONDir + '/' + tableJSONFile)
			if (!!msTable) {
				msTables.push(msTable)
			}
		}

		return msTables.sort((a, b) =>
			a.stepNo !== b.stepNo
				? a.stepNo - b.stepNo
				: a.calcName().localeCompare(b.calcName(), undefined, {sensitivity: 'base'})
		)
	}

	static ArePermissionsSet = false

	static SetPermissions() {
		// if (!self::ArePermissionsSet) {
		//     self::ArePermissionsSet = true;
		//
		//     exec('chmod a+rwx -R ' . __dir__);
		// }
	}

	public async loadColumns() {
		this.columns = await MSTable.Columns(this.name)
	}

	static async Columns(tableName: string): Promise<MSColumn[]> {
		await databasePoolMS.connect()

		return (((
			await databasePoolMS.request().query(`SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = '${tableName}'
    AND TABLE_CATALOG = '${MSConfig.database}'
    AND TABLE_SCHEMA = '${MSConfig.schema}'
    ORDER BY ORDINAL_POSITION`)
		).recordsets[0] ?? []) as any[]).map(column => new MSColumn(column))
	}
}
