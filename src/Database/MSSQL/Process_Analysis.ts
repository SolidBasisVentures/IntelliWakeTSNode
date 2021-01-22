import {MSTable} from './MSTable'
import moment from 'moment'
import {ToDigits} from '@solidbasisventures/intelliwaketsfoundation'

export namespace Process_Analysis {
	export const Process = async (): Promise<{msTables: MSTable[]; message: string}> => {
		const msTables = MSTable.LoadAll()

		let message = await Process_MissingFKs(msTables)

		//		message = static.Process_SetHasNullOrZero(msTables);

		MSTable.SaveAll(msTables)

		return {msTables: msTables, message: message ?? 'Nothing processed'}
	}

	const Process_MissingFKs = async (msTables: MSTable[]): Promise<string | null> => {
		let message = null

		let processed = 0

		for (let itbl = 0; itbl < msTables.length; itbl++) {
			for (let ifk = 0; ifk < msTables[itbl].newForeignKeys.length; ifk++) {
				if (
					msTables[itbl].newForeignKeys[ifk].noIssues === null ||
					(msTables[itbl].newForeignKeys[ifk].noIssues ?? 0) < 0
				) {
					msTables[itbl].newForeignKeys[ifk].noIssues = await msTables[itbl].newForeignKeys[ifk].missingFKCounts()
					processed++
				}
			}
		}

		if (processed > 0) {
			message = 'Processed: ' + processed
		}

		return message
	}

	export const Process_SetHasNullOrZero = (msTables: MSTable[]): string | null => {
		let message: string | null = null

		let processed = 0

		let secondsStart = moment().valueOf()

		for (let itbl = 0; itbl < msTables.length; itbl++) {
			for (let icol = 0; icol < msTables[itbl].columns.length; icol++) {
				if (
					msTables[itbl].columns[icol].notPK ||
					(!msTables[itbl].columns[icol].isPK &&
						!msTables[itbl].columns[icol].isIdentity &&
						!msTables[itbl].columns[icol].isKey)
				) {
					if (msTables[itbl].columns[icol].hasNullsOrZeros === null) {
						if (
							!msTables[itbl].columns[icol].hasNull(msTables[itbl].name) &&
							(!msTables[itbl].hasFKForColumn(msTables[itbl].columns[icol].COLUMN_NAME) ||
								!msTables[itbl].columns[icol].hasZero(msTables[itbl].name))
						) {
							msTables[itbl].columns[icol].hasNullsOrZeros = false
							processed++
						} else {
							msTables[itbl].columns[icol].hasNullsOrZeros = true
							processed++
						}
					}

					if (moment().valueOf() - secondsStart > 60000) {
						if (processed > 0) {
							return 'Processed (Partial): ' + ToDigits(processed)
						}
					}
				}
			}
		}

		if (processed > 0) {
			message = 'Processed: ' + ToDigits(processed)
		}

		return message
	}

	export const Process_SetNotNullable = (msTables: MSTable[]): string | null => {
		let message: string | null = null

		let processed = 0

		let secondsStart = moment().valueOf()

		for (let itbl = 0; itbl < msTables.length; itbl++) {
			for (let icol = 0; icol < msTables[itbl].columns.length; icol++) {
				if (
					msTables[itbl].columns[icol].notPK ||
					(!msTables[itbl].columns[icol].isPK &&
						!msTables[itbl].columns[icol].isIdentity &&
						!msTables[itbl].columns[icol].isKey)
				) {
					if (!msTables[itbl].columns[icol].overrideIsNullable) {
						if (
							!msTables[itbl].columns[icol].hasNull(msTables[itbl].name) &&
							(!msTables[itbl].hasFKForColumn(msTables[itbl].columns[icol].COLUMN_NAME) ||
								!msTables[itbl].columns[icol].hasZero(msTables[itbl].name))
						) {
							msTables[itbl].columns[icol].overrideIsNullable = 'NO'
							processed++
						} else {
							msTables[itbl].columns[icol].overrideIsNullable = 'YES'
							processed++
						}
					}

					if (moment().valueOf() - secondsStart > 60000) {
						if (processed > 0) {
							return 'Processed (Partial): ' + ToDigits(processed)
						}
					}
				}
			}
		}

		if (processed > 0) {
			message = 'Processed: ' + ToDigits(processed)
		}

		return message
	}
}
