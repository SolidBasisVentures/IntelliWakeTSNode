import {expect, test} from 'vitest'
import path from 'path'
import {FileReadStream} from './FileReadStream'

test('FileReadStream', async () => {
	const pathName = path.resolve('consoles', 'CSVData')

	const fileName = 'M20_TEST.csv'
	await FileReadStream(path.resolve(pathName, fileName), {
		onFirstLine: () => {
		},
		onSubsequentLine: () => {
		},
		onLine: () => {
		},
		pauseAfterLines: 10
	})

	expect(true).toBeTruthy()
})
