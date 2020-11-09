import {MyTable} from './MyTable'
import {ColumnDefinition} from './ColumnDefinition'
import {IsOn} from '@solidbasisventures/intelliwaketsfoundation'

export class MyColumn extends ColumnDefinition {
	public isPK = false
	public isAutoIncrement = false
	
	constructor(instanceData?: MyColumn) {
		super()
		
		if (instanceData) {
			this.deserialize(instanceData)
		}
	}
	
	private deserialize(instanceData: MyColumn) {
		const keys = Object.keys(this)
		
		for (const key of keys) {
			if (instanceData.hasOwnProperty(key)) {
				(this as any)[key] = (instanceData as any)[key]
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
	
	public ddlDefinition(myTable: MyTable, _prevMyColumn: MyColumn | null, _altering: boolean): string {
		let ddl = '`' + this.COLUMN_NAME + '` '
		ddl += this.DATA_TYPE
		
		if (this.integerType()) {
			switch (this.DATA_TYPE) {
				case ColumnDefinition.TYPE_BIT:
					ddl += ' '
					break
				case ColumnDefinition.TYPE_TINYINT:
					ddl += '(4) '
					break
				case ColumnDefinition.TYPE_SMALLINT:
					ddl += '(6) '
					break
				case ColumnDefinition.TYPE_MEDIUMINT:
					ddl += '(8) '
					break
				case ColumnDefinition.TYPE_INT:
					ddl += '(11) '
					break
				case ColumnDefinition.TYPE_BIGINT:
					ddl += '(20) '
					break
				default:
					ddl += '(' + this.NUMERIC_PRECISION + ') '
					break
			}
		} else if (this.floatType()) {
			ddl += '(' + this.NUMERIC_PRECISION + ',' + this.NUMERIC_SCALE + ') '
		} else if (this.booleanType()) {
			ddl += '(1) '
		} else if (this.DATA_TYPE === ColumnDefinition.TYPE_DATE) {
			ddl += ' '
		} else if (this.dateType()) {
			if ((this.DATETIME_PRECISION ?? 0) > 0) {
				ddl += '(' + this.DATETIME_PRECISION + ') '
			} else {
				ddl += ' '
			}

//			if (mb_strtoupper(this.DATA_TYPE) === ColumnDefinition.TYPE_DATE) {
//				ddl += ' ';
//			} else {
//				ddl += '(' + this.DATETIME_PRECISION + ') ';
//			}
		} else if (this.generalStringType()) {
			if (!this.blobType()) {
				ddl += '(' + this.CHARACTER_MAXIMUM_LENGTH + ') '
			} else {
				ddl += ' '
			}
			ddl += 'CHARACTER SET ' + (!!this.CHARACTER_SET_NAME ? this.CHARACTER_SET_NAME : myTable.CHARSET) + ' '
			ddl += 'COLLATE ' + (!!this.COLLATION_NAME ? this.COLLATION_NAME : myTable.COLLATE) + ' '
		}
		
		if (!IsOn(this.IS_NULLABLE)) {
			ddl += 'NOT NULL '
		}
		
		if (!this.blobType()) {
			if (this.isAutoIncrement || this.EXTRA === 'auto_increment') {
				ddl += 'AUTO_INCREMENT '
			} else if (!!this.COLUMN_DEFAULT) {
				if (this.integerFloatType() || this.dateType()) {
					ddl += 'DEFAULT ' + this.COLUMN_DEFAULT + ' '
				} else {
					ddl += 'DEFAULT \'' + this.COLUMN_DEFAULT + '\' '
				}
			} else if (IsOn(this.IS_NULLABLE)) {
				ddl += 'DEFAULT NULL '
			} else {
				if (this.integerFloatType()) {
					ddl += 'DEFAULT 0 '
				} else if (this.dateType()) {
					if (this.COLUMN_TYPE != ColumnDefinition.TYPE_DATE) {
						ddl += 'DEFAULT CURRENT_TIMESTAMP'
						if (!!this.DATETIME_PRECISION) {
							ddl += '(' + this.DATETIME_PRECISION + ') '
						} else {
							ddl += ' '
						}
//					if (mb_strtoupper(this.DATA_TYPE) === ColumnDefinition.TYPE_DATE) {
//						ddl += "DEFAULT (CURRENT_DATE) ";
//					} else {
//						ddl += "DEFAULT CURRENT_TIMESTAMP(" + this.DATETIME_PRECISION + ") ";
//					}
					}
				} else {
					ddl += 'DEFAULT \'\' '
				}
			}
		}
		
		if (!!this.EXTRA && this.EXTRA !== 'auto_increment') {
			ddl += this.EXTRA + ' '
		}
		
		if (!!this.COLUMN_COMMENT) {
			ddl += 'COMMENT \'' + this.COLUMN_COMMENT + '\' '
		}
		
		return ddl.trim()
	}
}
