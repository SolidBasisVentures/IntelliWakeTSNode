import mysql from 'mysql'
import {MySQL} from '../src/Database/MySQL/MySQL'

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
	
	console.log(await MySQL.Tables(connection))
	
	connection.end()
}

processConsole()
	.then(() => {
		console.log('Done')
	})
