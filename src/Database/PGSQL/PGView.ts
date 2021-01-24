
import {PGSQL, TConnection} from './PGSQL'

export class PGView {
	name = ''
	definition = ''
	
	constructor(instanceData?: any) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}
	
	protected deserialize(instanceData: any) {
		const keys = Object.keys(this)
		
		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
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
	
	public async writeToDB(connection: TConnection) {
		if (!!this.name && !!this.definition) {
			return PGSQL.Execute(connection, `CREATE OR REPLACE VIEW ${this.name} AS ${this.definition}`)
		}
		
		return null
	}
}
