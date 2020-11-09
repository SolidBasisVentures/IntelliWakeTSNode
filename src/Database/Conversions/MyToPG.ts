import {MyTable} from '../MySQL/MyTable'
import {PGTable} from '../PGSQL/PGTable'
import {MyColumn} from '../MySQL/MyColumn'
import {PGColumn} from '../PGSQL/PGColumn'
import {IsOn} from '@solidbasisventures/intelliwaketsfoundation'
import {ColumnDefinition} from '../ColumnDefinition'
import {MyForeignKey} from '../MySQL/MyForeignKey'
import {PGForeignKey} from '../PGSQL/PGForeignKey'
import {MyIndex} from '../MySQL/MyIndex'
import {PGIndex} from '../PGSQL/PGIndex'

export namespace MyToPG {
	export const GetPGTable = (myTable: MyTable): PGTable => {
		const pgTable = new PGTable()
		
		pgTable.name = myTable.name.toLowerCase()
		
		for (const myColumn of myTable.columns) {
			const pgColumn = GetPGColumn(myColumn)
			
			pgTable.columns.push(pgColumn)
		}
		
		for (const myForeignKey of myTable.foreignKeys) {
			const pgForeignKey = GetPGForeignKey(myForeignKey)
			
			pgTable.foreignKeys.push(pgForeignKey)
		}
		
		for (const myIndex of myTable.indexes) {
			const pgIndex = GetPGIndex(myIndex)
			
			pgTable.indexes.push(pgIndex)
		}
		
		return pgTable
	}
	
	export const GetPGColumn = (myColumn: MyColumn): PGColumn => {
		const pgColumn = new PGColumn()
		
		pgColumn.column_name = myColumn.COLUMN_NAME
		pgColumn.ordinal_position = myColumn.ORDINAL_POSITION
		pgColumn.udt_name = UDTNameFromDataType(myColumn.DATA_TYPE!)
		pgColumn.is_nullable = IsOn(myColumn.IS_NULLABLE) ? 'YES' : 'NO'
		pgColumn.column_default = (pgColumn.udt_name === PGColumn.TYPE_BOOLEAN) ?
			myColumn.COLUMN_DEFAULT === null ?
				null : IsOn(myColumn.COLUMN_DEFAULT) : myColumn.COLUMN_DEFAULT
		pgColumn.character_maximum_length = myColumn.CHARACTER_MAXIMUM_LENGTH
		pgColumn.numeric_precision = myColumn.NUMERIC_PRECISION
		pgColumn.numeric_scale = myColumn.NUMERIC_SCALE
		pgColumn.datetime_precision = myColumn.DATETIME_PRECISION
		pgColumn.isAutoIncrement = myColumn.EXTRA === 'auto_increment'
		pgColumn.is_identity = myColumn.COLUMN_KEY === 'PRI' ? 'YES' : 'NO'
		pgColumn.column_comment = myColumn.COLUMN_COMMENT ?? ''
		
		return pgColumn
	}
	
	export const GetPGForeignKey = (myForeignKey: MyForeignKey): PGForeignKey => {
		const pgForeignKey = new PGForeignKey()
		
		pgForeignKey.columnNames = myForeignKey.columnNames.map(col => col.toLowerCase())
		pgForeignKey.primaryTable = myForeignKey.primaryTable.toLowerCase()
		pgForeignKey.primaryColumns = myForeignKey.primaryColumns.map(col => col.toLowerCase())
		
		return pgForeignKey
	}
	
	export const GetPGIndex = (myIndex: MyIndex): PGIndex => {
		const pgIndex = new PGIndex()
		
		pgIndex.columns = myIndex.columns.map(col => col.toLowerCase())
		pgIndex.isUnique = myIndex.isUnique
		
		return pgIndex
	}
	
	export const UDTNameFromDataType = (columnName: string): string => {
		switch (columnName.toUpperCase()) {
			case ColumnDefinition.TYPE_TINYINT:
				return PGColumn.TYPE_BOOLEAN
			case ColumnDefinition.TYPE_FLOAT:
				return PGColumn.TYPE_FLOAT8
			case ColumnDefinition.TYPE_DATETIME:
				return PGColumn.TYPE_TIMESTAMP
			case ColumnDefinition.TYPE_INT:
			case ColumnDefinition.TYPE_SMALLINT:
				return PGColumn.TYPE_INTEGER
			case ColumnDefinition.TYPE_BINARY:
				return PGColumn.TYPE_BYTEA
			case ColumnDefinition.TYPE_DECIMAL:
			case ColumnDefinition.TYPE_DOUBLE:
				return PGColumn.TYPE_NUMERIC
			case ColumnDefinition.TYPE_MEDIUMTEXT:
				return PGColumn.TYPE_TEXT
			default:
				return columnName.toLowerCase()
		}
	}
}
