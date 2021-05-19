import {KeyboardKey, KeyboardLine} from '../src/Functions'
import {PGIndex} from '../src/Database/PGSQL/PGIndex'

const processScript = async() => {
	// const val = await KeyboardKey('True or False?', (key) => key === 't')
	// console.log('Answer:', val)
	//
	// const valLine = await KeyboardLine('Question?')
	// console.log('Answered:', valLine)
	
	// const test = 'Blah {EnUm: ETestEnum} Blah'
	//
	// const regExp = /{([^}]*)}/;
	// const results = regExp.exec(test)
	// if (!!results) {
	// 	console.log('R', results)
	// 	const items = results[1].split(':')
	// 	console.log('Is', items)
	// 	if ((items[0] ?? '').toLowerCase().trim() === 'enum') {
	// 		console.log('Found', (items[1] ?? '').trim())
	// 	}
	// }
	// console.log('Not Found')
	
	const indexDef = `CREATE INDEX "idx_appointment_pleted_date_time IS NULL)" ON public.appointment USING btree (intake_review_needed_date_time) WHERE ((intake_review_needed_date_time IS NOT NULL) AND (intake_review_completed_date_time IS NULL))`
	
	const wherePos = indexDef.toUpperCase().indexOf(' WHERE ')
	
	const pgIndex = new PGIndex({
		columns: indexDef
			.substring(indexDef.indexOf('(') + 1, wherePos > 0 ? wherePos - 1 : indexDef.length - 1)
			.split(',')
			.map(idx => idx.trim())
			.filter(idx => !!idx),
		isUnique: indexDef.includes(' UNIQUE '),
		where: wherePos > 0 ? indexDef.substring(wherePos + 7).trim() : undefined
	} as any)
	
	console.log(pgIndex)
	
}

processScript().then(() => console.log('Done!'))
