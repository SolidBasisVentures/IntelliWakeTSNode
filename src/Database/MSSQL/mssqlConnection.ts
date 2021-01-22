import mssql from 'mssql'
import {timeout} from '../Transforms/Transform'

export const MSConfig = {
	user: 'sa',
	password: 'DennisSQL1!',
	server: 'localhost',
	port: 1433,
	database: 'chronos',
	schema: 'dbo',
	options: {
		enableArithAbort: true,
		useUTC: false
	}
}

export const MSConfigSchema = 'dbo'

// export const databasePoolMS = new mssql.ConnectionPool(MSConfig);

export const databasePoolMS = new mssql.ConnectionPool(MSConfig)

// databasePoolMS.connect(err => {
//     console.log('MS Connect Error', err);
// });

export namespace MSSQL {
	export const GetMissingValues = async (
		primaryTable: string,
		primaryColumn: string,
		foreignTable: string,
		foreignColumn: string,
		offset = 0,
		count = 20,
		search = ''
	): Promise<any[]> => {
		return new Promise(async resolve => {
			let sql =
				'SELECT DISTINCT "' +
				foreignColumn +
				'" FROM "' +
				foreignTable +
				'" WHERE NOT EXISTS (SELECT 1 FROM "' +
				primaryTable +
				'" WHERE "' +
				foreignTable +
				'"."' +
				foreignColumn +
				'" = "' +
				primaryTable +
				'"."' +
				primaryColumn +
				'") AND "' +
				foreignColumn +
				'" IS NOT NULL /* where */ ORDER BY "' +
				foreignColumn +
				'" OFFSET ' +
				offset +
				' ROWS FETCH NEXT ' +
				count +
				' ROWS ONLY'

			if (!!search) {
				sql = sql.replace('/* where */', ' AND "' + foreignColumn + '" LIKE CONCAT("%", :search, "%") ')
			} else {
				sql = sql.replace('/* where */', '')
			}

			await databasePoolMS.connect()

			databasePoolMS.request().query(sql, (err, results) => {
				if (err) {
					// throw Error(err.message);
					console.log('---------- GetMissingValues')
					console.log(sql)
					console.log(err)
					resolve([])
				} else {
					// console.log("---------- GetMissingValues OK");
					resolve((results!.recordsets[0] ?? []).map(row => (row as any)[foreignColumn]))
				}
			})
		})
	}

	export const GetMissingValuesCount = async (
		primaryTable: string,
		primaryColumn: string,
		foreignTable: string,
		foreignColumn: string,
		offset = 0,
		count = 20,
		search = ''
	): Promise<number> => {
		return new Promise(async resolve => {
			let sql =
				'SELECT count(DISTINCT "' +
				foreignColumn +
				'") as count FROM "' +
				foreignTable +
				'" WHERE NOT EXISTS (SELECT 1 FROM "' +
				primaryTable +
				'" WHERE "' +
				foreignTable +
				'"."' +
				foreignColumn +
				'" = "' +
				primaryTable +
				'"."' +
				primaryColumn +
				'") AND "' +
				foreignColumn +
				'" IS NOT NULL /* where */'

			if (!!search) {
				sql = sql.replace('/* where */', ' AND "' + foreignColumn + '" LIKE CONCAT("%", :search, "%") ')
			} else {
				sql = sql.replace('/* where */', '')
			}

			await databasePoolMS.connect()

			databasePoolMS.request().query(sql, (err, results) => {
				if (err) {
					// throw Error(err.message);
					console.log('---------- GetMissingValuesCount')
					console.log(sql)
					console.log(err)
					resolve(0)
				} else {
					// console.log("---------- GetMissingValues OK");
					resolve((results!.recordset[0] as any)['count'] ?? 0)
				}
			})
		})
	}

	export const FetchAll = async (sql: string): Promise<any[]> => {
		await databasePoolMS.connect()

		return (await databasePoolMS.request().query(sql)).recordsets[0] ?? []
	}

	export const FetchAllArray = async (sql: string): Promise<any[]> => {
		return new Promise(async resolve => {
			let results: any[] = []

			await databasePoolMS.connect()

			const request = databasePoolMS.request()

			request.stream = true // You can set streaming differently for each request
			request.query(sql) // or request.execute(procedure)

			// request.on('recordset', columns => {
			//     // Emitted once for each recordset in a query
			// })

			request.on('row', row => {
				// Emitted for each row in a recordset
				results.push(Object.values(row)[0])
			})

			request.on('error', err => {
				// May be emitted multiple times
				console.log('Stream error', err)
			})

			request.on('done', () => {
				// Always emitted as the last one

				resolve(results)
			})
		})
	}

	export const Fetch = async (sql: string): Promise<any> => {
		await databasePoolMS.connect()

		return ((await databasePoolMS.request().query(sql)).recordset ?? [])[0] ?? null
	}

	export const Execute = async (sql: string): Promise<any> => {
		await databasePoolMS.connect()

		return await databasePoolMS.request().query(sql)
	}

	export const Table_Exists = async (tableName: string): Promise<boolean> => {
		return new Promise(async resolve => {
			const sql = `SELECT count(*) AS count
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = '${MSConfigSchema}'
                AND TABLE_CATALOG = '${MSConfig.database}'
                AND TABLE_NAME = '${tableName}'`

			// const request = databasePoolMS.request();

			await databasePoolMS.connect()

			databasePoolMS.request().query(sql, (err, results) => {
				if (err) {
					// throw Error(err.message);
					console.log(sql, err)
					resolve(false)
				} else {
					resolve(((results!.recordset[0] as any)['count'] ?? 0) > 0)
				}
			})
		})
	}

	export const Table_Column_Exists = async (tableName: string, columnName: string): Promise<boolean> => {
		return new Promise(async resolve => {
			const sql = `SELECT count(*) AS count
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = '${MSConfigSchema}'
            AND TABLE_CATALOG = '${MSConfig.database}'
            AND TABLE_NAME = '${tableName}'
            AND COLUMN_NAME = '${columnName}'`

			await databasePoolMS.connect()

			databasePoolMS.request().query(sql, (err, results) => {
				if (err) {
					// throw Error(err.message);
					console.log(sql, err)
					resolve(false)
				} else {
					resolve(((results!.recordset[0] as any)['count'] ?? 0) > 0)
				}
			})
		})
	}

	export const GetColumnValues = async (
		table: string,
		column: string,
		offset = 0,
		count = 20,
		search = '',
		distinct = 0
	): Promise<string[]> => {
		return new Promise(async resolve => {
			if (!(await Table_Exists(table))) {
				resolve([])
			} else if (!(await Table_Column_Exists(table, column))) {
				resolve([])
			} else {
				const sqlDistinct = distinct === 0 ? '' : 'DISTINCT'

				const sqlSearch = !!search ? ` WHERE '${column}' LIKE "%${search}%" ` : ''

				let sql = `SELECT ${sqlDistinct} "${column}"
                    FROM ${table}
                    ${sqlSearch}
                    ORDER BY ${column}
                    OFFSET ${offset} ROWS
                    FETCH NEXT ${count} ROWS ONLY`

				resolve(await FetchAllArray(sql))
			}
		})
	}

	export const GetColumnValuesCount = async (
		table: string,
		column: string,
		offset = 0,
		count = 20,
		search = '',
		distinct = 0
	): Promise<number> => {
		return new Promise(async resolve => {
			if (!(await Table_Exists(table))) {
				resolve(0)
			} else if (!(await Table_Column_Exists(table, column))) {
				resolve(0)
			} else {
				const sqlDistinct = distinct === 0 ? 'count(*)::INTEGER AS count ' : `count(DISTINCT ${column}) AS count `

				const sqlSearch = !!search ? ` WHERE '${column}' LIKE "%${search}%" ` : ''

				const sql = `SELECT ${sqlDistinct} FROM ${table} ${sqlSearch}`

				await databasePoolMS.connect()

				databasePoolMS.request().query(sql, (err, results) => {
					if (err) {
						// throw Error(err.message);
						console.log(sql, err)
						resolve(0)
					} else {
						resolve((results!.recordset[0] as any)['count'] ?? 0)
					}
				})
			}
		})
	}

	export const StreamSQL = async (mssql: string, each: (_row: any) => Promise<void>): Promise<number | null> => {
		let noProcessed = 0
		let succeeded = true
		let done = false
		let processing = 0

		return new Promise<number | null>(async resolve => {
			await databasePoolMS.connect()
			const request = databasePoolMS.request()
			request.stream = true
			request.query(mssql)

			request.on('row', async row => {
				// Emitted for each row in a recordset
				processing++

				let paused = processing > 20

				if (paused) {
					request.pause()
				}

				if (done) {
					console.log('DONE AND STILL PROCESSING!!!', processing)
				}

				await each(row)

				if (paused) {
					request.resume()
				}

				processing--
			})

			request.on('error', err => {
				// May be emitted multiple times
				console.log('-----------')
				console.log('Error on ' + (+noProcessed + 1))
				console.log(mssql)
				console.log(err)
			})

			request.on('done', async () => {
				// Always emitted as the last one

				await timeout(250)

				while (processing > 0) {
					// console.log('done awaiting', processing)
					await timeout(250)
				}

				if (succeeded) {
					resolve(succeeded ? noProcessed : null)
				} else {
					resolve(null)
				}
			})
		})
	}
}
