import {ESTTodayDateTimeLabel} from '@solidbasisventures/intelliwaketsfoundation'
import {PGTable} from '../src/Database/PGSQL/PGTable'
import {PGColumn} from '../src/Database/PGSQL/PGColumn'

const processScript = async () => {
	const pgTable = new PGTable({name: 'Test_Table'})
	pgTable.addColumn(new PGColumn({column_name: 'id', udt_name: PGColumn.TYPE_INTEGER, is_nullable: 'NO'}))
	pgTable.addColumn(new PGColumn({
		column_name: 'e_test',
		udt_name: PGColumn.TYPE_VARCHAR,
		numeric_scale: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest.One}'
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
	console.log(pgTable.tsText())
}

console.info('Started', ESTTodayDateTimeLabel())
console.time('Ended')
processScript().then(() => console.timeEnd('Ended'))
