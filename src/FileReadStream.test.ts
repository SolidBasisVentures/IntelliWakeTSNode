import {expect, test} from 'vitest'
import path from 'path'
import {FileReadStream} from './FileReadStream'

test('FileReadStream', async () => {
	const pathName = path.resolve('consoles', 'CSVData')

	const fileName = 'M20_TEST.csv'

	const showSeparated = true
	const showEach = false

	await FileReadStream(path.resolve(pathName, fileName), {
		onFirstLine: (data) => {
			if (showSeparated) console.info('1st', data)
			if (data.endsWith('\r')) console.info('Here')
		},
		onSubsequentLine: (data) => {
			if (showSeparated) console.info('nth', data)
		},
		onLine: (data) => {
			if (showEach) console.info('Each', data)
		},
		pauseAfterLines: 10
	})

	expect(true).toBeTruthy()
})
