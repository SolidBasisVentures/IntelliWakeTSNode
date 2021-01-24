import readline from 'readline'

export const KeyboardLine = async (question: string): Promise<string> => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	
	return new Promise(resolve =>
		rl.question(`${question} `, answer => {
			resolve(answer)
			
			rl.close()
		})
	)
}

export const KeyboardKey = async (question?: string): Promise<string> => {
	return new Promise(resolve => {
		if (!!question) console.log(question)
		
		process.stdin.setRawMode(true)
		process.stdin.resume()
		process.stdin.setEncoding('utf8')
		process.stdin.on('data', (key: any) => {
			if (key === '\u0003') process.exit()
			resolve(key)
		})
	})
}
