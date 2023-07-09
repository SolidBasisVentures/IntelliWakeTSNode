import {testValue} from './TestData'

function testValueFunc() {
	return testValue
}

async function testValueFuncAS(): Promise<number> {
	return new Promise<number>(resolve => {
		resolve(testValue)
	})
}

const processScript = async () => {
	const tvf = testValueFunc()
	const tvfas = testValueFuncAS()

	console.log('tvf', await Promise.resolve(tvf))
	console.log('tvfas', await Promise.resolve(tvfas))
}

console.info('Started')
console.time('Ended')
processScript().then(() => console.timeEnd('Ended'))
