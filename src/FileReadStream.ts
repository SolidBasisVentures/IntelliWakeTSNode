import fs from 'fs'
// import split from 'split'
import {ESTTodayDateTimeLabel} from '@solidbasisventures/intelliwaketsfoundation'

export type TFileReadStreamOptions = {
	onLine?: (data: string) => void
	onFirstLine?: (data: string) => void
	onSubsequentLine?: (data: string) => void
	pauseAfterLines?: number | null
}

export async function FileReadStream(fileName: string, options: TFileReadStreamOptions) {
	return new Promise<void>((resolve, reject) => {
		const files = fs.createReadStream(fileName)
		                // .pipe(split())

		let linesStarted = 0
		let linesCompleted = 0

		files
			.on('data', (data) => {
				linesStarted++

				const isFirst = linesStarted === 1

				let lineDifferential = linesCompleted - linesStarted

				if (
					options.pauseAfterLines !== null &&
					(options.pauseAfterLines === undefined || options.pauseAfterLines >= lineDifferential)
				) {
					files.pause()
				}

				if (!!data && !!data.toString().trim()) {
					if (options.onFirstLine && isFirst) options.onFirstLine(data.toString())
					if (options.onLine) options.onLine(data.toString())
					if (options.onSubsequentLine && !isFirst) options.onSubsequentLine(data.toString())
				}

				linesCompleted++

				lineDifferential = linesCompleted - linesStarted

				if (
					files.isPaused() &&
					(!options.pauseAfterLines || !lineDifferential || options.pauseAfterLines <= lineDifferential)
				) {
					files.resume()
				}
			})
			.on('error', (err) => {
				console.warn(ESTTodayDateTimeLabel(), err)
				reject(err.message)
			})
			// .on('finish', () => {
			//     console.log('Finished ------------')
			//     resolve(this)
			// })
			// .on('end', () => {
			//     console.log('Ended ------------')
			//     resolve(this)
			// })
			.on('close', () => {
				resolve()
			})
	})
}
