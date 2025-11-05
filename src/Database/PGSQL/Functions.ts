import {CleanNumber} from '@solidbasisventures/intelliwaketsfoundation'

export function CleanDefaultRepeatValue(defaultValue: any): string | null {
	let useDefault = defaultValue?.toString().toLowerCase()

	if (useDefault.includes('repeat')) {
		let vals = useDefault.match(/repeat\('(.)', (\d+)\)/)
		if (vals && vals[1] && vals[2]) {
			return `'${vals[1]}'.repeat(${CleanNumber(vals[2])})`
		}
		vals = useDefault.match(/repeat\('(.)'::text,\s*(\d+)\).*?bit\((\d+)\)/)
		if (vals && vals[1] && vals[2]) {
			return `'${vals[1]}'.repeat(${CleanNumber(vals[2])})`
		}
	}

	return null
}
