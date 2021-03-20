import {KeyboardKey, KeyboardLine} from '../src/Functions'

const processScript = async() => {
	// const val = await KeyboardKey('True or False?', (key) => key === 't')
	// console.log('Answer:', val)
	//
	// const valLine = await KeyboardLine('Question?')
	// console.log('Answered:', valLine)
	
	const test = 'Blah {EnUm: ETestEnum} Blah'
	
	const regExp = /{([^}]*)}/;
	const results = regExp.exec(test)
	if (!!results) {
		console.log('R', results)
		const items = results[1].split(':')
		console.log('Is', items)
		if ((items[0] ?? '').toLowerCase().trim() === 'enum') {
			console.log('Found', (items[1] ?? '').trim())
		}
	}
	console.log('Not Found')
}

processScript().then(() => console.log('Done!'))
