import {PGParams} from './PGParams'
import {SearchTerms} from '../../Functions'

export const PGWhereSearchClause = (search: string | null | undefined, params: PGParams, fields: string[], startWithAnd = true): string => {
	let where = ''
	
	let andAdded = false
	
	if (!!search && fields.length > 0) {
		const terms = SearchTerms(search)
		for (const term of terms) {
			if (andAdded || startWithAnd) where += 'AND '
			andAdded = true
			where += `CONCAT_WS('|',` + fields.join(',') + `) ILIKE ${params.addLike(term)} `
		}
	}
	
	return where
}
