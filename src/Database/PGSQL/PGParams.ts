export class PGParams {
	lastPosition: number
	values: any[]

	constructor() {
		this.lastPosition = 0
		this.values = []
	}

	public add(value: any): string {
		this.lastPosition++

		this.values.push(value)

		return '$' + this.lastPosition
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
}