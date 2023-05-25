import {PGColumn} from './PGColumn'
import {PGIndex} from './PGIndex'
import {PGForeignKey} from './PGForeignKey'
import type {TObjectConstraint, TObjectFieldConstraint} from '@solidbasisventures/intelliwaketsfoundation'
import {
	CleanNumber,
	CoalesceFalsey,
	IsOn,
	RemoveEnding,
	ReplaceAll,
	SortCompare,
	YYYY_MM_DD_HH_mm_ss
} from '@solidbasisventures/intelliwaketsfoundation'
import {PGEnum} from './PGEnum'

export const TS_EOL = '\n' // was \r\n

export interface ICTableRelativePaths extends TPGTableTextOptions {
	/** @Common/Tables */
	initials?: string
	/** ../Database */
	tTables?: string
	responseContext?: string
	responseContextName?: string
	responseContextClass?: string
}

export interface IFixedWidthMapOptions {
	startColumnName?: string
	startPosition: number
	lastColumnName?: string
	stopBeforeColumnName?: string
}

export interface IFixedWidthMap<T> {
	column_name: keyof T,
	startPosition: number
	positionWidth: number
}

export const initialFixedWidthMapOptions: IFixedWidthMapOptions = {
	startPosition: 0
}

export type TPGTableTextOptions = {
	includeConstraint?: boolean
}

export class PGTable {
	public name = ''
	public description = ''
	public check: string | string[] | null = null

	public inherits: string[] = []

	public columns: PGColumn[] = []

	public indexes: PGIndex[] = []

	public foreignKeys: PGForeignKey[] = []

	public importWithTypes = false

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

	public addColumn(pgColumn: Partial<PGColumn>) {
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

	public tableHeaderText(forTableText: string, modifyStatement = 'DO NOT MODIFY'): string {
		let text = '/**' + TS_EOL
		text += ' * Automatically generated: ' + YYYY_MM_DD_HH_mm_ss('now') + TS_EOL
		text += ' * © ' + (new Date()).getFullYear() + ', Solid Basis Ventures, LLC.' + TS_EOL // Must come after generated date so it doesn't keep regenerating
		text += ` * ${modifyStatement}` + TS_EOL
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

	/**
	 * Generates type definitions for a table.
	 *
	 * @param options
	 */
	public tsText(options?: TPGTableTextOptions): string {
		let text = this.tableHeaderText('Table Manager for')

		if (options?.includeConstraint) {
			text += `import type {TObjectConstraint} from '@solidbasisventures/intelliwaketsfoundation'${TS_EOL}`
		}

		if (this.inherits.length > 0) {
			for (const inherit of this.inherits) {
				if (this.importWithTypes) {
					text += `import type {I${inherit}} from './I${inherit}'${TS_EOL}`
					text += `import {initial_${inherit}} from './I${inherit}'${TS_EOL}`
				} else {
					text += `import {I${inherit}, initial_${inherit}} from './I${inherit}'${TS_EOL}`
				}
			}
		}

		const enums: { column_name: string, enum_name: string, default_value?: string }[] = Array.from(
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
									       const enumName = items[1]?.split('.')[0]?.trim()
									       let enumDefault = CoalesceFalsey(items[1]?.split('.')[1], items[2], column.column_default)?.toString()?.trim()
									       if (enumDefault?.startsWith('\'{}\'')) {
										       enumDefault = '[]'
									       }

									       // console.info(column.column_name, enumName, enumDefault)

									       if (!enumName) {
										       throw new Error('Enum requested in comment, but not specified  - Format {Enum: ETest} for nullable or {Enum: ETest.FirstValue}')
									       }
									       if (!IsOn(column.is_nullable) && !enumDefault && !column.array_dimensions.length) {
										       throw new Error('Not Nullable Enum requested in comment, but no default value specified - Format {Enum: ETest.FirstValue}')
									       }
									       return {
										       column_name: column.column_name,
										       enum_name: enumName,
										       default_value: column.array_dimensions.length > 0 ?
											       (IsOn(column.is_nullable) ? 'null' : enumDefault ?? '[]') :
											       (!enumDefault ? 'null' : `${enumName}.${enumDefault}`)
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

		type TInterfaceBuild = {
			column_name: string,
			interface_name: string,
			default_value?: string,
			otherImportItem?: string | null
		}
		const interfaces: TInterfaceBuild[] = Array.from(
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
									       const interfaceName = items[1]?.split('.')[0]?.trim()
									       let interfaceDefault = (CoalesceFalsey(items[1]?.split('.')[1], items[2], column.column_default)?.toString()?.trim()) ?? (IsOn(column.is_nullable) ? 'null' : '{}')

									       if (!interfaceName) {
										       throw new Error('Interface requested in comment, but not specified  - Format {Interface: ITest} for nullable or {Interface: ITest.initialValue}')
									       }

									       return {
										       column_name: column.column_name,
										       interface_name: interfaceName,
										       otherImportItem: interfaceDefault,
										       default_value: column.array_dimensions.length > 0 ?
											       (IsOn(column.is_nullable) ? 'null' : interfaceDefault ?? '[]') :
											       interfaceDefault
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

		type TTypeBuild = { column_name: string, type_name: string }
		const types: TTypeBuild[] = Array.from(
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
								       if ((items[0] ?? '').toLowerCase().trim() === 'type') {
									       const typeName = items[1]?.split('.')[0]?.trim()

									       if (!typeName) {
										       throw new Error('Type requested in comment, but not specified  - Format {type: TTest}')
									       }

									       return {
										       column_name: column.column_name,
										       type_name: typeName
									       }
								       }
							       }
						       }
						       return {column_name: column.column_name, type_name: ''}
					       })
				]
					.filter(enumName => !!enumName.type_name)
			)
		)

		enums.map(enumItem => enumItem.enum_name).reduce<string[]>((results, enumItem) => results.includes(enumItem) ? results : [...results, ReplaceAll('[]', '', enumItem)], [])
		     .forEach(enumItem => {
			     text += `import ${(this.importWithTypes &&
				     !this.columns.some(column => ReplaceAll(' ', '', column.column_comment ?? '').toLowerCase().includes(`{enum:${enumItem.toLowerCase()}`) &&
					     (ReplaceAll(' ', '', column.column_comment ?? '').toLowerCase().includes(`{enum:${enumItem.toLowerCase()}.`) ||
						     (!!column.column_default &&
							     !(column.column_default ?? '').toString().includes('{}') &&
							     (column.column_default ?? '').toString().toLowerCase() !== 'null')))) ?
				     'type ' : ''}{${enumItem}} from "../Enums/${enumItem}"${TS_EOL}`
		     })

		interfaces.map(interfaceItem => interfaceItem).reduce<TInterfaceBuild[]>((results, interfaceItem) => results.some(result => result.interface_name === interfaceItem.interface_name && (!!result.otherImportItem || !interfaceItem.otherImportItem)) ? results : [...results.filter(result => result.interface_name !== interfaceItem.interface_name), interfaceItem], [])
		          .forEach(interfaceItem => {
			          text += `import ${this.importWithTypes ? 'type ' : ''}{${interfaceItem.interface_name}${(!interfaceItem.otherImportItem || interfaceItem?.otherImportItem?.toLowerCase() === 'null') ? '' : `, ${interfaceItem.otherImportItem}`}} from "../Interfaces/${interfaceItem.interface_name}"${TS_EOL}`
		          })

		if (enums.length > 0 || interfaces.length > 0) {
			text += TS_EOL
		}

		types.map(typeItem => typeItem)
		     .reduce<TTypeBuild[]>((results, typeItem) => results.some(result => result.type_name === typeItem.type_name) ?
			     results :
			     [...results.filter(result => result.type_name !== typeItem.type_name), typeItem], [])
		     .forEach(typeItem => {
			     text += `import ${this.importWithTypes ? 'type ' : ''}{${typeItem.type_name}} from "../Types/${typeItem.type_name}"${TS_EOL}`
		     })

		if (types.length > 0) {
			text += TS_EOL
		}

		if (this.description) {
			text += `/** ${this.description} */${TS_EOL}`
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
			text += ReplaceAll('[]', '', enums.find(enumItem => enumItem.column_name === pgColumn.column_name)?.enum_name ??
				interfaces.find(interfaceItem => interfaceItem.column_name === pgColumn.column_name)?.interface_name ??
				types.find(typeItem => typeItem.column_name === pgColumn.column_name)?.type_name ??
				pgColumn.jsType()).trim()
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

			// if (pgColumn.column_name === 'inspect_roles') {
			// 	console.log('Column', pgColumn)
			// 	console.log('ItemDefault', itemDefault)
			// 	console.log('Arry Len', pgColumn.array_dimensions.length)
			// }

			if (!!itemDefault) {
				// console.log('HERE', enums.find(enumItem => enumItem.column_name === pgColumn.column_name))
				// console.log('THERE', pgColumn)
				if (itemDefault.endsWith('.') && IsOn(pgColumn.is_nullable) && !pgColumn.column_default) {
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
								text += colDefault.substring(1, 1 + colDefault.indexOf('::') - 2)
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
		text += TS_EOL + '}' + TS_EOL

		if (options?.includeConstraint) {
			const constraint: TObjectConstraint = {}

			for (const pgColumn of this.columns) {
				const fieldConstraint: TObjectFieldConstraint = {}

				if (pgColumn.booleanType()) {
					fieldConstraint.type = 'boolean'
					if (pgColumn.column_default && !pgColumn.isArray()) {
						fieldConstraint.default = IsOn(pgColumn.column_default)
					}
				} else if (pgColumn.integerFloatType()) {
					fieldConstraint.type = 'number'
					if (pgColumn.numeric_precision) {
						fieldConstraint.length = CleanNumber(pgColumn.numeric_precision)
					}
					if (pgColumn.column_default && !pgColumn.isArray()) {
						fieldConstraint.default = CleanNumber(pgColumn.column_default)
					}
				} else if (pgColumn.jsonType()) {
					fieldConstraint.type = 'object'
				} else if (pgColumn.dateOnlyType()) {
					fieldConstraint.type = 'date'
					if (pgColumn.column_default && !pgColumn.isArray()) {
						fieldConstraint.default = 'now'
					}
				} else if (pgColumn.dateTimeOnlyType()) {
					fieldConstraint.type = 'datetime'
					if (pgColumn.column_default && !pgColumn.isArray()) {
						fieldConstraint.default = 'now'
					}
				} else if (pgColumn.timeOnlyType()) {
					fieldConstraint.type = 'time'
					if (pgColumn.column_default && !pgColumn.isArray()) {
						fieldConstraint.default = 'now'
					}
				} else {
					fieldConstraint.type = 'string'
					if (pgColumn.character_maximum_length) {
						fieldConstraint.length = pgColumn.character_maximum_length
					}
					if (pgColumn.column_default && !pgColumn.isArray()) {
						fieldConstraint.default = ''
					}
				}

				fieldConstraint.nullable = IsOn(pgColumn.is_nullable)

				if (pgColumn.isArray()) {
					fieldConstraint.isArray = true
					if (!fieldConstraint.nullable) {
						fieldConstraint.default = []
					}
				}

				// if (pgColumn.column_name === 'sysuser_ids' || pgColumn.column_name === 'freshxpert_sysuser_id')
				// 	console.log(this.name, pgColumn)

				constraint[pgColumn.column_name] = fieldConstraint
			}

			text += TS_EOL + `export const Constraint_${this.name}: TObjectConstraint<I${this.name}> = ${JSON.stringify(constraint, undefined, 4)}` + TS_EOL
		}

		return text
	}

	/*export class Cprogress_report_test extends _CTable<Iprogress_report_test> {
	public readonly table: TTables

	constructor(responseContext: ResponseContext, initialValues?: Partial<Iprogress_report_test>) {
		super(responseContext, initialValues, {...initial_progress_report_test})

		this.table = 'progress_report_test'
	}
}*/

	public static TSTables(tables: string[]): string {
		let text = `export type TTables =`
		text += TS_EOL
		text += '\t'
		text += tables
			.filter(table => !!table)
			.sort((a, b) => SortCompare(a, b))
			.map(table => `'${table}'`)
			.join(TS_EOL + '\t| ')
		text += TS_EOL

		return text
	}

	/**
	 * Generates the text for a class that manages the table itself.  Must inherit from a local _CTable base class.
	 *
	 * @param relativePaths
	 */
	public tsTextTable(relativePaths?: ICTableRelativePaths): string {
		const usePaths: Required<ICTableRelativePaths> = {
			initials: RemoveEnding('/', relativePaths?.initials ?? '@Common/Tables', true),
			tTables: RemoveEnding('/', relativePaths?.tTables ?? '../Database', true),
			responseContext: RemoveEnding('/', relativePaths?.responseContext ?? '../MiddleWare/ResponseContext', true),
			responseContextName: relativePaths?.responseContextName ?? 'responseContext',
			responseContextClass: relativePaths?.responseContextClass ?? 'ResponseContext',
			includeConstraint: !!relativePaths?.includeConstraint
		}

		let text = this.tableHeaderText('Table Class for', 'MODIFICATIONS WILL NOT BE OVERWRITTEN')
		if (this.importWithTypes) {
			text += `import {initial_${this.name}${usePaths.includeConstraint ? `, Constraint_${this.name}` : ''}} from '${usePaths.initials}/I${this.name}'` + TS_EOL
			text += `import type {I${this.name}} from '${usePaths.initials}/I${this.name}'` + TS_EOL
		} else {
			text += `import {initial_${this.name}, I${this.name}} from '${usePaths.initials}/I${this.name}'` + TS_EOL
		}
		text += `import ${this.importWithTypes ? 'type ' : ''}{TTables} from '${usePaths.tTables}/TTables'` + TS_EOL
		text += `import {_CTable} from './_CTable'` + TS_EOL
		text += `import ${this.importWithTypes ? 'type ' : ''}{${usePaths.responseContextClass}} from '${usePaths.responseContext}'` + TS_EOL
		for (const inherit of this.inherits) {
			text += `import {_C${inherit}} from "./_C${inherit}"` + TS_EOL
		}
		text += TS_EOL
		if (this.description) {
			text += `/** ${this.description} */${TS_EOL}`
		}
		text += `export class C${this.name} extends _CTable<I${this.name}>`
		if (this.inherits.length > 0) {
			text += `, C${this.inherits.join(', C')}`
		}
		text += ` {` + TS_EOL
		text += `\tpublic readonly table: TTables` + TS_EOL
		text += TS_EOL
		text += `\tconstructor(${usePaths.responseContextName}: ${usePaths.responseContextClass}) {` + TS_EOL
		text += `\t\tsuper(${usePaths.responseContextName}, {...initial_${this.name}})` + TS_EOL
		text += TS_EOL
		if (usePaths.includeConstraint) {
			text += `\t\tthis.constraint = Constraint_${this.name}` + TS_EOL
		}
		text += `\t\tthis.table = '${this.name}'` + TS_EOL
		text += `\t}` + TS_EOL
		text += `}` + TS_EOL

		return text
	}

	public tsTextTableUpdateDescription(currentText: string): string {
		const currentTextLines = currentText.split(TS_EOL)

		let classIdx = currentTextLines.findIndex(line => line.startsWith('export class C'))
		if (classIdx > 0) {
			if (currentTextLines[classIdx - 1]?.startsWith('/** ')) {
				currentTextLines.splice(classIdx - 1, 1)
				if (this.description) {
					currentTextLines.splice(classIdx - 1, 0, `/** ${this.description} */`)
				}
			} else {
				if (this.description) {
					currentTextLines.splice(classIdx, 0, `/** ${this.description} */`)
				}
			}
		}

		return currentTextLines.join(TS_EOL)
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

	public fixedWidthMap<T>(options?: Partial<IFixedWidthMapOptions>): IFixedWidthMap<T>[] {
		const useOptions: IFixedWidthMapOptions = {...initialFixedWidthMapOptions, ...options}

		let currentPosition = useOptions.startPosition
		let validColumn = !useOptions.startColumnName

		let fixedWidthMaps: IFixedWidthMap<T>[] = []

		for (const column of this.columns) {
			if (useOptions.stopBeforeColumnName && column.column_name.toLowerCase() === useOptions.stopBeforeColumnName.toLowerCase()) {
				break
			}

			if (!validColumn) {
				if (column.column_name.toLowerCase() === useOptions.startColumnName) {
					validColumn = true
				}
			}

			if (validColumn) {
				const colLength = column.character_maximum_length ?? 0
				if (!colLength) {
					console.warn('Could not determine length for FixedWidthMap', column.column_name, column.udt_name)
				}
				fixedWidthMaps.push({
					column_name: column.column_name as any,
					startPosition: currentPosition,
					positionWidth: colLength
				})
				currentPosition += colLength
			}

			if (useOptions.lastColumnName && column.column_name.toLowerCase() === useOptions.lastColumnName.toLowerCase()) {
				break
			}
		}

		return fixedWidthMaps
	}
}
