import {ToSnakeCase} from '../../Functions'

export class PGEnum {
	public enumName = ''
	public values: string[] = []
	public defaultValue: string | null | undefined

	constructor(instanceData?: PGEnum) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: PGEnum) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}
	
	public get columnName(): string {
	return ToSnakeCase(this.enumName)
}

	public ddlRemove(): string {
		return `DROP TYPE IF EXISTS ${this.columnName} CASCADE `
	}

	public ddlDefinition(): string {
		return `CREATE TYPE ${this.columnName} AS ENUM ('${this.values.join("','")}')`
	}
}
