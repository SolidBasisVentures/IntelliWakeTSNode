// noinspection SqlNoDataSourceInspection

import {
	CleanNumber,
	DateFormat,
	IPaginatorRequest,
	IPaginatorResponse,
	IsOn,
	ISortColumn,
	ReplaceAll
} from '@solidbasisventures/intelliwaketsfoundation'
import {PGTable} from './PGTable'
import {PGColumn} from './PGColumn'
import {PGParams} from './PGParams'
import {PGEnum} from './PGEnum'
import {PGIndex} from './PGIndex'
import {PGForeignKey} from './PGForeignKey'
import {Client, FieldDef, Pool, PoolClient} from 'pg'

// import QueryStream from 'pg-query-stream'

declare function transact<TResult>(
	fn: (client: PoolClient) => Promise<TResult>
): Promise<TResult>;

declare function transact<TResult>(
	fn: (client: PoolClient) => Promise<TResult>,
	cb: (error: Error | null, result?: TResult) => void
): void;

export type TConnection = Pool | PoolClient | Client | {
	pool: Pool;
	Client: Client;
	query: Pool['query'];
	connect: Pool['connect'];
	transact: typeof transact;
} & Record<string, {
	pool: Pool;
	Client: Client;
	query: Pool['query'];
	connect: Pool['connect'];
	transact: typeof transact;
}>

export namespace PGSQL {
	export interface IOffsetAndCount {
		offset: number
		countPerPage: number
	}

	export const SetDBMSAlert = (milliseconds?: number) => {
		if (!milliseconds) {
			delete process.env.DB_MS_ALERT
		} else {
			process.env.DB_MS_ALERT = milliseconds.toString()
		}
	}

	export type TQueryResults<T> = { rows?: Array<T>; fields?: FieldDef[]; rowCount?: number }

	export const query = async <T>(connection: TConnection, sql: string, values?: any): Promise<TQueryResults<T>> => {
		try {
			if (!process.env.DB_MS_ALERT) {
				return await connection.query(sql, values)
			} else {
				const start = Date.now()
				const response = await connection.query(sql, values)
				const ms = Date.now() - start
				if (ms > CleanNumber(process.env.DB_MS_ALERT)) {
					console.log('----- Long SQL Query', ms / 1000, 'ms')
					console.log(sql)
					console.log(values)
				}
				return response
			}
		} catch (err) {
			console.log('------------ SQL Query')
			console.log(DateFormat('LocalDateTime', 'now', 'America/New_York'))
			console.log(err.message)
			console.log(sql)
			console.log(values)
			throw err
		}

		// return await new Promise((resolve, reject) => {
		// 	// const stackTrace = new Error().stack
		// 	const res = await connection.query(sql, values)
		// 	connection
		// 		.query(sql, values)
		// 		.then(res => {
		// 			resolve({rows: res.rows, fields: res.fields, rowCount: res.rowCount})
		// 		})
		// 		.catch(err => {
		// 			// console.log('------------ SQL')
		// 			// console.log(sql)
		// 			// console.log(values)
		// 			// console.log(err)
		// 			// console.log(stackTrace)
		// 			// throw 'SQL Error'
		// 			reject(`${err.message}\n${sql}\n${JSON.stringify(values ?? {})}`)
		// 		})
		// })
	}

	export const timeout = async (ms: number) => {
		return new Promise(resolve => {
			setTimeout(resolve, ms)
		})
	}

	// export const PGQueryValuesStream = async <T = any>(
	// 	connection: TConnection,
	// 	sql: string,
	// 	values: any,
	// 	row?: (row: T) => void
	// ): Promise<void> => {
	// 	return new Promise(async (resolve, reject) => {
	// 		let actualRow: (row: T) => void
	// 		let actualValues: any
	//
	// 		if (!!row) {
	// 			actualRow = row
	// 			actualValues = values
	// 		} else {
	// 			actualRow = values
	// 			values = []
	// 		}
	//
	// 		let loadCount = 0
	// 		let processedCount = 0
	//
	// 		const query = new QueryStream(sql, actualValues)
	// 		const stream = connection.query(query)
	// 		stream.on('data', async (row: any) => {
	// 			loadCount++
	// 			let paused = false
	//
	// 			if (loadCount > processedCount + 100) {
	// 				stream.pause()
	// 				paused = true
	// 			}
	// 			await actualRow(row)
	// 			processedCount++
	// 			if (paused) {
	// 				stream.resume()
	// 			}
	// 		})
	// 		stream.on('error', (err: Error) => {
	// 			reject(err)
	// 		})
	// 		stream.on('end', async () => {
	// 			await timeout(100)
	// 			while (processedCount < loadCount) {
	// 				await timeout(100)
	// 			}
	//
	// 			resolve()
	// 		})
	// 	})
	// }
	//
	// export const PGQueryStream = async <T = any>(
	// 	connection: TConnection,
	// 	sql: string,
	// 	row: (row: T) => void
	// ): Promise<void> => PGQueryValuesStream<T>(connection, sql, [], row)


	export const TableRowCount = async (connection: TConnection, table: string, schema?: string): Promise<number> => {
		const data = await query(connection, `SELECT COUNT(*) AS count
											  FROM ${(!!schema ? `${schema}.` : '') + table}`, undefined)

		return (((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0
	}

	export const CurrentSchema = (schema?: string) => schema ?? 'public'

	export const TableExists = async (connection: TConnection, table: string, schema?: string): Promise<boolean> => {
		const sql = `SELECT COUNT(*) AS count
					 FROM information_schema.tables
					 WHERE table_schema = '${CurrentSchema(schema)}'
					   AND table_name = '${table}'`

		const data = await query(connection, sql, undefined)

		return ((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0
	}

	export const TableColumnExists = async (connection: TConnection, table: string, column: string, schema?: string): Promise<boolean> => {
		const sql = `SELECT COUNT(*) AS count
					 FROM information_schema.COLUMNS
					 WHERE table_schema = '${CurrentSchema(schema)}'
					   AND table_name = '${table}'
					   AND column_name = '${column}'`
		const data = await query(connection, sql, undefined)
		return ((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0
	}

	export const TriggerExists = async (connection: TConnection, trigger: string, schema?: string): Promise<boolean> => {
		const sql = `SELECT COUNT(*) AS count
					 FROM information_schema.triggers
					 WHERE trigger_schema = '${CurrentSchema(schema)}'
					   AND trigger_name = '${trigger}'`
		const data = await query(connection, sql, undefined)
		return ((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0
	}

	export const TableResetIncrement = async (connection: TConnection, table: string, column: string, toID?: number) => {
		if (!!toID) {
			return PGSQL.Execute(
				connection,
				`SELECT setval(pg_get_serial_sequence('${table}', '${column}'), ${toID});
			`
			)
		} else {
			return PGSQL.Execute(
				connection,
				`SELECT SETVAL(PG_GET_SERIAL_SEQUENCE('${table}', '${column}'), MAX(${column}))
				 FROM ${table};
				`
			)
		}
	}

	export const ConstraintExists = async (connection: TConnection, constraint: string, schema?: string): Promise<boolean> => {
		const sql = `
			SELECT COUNT(*) AS count
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${CurrentSchema(schema)}'
			  AND constraint_name = '${constraint}'`
		const data = await query(connection, sql, undefined)
		return ((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0
	}

	export interface IConstraints {
		table_name: string
		constraint_name: string
	}

	export const FKConstraints = async (connection: TConnection, schema?: string): Promise<IConstraints[]> => {
		const sql = `
			SELECT table_name, constraint_name
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${CurrentSchema(schema)}'
			  AND constraint_type = 'FOREIGN KEY'`

		return PGSQL.FetchMany<IConstraints>(connection, sql)
	}

	export const Functions = async (connection: TConnection, schema?: string): Promise<string[]> => {
		const sql = `
			SELECT routines.routine_name
			FROM information_schema.routines
			WHERE routines.specific_schema = '${CurrentSchema(schema)}'
			  AND routine_type = 'FUNCTION'
			ORDER BY routines.routine_name`

		return (await PGSQL.FetchArray<string>(connection, sql)).filter(func => func.startsWith('func_'))
	}

	export const IndexExists = async (
		connection: TConnection,
		tablename: string,
		indexName: string, schema?: string
	): Promise<boolean> => {
		const sql = `SELECT COUNT(*) AS count
					 FROM pg_indexes
					 WHERE schemaname = '${CurrentSchema(schema)}'
					   AND tablename = '${tablename}'
					   AND indexname = '${indexName}'`
		const data = await query(connection, sql, undefined)
		return ((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? 0) > 0
	}

	export const GetByID = async <T>(connection: TConnection, table: string, id: number | null): Promise<T | null> => {
		if (!id) {
			return Promise.resolve(null)
		} else {
			// noinspection SqlResolve
			const sql = `SELECT *
						 FROM ${table}
						 WHERE id = $1`
			const data = await query<T>(connection, sql, [id])

			return !!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null
		}
	}

	/**
	 * Returns a number from the sql who's only column returned is "count"
	 *
	 * @param connection
	 * @param sql
	 * @param values
	 * @constructor
	 */
	export const GetCountSQL = async (connection: TConnection, sql: string, values?: any): Promise<number> => {
		const data = await query(connection, sql, values)

		return CleanNumber((((data.rows ?? [])[0] ?? {}) as any)['count'] ?? (((data.rows ?? [])[0] ?? {}) as any)[0], 0)
		// return isNaN(value) ? 0 : parseInt(value)
	}

	export const FetchOne = async <T>(connection: TConnection, sql: string, values?: any): Promise<T | null> => {
		// noinspection SqlResolve
		const data = await query<T>(connection, sql, values)
		return !!(data.rows ?? [])[0] ? {...(data.rows ?? [])[0]} : null
	}

	export const FetchOneValue = async <T>(connection: TConnection, sql: string, values?: any): Promise<T | null> => {
		return (Object.values((await FetchOne<any>(connection, sql, values)) ?? {}) as any)[0] ?? null
	}

	export const FetchMany = async <T>(connection: TConnection, sql: string, values?: any): Promise<Array<T>> => {
		// noinspection SqlResolve
		const data = await query<T>(connection, sql, values)
		return data.rows ?? []
	}

	export const FetchArray = async <T>(connection: TConnection, sql: string, values?: any): Promise<Array<T>> => {
		const data = await query(connection, sql, values)
		return (data.rows ?? []).map((row: any) => (row as any)[Object.keys(row as any)[0]] as T)
	}

	/**
	 * Pass a SQL command with a "SELECT 1 FROM..." and it will check if it exists
	 *
	 * @param connection
	 * @param sql
	 * @param values
	 * @constructor
	 */
	export const FetchExists = async (connection: TConnection, sql: string, values?: any): Promise<boolean> => {
		// noinspection SqlResolve
		const data = await query<{ does_exist: boolean }>(connection, `SELECT EXISTS (${sql}) as does_exist`, values)
		return !!(data.rows ?? [])[0]?.does_exist
	}

	export const InsertAndGetReturning = async (
		connection: TConnection,
		table: string,
		values: any
	): Promise<any | null> => {
		let newValues = {...values}
		if (!newValues.id) {
			delete newValues.id
			// delete newValues.added_date;
			// delete newValues.modified_date;
		}

		let params = new PGParams()

		const sql = `
			INSERT INTO ${table}
				("${Object.keys(newValues).join('","')}")
			VALUES (${Object.values(newValues)
							.map(value => params.add(value))
							.join(',')})
			RETURNING *`

		const results = await query(connection, sql, params.values)

		// if (!((results.rows as any[]) ?? [])[0]) console.error('Error inserting', sql, results)

		return ((results.rows as any[]) ?? [])[0]
	}

	export const InsertAndGetID = async (
		connection: TConnection,
		table: string,
		values: any
	): Promise<number> => {
		let newValues = {...values}
		if (!newValues.id) {
			delete newValues.id
			// delete newValues.added_date;
			// delete newValues.modified_date;
		}

		let params = new PGParams()

		const sql = `
			INSERT INTO ${table}
				("${Object.keys(newValues).join('","')}")
			VALUES (${Object.values(newValues)
							.map(value => params.add(value))
							.join(',')})
			RETURNING id`

		const results = await query(connection, sql, params.values)

		const id = (results.rows as any)[0]?.id

		if (!id) throw new Error('Could not load ID')

		return id
	}

	export const InsertBulk = async (connection: TConnection, table: string, values: any): Promise<void> => {
		let params = new PGParams()

		const sql = `
			INSERT INTO ${table}
				("${Object.keys(values).join('","')}")
			VALUES (${Object.values(values)
							.map(value => params.add(value))
							.join(',')})`

		await query(connection, sql, params.values)
	}

	export const UpdateAndGetReturning = async (
		connection: TConnection,
		table: string,
		whereValues: any,
		updateValues: any
	): Promise<any | null> => {
		let params = new PGParams()

		// noinspection SqlResolve
		const sql = `UPDATE ${table}
					 SET ${BuildSetComponents(updateValues, params)}
					 WHERE ${BuildWhereComponents(
						 whereValues,
						 params
					 )}
					 RETURNING *`
		const data = await query(connection, sql, params.values)
		// @ts-ignore
		// if (!data.rows[0]) console.error('Error updating', sql, data)
		// @ts-ignore
		return data.rows[0]
	}

	export const BuildWhereComponents = (whereValues: any, params: PGParams): string =>
		Object.keys(whereValues)
		      .map(key => (whereValues[key] === undefined || whereValues[key] === null) ? `"${key}" IS NULL` : `"${key}"=${params.add(whereValues[key])}`)
		      .join(' AND ')

	export const BuildSetComponents = (setValues: any, params: PGParams): string =>
		Object.keys(setValues)
		      .map(key => `"${key}"=${params.add(setValues[key])}`)
		      .join(',')

	export const Save = async (connection: TConnection, table: string, values: any): Promise<any | null> => {
		if (!values.id) {
			return InsertAndGetReturning(connection, table, values)
		} else {
			let whereValues = {id: values.id}

			return UpdateAndGetReturning(connection, table, whereValues, values)
		}
	}

	export const Delete = async (connection: TConnection, table: string, whereValues: any): Promise<void> => {
		let params = new PGParams()

		// noinspection SqlResolve
		const sql = `DELETE
					 FROM ${table}
					 WHERE ${BuildWhereComponents(whereValues, params)}`
		await query(connection, sql, params.values)
	}

	export const ExecuteRaw = async (connection: TConnection, sql: string) => Execute(connection, sql)

	export const Execute = async (connection: TConnection, sql: string, values?: any) => {
		try {
			if (!process.env.DB_MS_ALERT) {
				return await connection.query(sql, values)
			} else {
				const start = Date.now()
				const response = await connection.query(sql, values)
				const ms = Date.now() - start
				if (ms > CleanNumber(process.env.DB_MS_ALERT)) {
					console.log('----- Long SQL Query', ms / 1000, 'ms')
					console.log(sql)
					console.log(values)
				}
				return response
			}
		} catch (err) {
			console.log('------------ SQL Execute')
			console.log(err.message)
			console.log(sql)
			console.log(values)
			throw new Error(err.message)
		}
	}

	export const TruncateAllTables = async (connection: TConnection, exceptions: string[] = [], includeCascade = false) => {
		let tables = await TablesArray(connection)

		await Execute(connection, 'START TRANSACTION')
		await Execute(connection, 'SET CONSTRAINTS ALL DEFERRED')

		try {
			for (const table of tables) {
				if (exceptions.includes(table)) {
					await Execute(connection, `TRUNCATE TABLE ${table} RESTART IDENTITY` + (includeCascade ? ' CASCADE' : ''), undefined)
				}
			}
			await Execute(connection, 'COMMIT')
		} catch (err) {
			await Execute(connection, 'ROLLBACK')
			return false
		}

		return true
	}

	export const TruncateTables = async (connection: TConnection, tables: string[], includeCascade = false) => {
		for (const table of tables) {
			await Execute(connection, `TRUNCATE TABLE ${table} RESTART IDENTITY` + (includeCascade ? ' CASCADE' : ''))
		}
	}

	export const TablesArray = async (connection: TConnection, schema?: string): Promise<string[]> => {
		return FetchArray<string>(
			connection,
			`
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${CurrentSchema(schema)}'
				  AND table_type = 'BASE TABLE'`
		)
	}

	export const ViewsArray = async (connection: TConnection, schema?: string): Promise<string[]> => {
		return await FetchArray<string>(
			connection,
			`
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${CurrentSchema(schema)}'
				  AND table_type = 'VIEW'`
		)
	}

	export const ViewsMatArray = async (connection: TConnection, schema?: string): Promise<string[]> => {
		return await FetchArray<string>(
			connection,
			`
				SELECT matviewname
				FROM pg_matviews
				WHERE schemaname = '${CurrentSchema(schema)}'`
		)
	}

	export const TypesArray = async (connection: TConnection): Promise<string[]> => {
		return await FetchArray<string>(
			connection,
			`
				SELECT typname
				FROM pg_type
				WHERE typcategory = 'E'
				ORDER BY typname`
		)
	}

	export const FunctionsArray = async (connection: TConnection, schema?: string): Promise<string[]> => {
		return await FetchArray<string>(
			connection,
			`
				SELECT f.proname
				FROM pg_catalog.pg_proc f
						 INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${CurrentSchema(schema)}'
				  AND f.proname ILIKE 'func_%'`
		)
	}

	export const FunctionsOIDArray = async (connection: TConnection, schema?: string): Promise<any[]> => {
		return await FetchArray<any>(
			connection,
			`
				SELECT f.oid
				FROM pg_catalog.pg_proc f
						 INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${CurrentSchema(schema)}'
				  AND f.proname ILIKE 'func_%'`
		)
	}

	export const ExtensionsArray = async (connection: TConnection): Promise<string[]> => {
		return await FetchArray<string>(
			connection,
			`
				SELECT extname
				FROM pg_extension
				WHERE extname != 'plpgsql'`
		)
	}

	export const TableData = async (connection: TConnection, table: string, schema?: string): Promise<any> => {
		return FetchOne<any>(
			connection,
			`
				SELECT *
				FROM information_schema.tables
				WHERE table_schema = '${CurrentSchema(schema)}'
				  AND table_type = 'BASE TABLE'
				  AND table_name = $1`,
			[table]
		)
	}

	export const TableColumnsData = async (connection: TConnection, table: string, schema?: string): Promise<any[]> => {
		return FetchMany<any>(
			connection,
			`
				SELECT *
				FROM information_schema.columns
				WHERE table_schema = '${CurrentSchema(schema)}'
				  AND table_name = $1
				ORDER BY ordinal_position`,
			[table]
		)
	}

	export const TableFKsData = async (connection: TConnection, table: string, schema?: string): Promise<any[]> => {
		return FetchMany<any>(
			connection,
			`
				SELECT tc.table_schema,
					   tc.constraint_name,
					   tc.table_name,
					   MAX(tc.enforced),
					   JSON_AGG(kcu.column_name) AS "columnNames",
					   MAX(ccu.table_schema)     AS foreign_table_schema,
					   MAX(ccu.table_name)       AS "primaryTable",
					   JSON_AGG(ccu.column_name) AS "primaryColumns"
				FROM information_schema.table_constraints AS tc
						 JOIN information_schema.key_column_usage AS kcu
							  ON tc.constraint_name = kcu.constraint_name
								  AND tc.table_schema = kcu.table_schema
						 JOIN information_schema.constraint_column_usage AS ccu
							  ON ccu.constraint_name = tc.constraint_name
								  AND ccu.table_schema = tc.table_schema
				WHERE tc.table_schema = '${CurrentSchema(schema)}'
				  AND tc.constraint_type = 'FOREIGN KEY'
				  AND tc.table_name = $1
				GROUP BY tc.table_schema,
						 tc.constraint_name,
						 tc.table_name`,
			[table]
		)
	}

	export const TableIndexesData = async (connection: TConnection, table: string, schema?: string): Promise<any[]> => {
		return FetchMany<any>(
			connection,
			`
				SELECT *
				FROM pg_indexes
				WHERE schemaname = '${CurrentSchema(schema)}'
				  AND tablename = $1
				  AND (indexname NOT ILIKE '%_pkey'
					OR indexdef ILIKE '%(%,%)%')`,
			[table]
		)
	}

	export const ViewData = async (connection: TConnection, view: string): Promise<string | null> => {
		return (
			(
				await FetchOne<any>(
					connection,
					`
          select pg_get_viewdef($1, true) as viewd`,
					[view]
				)
			)?.viewd ?? null
		)
	}

	export const ViewsMatData = async (connection: TConnection, viewMat: string): Promise<any> => {
		return (
			(
				await FetchOne<any>(
					connection,
					`
          select pg_get_viewdef($1, true) as viewd`,
					[viewMat]
				)
			)?.viewd ?? null
		)
	}

	export const FunctionData = async (connection: TConnection, func: string): Promise<any> => {
		return (
			(
				await FetchOne<any>(
					connection,
					`
          select pg_get_functiondef($1) as viewd`,
					[func]
				)
			)?.viewd ?? null
		)
	}

	export const TypeData = async (connection: TConnection, type: string): Promise<string[]> => {
		return FetchArray<string>(
			connection,
			`
                SELECT unnest(enum_range(NULL::${type}))`
		)
	}

	export const SortColumnSort = <T = Record<string, any>>(sortColumn: ISortColumn<T>): string => {
		let sort = ''

		if (!!sortColumn.primarySort) {
			sort += 'ORDER BY '
			if (!sortColumn.primaryAscending) {
				sort += `${AltColumn(sortColumn.primarySort)} DESC`
			} else {
				switch (sortColumn.primaryEmptyToBottom) {
					case 'string':
						sort += `NULLIF(${sortColumn.primarySort as any}, '')`
						break
					case 'number':
						sort += `NULLIF(${sortColumn.primarySort as any}, 0)`
						break
					default:
						// null, so do not empty to bottom
						sort += `${AltColumn(sortColumn.primarySort)}`
						break
				}
			}

			if (!!sortColumn.primaryEmptyToBottom) sort += ' NULLS LAST'

			if (!!sortColumn.secondarySort) {
				sort += ', '
				if (!sortColumn.secondaryAscending) {
					sort += `${AltColumn(sortColumn.secondarySort)} DESC`
				} else {
					switch (sortColumn.secondaryEmptyToBottom) {
						case 'string':
							sort += `NULLIF(${sortColumn.secondarySort as any}, '')`
							break
						case 'number':
							sort += `NULLIF(${sortColumn.secondarySort as any}, 0)`
							break
						default:
							// null, so do not empty to bottom
							sort += `${AltColumn(sortColumn.secondarySort)}`
							break
					}
				}

				if (!!sortColumn.secondaryEmptyToBottom) sort += ' NULLS LAST'
			}
		}

		return sort
	}

	export const PaginatorOrderBy = (paginatorRequest: IPaginatorRequest): string => SortColumnSort(paginatorRequest.sortColumns)

	export const LimitOffset = (limit: number, offset: number): string => ` LIMIT ${limit} OFFSET ${offset} `

	export const PaginatorLimitOffset = (paginatorResponse: IPaginatorResponse): string => LimitOffset(paginatorResponse.countPerPage, paginatorResponse.currentOffset)

	const AltColumn = (column: any): string => {
		if (column === 'appointment_date') {
			return `concat_ws(' ', appointment_date, appointment_time)`
		} else {
			return column
		}
	}

	export const CalcOffsetFromPage = (page: number, pageSize: number, totalRecords: number): number => {
		if (CleanNumber(totalRecords) > 0) {
			const pages = CalcPageCount(pageSize, totalRecords)

			if (CleanNumber(page) < 1) {
				page = 1
			}
			if (CleanNumber(page) > CleanNumber(pages)) {
				page = pages
			}

			return (CleanNumber(page) - 1) * CleanNumber(pageSize)
		} else {
			// noinspection JSUnusedAssignment
			page = 1

			return 0
		}
	}

	export const CalcPageCount = (pageSize: number, totalRecords: number): number => {
		if (CleanNumber(totalRecords) > 0) {
			return Math.floor((CleanNumber(totalRecords) + (CleanNumber(pageSize) - 1)) / CleanNumber(pageSize))
		} else {
			return 0
		}
	}

	export const ResetIDs = async (connection: TConnection) => {
		let tables = await PGSQL.TablesArray(connection)

		for (const table of tables) {
			if (await TableColumnExists(connection, table, 'id')) {
				await TableResetIncrement(connection, table, 'id')
			}
		}
	}

	export const GetTypes = async (connection: TConnection): Promise<PGEnum[]> => {
		const enumItems = await TypesArray(connection)

		let enums: PGEnum[] = []

		for (const enumItem of enumItems) {
			enums.push(
				new PGEnum({
					enumName: enumItem,
					values: await TypeData(connection, enumItem),
					defaultValue: undefined
				} as any)
			)
		}

		return enums
	}

	export const TableColumnComments = async (connection: TConnection, table: string, schema?: string): Promise<{ column_name: string, column_comment: string | null }[]> => {
		return PGSQL.FetchMany<{ column_name: string, column_comment: string | null }>(connection, `
			SELECT cols.column_name,
				   (SELECT pg_catalog.COL_DESCRIPTION(c.oid, cols.ordinal_position::INT)
					FROM pg_catalog.pg_class c
					WHERE c.oid = (SELECT cols.table_name::REGCLASS::OID)
					  AND c.relname = cols.table_name) AS column_comment

			FROM information_schema.columns cols
			WHERE cols.table_schema = '${CurrentSchema(schema)}'
			  AND cols.table_name = '${table}'`)
	}

	export const GetPGTable = async (connection: TConnection, table: string, schema?: string): Promise<PGTable> => {
		const pgTable = new PGTable()

		pgTable.name = table

		const columnComments = await TableColumnComments(connection, table, schema)

		const columns = await TableColumnsData(connection, table, schema)
		for (const column of columns) {
			const pgColumn = new PGColumn({
				...column,
				generatedAlwaysAs: column.generation_expression,
				isAutoIncrement: IsOn(column.identity_increment),
				udt_name: column.udt_name.toString().startsWith('_') ? column.udt_name.toString().substr(1) : column.udt_name,
				array_dimensions: column.udt_name.toString().startsWith('_') ? [null] : [],
				column_default: ((column.column_default ?? '').toString().startsWith('\'NULL\'') || (column.column_default ?? '').toString().startsWith('NULL::')) ? null : (column.column_default ?? '').toString().startsWith('\'\'::') ? '' : column.column_default,
				column_comment: columnComments.find(col => col.column_name === column.column_name)?.column_comment ?? ''
			})

			pgTable.columns.push(pgColumn)
		}

		const fks = await TableFKsData(connection, table)
		for (const fk of fks) {
			const pgForeignKey = new PGForeignKey({
				columnNames: (fk.columnNames as string[]).reduce<string[]>((results, columnName) => results.includes(columnName) ? results : [...results, columnName], []),
				primaryTable: fk.primaryTable,
				primaryColumns: (fk.primaryColumns as string[]).reduce<string[]>((results, primaryColumn) => results.includes(primaryColumn) ? results : [...results, primaryColumn], [])
			} as any)

			pgTable.foreignKeys.push(pgForeignKey)
		}

		const indexes = await TableIndexesData(connection, table)
		for (const index of indexes) {
			const indexDef = index.indexdef as string

			const wherePos = indexDef.toUpperCase().indexOf(' WHERE ')

			const pgIndex = new PGIndex({
				columns: indexDef
					.substring(indexDef.indexOf('(') + 1, wherePos > 0 ? wherePos - 1 : indexDef.length - 1)
					.split(',')
					.map(idx => idx.trim())
					.filter(idx => !!idx),
				isUnique: indexDef.includes(' UNIQUE '),
				whereCondition: wherePos > 0 ? indexDef.substring(wherePos + 7).trim() : null
			})

			pgTable.indexes.push(pgIndex)
		}

		return pgTable
	}

	export const CleanSQL = (sql: string): string => ReplaceAll(';', '', sql)
}
