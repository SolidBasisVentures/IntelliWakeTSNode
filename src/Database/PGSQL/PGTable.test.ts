import {PGTable} from './PGTable'
import {PGColumn} from './PGColumn'

const pgTable = new PGTable()

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
	udt_name: PGColumn.TYPE_VARCHAR,
	character_maximum_length: 64,
	is_nullable: 'YES',
	column_comment: '{interface: ITest}'
})
pgTable.addColumn({
	column_name: 'interface_test_null_default',
	udt_name: PGColumn.TYPE_VARCHAR,
	character_maximum_length: 64,
	is_nullable: 'YES',
	column_default: 'initialValue',
	column_comment: '{interface: ITest}'
})
pgTable.addColumn({
	column_name: 'interface_test_null_default_comment',
	udt_name: PGColumn.TYPE_VARCHAR,
	character_maximum_length: 64,
	is_nullable: 'YES',
	column_comment: '{interface: ITest.initialValue}'
})
pgTable.addColumn({
	column_name: 'interface_test_default',
	udt_name: PGColumn.TYPE_VARCHAR,
	character_maximum_length: 64,
	is_nullable: 'NO',
	column_default: 'initialValue',
	column_comment: '{interface: ITest}'
})
pgTable.addColumn({
	column_name: 'interface_test_default_blank',
	udt_name: PGColumn.TYPE_VARCHAR,
	character_maximum_length: 64,
	is_nullable: 'NO',
	column_comment: '{interface: ITest}'
})
pgTable.addColumn({
	column_name: 'interface_test_default_comment',
	udt_name: PGColumn.TYPE_VARCHAR,
	character_maximum_length: 64,
	is_nullable: 'NO',
	column_comment: '{interface: ITest.initialValue}'
})

test('PGTable', () => {
	const tsTest = pgTable.tsText()

	expect(tsTest.includes('enum_test_null: ETest | null')).toBeTruthy()
	expect(tsTest.includes('enum_test_null: null')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default: ETest | null')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default: ETest.FirstValue')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default_comment: ETest | null')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default_comment: ETest.FirstValue')).toBeTruthy()
	expect(tsTest.includes('enum_test_default: ETest')).toBeTruthy()
	expect(tsTest.includes('enum_test_default: ETest.FirstValue')).toBeTruthy()
	expect(tsTest.includes('enum_test_default_comment: ETest')).toBeTruthy()
	expect(tsTest.includes('enum_test_default_comment: ETest.FirstValue')).toBeTruthy()

	expect(tsTest.includes('interface_test_null: ITest | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null: null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default: ITest | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default: initialValue')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default_comment: ITest | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default_comment: initialValue')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_blank: ITest')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_blank: {}')).toBeTruthy()
	expect(tsTest.includes('interface_test_default: ITest')).toBeTruthy()
	expect(tsTest.includes('interface_test_default: initialValue')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_comment: ITest')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_comment: initialValue')).toBeTruthy()
})
