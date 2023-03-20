import {PGTable} from './PGTable'
import {FileReadStream} from '../../FileReadStream'
import {CoalesceFalsey} from '@solidbasisventures/intelliwaketsfoundation'

export class PGTableCSV extends PGTable {
	public async buildFromCSV(fileName: string): Promise<this> {
		this.name = fileName.split('/')[fileName.split('/').length - 1]?.split('.')[0] ?? ''

		type TFieldAnalysis = {
			field: string
			hasBlanks: boolean
			forcedString: boolean
			hasNumerics: boolean
			hasAlpha: boolean
			hasPeriod: boolean
			hasColon: boolean
			hasForwardSlash: boolean
			hasDash: boolean
			maxLength: number | null
			minLength: number | null
		}

		const initialFieldAnalysis: TFieldAnalysis = {
			field: '',
			hasBlanks: false,
			forcedString: false,
			hasNumerics: false,
			hasAlpha: false,
			hasPeriod: false,
			hasColon: false,
			hasForwardSlash: false,
			hasDash: false,
			maxLength: null,
			minLength: null
		}

		let fields: TFieldAnalysis[] = []

		await FileReadStream(fileName, {
			onFirstLine: data => {
				fields = data
					.split(',')
					.map((field, idx) => (CoalesceFalsey(field, `field${idx}`) ?? '').toLowerCase())
					.map(field => ({
						...initialFieldAnalysis,
						field
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
							if (!field.hasPeriod && /[.]/i.test(useValue)) field.hasPeriod = true
							if (!field.hasColon && /[:]/i.test(useValue)) field.hasColon = true
							if (!field.hasForwardSlash && /[/]/i.test(useValue)) field.hasForwardSlash = true
							if (!field.hasDash && /[-]/i.test(useValue)) field.hasDash = true

							if (!field.maxLength || field.maxLength > value.length) field.maxLength = value.length
							if (!field.minLength || field.minLength < value.length) field.minLength = value.length
						}
					}
				)
			}
		})

		console.table(fields)

		return this
	}
}
