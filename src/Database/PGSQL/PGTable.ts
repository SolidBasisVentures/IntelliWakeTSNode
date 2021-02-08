import {PGColumn} from './PGColumn'
import {PGIndex} from './PGIndex'
import {PGForeignKey} from './PGForeignKey'
import moment from 'moment'
import {IsOn} from '@solidbasisventures/intelliwaketsfoundation'
import {PGEnum} from './PGEnum'

const TS_EOL = '\n' // was \r\n

export class PGTable {
	public name = ''
	public description = ''
	public check: string | string[] | null = null
	
	public inherits: string[] = []
	
	public columns: PGColumn[] = []
	
	public indexes: PGIndex[] = []
	
	public foreignKeys: PGForeignKey[] = []
	
	constructor(instanceData?: PGTable) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}
	
	protected deserialize(instanceData: PGTable) {
		const keys = Object.keys(this)
		
		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				switch (key) {
					case 'columns':
						for (const column of (instanceData as any)[key] as PGColumn[]) {
							;(this as any)[key].push(new PGColumn(column))
						}
						break
					case 'indexes':
						for (const index of (instanceData as any)[key] as PGIndex[]) {
							;(this as any)[key].push(new PGIndex(index))
						}
						break
					case 'foreignKeys':
						for (const foreignKey of (instanceData as any)[key] as PGForeignKey[]) {
							;(this as any)[key].push(new PGForeignKey(foreignKey))
						}
						break
					default:
						;(this as any)[key] = (instanceData as any)[key]
						break
				}
			}
		}
	}
	
	public indexOfColumn(columnName: string): number {
		return this.columns.findIndex((column) => column.column_name === columnName)
	}
	
	public indexesOfForeignKeyByColumn(columnName: string): number[] {
		let indexes: number[] = []
		
		for (let i = 0; i < this.foreignKeys.length; i++) {
			if (this.foreignKeys[i].columnNames.includes(columnName)) {
				indexes.push(i)
			}
		}
		
		return indexes
	}
	
	public getForeignKeysByColumn(columnName: string): PGForeignKey[] {
		let fks: PGForeignKey[] = []
		
		const indexes = this.indexesOfForeignKeyByColumn(columnName)
		
		for (const index of indexes) {
			fks.push(this.foreignKeys[index])
		}
		
		return fks
	}
	
	public removeForeignKeysByColumn(columnName: string) {
		this.foreignKeys = this.foreignKeys.filter((foreignKey) => !foreignKey.columnNames.includes(columnName))
	}
	
	public removeIndexsByColumn(columnName: string) {
		this.indexes = this.indexes.filter((index) => !index.columns.includes(columnName))
	}
	
	public addForeignKey(pgForeignKey: PGForeignKey) {
		this.foreignKeys.push(pgForeignKey)
	}
	
	public getColumn(columnName: string): PGColumn | null {
		return this.columns.find((column) => column.column_name === columnName) ?? null
	}
	
	public removeColumn(columnName: string) {
		const column = this.getColumn(columnName)
		
		if (!!column) {
			this.removeForeignKeysByColumn(columnName)
			
			this.columns.filter((column) => column.column_name !== columnName)
			
			this.reOrderColumns()
		}
	}
	
	public addColumn(pgColumn: PGColumn) {
		const pgColumnToAdd = new PGColumn(pgColumn)
		
		if (!pgColumnToAdd.ordinal_position) {
			pgColumnToAdd.ordinal_position = 999999
		}
		
		this.columns = this.columns.filter((column) => column.column_name !== pgColumnToAdd.column_name)
		
		for (let i = 0; i < this.columns.length; i++) {
			if (this.columns[i].ordinal_position >= pgColumnToAdd.ordinal_position) {
				this.columns[i].ordinal_position++
			}
		}
		
		this.columns.push(pgColumnToAdd)
		
		this.reOrderColumns()
	}
	
	public reOrderColumns() {
		this.columns = this.columns.sort((a, b) => a.ordinal_position - b.ordinal_position)
		
		let position = 0
		
		for (let i = 0; i < this.columns.length; i++) {
			position++
			this.columns[i].ordinal_position = position
		}
	}
	
	public addIndex(pgIndex: PGIndex) {
		this.indexes.push(pgIndex)
	}
	
	public tableHeaderText(forTableText: string): string {
		let text = '/**' + TS_EOL
		text += ' * Automatically generated: ' + moment().format('Y-MM-DD HH:mm:ss') + TS_EOL
		text += ' * © ' + moment().format('Y') + ', Solid Basis Ventures, LLC.' + TS_EOL // Must come after generated date so it doesn't keep regenerating
		text += ' * DO NOT MODIFY' + TS_EOL
		text += ' *' + TS_EOL
		text += ' * ' + forTableText + ': ' + this.name + TS_EOL
		if (!!this.description) {
			text += ' *' + TS_EOL
			text += ' * ' + PGTable.CleanComment(this.description) + TS_EOL
		}
		text += ' */' + TS_EOL
		text += TS_EOL
		
		return text
	}
	
	public tsText(): string {
		let text = this.tableHeaderText('Table Manager for')
		if (this.inherits.length > 0) {
			for (const inherit of this.inherits) {
				text += `import {I${inherit}, initial_${inherit}} from "./I${inherit}"${TS_EOL}`
			}
		}
		
		const enums = Array.from(
			new Set(
				[...this.columns
					.map((column) => (typeof column.udt_name !== 'string' ? column.udt_name.enumName : ''))
					.filter((enumName) => !!enumName),
				 ...this.columns
					 .map((column) => (typeof column.udt_name === 'string' && column.udt_name.startsWith('e_') ? PGEnum.TypeName(column.udt_name) : ''))
					 .filter((enumName) => !!enumName)
				 ]
			)
		)
		
		if (enums.length > 0) {
			for (const enumItem of enums) {
				text += `import {${enumItem}} from "../Enums/${enumItem}"${TS_EOL}`
			}
			
			text += TS_EOL
		}
		
		text += `export interface I${this.name}`
		if (this.inherits.length > 0) {
			text += ` extends I${this.inherits.join(', I')}`
		}
		text += ` {` + TS_EOL
		for (const pgColumn of this.columns) {
			// if (!!pgColumn.column_comment || !!pgColumn.generatedAlwaysAs) {
			if (!!pgColumn.column_comment) {
				text += `\t/** `
				text += `${PGTable.CleanComment(pgColumn.column_comment)} `
				text += `*/${TS_EOL}`
			}
			// if (!!pgColumn.generatedAlwaysAs) {
			// 	text += `GENERATED AS: ${PGTable.CleanComment(pgColumn.generatedAlwaysAs)} `
			// }
			// }
			text += '\t'
			text += pgColumn.column_name
			text += ': '
			text += pgColumn.jsType()
			if (pgColumn.array_dimensions.length > 0) {
				text += `[${pgColumn.array_dimensions.map(() => '').join('],[')}]`
			}
			if (IsOn(pgColumn.is_nullable ?? 'YES')) {
				text += ' | null'
			}
			text += TS_EOL
		}
		text += '}' + TS_EOL
		text += TS_EOL
		text += `export const initial_${this.name}: I${this.name} = {` + TS_EOL
		let addComma = false
		if (this.inherits.length > 0) {
			text += `\t...initial_${this.inherits.join(`,${TS_EOL}\t...initial_`)},${TS_EOL}`
		}
		for (const pgColumn of this.columns) {
			if (addComma) {
				text += ',' + TS_EOL
			}
			text += '\t'
			text += pgColumn.column_name
			text += ': '
			if (pgColumn.array_dimensions.length > 0) {
				if (IsOn(pgColumn.is_nullable)) {
					text += 'null'
				} else {
					text += `[${pgColumn.array_dimensions.map(() => '').join('],[')}]`
				}
			} else {
				if (!pgColumn.blobType()) {
					if (IsOn(pgColumn.is_identity) && pgColumn.isAutoIncrement) {
						text += '0'
					} else if (pgColumn.booleanType()) {
						if (IsOn(pgColumn.is_nullable)) {
							text += 'null'
						} else {
							text += IsOn(pgColumn.column_default) ? 'true' : 'false'
						}
					} else if (
						!!pgColumn.column_default ||
						(typeof pgColumn.udt_name !== 'string' && !!pgColumn.udt_name.defaultValue)
					) {
						if (pgColumn.dateType()) {
							text += '\'\''
						} else if (pgColumn.integerFloatType() || pgColumn.dateType()) {
							text += pgColumn.column_default
						} else if (typeof pgColumn.udt_name !== 'string') {
							text +=
								'\'' + (pgColumn.column_default ?? pgColumn.udt_name.defaultValue ?? '') + '\' as ' + pgColumn.jsType()
						} else if (!!pgColumn.column_default && pgColumn.column_default.toString().includes('::')) {
							if (pgColumn.udt_name.startsWith('e_')) {
								const colDefault = pgColumn.column_default.toString()
								text += PGEnum.TypeName(pgColumn.udt_name)
								text += '.'
								text += colDefault.substr(1, colDefault.indexOf('::') - 2)
								text += ' as '
								text += PGEnum.TypeName(pgColumn.udt_name)
							} else {
								text += '\'' + (pgColumn.column_default ?? '').toString().substring(0, (pgColumn.column_default ?? '').toString().indexOf('::') - 2) + '\''
							}
						} else {
							text += '\'' + (pgColumn.column_default ?? '') + '\''
						}
					} else if (IsOn(pgColumn.is_nullable)) {
						text += 'null'
					} else {
						if (pgColumn.booleanType()) {
							text += 'true'
						} else if (pgColumn.integerFloatType()) {
							text += '0'
						} else if (pgColumn.dateType()) {
							text += '\'\''
						} else {
							text += '\'\''
						}
					}
				} else {
					text += '\'\''
				}
			}
			addComma = true
		}
		text += TS_EOL + '}' + TS_EOL // Removed semi
		
		return text
	}
	
	public tsTextTable(): string {
		let text = this.tableHeaderText('Table Class for')
		text += `import {initial_${this.name}, I${this.name}} from "@Common/Tables/I${this.name}"` + TS_EOL
		text += `import {TTables} from "../Database/Tables"` + TS_EOL
		text += `import {TConnection} from "../Database/pgsqlConnection"` + TS_EOL
		text += `import {_CTable} from "./_CTable"` + TS_EOL
		for (const inherit of this.inherits) {
			text += `import {_C${inherit}} from "./_C${inherit}"` + TS_EOL
		}
		text += TS_EOL
		text += `export class C${this.name} extends _CTable<I${this.name}>`
		if (this.inherits.length > 0) {
			text += `, C${this.inherits.join(', C')}`
		}
		text += ` {` + TS_EOL
		text += `\tpublic readonly table: TTables` + TS_EOL
		text += TS_EOL
		text += `\tconstructor(connection: TConnection, initialValues?: I${this.name} | any) {` + TS_EOL
		text += `\t\tsuper(connection, initialValues, {...initial_${this.name}})` + TS_EOL
		text += TS_EOL
		text += `\t\tthis.table = '${this.name}'` + TS_EOL
		text += `\t}` + TS_EOL
		text += `}` + TS_EOL
		
		return text
	}
	
	public ddlPrimaryKey(): string | null {
		let found = false
		
		let ddl = `PRIMARY KEY ("`
		
		for (const column of this.columns) {
			if (IsOn(column.is_identity)) {
				if (found) {
					ddl += `","`
				}
				ddl += column.column_name
				found = true
			}
		}
		
		if (found) {
			ddl += `")`
			
			return ddl
		}
		
		return null
	}
	
	public ddlCreateTableText(createForeignKeys: boolean, createIndexes: boolean): string {
		let ddl = ''
		
		/** @noinspection SqlResolve */
		ddl += `DROP TABLE IF EXISTS ${this.name} CASCADE;` + TS_EOL
		ddl += `CREATE TABLE ${this.name} (` + TS_EOL
		
		let prevColumn: PGColumn | null = null
		for (const pgColumn of this.columns) {
			if (prevColumn !== null) {
				ddl += ',' + TS_EOL
			}
			
			ddl += '\t' + pgColumn.ddlDefinition()
			
			prevColumn = pgColumn
		}
		const pk = this.ddlPrimaryKey()
		if (!!pk) {
			ddl += ',' + TS_EOL + '\t' + pk
		}
		
		if (!!this.check) {
			const checkItems = (typeof this.check === 'string' ? [this.check] : this.check).filter((item) => !!item)
			
			for (const checkItem of checkItems) {
				ddl += `,${TS_EOL}\tCHECK (${checkItem})`
			}
		}
		
		ddl += TS_EOL
		ddl += ')'
		
		if (this.inherits.length > 0) {
			ddl += TS_EOL + `INHERITS (${this.inherits.join(',')})`
		}
		
		ddl += ';'
		
		if (createIndexes) {
			ddl += this.ddlCreateIndexes()
		}
		
		if (createForeignKeys) {
			ddl += this.ddlCreateForeignKeysText()
		}
		
		return ddl
	}
	
	public ddlCreateIndexes(): string {
		let ddl = ''
		
		for (const index of this.indexes) {
			ddl += TS_EOL + index.ddlDefinition(this)
		}
		
		return ddl
	}
	
	public ddlCreateForeignKeysText(): string {
		let ddl = ''
		
		for (const foreignKey of this.foreignKeys) {
			ddl += foreignKey.ddlConstraintDefinition(this) + TS_EOL
		}
		
		return ddl
	}
	
	public static CleanComment(comment: string): string {
		if (!comment) {
			return comment
		}
		
		return comment.replace(/[\n\r]/g, ' ')
	}
}
