import {PGTable} from '../src/Database/PGSQL/PGTable'
import {PGColumn} from '../src/Database/PGSQL/PGColumn'


const processScript = async () => {
	const pgTable = new PGTable()

	pgTable.breakOutTypes = true

	pgTable.name = 'test_table'

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
		is_nullable: 'NO',
		udt_name: PGColumn.TYPE_DATE
	})
	pgTable.addColumn({
		column_name: 'enum_test_null',
		udt_name: PGColumn.TYPE_VARCHAR,
		character_maximum_length: 64,
		is_nullable: 'YES',
		column_comment: '{enum: ETest}'
	})
	pgTable.addColumn({
		column_name: 'enum_test_null_default',
		udt_name: PGColumn.TYPE_VARCHAR,
		character_maximum_length: 64,
		is_nullable: 'YES',
		column_default: 'FirstValue',
		column_comment: '{enum: ETest}'
	})
	pgTable.addColumn({
		column_name: 'enum_test2_null_default',
		udt_name: PGColumn.TYPE_VARCHAR,
		character_maximum_length: 64,
		is_nullable: 'YES',
		column_comment: '{enum: ETest2}'
	})
	pgTable.addColumn({
		column_name: 'enum_test_null_default_comment',
		udt_name: PGColumn.TYPE_VARCHAR,
		character_maximum_length: 64,
		is_nullable: 'YES',
		column_comment: '{enum: ETest.FirstValue}'
	})
	pgTable.addColumn({
		column_name: 'enum_test_default',
		udt_name: PGColumn.TYPE_VARCHAR,
		character_maximum_length: 64,
		is_nullable: 'NO',
		column_default: 'FirstValue',
		column_comment: '{enum: ETest}'
	})
	pgTable.addColumn({
		column_name: 'enum_test_default_comment',
		udt_name: PGColumn.TYPE_VARCHAR,
		character_maximum_length: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest.FirstValue}'
	})
	pgTable.addColumn({
		column_name: 'interface_test_null',
		udt_name: PGColumn.TYPE_JSON,
		is_nullable: 'YES',
		column_comment: '{interface: ITest}'
	})

	// console.log(pgTable.tsText())
	console.log(pgTable.tsTextTable())
}

processScript().then(() => console.log('Done!'))
