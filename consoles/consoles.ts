import {ESTTodayDateTimeLabel} from '@solidbasisventures/intelliwaketsfoundation'
import {PGTable} from '../src/Database/PGSQL/PGTable'
import {PGColumn} from '../src/Database/PGSQL/PGColumn'


console.info('Started', ESTTodayDateTimeLabel())
console.time('Ended')

// KeyboardKey('How are you?', ['F', 'O'])
// 	.then(answer => {
// 		console.log(answer)
// 		console.time('Ended')
// 	})


const processScript = async () => {
	const pgTable = new PGTable({name: 'Test_Table'})
	pgTable.addColumn(new PGColumn({column_name: 'id', udt_name: PGColumn.TYPE_INTEGER, is_nullable: 'NO'}))
	pgTable.addColumn(new PGColumn({column_name: 'name', udt_name: PGColumn.TYPE_VARCHAR, numeric_precision: 10, is_nullable: 'NO'}))
	pgTable.addColumn(new PGColumn({column_name: 'dt', udt_name: PGColumn.TYPE_DATE, is_nullable: 'NO'}))
	pgTable.addColumn(new PGColumn({column_name: 'dttm', udt_name: PGColumn.TYPE_TIMESTAMPTZ, is_nullable: 'YES'}))
	pgTable.addColumn(new PGColumn({column_name: 'bl', udt_name: PGColumn.TYPE_BOOLEAN, is_nullable: 'YES'}))
	pgTable.addColumn(new PGColumn({
		column_name: 'e_test',
		udt_name: PGColumn.TYPE_VARCHAR,
		numeric_scale: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest.One}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'e_test2',
		udt_name: PGColumn.TYPE_VARCHAR,
		numeric_scale: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest2.One}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'e_test3',
		udt_name: PGColumn.TYPE_VARCHAR,
		numeric_scale: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest3.One}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'e_test5a',
		udt_name: PGColumn.TYPE_VARCHAR,
		numeric_scale: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest5.One}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'e_test5b',
		udt_name: PGColumn.TYPE_VARCHAR,
		numeric_scale: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest5.One}'
	}))
	pgTable.addColumn(new PGColumn({column_name: 'support_data', udt_name: PGColumn.TYPE_JSONB, is_nullable: 'NO'}))
	pgTable.addColumn(new PGColumn({
		column_name: 'support_data1',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'NO',
		column_comment: '{type: TTestType}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'support_data2',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'NO',
		column_default: '{}',
		column_comment: '{type: TTestType[ETest]}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'support_data3',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'NO',
		column_default: '\'{}\'::jsonb',
		column_comment: '{type: TTestType[ETest2]}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'support_data4',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'NO',
		column_default: '\'{}\'::jsonb',
		column_comment: '{type: TTestType[ETest4]}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'support_data5',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'NO',
		column_default: '\'{}\'::jsonb',
		column_comment: '{type: TTestType[ETest5]}'
	}))
	pgTable.addColumn(new PGColumn({column_name: 'ysupport_data', udt_name: PGColumn.TYPE_JSONB, is_nullable: 'YES'}))
	pgTable.addColumn(new PGColumn({
		column_name: 'ysupport_data1',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'YES',
		column_comment: '{type: TTestType}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'ysupport_data2',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'YES',
		column_comment: '{type: TTestType[ETest]}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'ysupport_data3',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'YES',
		column_comment: '{type: TTestType[ETest2]}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'ysupport_data4',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'YES',
		column_comment: '{type: TTestType[ETest4]}'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'bit_test',
		udt_name: PGColumn.TYPE_BIT,
		is_nullable: 'NO',
		column_default: `(repeat('0'::text, 1024))::bit(1024)`,
		column_comment: 'Test Comment'
	}))
	pgTable.addColumn(new PGColumn({
		column_name: 'ysupport_data5',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'YES',
		column_comment: '{type: TTestType[ETest5]}'
	}))
	console.log(pgTable.tsText({includeZod: false}))
}
processScript().then(() => console.timeEnd('Ended'))
