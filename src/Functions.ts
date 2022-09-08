import readline from 'readline'
import {exec, ExecException} from 'child_process'

export const KeyboardLine = async (question: string, validAnswers?: string[]): Promise<string> => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	})
	
	return new Promise(resolve =>
		rl.question(`${question} `, answer => {
			if (!validAnswers || validAnswers.includes(answer)) {
				resolve(answer)
				
				rl.close()
			}
		})
	)
}

export const KeyboardKey = async (question?: string, validKeys?: string[] | ((key: string) => boolean)): Promise<string> => {
	return new Promise(resolve => {
		if (!!question) console.log(question)
		
		process.stdin.setRawMode(true)
		process.stdin.resume()
		process.stdin.setEncoding('utf8')
		
		const getData = (key: any) => {
			if (key === '\u0003') process.exit()
			
			if (!validKeys || (Array.isArray(validKeys) ? validKeys.includes(key) : validKeys(key))) {
				process.stdin.setRawMode(false)
				process.stdin.pause()
				process.stdin.removeListener('data', getData)
				resolve(key)
			}
		}
		
		process.stdin.on('data', getData)
	})
}

export const ExecuteScript = async (script: string): Promise<string> =>
	new Promise<string>((resolve, reject) => {
		exec(script, async (error: ExecException | null, stdout: string, stderr: string) => {
			if (error) {
				reject(error)
			} else {
				if (stderr) {
					console.log(`stderr: ${stderr}`)
				}
				
				resolve(stdout)
			}
		})
	})
