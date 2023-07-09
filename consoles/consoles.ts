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

	const tvfv = await Promise.resolve(tvf)
	const tvfasv = await Promise.resolve(tvfas)

	console.log('tvf', tvfv)
	console.log('tvfas', tvfasv)
}

console.info('Started')
console.time('Ended')
processScript().then(() => console.timeEnd('Ended'))
