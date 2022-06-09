import {PGTable} from '../src/Database/PGSQL/PGTable'
import {PGColumn} from '../src/Database/PGSQL/PGColumn'


const processScript = async () => {
	const pgTable = new PGTable()
	pgTable.addColumn({
		column_name: 'id',
		udt_name: PGColumn.TYPE_INTEGER,
		is_nullable: 'NO'
	})
	pgTable.addColumn({
		column_name: 'added_id',
		udt_name: PGColumn.TYPE_INTEGER,
		is_nullable: 'YES'
	})
	pgTable.addColumn({
		column_name: 'name',
		udt_name: PGColumn.TYPE_VARCHAR,
		is_nullable: 'YES',
		character_maximum_length: 20
	})
	pgTable.addColumn({
		column_name: 'description',
		udt_name: PGColumn.TYPE_VARCHAR,
		is_nullable: 'YES',
		character_maximum_length: 30
	})
	pgTable.addColumn({
		column_name: 'address',
		udt_name: PGColumn.TYPE_VARCHAR,
		is_nullable: 'YES',
		character_maximum_length: 15
	})
	pgTable.addColumn({
		column_name: 'phone',
		udt_name: PGColumn.TYPE_VARCHAR,
		is_nullable: 'YES',
		character_maximum_length: 9
	})
	pgTable.addColumn({
		column_name: 'added_date',
		udt_name: PGColumn.TYPE_DATE
	})
	
	const json = pgTable.fixedWidthMap({
		startColumnName: 'name',
		lastColumnName: 'phone'
	})
	
	console.log(json)
}

processScript().then(() => console.log('Done!'))
