import mysql from 'mysql'
import {MySQL} from '../src/Database/MySQL/MySQL'
import {MyToPG} from '../src/Database/Conversions/MyToPG'

require('source-map-support').install()

process.env.MYSQLDATABASE = 'qvsheets-app-local'

const processConsole = async () => {
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'admin',
		password: '123',
		database: process.env.MYSQLDATABASE,
		port: 33061
	})
	
	connection.connect()

// connection.query('SELECT * FROM account', (error , results, fields) => {
// 	if (error) throw error
// 	console.log('The solution is: ', [...results])
// })
	
	const tables = await MySQL.Tables(connection)
	
	const table = tables.find(tab => tab === 'qv_sheet')
	
	if (table) {
		const myTable = await MySQL.GetMyTable(connection, table)
		
		const pgTable = MyToPG.GetPGTable(myTable)
		
		console.log(pgTable.name)
		
		// console.log(myTable.columns.filter(col => col.COLUMN_NAME === 'id'))
		
		// console.log(pgTable.columns.filter(col => col.column_name === 'id'))
	}
	
	connection.end()
}

processConsole()
	.then(() => {
		console.log('Done')
	})
