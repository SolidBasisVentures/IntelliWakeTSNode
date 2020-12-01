import {MyTable} from './MyTable'

export class MyForeignKey {
	public columnNames: string[] = []
	public primaryTable = ''
	public primaryColumns: string[] = []
	public isUnique = false
	public keyName = ''
	
	public onDelete = 'RESTRICT'
	public onUpdate = 'RESTRICT'
	
	constructor(instanceData?: MyForeignKey) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}
	
	private deserialize(instanceData: MyForeignKey) {
		const keys = Object.keys(this)
		
		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				(this as any)[key] = (instanceData as any)[key]
			}
		}
	}
	
	public fkName(myTable: MyTable, prefix: string) {
		return prefix + '_' + myTable.name.substr(-25) + '_' + this.columnNames.map(column => column.substr(0, -10)).join('_')
	}
	
	public ddlKeyDefinition(myTable: MyTable, altering: boolean): string {
		let ddl = ''
		if (altering) {
			ddl += 'ADD '
		}
		if (this.isUnique) {
			ddl += 'UNIQUE '
		}
		ddl += 'KEY '
		ddl += '`' + this.fkName(myTable, 'idx') + '` '
		ddl += '(`' + this.columnNames.join('`,`') + '`)'
		
		return ddl
	}
	
	public ddlConstraintDefinition(myTable: MyTable, altering: boolean): string {
		let ddl = ''
		if (altering) {
			ddl += 'ADD '
		}
		ddl += 'CONSTRAINT '
		ddl += '`' + this.fkName(myTable, 'fk') + '` '
		ddl += 'FOREIGN KEY '
		ddl += '(`' + this.columnNames.join('`,`') + '`) '
		ddl += 'REFERENCES '
		ddl += '`' + this.primaryTable + '` '
		ddl += '(`' + this.primaryColumns.join('`,`') + '`)'
		
		return ddl
	}
}
