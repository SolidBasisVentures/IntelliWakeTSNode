
import {PGSQL, TConnection} from './PGSQL'

export class PGFunc {
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
	
	static async GetFromDB(connection: TConnection, name: string): Promise<PGFunc | null> {
		const definition = await PGSQL.ViewData(connection, name)
		
		if (!!definition) {
			return new PGFunc({name: name, definition: definition})
		}
		
		return null
	}
	
	public async writeToDB(connection: TConnection) {
		if (!!this.name && !!this.definition) {
			return PGSQL.Execute(connection, this.definition)
		}
		
		return null
	}
}
