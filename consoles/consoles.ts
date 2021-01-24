import {KeyboardKey, KeyboardLine} from '../src/Functions'

const processScript = async() => {
	const val = await KeyboardKey('True or False?', (key) => key === 't')
	console.log('Answer:', val)
	
	const valLine = await KeyboardLine('Question?')
	console.log('Answered:', valLine)
}

processScript().then(() => console.log('Done!'))
