import mysql from 'mysql'
import {MySQL} from '../src/Database/MySQL/MySQL'
import {MyToPG} from '../src/Database/Conversions/MyToPG'

require('source-map-support').install()

process.env.MYSQLDATABASE = 'qvsheets-app-local'

const processConsole = async (host: string, user: string, password: string, schema: string, port: number) => {
	let connection = mysql.createConnection({
		host: host,
		user: user,
		password: password,
		database: schema,
		port: port
	})
	
	connection.connect()

// connection.query('SELECT * FROM account', (error , results, fields) => {
// 	if (error) throw error
// 	console.log('The solution is: ', [...results])
// })
	
	const tables = await MySQL.Tables(connection, schema)
	
	const table = tables.find(tab => tab === 'qv_sheet')
	
	if (table) {
		const myTable = await MySQL.GetMyTable(connection, schema, table)
		
		const pgTable = MyToPG.GetPGTable(myTable)
		
		console.log(pgTable.name)
		
		// console.log(myTable.columns.filter(col => col.COLUMN_NAME === 'id'))
		
		// console.log(pgTable.columns.filter(col => col.column_name === 'id'))
	}
	
	connection.end()
}


