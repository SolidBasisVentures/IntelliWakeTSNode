import { GreaterNumber, Sleep } from '@solidbasisventures/intelliwaketsfoundation'
import readline from 'readline'
import {Readable} from 'stream'

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

/**
 * @typedef {Object} TParallelProcessOptions
 * @template T
 * @property {number | null} [upperBound] - The upper bound of the parallel processing limit. Default value is null.
 * @property {number | null} [lowerBound] - The lower bound of the parallel processing limit. Default value is null.
 * @property {(chunk: T, err: any) => Promise<void>} [onError] - A callback function to handle errors that occur during processing. It takes two parameters: the chunk being processed and the error object. It returns a Promise<void>.
 * @property {boolean} [throwOnError] - A flag indicating whether an error should be thrown when an error occurs during processing. Default value is false.
 */
export type TParallelProcessOptions<T = any> = {
	upperBound?: number | null
	lowerBound?: number | null
	onError?: (chunk: T, err: any) => Promise<void>
	throwOnError?: boolean
}

/**
 * Executes a given action in parallel for each chunk of data from a readable stream.
 * @param {stream.Readable} stream - The readable stream from which to read data.
 * @param {Function} action - The action to be executed for each chunk of data. It should accept a single parameter, the chunk of data, and return a Promise that resolves when the action is complete.
 * @param {Object} options - Optional configuration options.
 * @param {number} options.upperBound - The maximum number of active processes. Defaults to 1000.
 * @param {number} options.lowerBound - The minimum number of active processes before resuming the stream. Defaults to half of the upper bound or 1, whichever is greater.
 * @param {Function} options.onError - A callback function to handle errors that occur during the action execution. It should accept two parameters: the chunk of data and the error object.
 * @param {boolean} options.throwOnError - If true, the ReadableParallelProcess function will reject the promise if an error occurs during the action execution. Defaults to false.
 * @returns {Promise<void>} - A promise that resolves when all chunks have been processed.
 */
export async function ReadableParallelProcess<T = any>(
	stream: Readable,
	action: (chunk: T) => Promise<void>,
	options?: TParallelProcessOptions<T>
) {
	return new Promise<void>((resolve, reject) => {
		let activeProcesses = 0
		const upperBound = options?.upperBound ?? 1000
		const lowerBound = GreaterNumber(options?.lowerBound ?? upperBound * 0.5, 1)

		stream.on('data', async (chunk: any) => {
			activeProcesses++

			if (activeProcesses >= upperBound) {
				stream.pause()
			}

			try {
				await action(chunk)
			} catch (err) {
				if (options?.onError) {
					options.onError(chunk, err)
				}
				if (options?.throwOnError) {
					reject({...err, chunk})
					stream.destroy()
				} else {
					console.info('Stream Error', chunk, err)
				}
			}

			activeProcesses--

			if (!stream.readableFlowing && activeProcesses <= lowerBound) {
				stream.resume()
			}
		})

		stream.on('end', async () => {
			while (activeProcesses > 0) {
				await Sleep()
			}
			resolve()
		})
	})
}

/**
 * Processes an array of elements in parallel using a provided action.
 *
 * @param {Array} array - The array of elements to process.
 * @param {Function} action - The action to perform on each element. This action should take a single parameter, representing an element from the array, and return a Promise that resolves once the action is completed.
 * @param {Object} options - Optional configuration options.
 * @param {number} options.upperBound - The maximum number of active processes. Defaults to 1000.
 * @param {number} options.lowerBound - The minimum number of active processes before resuming the stream. Defaults to half of the upper bound or 1, whichever is greater.
 * @param {Function} options.onError - A callback function to handle errors that occur during the action execution. It should accept two parameters: the chunk of data and the error object.
 * @param {boolean} options.throwOnError - If true, the ReadableParallelProcess function will reject the promise if an error occurs during the action execution. Defaults to false.
 * @returns {Promise<void>} - A Promise that resolves once all the elements in the array have been processed.
 */
export async function ArrayParallelProcess<T = any>(
	array: T[],
	action: (chunk: T) => Promise<void>,
	options?: TParallelProcessOptions<T>
): Promise<void> {
	return ReadableParallelProcess(Readable.from(array), action, options)
}
