import {PGSQL, TConnection} from './PGSQL'

export class PGFunc {
	name = ''
	definition = ''
	
	constructor(instanceData?: Partial<PGFunc>) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}
	
	protected deserialize(instanceData: Partial<PGFunc>) {
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
	
	public ddlDefinition() { return this.definition}
	
	
	public async writeToDB(connection: TConnection) {
		if (!!this.name && !!this.definition) {
			return PGSQL.Execute(connection, this.ddlDefinition())
		}
		
		return null
	}
}
