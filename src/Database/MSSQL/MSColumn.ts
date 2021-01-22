import {databasePoolMS} from './mssqlConnection'
import {IMSColumn} from '@Common/Migration/Chronos/IMSColumn'
import {toSnakeCase} from '../../Generics/Functions'
import {PGColumn} from '@solidbasisventures/intelliwaketsnode'

export class MSColumn implements IMSColumn {
	public COLUMN_NAME = ''
	public ORDINAL_POSITION = 0
	public COLUMN_DEFAULT: string | null = null
	public IS_NULLABLE: 'YES' | 'NO' | '' = ''
	public DATA_TYPE = ''
	public CHARACTER_MAXIMUM_LENGTH: number | null = null
	public CHARACTER_OCTET_LENGTH: number | null = null
	public NUMERIC_PRECISION: number | null = null
	public NUMERIC_PRECISION_RADIX: number | null = null
	public NUMERIC_SCALE: number | null = null
	public DATETIME_PRECISION: number | null = null
	public CHARACTER_SET_CATALOG: string | null = null
	public CHARACTER_SET_SCHEMA: string | null = null
	public CHARACTER_SET_NAME: string | null = null
	public COLLATION_CATALOG: string | null = null
	public COLLATION_SCHEMA: string | null = null
	public COLLATION_NAME: string | null = null
	public DOMAIN_CATALOG: string | null = null
	public DOMAIN_SCHEMA: string | null = null
	public DOMAIN_NAME: string | null = null

	public isKey = false
	public isIdentity = false
	public isIndexed = false
	public lenGTZero = false
	public overrideType = ''
	public overrideSize = 0
	public overrideScale = 0
	public overrideDefault = ''
	public overrideDefaultUpdate = ''
	public overrideIsNullable: 'YES' | 'NO' | '' = ''
	public isBit = false
	public isTime = false
	public toUserID = false
	public toLangID = false
	public notPK = false
	public isPK = false
	public generatePKsMissing = false
	public moveToParent = false

	public cardinality: number | null = null
	public hasNullsOrZeros: boolean | null = null

	public newName = ''
	public description = ''
	public question = ''
	public questionMe = false
	public readyToProcess = false
	public ignore = false

	constructor(instanceData?: IMSColumn) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}

	private deserialize(instanceData: IMSColumn) {
		const keys = Object.keys(this)

		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}

	public calcName = (): string => {
		if (!!this.newName) {
			return toSnakeCase(this.newName)
		}

		return toSnakeCase(this.COLUMN_NAME)
	}

	public calcIsNullable = (): string => {
		if (this.calcName().startsWith('old_')) {
			return 'YES'
		}
		if ((this.overrideIsNullable ?? '').length > 0) {
			return this.overrideIsNullable
		}

		return this.IS_NULLABLE
	}

	public clean = () => {
		// this.ORDINAL_POSITION = (this.ORDINAL_POSITION) ?? 1;
		// CHARACTER_MAXIMUM_LENGTH = (CHARACTER_MAXIMUM_LENGTH);
		// CHARACTER_OCTET_LENGTH = (CHARACTER_OCTET_LENGTH);
		// NUMERIC_PRECISION = (NUMERIC_PRECISION);
		// NUMERIC_PRECISION_RADIX = (NUMERIC_PRECISION_RADIX);
		// NUMERIC_SCALE = (NUMERIC_SCALE);
		// DATETIME_PRECISION = (DATETIME_PRECISION);
	}

	public cleanSave = () => {
		// unset(references);
		// unset(referencedBy);
		// unset(newReferences);
		// unset(toContactID);
		// unset(questionJames);
		// unset(toTripTypeID);

		if (this.calcName() === 'id' || this.calcName().endsWith('_id')) {
			this.overrideType = PGColumn.TYPE_INTEGER
		}

		if (this.newName === 'added_date') {
			this.overrideType = PGColumn.TYPE_TIMESTAMPTZ
			this.overrideSize = 3
			this.overrideDefault = 'CURRENT_TIMESTAMP(3)'
			this.overrideIsNullable = 'NO'
		}

		if (this.newName === 'added_sysuser_id') {
			this.overrideType = PGColumn.TYPE_INTEGER
			this.overrideDefault = '100'
			this.overrideIsNullable = 'NO'
		}

		if (this.newName === 'modified_date') {
			this.overrideType = PGColumn.TYPE_TIMESTAMPTZ
			this.overrideSize = 3
			this.overrideDefault = 'CURRENT_TIMESTAMP(3)'
			this.overrideDefaultUpdate = 'CURRENT_TIMESTAMP(3)'
			this.overrideIsNullable = 'NO'
		}

		if (this.newName === 'modified_sysuser_id') {
			this.overrideType = PGColumn.TYPE_INTEGER
			this.overrideDefault = '100'
			this.overrideIsNullable = 'NO'
		}

		// if (this.isBit) {
		//     this.overrideIsNullable = "NO";
		//     if (!this.overrideDefault) {
		//         this.overrideDefault = "true";
		//     }
		// }

		if (this.toUserID) {
			this.overrideType = PGColumn.TYPE_INTEGER
		}

		this.newName = toSnakeCase(!!this.newName ? this.newName : this.COLUMN_NAME)

		switch (this.overrideType) {
			case 'VARCHAR':
				this.overrideType = PGColumn.TYPE_VARCHAR
				break
			case 'BIGINT':
				this.overrideType = PGColumn.TYPE_BIGINT
				break
			case 'INT':
				this.overrideType = PGColumn.TYPE_INTEGER
				break
			case 'MEDIUMTEXT':
			case 'TEXT':
				this.overrideType = PGColumn.TYPE_TEXT
				break
			case 'DATE':
				this.overrideType = PGColumn.TYPE_DATE
				break
			case 'DATETIME':
				this.overrideType = PGColumn.TYPE_TIMESTAMP
				break
			case 'TIME':
				this.overrideType = PGColumn.TYPE_TIME
				break
			case 'DECIMAL':
				this.overrideType = PGColumn.TYPE_NUMERIC
				break
		}

		if (!!this.overrideType) {
			if (!PGColumn.TYPES_ALL.includes(this.overrideType)) {
				console.log('INVALID COLUMN', this.overrideType)
			}
		}
	}

	public countCardinality = async (tableName: string): Promise<number> => {
		if (this.CHARACTER_MAXIMUM_LENGTH == -1) {
			this.cardinality = -1
		} else {
			const results: Array<any> =
				(await databasePoolMS.request().query(`SELECT count(DISTINCT ${this.COLUMN_NAME}) AS count FROM ${tableName}`))
					.recordsets ?? []
			this.cardinality = (results[0] ?? {})['count'] ?? 0
		}

		return this.cardinality ?? 0
	}

	public hasNull = async (tableName: string): Promise<boolean> => {
		const results: Array<any> =
			(
				await databasePoolMS
					.request()
					.query(`SELECT count(*) AS count FROM ${tableName}) WHERE ${this.COLUMN_NAME} IS NULL`)
			).recordsets ?? []
		return (results[0] ?? {})['count'] ?? 0 > 0
	}

	public hasZero = async (tableName: string): Promise<boolean> => {
		const results: Array<any> =
			(
				await databasePoolMS
					.request()
					.query(`SELECT count(*) AS count FROM ${tableName}) WHERE ${this.COLUMN_NAME} = 0`)
			).recordsets ?? []
		return (results[0] ?? {})['count'] ?? 0 > 0
	}
}
