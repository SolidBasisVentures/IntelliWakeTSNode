import {PGSQL, TConnection} from './PGSQL'

export class PGView {
	name = ''
	definition = ''

	constructor(instanceData?: Partial<PGView>) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	protected deserialize(instanceData: Partial<PGView>) {
		const keys = Object.keys(this) as (keyof PGView)[]

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData)[key]
			}
		}
	}

	static async GetFromDB(connection: TConnection, name: string): Promise<PGView | null> {
		const definition = await PGSQL.ViewData(connection, name)

		if (!!definition) {
			return new PGView({name: name, definition: definition})
		}

		return null
	}

	public ddlDefinition() { return `CREATE OR REPLACE VIEW ${this.name} AS ${this.definition}`}

	public async writeToDB(connection: TConnection) {
		if (!!this.name && !!this.definition) {
			return PGSQL.Execute(connection, this.ddlDefinition())
		}

		return null
	}
}
