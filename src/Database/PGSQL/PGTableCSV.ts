import {PGTable} from './PGTable'
import {FileReadStream} from '../../FileReadStream'
import {CoalesceFalsey, GreaterNumber} from '@solidbasisventures/intelliwaketsfoundation'
import {PGColumn} from './PGColumn'

export class PGTableCSV extends PGTable {
	public async buildFromCSV(fileName: string): Promise<this> {
		this.name = fileName.split('/')[fileName.split('/').length - 1]?.split('.')[0] ?? ''

		type TFieldAnalysis = {
			name: string
			hasBlanks: boolean
			forcedString: boolean
			hasNumerics: boolean
			hasAlpha: boolean
			hasPeriod: boolean
			hasColon: boolean
			hasForwardSlash: boolean
			hasDash: boolean
			isTrueFalse: boolean
			maxLength: number | null
			minLength: number | null
			startsWithYear: boolean
			precisionLength: number | null
		}

		const initialFieldAnalysis: TFieldAnalysis = {
			name: '',
			hasBlanks: false,
			forcedString: false,
			hasNumerics: false,
			hasAlpha: false,
			hasPeriod: false,
			hasColon: false,
			hasForwardSlash: false,
			hasDash: false,
			isTrueFalse: true,
			maxLength: null,
			minLength: null,
			startsWithYear: true,
			precisionLength: null
		}

		let fields: TFieldAnalysis[] = []

		await FileReadStream(fileName, {
			onFirstLine: data => {
				fields = data
					.split(',')
					.map((field, idx) => (CoalesceFalsey(field, `field${idx}`) ?? '').toLowerCase())
					.map(field => ({
						...initialFieldAnalysis,
						name: field
					}))
			},
			onSubsequentLine: data => {
				const values = data.split(',').map(value => value.trim())

				values.forEach((value, idx) => {
						const field = fields[idx]
						if (!field) throw new Error('Empty field')

						if (value === '""') {
							field.hasBlanks = true
							field.forcedString = true
						}
						if (!value) {
							field.hasBlanks = true
						} else {
							let useValue = value
							if (value.startsWith('"') && value.endsWith('"')) {
								field.forcedString = true
								useValue = value.substring(1, value.length - 1)
							}

							if (!field.hasNumerics && /\d/.test(useValue)) field.hasNumerics = true
							if (!field.hasAlpha && /[a-z]/i.test(useValue)) field.hasAlpha = true
							if (!field.hasAlpha && /[~`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?]/g.test(useValue)) field.hasAlpha = true
							if (!field.hasColon && /[:]/i.test(useValue)) field.hasColon = true
							if (!field.hasForwardSlash && /[/]/i.test(useValue)) field.hasForwardSlash = true
							if (!field.hasDash && /[-]/i.test(useValue)) field.hasDash = true

							if (field.hasNumerics) {
								if (/[.]/i.test(useValue)) {
									field.hasPeriod = true
									field.startsWithYear = false
									field.precisionLength = GreaterNumber(field.precisionLength, useValue.split('.')[1].length)
								} else {
									if (field.startsWithYear) {
										if (value.length < 8 || (!value.startsWith('19') && !value.startsWith('2'))) {
											field.startsWithYear = false
										}
									}
								}
							} else {
								field.startsWithYear = false
							}

							if (field.isTrueFalse && !['yes', 'true', 'y', 't', '1', 'no', 'false', 'n', 'f', '0'].includes(value.toLowerCase())) field.isTrueFalse = false

							if (!field.maxLength || field.maxLength > value.length) field.maxLength = value.length
							if (!field.minLength || field.minLength < value.length) field.minLength = value.length
						}
					}
				)
			}
		})

		// console.table(fields)

		fields.forEach(field => {
			const column = new PGColumn({
				column_name: field.name,
				is_nullable: field.hasBlanks ? 'YES' : 'NO'
			})

			if (field.isTrueFalse) {
				column.udt_name = PGColumn.TYPE_BOOLEAN
			} else if (field.hasAlpha || field.forcedString) {
				column.udt_name = PGColumn.TYPE_VARCHAR
				column.character_maximum_length = field.maxLength
			} else if (field.hasNumerics) {
				if (field.startsWithYear && field.maxLength === field.minLength && (field.maxLength === 8 || (field.maxLength === 10 && (field.hasDash || field.hasForwardSlash)))) {
					column.udt_name = PGColumn.TYPE_DATE
				} else if (field.startsWithYear && field.maxLength === field.minLength && field.maxLength === 8 && field.hasColon) {
					column.udt_name = PGColumn.TYPE_TIME
				} else if (field.startsWithYear && field.maxLength === field.minLength && (field.maxLength ?? 0) >= 12 && field.hasColon && (field.hasDash || field.hasForwardSlash)) {
					column.udt_name = PGColumn.TYPE_TIMESTAMPTZ
				} else if (field.hasPeriod) {
					column.udt_name = PGColumn.TYPE_NUMERIC
					column.character_maximum_length = GreaterNumber(field.maxLength, GreaterNumber(field.precisionLength, 2) + 3, 6)
					column.numeric_precision = GreaterNumber(field.precisionLength, 2)
				} else if ((field.maxLength ?? 0) > 9) {
					column.udt_name = PGColumn.TYPE_BIGINT
				} else {
					column.udt_name = PGColumn.TYPE_INTEGER
				}
			} else {
				throw new Error(`Cannot determine type of column ${field.name}`)
			}

			this.addColumn(column)
		})

		// console.table(this.columns.map(column => PickProperty(column, 'column_name', 'udt_name')))

		return this
	}
}
