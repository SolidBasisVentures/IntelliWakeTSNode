import {IsOn} from '../../Functions'
import {PGEnum} from './PGEnum'

export class PGColumn {
	public column_name = ''
	public ordinal_position = 0
	public column_default: string | number | boolean | null = null
	public is_nullable: 'YES' | 'NO' = 'YES'
	public udt_name: string | PGEnum = ''
	public character_maximum_length: number | null = null
	public character_octet_length: number | null = null
	public numeric_precision: number | null = null
	public numeric_scale: number | null = null
	public datetime_precision: number | null = null
	public is_identity: 'YES' | 'NO' = 'NO'
	public is_self_referencing: 'YES' | 'NO' = 'NO'
	public identity_generation: 'BY DEFAULT' | null = null
	public array_dimensions: (number | null)[] = []
	public check: string | null = null
	public checkStringValues: string[] = []
	
	public column_comment: string = ''
	public isAutoIncrement = true
	
	static readonly TYPE_BOOLEAN = 'boolean'
	static readonly TYPE_NUMERIC = 'numeric'
	static readonly TYPE_FLOAT8 = 'float8'
	
	static readonly TYPE_SMALLINT = 'smallint'
	static readonly TYPE_INTEGER = 'integer'
	static readonly TYPE_BIGINT = 'bigint'
	
	static readonly TYPE_VARCHAR = 'varchar'
	static readonly TYPE_TEXT = 'text'
	
	static readonly TYPE_DATE = 'date'
	static readonly TYPE_TIME = 'time'
	static readonly TYPE_TIMETZ = 'timetz'
	static readonly TYPE_TIMESTAMP = 'timestamp'
	static readonly TYPE_TIMESTAMPTZ = 'timestampz'
	
	static readonly TYPE_UUID = 'uuid'
	
	static readonly TYPES_ALL = [
		PGColumn.TYPE_BOOLEAN,
		PGColumn.TYPE_NUMERIC,
		PGColumn.TYPE_FLOAT8,
		PGColumn.TYPE_SMALLINT,
		PGColumn.TYPE_INTEGER,
		PGColumn.TYPE_BIGINT,
		PGColumn.TYPE_VARCHAR,
		PGColumn.TYPE_TEXT,
		PGColumn.TYPE_DATE,
		PGColumn.TYPE_TIME,
		PGColumn.TYPE_TIMETZ,
		PGColumn.TYPE_TIMESTAMP,
		PGColumn.TYPE_TIMESTAMPTZ,
		PGColumn.TYPE_UUID
	]
	
	public jsType = (): string => {
		if (typeof this.udt_name !== 'string') {
			return this.udt_name.enumName
		} else if (this.booleanType()) {
			return 'boolean'
		} else if (this.integerFloatType()) {
			return 'number'
		} else if (this.booleanType()) {
			return 'boolean'
		} else {
			return 'string' // Date or String or Enum
		}
	}
	
	public enumType = (): boolean => {
		return typeof this.udt_name !== 'string'
	}
	
	public integerType = (): boolean => {
		return typeof this.udt_name === 'string' && [PGColumn.TYPE_SMALLINT, PGColumn.TYPE_INTEGER, PGColumn.TYPE_BIGINT].includes(this.udt_name.toLowerCase())
	}
	
	public floatType = (): boolean => {
		return typeof this.udt_name === 'string' && [PGColumn.TYPE_NUMERIC, PGColumn.TYPE_FLOAT8].includes(this.udt_name.toLowerCase())
	}
	
	public integerFloatType = (): boolean => {
		return this.integerType() || this.floatType()
	}
	
	public booleanType = (): boolean => {
		return typeof this.udt_name === 'string' && [PGColumn.TYPE_BOOLEAN].includes(this.udt_name.toLowerCase())
	}
	
	public generalStringType = (): boolean => {
		return typeof this.udt_name !== 'string' || [PGColumn.TYPE_VARCHAR].includes(this.udt_name.toLowerCase())
	}
	
	public dateType = (): boolean => {
		return typeof this.udt_name === 'string' && [
			PGColumn.TYPE_DATE,
			PGColumn.TYPE_TIME,
			PGColumn.TYPE_TIMETZ,
			PGColumn.TYPE_TIMESTAMP,
			PGColumn.TYPE_TIMESTAMPTZ
		].includes(this.udt_name.toLowerCase())
	}
	
	public blobType = (): boolean => {
		return typeof this.udt_name === 'string' && [PGColumn.TYPE_TEXT].includes(this.udt_name.toLowerCase())
	}
	
	public otherType = (): boolean => {
		return (
			!this.integerFloatType && !this.booleanType && !this.dateType() && !this.generalStringType() && !this.blobType()
		)
	}
	
	constructor(instanceData?: PGColumn) {
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}
	
	private deserialize(instanceData: PGColumn) {
		const keys = Object.keys(this)
		
		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				;(this as any)[key] = (instanceData as any)[key]
			}
		}
	}
	
	public clean() {
		//		if (this.dateType()) {
		//			if (IsEmpty(this.DATETIME_PRECISION) || this.DATETIME_PRECISION < 3 || this.DATETIME_PRECISION > 6) {
		//				this.DATETIME_PRECISION = 6;
		//			}
		//		}
	}
	
	public ddlDefinition(): string {
		let ddl = '"' + this.column_name + '" '
		
		ddl += typeof this.udt_name === 'string' ? this.udt_name : this.udt_name.columnName
		
		if (this.array_dimensions.length > 0) {
			ddl += `[${this.array_dimensions
				.map((array_dimension) => (!!array_dimension ? array_dimension.toString() : ''))
				.join('],[')}] `
		} else {
			if (this.floatType() && this.udt_name !== PGColumn.TYPE_FLOAT8) {
				ddl += '(' + this.numeric_precision + ',' + this.numeric_scale + ') '
			} else if (this.dateType()) {
				if (!!this.datetime_precision) {
					ddl += '(' + this.datetime_precision + ') '
				} else {
					ddl += ' '
				}
			} else if (this.generalStringType()) {
				if (!this.blobType() && typeof this.udt_name === 'string') {
					ddl += '(' + (this.character_maximum_length ?? 255) + ') '
				} else {
					ddl += ' '
				}
			} else {
				ddl += ' '
			}
		}
		
		if (!IsOn(this.is_nullable)) {
			ddl += 'NOT NULL '
		}
		
		if (this.array_dimensions.length > 0) {
			if (IsOn(this.is_nullable)) {
				ddl += `DEFAULT ${this.column_default ?? 'NULL'} `
			} else {
				ddl += `DEFAULT ${this.column_default ?? (typeof this.udt_name === 'string' ? '\'{}\'' : this.udt_name.defaultValue ?? '\'{}')} `
			}
		} else {
			if (!this.blobType()) {
				if (IsOn(this.is_identity)) {
					if (this.isAutoIncrement) {
						if (!!this.identity_generation) {
							ddl += `GENERATED ${this.identity_generation} AS IDENTITY `
						} else {
							ddl += `GENERATED BY DEFAULT AS IDENTITY `
						}
					}
				} else if (this.booleanType()) {
					if (IsOn(this.is_nullable) || this.column_default === null) {
						ddl += `DEFAULT NULL `
					} else {
						ddl += `DEFAULT ${IsOn(this.column_default) ? 'true' : 'false'} `
					}
				} else if (!this.column_default && typeof this.udt_name !== 'string' && !!this.udt_name.defaultValue) {
					ddl += `DEFAULT '${this.udt_name.defaultValue}' `
				} else {
					if (!!this.column_default) {
						if (this.integerFloatType() || this.dateType()) {
							ddl += `DEFAULT ${this.column_default} `
						} else {
							ddl += `DEFAULT '${this.column_default}' `
						}
					} else if (IsOn(this.is_nullable)) {
						ddl += `DEFAULT NULL `
					} else {
						if (this.integerFloatType()) {
							ddl += `DEFAULT 0 `
						} else if (this.dateType()) {
							ddl += `DEFAULT now() `
							// if (!!this.datetime_precision) {
							// 	ddl += `(${this.datetime_precision} `;
							// } else {
							// 	ddl += ` `;
							// }
						} else {
							ddl += `DEFAULT '' `
						}
					}
				}
			}
		}
		
		if (!!this.check) {
			ddl += `CHECK (${this.check}) `
		} else if (this.checkStringValues.length > 0) {
			ddl += `CHECK (${IsOn(this.is_nullable) ? this.column_name + ' IS NULL OR ' : ''}${this.column_name} IN ('${this.checkStringValues.join('\', \'')}')) `
		}
		
		return ddl.trim()
	}
}
