
import {PGSQL, TConnection} from './PGSQL'

export class PGMatView {
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
	
	static async GetFromDB(connection: TConnection, name: string): Promise<PGMatView | null> {
		const definition = await PGSQL.ViewsMatData(connection, name)
		
		if (!!definition) {
			return new PGMatView({name: name, definition: definition})
		}
		
		return null
	}
	
	public ddlDefinition() { return `CREATE MATERIALIZED VIEW ${this.name} AS ${this.definition}`}
	
	public async writeToDB(connection: TConnection) {
		if (!!this.name && !!this.definition) {
			return await PGSQL.Execute(connection, this.ddlDefinition())
		}
		
		return null
	}
}
