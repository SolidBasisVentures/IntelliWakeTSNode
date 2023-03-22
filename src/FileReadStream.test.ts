import {expect, test} from 'vitest'
import path from 'path'
import {LineReadStream} from './LineReadStream'

test('FileReadStream', async () => {
	const pathName = path.resolve('consoles', 'CSVData')

	const fileName = 'M20_TEST.csv'

	const showSeparated = false
	const showEach = false
	const showSeparatedJSON = false
	const showEachJSON = true

	await LineReadStream(path.resolve(pathName, fileName), {
		onFirstLine: (data) => {
			if (showSeparated) console.info('1st', data)
		},
		onSubsequentLine: (data) => {
			if (showSeparated) console.info('nth', data)
		},
		onLine: (data) => {
			if (showEach) console.info('Each', data)
		},
		onFirstLineJSON: (data) => {
			if (showSeparatedJSON) console.info('J 1st', data)
		},
		onSubsequentLineJSON: (data) => {
			if (showSeparatedJSON) console.info('J nth', data)
		},
		onLineJSON: (data) => {
			if (showEachJSON) console.info('J Each', data)
		},
		pauseAfterLines: 10
	})

	expect(true).toBeTruthy()
})
