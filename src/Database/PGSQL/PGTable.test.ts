import {PGTable, TS_EOL} from './PGTable'
import {PGColumn} from './PGColumn'
import {test, expect} from 'vitest'


test('PGTable', () => {

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
		column_name: 'enum_test_array_null',
		udt_name: PGColumn.TYPE_VARCHAR,
		array_dimensions: [1],
		character_maximum_length: 64,
		is_nullable: 'YES',
		column_comment: '{enum: ETest}'
	})
	pgTable.addColumn({
		column_name: 'enum_test_array',
		udt_name: PGColumn.TYPE_VARCHAR,
		array_dimensions: [1],
		character_maximum_length: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest}'
	})
	pgTable.addColumn({
		column_name: 'enum_test_array_default',
		udt_name: PGColumn.TYPE_VARCHAR,
		array_dimensions: [1],
		character_maximum_length: 64,
		column_default: `'{}'::varchar[]`,
		is_nullable: 'NO',
		column_comment: '{enum: ETest}'
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
		column_name: 'interface_test_null_default_set',
		udt_name: PGColumn.TYPE_VARCHAR,
		character_maximum_length: 64,
		is_nullable: 'YES',
		column_default: 'null',
		column_comment: '{interface: ITest}'
	})
	pgTable.addColumn({
		column_name: 'interface_test_null_jsonb_array',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'YES',
		column_default: 'null',
		column_comment: '{type: TTest[]}'
	})
	pgTable.addColumn({
		column_name: 'interface_test_notnull_jsonb_array',
		udt_name: PGColumn.TYPE_JSONB,
		is_nullable: 'NO',
		column_default: '\'{}\'',
		column_comment: '{type: TTest[]}'
	})

	let tsTest = pgTable.tsText({includeConstraint: true})

	// console.info(tsTest)

	expect(tsTest.includes('import type {TObjectConstraint} from "@solidbasisventures/intelliwaketsfoundation"')).toBeTruthy()
	expect(tsTest.includes('import {ETest} from "../Enums/ETest"')).toBeTruthy()
	expect(tsTest.includes('import {ITest} from "../Interfaces/ITest"')).toBeTruthy()
	expect(tsTest.includes('import {TTest} from "../Types/TTest"')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_jsonb_array: TTest[] | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_jsonb_array: null')).toBeTruthy()
	expect(tsTest.includes('interface_test_notnull_jsonb_array: TTest[]')).toBeTruthy()
	expect(tsTest.includes('interface_test_notnull_jsonb_array: []')).toBeTruthy()
	expect(tsTest.includes('"id": {')).toBeTruthy()
	expect(tsTest.includes('"type": "object",')).toBeTruthy()

	tsTest = pgTable.tsText({includeConstraint: true, singleQuote: true, spaceInImports: true})

	// console.info(tsTest)

	expect(tsTest.includes('import type { TObjectConstraint } from \'@solidbasisventures/intelliwaketsfoundation\'')).toBeTruthy()
	expect(tsTest.includes('import { ETest } from \'../Enums/ETest\'')).toBeTruthy()
	expect(tsTest.includes('import { ITest } from \'../Interfaces/ITest\'')).toBeTruthy()
	expect(tsTest.includes('import { TTest } from \'../Types/TTest\'')).toBeTruthy()
	expect(tsTest.includes('\'id\': {')).toBeTruthy()
	expect(tsTest.includes('\'type\': \'object\',')).toBeTruthy()

	tsTest = pgTable.tsText({
		includeConstraint: true,
		singleQuote: true,
		spaceInImports: true,
		noConstraintKeyQuotes: true
	})

	// console.info(tsTest)

	expect(tsTest.includes('    id: {')).toBeTruthy()
	expect(tsTest.includes('        type: \'object\',')).toBeTruthy()

	tsTest = pgTable.tsText({
		includeConstraint: true,
		singleQuote: true,
		spaceInImports: true,
		noConstraintKeyQuotes: true,
		tabsForObjects: true
	})

	// console.info(tsTest)

	expect(tsTest.includes('\tid: {')).toBeTruthy()
	expect(tsTest.includes('\t\ttype: \'object\',')).toBeTruthy()

	pgTable.addColumn({
		column_name: 'enum_test2_array_null',
		udt_name: PGColumn.TYPE_VARCHAR,
		array_dimensions: [1],
		character_maximum_length: 64,
		is_nullable: 'YES',
		column_comment: '{enum: ETest2}'
	})
	pgTable.addColumn({
		column_name: 'enum_test3_array_null',
		udt_name: PGColumn.TYPE_VARCHAR,
		array_dimensions: [1],
		column_default: '\'{}\'::character varying[]',
		character_maximum_length: 64,
		is_nullable: 'NO',
		column_comment: '{enum: ETest3}'
	})
	pgTable.addColumn({
		column_name: 'enum_test4_array_null',
		udt_name: PGColumn.TYPE_VARCHAR,
		column_default: '',
		character_maximum_length: 64,
		column_comment: '{enum: ETest4.Test}'
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
	pgTable.addColumn({
		column_name: 'jsonb_any',
		udt_name: PGColumn.TYPE_JSONB,
		column_default: '\'{}\'',
		is_nullable: 'NO'
	})

	tsTest = pgTable.tsText({includeConstraint: true})

	let tsTestTable = pgTable.tsTextTable()

	expect(tsTest.includes('enum_test_null: ETest | null')).toBeTruthy()
	expect(tsTest.includes('enum_test_null: null,')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default: ETest | null')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default: ETest.FirstValue,')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default_comment: ETest | null')).toBeTruthy()
	expect(tsTest.includes('enum_test_null_default_comment: ETest.FirstValue,')).toBeTruthy()
	expect(tsTest.includes('enum_test_default: ETest')).toBeTruthy()
	expect(tsTest.includes('enum_test_default: ETest.FirstValue,')).toBeTruthy()
	expect(tsTest.includes('enum_test_default_comment: ETest')).toBeTruthy()
	expect(tsTest.includes('enum_test_default_comment: ETest.FirstValue,')).toBeTruthy()
	expect(tsTest.includes('enum_test_array_null: ETest[]')).toBeTruthy()
	expect(tsTest.includes('enum_test_array_null: null,')).toBeTruthy()
	expect(tsTest.includes('enum_test_array: ETest[]')).toBeTruthy()
	expect(tsTest.includes('enum_test_array: [],')).toBeTruthy()
	expect(tsTest.includes('enum_test_array_default: ETest[]')).toBeTruthy()
	expect(tsTest.includes('enum_test_array_default: [],')).toBeTruthy()
	expect(tsTest.includes('jsonb_any: any')).toBeTruthy()

	expect(tsTest.includes('interface_test_null: ITest | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null: null,')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default: ITest | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default: initialValue,')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default_set: ITest | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default_set: null,')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default_comment: ITest | null')).toBeTruthy()
	expect(tsTest.includes('interface_test_null_default_comment: initialValue,')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_blank: ITest')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_blank: {},')).toBeTruthy()
	expect(tsTest.includes('interface_test_default: ITest')).toBeTruthy()
	expect(tsTest.includes('interface_test_default: initialValue,')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_comment: ITest')).toBeTruthy()
	expect(tsTest.includes('interface_test_default_comment: initialValue')).toBeTruthy()
	expect(tsTest.includes('jsonb_any: {}')).toBeTruthy()

	expect(tsTestTable.includes('import {initial_test_table, Itest_table} from \'@Common/Tables/Itest_table\'')).toBeTruthy()
	expect(tsTestTable.includes('import {TTables} from \'../Database/TTables\'')).toBeTruthy()
	expect(tsTestTable.includes('import {_CTable} from \'./_CTable\'')).toBeTruthy()
	expect(tsTestTable.includes('import {ResponseContext} from \'../MiddleWare/ResponseContext\'')).toBeTruthy()

	pgTable.importWithTypes = true

	tsTest = pgTable.tsText()
	tsTestTable = pgTable.tsTextTable()

	expect(tsTest.includes('import {ETest} from "../Enums/ETest"')).toBeTruthy()
	expect(tsTest.includes('import type {ETest2} from "../Enums/ETest2"')).toBeTruthy()
	expect(tsTest.includes('import type {ETest3} from "../Enums/ETest3"')).toBeTruthy()
	expect(tsTest.includes('import {ETest4} from "../Enums/ETest4"')).toBeTruthy()
	expect(tsTest.includes('import type {ITest} from "../Interfaces/ITest"')).toBeTruthy()

	expect(tsTestTable.includes('import {initial_test_table')).toBeTruthy()
	expect(tsTestTable.includes('import type {Itest_table} from \'@Common/Tables/Itest_table\'')).toBeTruthy()
	expect(tsTestTable.includes('import type {TTables} from \'../Database/TTables\'')).toBeTruthy()
	expect(tsTestTable.includes('import {_CTable} from \'./_CTable\'')).toBeTruthy()
	expect(tsTestTable.includes('import type {ResponseContext} from \'../MiddleWare/ResponseContext\'')).toBeTruthy()

	let resultText = `import ...${TS_EOL}${TS_EOL}export class Ctest_table`
	expect(pgTable.tsTextTableUpdateDescription(`import ...${TS_EOL}${TS_EOL}export class Ctest_table`)).toEqual(resultText)
	expect(pgTable.tsTextTableUpdateDescription(`import ...${TS_EOL}${TS_EOL}/** Previous comments */${TS_EOL}export class Ctest_table`)).toEqual(resultText)

	pgTable.description = 'Test Description'
	resultText = `import ...${TS_EOL}${TS_EOL}/** ${pgTable.description} */${TS_EOL}export class Ctest_table`
	expect(pgTable.tsTextTableUpdateDescription(`import ...${TS_EOL}${TS_EOL}export class Ctest_table`)).toEqual(resultText)
	expect(pgTable.tsTextTableUpdateDescription(`import ...${TS_EOL}${TS_EOL}/** Previous comments */${TS_EOL}export class Ctest_table`)).toEqual(resultText)
})
