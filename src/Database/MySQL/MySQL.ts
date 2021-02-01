import { Connection } from "mysql"
import {MyTable} from './MyTable'
import {MyColumn} from './MyColumn'
import {MyForeignKey} from './MyForeignKey'
import {MyIndex} from './MyIndex'
import {IsOn} from '@solidbasisventures/intelliwaketsfoundation'

export namespace MySQL {
	
	export const TableRowCount = async (connection: Connection, table: string): Promise<number> => {
		return await new Promise((resolve) => {
			connection.query(`SELECT COUNT(*) AS count FROM ${table}`, (error , results, _fields) => {
				if (error) throw error
				resolve((((results ?? [])[0] ?? {}) as any)['count'] ?? 0)
			})
		})
	}
	
	export const TableExists = async (connection: Connection, schema: string, table: string): Promise<boolean> => {
		return await new Promise((resolve) => {
			connection.query(`SELECT COUNT(*) AS count
                      FROM information_schema.tables
                      WHERE TABLE_SCHEMA = '${schema}'
                        AND TABLE_NAME = '${table}'`, (error , results, _fields) => {
				if (error) throw error
				resolve(((((results ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
			})
		})
	}
	
	export const Tables = async (connection: Connection, schema: string): Promise<string[]> => {
		return await new Promise((resolve) => {
			connection.query(`SELECT TABLE_NAME
                      FROM information_schema.tables
                      WHERE TABLE_SCHEMA = '${schema}'`, (error , results, _fields) => {
				if (error) throw error
				resolve((results as any[] ?? []).map((result: any) => result.TABLE_NAME as string).sort((a, b) => a.localeCompare(b)))
			})
		})
	}
	
	export const TableColumnExists = async (connection: Connection, schema: string, table: string, column: string): Promise<boolean> => {
		return await new Promise((resolve) => {
			connection.query(`SELECT COUNT(*) AS count
                      FROM information_schema.COLUMNS
                      WHERE TABLE_SCHEMA = '${schema}'
                        AND TABLE_NAME = '${table}'
                        AND COLUMN_NAME = '${column}'`, (error , results, _fields) => {
				if (error) throw error
				resolve(((((results ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
			})
		})
	}
	
	export const TableColumns = async (connection: Connection, schema: string, table: string): Promise<string[]> => {
		return await new Promise((resolve) => {
			connection.query(`SELECT *
                      FROM information_schema.COLUMNS
                      WHERE TABLE_SCHEMA = '${schema}'
                        AND TABLE_NAME = '${table}'
                        ORDER BY ORDINAL_POSITION`, (error , results, _fields) => {
				if (error) throw error
				resolve([...(results as any[] ?? [])])
			})
		})
	}
	
	export const TableFKs = async (connection: Connection, schema: string, table: string): Promise<MyForeignKey[]> => {
		return await new Promise((resolve) => {
			connection.query(`SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME
				FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
				WHERE REFERENCED_TABLE_SCHEMA = '${schema}'
				  AND TABLE_NAME = '${table}'`, (error , results, _fields) => {
				if (error) throw error
				
				let myForeignKeys: MyForeignKey[] = []
				
				for (const result of results) {
					const prevFK = myForeignKeys.find(fk => fk.keyName === result.CONSTRAINT_NAME)
					
					if (!!prevFK) {
						prevFK.columnNames = [...prevFK.columnNames, result.COLUMN_NAME]
						prevFK.primaryColumns = [...prevFK.primaryColumns, result.REFERENCED_COLUMN_NAME]
					} else {
						const myForeignKey = new MyForeignKey()
						
						myForeignKey.keyName = result.CONSTRAINT_NAME
						myForeignKey.columnNames = [result.COLUMN_NAME]
						myForeignKey.primaryTable = result.REFERENCED_TABLE_NAME
						myForeignKey.primaryColumns = [result.REFERENCED_COLUMN_NAME]
						
						myForeignKeys.push(myForeignKey)
					}
				}
				
				resolve(myForeignKeys)
			})
		})
	}
	
	export const TableIndexes = async (connection: Connection, schema: string, table: string): Promise<MyIndex[]> => {
		return await new Promise((resolve) => {
			connection.query(`SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
				FROM INFORMATION_SCHEMA.STATISTICS
				WHERE TABLE_SCHEMA = '${schema}'
					AND TABLE_NAME = '${table}'
				ORDER BY INDEX_NAME`, (error , results, _fields) => {
				if (error) throw error
				
				let myIndexes: MyIndex[] = []
				
				for (const result of results) {
					const prevIndex = myIndexes.find(idx => idx.indexName === result.INDEX_NAME)
					
					if (!!prevIndex) {
						prevIndex.columns = [...prevIndex.columns, result.COLUMN_NAME]
					} else {
						const myIndex = new MyIndex()
						
						myIndex.indexName = result.INDEX_NAME
						myIndex.columns = [result.COLUMN_NAME]
						myIndex.isUnique = !IsOn(result.NON_UNIQUE)
						
						myIndexes.push(myIndex)
					}
				}
				
				resolve(myIndexes)
			})
		})
	}
	
	export const GetMyTable = async (connection: Connection, schema: string, table: string): Promise<MyTable> => {
		const myTable = new MyTable()
		
		myTable.name = table
		
		const columns = await TableColumns(connection, schema, table)
		for (const column of columns) {
			const myColumn = new MyColumn(column as any)
			
			myTable.columns.push(myColumn)
		}
		
		myTable.foreignKeys = await TableFKs(connection, schema, table)
		
		myTable.indexes = await TableIndexes(connection, schema, table)
		
		return myTable
	}

	// export const TriggerExists = async (connection: TConnection, trigger: string): Promise<boolean> => {
	// 	return await new Promise((resolve) => {
	// 		const sql = `SELECT COUNT(*) AS count
  //                     FROM information_schema.triggers
  //                     WHERE trigger_schema = 'public'
  //                       AND trigger_catalog = '${schema}'
  //                       AND trigger_name = '${trigger}'`
	// 		query(connection, sql, undefined)
	// 			.then((data) => {
	// 				resolve(((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
	// 			})
	// 			.catch(() => {
	// 				console.log('...Trigger Exists', trigger)
	// 				resolve(false)
	// 			})
	// 	})
	// }
	//
	// export const TableResetIncrement = async (
	// 	connection: TConnection,
	// 	table: string,
	// 	column: string,
	// 	toID?: number
	// ): Promise<boolean> => {
	// 	const max =
	// 		toID ??
	// 		+((await SQL.FetchOne<{id: number}>(connection, `SELECT MAX(${column}) AS id FROM ${table}`))?.id ?? 0) + 1
	//
	// 	if (!!max) {
	// 		// console.log(table, column, max.id);
	// 		return await SQL.Execute(connection, `ALTER TABLE ${table} ALTER COLUMN ${column} RESTART WITH ${max}`)
	// 	}
	//
	// 	return true
	// }
	//
	// export const ConstraintExists = async (connection: TConnection, constraint: string): Promise<boolean> => {
	// 	return await new Promise((resolve) => {
	// 		const sql = `
	// 			SELECT COUNT(*) AS count
  //                     FROM information_schema.table_constraints
  //                     WHERE constraint_schema = 'public'
  //                       AND constraint_catalog = '${schema}'
  //                       AND constraint_name = '${constraint}'`
	// 		query(connection, sql, undefined)
	// 			.then((data) => {
	// 				resolve(((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
	// 			})
	// 			.catch(() => {
	// 				console.log('...Constraint Exists', constraint)
	// 				resolve(false)
	// 			})
	// 	})
	// }
	//
	// export interface IConstraints {
	// 	table_name: string
	// 	constraint_name: string
	// }
	//
	// export const FKConstraints = async (connection: TConnection): Promise<IConstraints[]> => {
	// 	const sql = `
	// 		SELECT table_name, constraint_name
  //                     FROM information_schema.table_constraints
  //                     WHERE constraint_schema = 'public'
  //                       AND constraint_catalog = '${schema}'
  //                       AND constraint_type = 'FOREIGN KEY'`
	//
	// 	return await SQL.FetchMany<IConstraints>(connection, sql)
	// }
	//
	// export const Functions = async (connection: TConnection): Promise<string[]> => {
	// 	const sql = `
	// 			SELECT routines.routine_name
	// 			  FROM information_schema.routines
	// 			  WHERE routines.specific_schema='public'
	// 			  AND routine_type='FUNCTION'
	// 			  AND routine_catalog='${schema}'
	// 			  ORDER BY routines.routine_name`
	//
	// 	return (await SQL.FetchArray<string>(connection, sql)).filter((func) => func.startsWith('transcom'))
	// }
	//
	// export const IndexExists = async (
	// 	connection: TConnection,
	// 	tablename: string,
	// 	indexName: string
	// ): Promise<boolean> => {
	// 	return await new Promise((resolve) => {
	// 		const sql = `SELECT COUNT(*) AS count
  //                     FROM pg_indexes
  //                     WHERE schemaname = 'public'
  //                       AND tablename = '${tablename}'
  //                       AND indexname = '${indexName}'`
	// 		query(connection, sql, undefined)
	// 			.then((data) => {
	// 				resolve(((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0)
	// 			})
	// 			.catch(() => {
	// 				console.log('...Index Exists', tablename, indexName)
	// 				resolve(false)
	// 			})
	// 	})
	// }
	//
	// export const GetByID = async <T>(connection: TConnection, table: TTables, id: number | null): Promise<T | null> => {
	// 	return await new Promise((resolve) => {
	// 		if (!id) {
	// 			resolve(null)
	// 		} else {
	// 			// noinspection SqlResolve
	// 			const sql = `SELECT * FROM ${table} WHERE id = $1`
	// 			query<T>(connection, sql, [id])
	// 				.then((data) => {
	// 					const result = !!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null
	//
	// 					resolve(result)
	// 					// resolve(!!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null)
	// 				})
	// 				.catch(() => {
	// 					console.log('...GetByID', table, id)
	// 					resolve(null)
	// 				})
	// 		}
	// 	})
	// }
	//
	// export const GetCountSQL = async (connection: TConnection, sql: string, values?: any): Promise<number> => {
	// 	return await new Promise((resolve) => {
	// 		query(connection, sql, values)
	// 			.then((data) => {
	// 				const value = (((data.rows ?? [])[0] ?? {}) as any)['count']
	// 				resolve(isNaN(value) ? 0 : parseInt(value))
	// 			})
	// 			.catch(() => {
	// 				console.log('... GetCNTSQL')
	// 				resolve(0)
	// 			})
	// 	})
	// }
	//
	// export const FetchOne = async <T>(connection: TConnection, sql: string, values?: any): Promise<T | null> => {
	// 	return await new Promise((resolve) => {
	// 		// noinspection SqlResolve
	// 		query<T>(connection, sql, values)
	// 			.then((data) => {
	// 				resolve(!!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null)
	// 			})
	// 			.catch(() => {
	// 				console.log('...FetchOne')
	// 				resolve(null)
	// 			})
	// 	})
	// }
	//
	// export const FetchMany = async <T>(connection: TConnection, sql: string, values?: any): Promise<Array<T>> => {
	// 	return await new Promise((resolve) => {
	// 		// noinspection SqlResolve
	// 		query<T>(connection, sql, values)
	// 			.then((data) => {
	// 				resolve(data.rows ?? [])
	// 			})
	// 			.catch(() => {
	// 				console.log('...FetchMany')
	// 				resolve([])
	// 			})
	// 	})
	// }
	//
	// export const FetchArray = async <T>(connection: TConnection, sql: string, values?: any): Promise<Array<T>> => {
	// 	return await new Promise((resolve) => {
	// 		query(connection, sql, values)
	// 			.then((data) => {
	// 				resolve((data.rows ?? []).map((row) => (row as any)[Object.keys(row as any)[0]] as T))
	// 			})
	// 			.catch(() => {
	// 				console.log('...FetchArray')
	// 				resolve([])
	// 			})
	// 	})
	// }
	//
	// export const InsertAndGetReturning = async (
	// 	connection: TConnection,
	// 	table: TTables,
	// 	values: any
	// ): Promise<any | null> => {
	// 	return await new Promise((resolve) => {
	// 		let newValues = {...values}
	// 		if (!newValues.id) {
	// 			delete newValues.id
	// 			// delete newValues.added_date;
	// 			// delete newValues.modified_date;
	// 		}
	//
	// 		let params = new PGParams()
	//
	// 		const sql = `
	// 			INSERT INTO ${table}
	// 			    ("${Object.keys(newValues).join('","')}")
	// 			    VALUES
	// 			    (${Object.values(newValues)
	// 			.map((value) => params.add(value))
	// 			.join(',')})
	// 			    RETURNING *`
	//
	// 		query(connection, sql, params.values)
	// 			.then((results) => {
	// 				resolve(((results.rows as any[]) ?? [])[0])
	// 			})
	// 			.catch(() => {
	// 				console.log('...InsertAndGetID', table)
	// 				resolve(null)
	// 			})
	// 	})
	// }
	//
	// export const InsertBulk = async (connection: TConnection, table: TTables, values: any): Promise<boolean> => {
	// 	return await new Promise((resolve) => {
	// 		let params = new PGParams()
	//
	// 		const sql = `
	// 			INSERT INTO ${table}
	// 			    ("${Object.keys(values).join('","')}")
	// 			    VALUES
	// 			    (${Object.values(values)
	// 			.map((value) => params.add(value))
	// 			.join(',')})`
	//
	// 		query(connection, sql, params.values)
	// 			.then(() => {
	// 				resolve(true)
	// 			})
	// 			.catch(() => {
	// 				console.log('...InsertBulk', table)
	// 				resolve(false)
	// 			})
	// 	})
	// }
	//
	// export const UpdateAndGetReturning = async (
	// 	connection: TConnection,
	// 	table: TTables,
	// 	whereValues: any,
	// 	updateValues: any
	// ): Promise<any | null> => {
	// 	return await new Promise((resolve) => {
	// 		let params = new PGParams()
	//
	// 		// noinspection SqlResolve
	// 		const sql = `UPDATE ${table} SET ${BuildSetComponents(updateValues, params)} WHERE ${BuildWhereComponents(
	// 			whereValues,
	// 			params
	// 		)} RETURNING *`
	// 		query(connection, sql, params.values)
	// 			.then((results) => {
	// 				// @ts-ignore
	// 				resolve(results.rows[0])
	// 			})
	// 			.catch(() => {
	// 				console.log('...Update', table)
	// 				resolve(null)
	// 			})
	// 	})
	// }
	//
	// export const BuildWhereComponents = (whereValues: any, params: PGParams): string =>
	// 	Object.keys(whereValues)
	// 		.map((key) => `"${key}"=${params.add(whereValues[key])}`)
	// 		.join(' AND ')
	//
	// export const BuildSetComponents = (setValues: any, params: PGParams): string =>
	// 	Object.keys(setValues)
	// 		.map((key) => `"${key}"=${params.add(setValues[key])}`)
	// 		.join(',')
	//
	// export const Save = async (connection: TConnection, table: TTables, values: any): Promise<any | null> => {
	// 	return await new Promise(async (resolve) => {
	// 		if (!values.id) {
	// 			resolve(await InsertAndGetReturning(connection, table, values))
	// 		} else {
	// 			let whereValues = {id: values.id}
	//
	// 			resolve(await UpdateAndGetReturning(connection, table, whereValues, values))
	// 		}
	// 	})
	// }
	//
	// export const Delete = async (connection: TConnection, table: TTables, whereValues: any): Promise<boolean> => {
	// 	return await new Promise((resolve) => {
	// 		let params = new PGParams()
	//
	// 		// noinspection SqlResolve
	// 		const sql = `DELETE FROM ${table} WHERE ${BuildWhereComponents(whereValues, params)}`
	// 		query(connection, sql, params.values)
	// 			.then(() => {
	// 				// @ts-ignore
	// 				resolve(true)
	// 			})
	// 			.catch(() => {
	// 				console.log('...DELETE', table)
	// 				resolve(false)
	// 			})
	// 	})
	// }
	//
	// export const ExecuteRaw = async (connection: TConnection | null, sql: string): Promise<boolean> => {
	// 	return await new Promise((resolve) => {
	// 		const tConnection = connection ?? databasePool
	// 		query(tConnection, sql, undefined)
	// 			.then(() => {
	// 				resolve(true)
	// 			})
	// 			.catch(() => {
	// 				console.log('...ExecuteRaw')
	// 				// console.log(());
	// 				// throw Error(().message);
	// 				resolve(false)
	// 			})
	// 	})
	// }
	//
	// export const Execute = async (connection: TConnection, sql: string, values?: any): Promise<boolean> => {
	// 	return await new Promise((resolve) => {
	// 		query(connection, sql, values)
	// 			.then(() => {
	// 				resolve(true)
	// 			})
	// 			.catch(() => {
	// 				console.log('...Execute')
	// 				resolve(false)
	// 			})
	// 	})
	// }
	//
	// export const TruncateAllTables = async (connection: TConnection, exceptions: string[] = []): Promise<boolean> => {
	// 	// if (Settings.IsTestDataENV()) {
	//
	// 	const dbVersion = await Csettings.GetSetting(connection, 'DBVersion', null, 0)
	// 	const htmlVersion = await Csettings.GetSetting(connection, 'HTMLVersion', null, 0)
	//
	// 	let tables = await TablesArray(connection)
	//
	// 	await Transaction(async (connection) => {
	// 		await Execute(connection, 'SET CONSTRAINTS ALL DEFERRED', undefined)
	//
	// 		for (const table of tables) {
	// 			if (exceptions.includes(table)) {
	// 				await Execute(connection, `TRUNCATE TABLE ${table}`, undefined)
	// 			}
	// 		}
	//
	// 		return true
	// 	})
	//
	// 	await Csettings.SetSetting(connection, 'DBVersion', dbVersion, 0)
	// 	await Csettings.SetSetting(connection, 'HTMLVersion', htmlVersion, 0)
	//
	// 	return true
	// }
	//
	// export const TruncateTables = async (connection: TConnection, tables: string[]) => {
	// 	for (const table of tables) {
	// 		await Execute(connection, `TRUNCATE TABLE ${table}`)
	// 	}
	// }
	//
	// export const TablesArray = async (connection: TConnection): Promise<string[]> => {
	// 	return await FetchArray<string>(
	// 		connection,
	// 		`
  //       	SELECT table_name
	// 			  FROM information_schema.tables
	// 			  WHERE table_schema = 'public'
	// 			    AND table_type = 'BASE TABLE'
	// 				AND table_catalog = '${schema}'`
	// 	)
	// }
	//
	// export const ViewsArray = async (connection: TConnection): Promise<string[]> => {
	// 	return (
	// 		await FetchArray<string>(
	// 			connection,
	// 			`
  //       	SELECT table_name
	// 			  FROM information_schema.tables
	// 			  WHERE table_schema = 'public'
	// 			    AND table_type = 'VIEW'
	// 				AND table_catalog = '${schema}'`
	// 		)
	// 	).filter((vw) => vw.startsWith('transcom'))
	// }
	//
	// export const TypesArray = async (connection: TConnection): Promise<string[]> => {
	// 	return (
	// 		await FetchArray<string>(
	// 			connection,
	// 			`
  //               SELECT typname
  //               FROM pg_type
  //               where typcategory = 'E'
  //               order by typname`
	// 		)
	// 	).filter((typ) => typ.startsWith('transcom'))
	// }
	//
	// export const SortColumnSort = (sortColumn: ISortColumn): string => {
	// 	let sort = ''
	//
	// 	if (!!sortColumn.primarySort) {
	// 		sort += 'ORDER BY '
	// 		if (!sortColumn.primaryAscending) {
	// 			sort += `${sortColumn.primarySort} DESC`
	// 		} else {
	// 			switch (sortColumn.primaryEmptyToBottom) {
	// 				case 'string':
	// 					sort += `NULLIF(${sortColumn.primarySort}, '')`
	// 					break
	// 				case 'number':
	// 					sort += `NULLIF(${sortColumn.primarySort}, 0)`
	// 					break
	// 				default:
	// 					// null, so do not empty to bottom
	// 					sort += `${sortColumn.primarySort}`
	// 					break
	// 			}
	// 		}
	//
	// 		if (!!sortColumn.primaryEmptyToBottom) sort += ' NULLS LAST'
	//
	// 		if (!!sortColumn.secondarySort) {
	// 			sort += ', '
	// 			if (!sortColumn.secondaryAscending) {
	// 				sort += `${sortColumn.secondarySort} DESC`
	// 			} else {
	// 				switch (sortColumn.secondaryEmptyToBottom) {
	// 					case 'string':
	// 						sort += `NULLIF(${sortColumn.secondarySort}, '')`
	// 						break
	// 					case 'number':
	// 						sort += `NULLIF(${sortColumn.secondarySort}, 0)`
	// 						break
	// 					default:
	// 						// null, so do not empty to bottom
	// 						sort += `${sortColumn.secondarySort}`
	// 						break
	// 				}
	// 			}
	//
	// 			if (!!sortColumn.secondaryEmptyToBottom) sort += ' NULLS LAST'
	// 		}
	// 	}
	//
	// 	return sort
	// }
	//
	// export const CalcOffsetFromPage = (page: number, pageSize: number, totalRecords: number): number => {
	// 	if (totalRecords > 0) {
	// 		const pages = CalcPageCount(+pageSize, +totalRecords)
	//
	// 		if (page < 1) {
	// 			page = 1
	// 		}
	// 		if (page > pages) {
	// 			page = pages
	// 		}
	//
	// 		return (page - 1) * pageSize
	// 	} else {
	// 		// noinspection JSUnusedAssignment
	// 		page = 1
	//
	// 		return 0
	// 	}
	// }
	//
	// export const CalcPageCount = (pageSize: number, totalRecords: number): number => {
	// 	if (totalRecords > 0) {
	// 		return Math.floor((totalRecords + (pageSize - 1)) / pageSize)
	// 	} else {
	// 		return 0
	// 	}
	// }
}
