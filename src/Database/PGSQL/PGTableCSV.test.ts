import {expect, test} from 'vitest'
import path from 'path'
import {PGTableCSV} from './PGTableCSV'

test('PGTable_CSV', async () => {
	const pathName = path.resolve('consoles', 'CSVData')

	{
		const fileName = 'M20_TEST.csv'
		const table = await new PGTableCSV().buildFromCSV(path.resolve(pathName, fileName))
		// expect(true).toBeTruthy()
		expect(table.name).toBe(fileName.split('.')[0])

		console.log(table.columns)
	}
})
