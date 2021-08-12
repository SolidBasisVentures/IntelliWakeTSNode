import {PGColumn} from './PGColumn'
import {PGIndex} from './PGIndex'
import {PGForeignKey} from './PGForeignKey'
import {MomentDateTimeString, IsOn} from '@solidbasisventures/intelliwaketsfoundation'
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
	
	constructor(instanceData?: Partial<PGTable>) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}
	
	protected deserialize(instanceData: Partial<PGTable>) {
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
	
	public renameForeignKeysByColumn(fromName: string, toName: string, pgTables?: PGTable[]) {
		const thisObject = this
		
		this.foreignKeys.forEach(fk => {
			if (fk.columnNames.includes(fromName)) {
				fk.columnNames = [...fk.columnNames.filter(cN => cN !== fromName), toName]
			}
		})
		
		if (pgTables) {
			pgTables.filter(pgTable => pgTable.name !== thisObject.name).forEach(pgTable => {
				pgTable.foreignKeys.forEach(fk => {
					if (fk.primaryTable === thisObject.name) {
						if (fk.primaryColumns.includes(fromName)) {
							fk.primaryColumns = [...fk.primaryColumns.filter(pC => pC !== fromName), toName]
						}
					}
				})
			})
		}
	}
	
	public removeIndexsByColumn(columnName: string) {
		this.indexes = this.indexes.filter((index) => !index.columns.includes(columnName))
	}
	
	public renameIndexsByColumn(fromName: string, toName: string) {
		this.indexes.forEach(idx => {
			if (idx.columns.includes(fromName)) {
				idx.columns = [...idx.columns.filter(cN => cN !== fromName), toName]
			}
		})
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
			this.removeIndexsByColumn(columnName)
			
			this.columns = this.columns.filter((column) => column.column_name !== columnName)
			
			this.reOrderColumns()
		}
	}
	
	public renameColumn(fromName: string, toName: string, pgTables?: PGTable[]) {
		const column = this.getColumn(fromName)
		
		if (!!column) {
			column.column_name = toName
			
			this.renameForeignKeysByColumn(fromName, toName, pgTables)
			this.renameIndexsByColumn(fromName, toName)
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
		text += ' * Automatically generated: ' + MomentDateTimeString(new Date()) + TS_EOL
		text += ' * © ' + (new Date()).getFullYear() + ', Solid Basis Ventures, LLC.' + TS_EOL // Must come after generated date so it doesn't keep regenerating
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
		
		const enums: {column_name: string, enum_name: string, default_value?: string}[] = Array.from(
			new Set(
				[
					...this.columns
						.map((column) => ({
							column_name: column.column_name,
							enum_name: (typeof column.udt_name !== 'string' ? column.udt_name.enumName : '')
						})),
					...this.columns
						.map((column) => ({
							column_name: column.column_name,
							enum_name: (typeof column.udt_name === 'string' && column.udt_name.startsWith('e_') ? PGEnum.TypeName(column.udt_name) : '')
						})),
					...this.columns
						.map(column => {
							const regExp = /{([^}]*)}/
							const results = regExp.exec(column.column_comment)
							if (!!results && !!results[1]) {
								const commaItems = results[1].split(',')
								for (const commaItem of commaItems) {
									const items = commaItem.split(':')
									if ((items[0] ?? '').toLowerCase().trim() === 'enum') {
										return {
											column_name: column.column_name,
											enum_name: ((items[1] ?? '').split('.')[0] ?? '').trim(),
											default_value: column.array_dimensions.length > 0 ? '[]' : (items[2] ?? '').includes('.') ? items[2] : ((items[1] ?? '').split('.')[0] ?? '').trim() + '.' + (items[2] ?? ((items[1] ?? '').split('.')[1] ?? '')).trim()
										}
									}
								}
							}
							return {column_name: column.column_name, enum_name: ''}
						})
				]
					.filter(enumName => !!enumName.enum_name)
			)
		)
		
		const interfaces: {column_name: string, interface_name: string, default_value?: string}[] = Array.from(
			new Set(
				[
					...this.columns
						.map(column => {
							const regExp = /{([^}]*)}/
							const results = regExp.exec(column.column_comment)
							if (!!results && !!results[1]) {
								const commaItems = results[1].split(',')
								for (const commaItem of commaItems) {
									const items = commaItem.split(':')
									if ((items[0] ?? '').toLowerCase().trim() === 'interface') {
										return {
											column_name: column.column_name,
											interface_name: ((items[1] ?? '').split('.')[0] ?? '').trim(),
											default_value: column.array_dimensions.length > 0 ? '[]' : (items[2] ?? '').includes('.') ? items[2] : ((items[1] ?? '').split('.')[0] ?? '').trim() + '.' + (items[2] ?? ((items[1] ?? '').split('.')[1] ?? '')).trim()
										}
									}
								}
							}
							return {column_name: column.column_name, interface_name: ''}
						})
				]
					.filter(enumName => !!enumName.interface_name)
			)
		)
		
		enums.map(enumItem => enumItem.enum_name).reduce<string[]>((results, enumItem) => results.includes(enumItem) ? results : [...results, enumItem], [])
			.forEach(enumItem => {
				text += `import {${enumItem}} from "../Enums/${enumItem}"${TS_EOL}`
			})
		
		if (enums.length > 0) {
			text += TS_EOL
		}
		
		interfaces.map(interfaceItem => interfaceItem.interface_name).reduce<string[]>((results, enumItem) => results.includes(enumItem) ? results : [...results, enumItem], [])
			.forEach(interfaceItem => {
				text += `import {${interfaceItem}} from "../Interfaces/${interfaceItem}"${TS_EOL}`
			})
		
		if (interfaces.length > 0) {
			text += TS_EOL
		}
		
		text += `export interface I${this.name}`
		if (this.inherits.length > 0) {
			text += ` extends I${this.inherits.join(', I')}`
		}
		text += ` {` + TS_EOL
		for (const pgColumn of this.columns) {
			// if (!!pgColumn.column_comment || !!pgColumn.generatedAlwaysAs) {
			if (!!PGTable.CleanComment(pgColumn.column_comment)) {
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
			text += enums.find(enumItem => enumItem.column_name === pgColumn.column_name)?.enum_name ?? interfaces.find(interfaceItem => interfaceItem.column_name === pgColumn.column_name)?.interface_name ?? pgColumn.jsType()
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
			const itemDefault = enums.find(enumItem => enumItem.column_name === pgColumn.column_name)?.default_value ?? interfaces.find(interfaceItem => interfaceItem.column_name === pgColumn.column_name)?.default_value
			if (!!itemDefault) {
				// console.log('HERE', enums.find(enumItem => enumItem.column_name === pgColumn.column_name))
				// console.log('THERE', pgColumn)
				if (itemDefault.endsWith('.') && pgColumn.is_nullable === 'YES' && !pgColumn.column_default) {
					text += 'null'
				} else {
					text += itemDefault
				}
			} else if (pgColumn.array_dimensions.length > 0) {
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
						} else if (pgColumn.jsonType()) {
							text += (pgColumn.column_default ?? '{}').toString().substring(1, (pgColumn.column_default ?? '').toString().indexOf('::') - 1)
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
								// text += ' as '
								// text += PGEnum.TypeName(pgColumn.udt_name)
							} else {
								text += '\'' + (pgColumn.column_default ?? '').toString().substring(1, (pgColumn.column_default ?? '').toString().indexOf('::') - 1) + '\''
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
	
	/*export class Cprogress_report_test extends _CTable<Iprogress_report_test> {
	public readonly table: TTables

	constructor(responseContext: ResponseContext, initialValues?: Partial<Iprogress_report_test>) {
		super(responseContext, initialValues, {...initial_progress_report_test})

		this.table = 'progress_report_test'
	}
}*/
	
	public tsTextTable(): string {
		let text = this.tableHeaderText('Table Class for')
		text += `import {initial_${this.name}, I${this.name}} from '@Common/Tables/I${this.name}'` + TS_EOL
		text += `import {TTables} from '../Database/Tables'` + TS_EOL
		text += `import {_CTable} from './_CTable'` + TS_EOL
		text += `import {ResponseContext} from '../MiddleWare/ResponseContext'` + TS_EOL
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
		text += `\tconstructor(responseContext: ResponseContext, initialValues?: Partial<I${this.name}>) {` + TS_EOL
		text += `\t\tsuper(responseContext, initialValues, {...initial_${this.name}})` + TS_EOL
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
	
	public ddlCreateTableText(createForeignKeys: boolean, createIndexes: boolean, dropFirst = true): string {
		let ddl = ''
		
		/** @noinspection SqlResolve */
		if (dropFirst) {
			ddl += `DROP TABLE IF EXISTS ${this.name} CASCADE;` + TS_EOL
		}
		ddl += `CREATE TABLE ${this.name}
    (` + TS_EOL
		
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
		
		for (const pgColumn of this.columns.filter(col => !!col.column_comment)) {
			ddl += TS_EOL + `COMMENT ON COLUMN ${this.name}.${pgColumn.column_name} IS '${PGTable.CleanComment(pgColumn.column_comment, false)}';`
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
	
	public static CleanComment(comment: string, stripBrackets = true): string {
		if (!comment) {
			return comment
		}
		
		// noinspection RegExpRedundantEscape
		return stripBrackets ? comment.replace(/[\n\r]/g, ' ').replace(/\{(.+?)\}/g, '').trim() : comment.replace(/[\n\r]/g, ' ').trim()
	}
}
