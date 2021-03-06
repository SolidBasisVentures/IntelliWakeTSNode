import {ReplaceAll} from '@solidbasisventures/intelliwaketsfoundation'

export class PGParams {
	lastPosition: number
	values: any[]

	constructor() {
		this.lastPosition = 0
		this.values = []
	}

	public add(value: any): string {
		// const idx = this.values.indexOf(value)
		//
		// if (idx >= 0) {
		// 	return `$${idx + 1}`
		// }
		
		this.lastPosition++

		this.values.push(value)

		return `$${this.lastPosition}`
	}

	public addLike(value: string): string {
		return this.add(`%${value}%`)
	}

	public addEqualNullable(field: string, value: any): string {
		if (value === null || value === undefined) {
			return `${field} IS NULL`
		} else {
			return `${field} = ${this.add(value)}`
		}
	}
	
	public replaceSQLWithValues(sql: string): string {
		let returnSQL = sql
		
		for (let i = this.values.length; i > 0; i--) {
			returnSQL = ReplaceAll(`$${i}`, typeof this.values[i - 1] === 'string' ? `'${this.values[i - 1]}'` : this.values[i - 1], returnSQL)
		}
		
		return returnSQL
	}
}
