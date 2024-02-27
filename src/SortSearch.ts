import {CleanNumber, IPaginatorRequest, IPaginatorResponse} from '@solidbasisventures/intelliwaketsfoundation'

/**
 * Creates a paginated response from a request count.
 *
 * @param {IPaginatorRequest} paginatorRequest - The paginator request object.
 * @param {number} rowCount - The total number of rows in the result set.
 * @returns {PaginatorReturnRowCount} - The paginated response.
 */
export const PaginatorResponseFromRequestCount = <SORT = Record<string, any>, FILTER = Record<string, any>>(paginatorRequest: IPaginatorRequest<SORT, FILTER>, rowCount: number) =>
	PaginatorReturnRowCount<SORT>(PaginatorInitializeResponseFromRequest(paginatorRequest), CleanNumber(rowCount))

export const PaginatorInitializeResponseFromRequest = <SORT = Record<string, any>, FILTER = Record<string, any>, RES = Record<string, any>>(paginatorRequest: IPaginatorRequest<SORT, FILTER>): IPaginatorResponse<RES> => ({
	page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
	pageCount: 1,
	rowCount: 0,
	countPerPage: paginatorRequest.countPerPage,
	currentOffset: 1,
	rows: []
})

/**
 * Applies row count to a paginator response.
 *
 * @param {IPaginatorResponse<T>} paginatorResponse - The paginator response object.
 * @param {number} rowCount - The row count to be applied.
 * @template T - The type of the records in the paginator response.
 */
export const PaginatorApplyRowCount = <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number) => {
	console.warn('"PaginatorApplyRowCount" will deprecate for "PaginatorReturnRowCount"')
	paginatorResponse.rowCount = CleanNumber(rowCount)

	if (+rowCount > 0) {
		paginatorResponse.pageCount = Math.floor((CleanNumber(rowCount) + (CleanNumber(paginatorResponse.countPerPage - 1))) / CleanNumber(paginatorResponse.countPerPage))

		if (CleanNumber(paginatorResponse.page) < 1) paginatorResponse.page = 1
		if (CleanNumber(paginatorResponse.page) > CleanNumber(paginatorResponse.pageCount)) paginatorResponse.page = CleanNumber(paginatorResponse.pageCount)

		paginatorResponse.currentOffset = (+paginatorResponse.page - 1) * +paginatorResponse.countPerPage
	} else {
		paginatorResponse.pageCount = 0
		paginatorResponse.currentOffset = 0
		paginatorResponse.page = 1
	}
}

/**
 * Updates the row count and calculates the page count and current offset
 * for a given paginator response.
 *
 * @param {IPaginatorResponse<T>} paginatorResponse - The paginator response object.
 * @param {number} rowCount - The total number of rows.
 * @returns {IPaginatorResponse<T>} - The updated paginator response object.
 */
export const PaginatorReturnRowCount = <T = Record<string, any>>(paginatorResponse: IPaginatorResponse<T>, rowCount: number): IPaginatorResponse<T> => {
	let response = {...paginatorResponse}

	response.rowCount = CleanNumber(rowCount)
	response.page = CleanNumber(response.page)

	if (response.rowCount > 0) {
		response.pageCount = Math.floor((CleanNumber(rowCount) + (CleanNumber(response.countPerPage) - 1)) / CleanNumber(response.countPerPage))

		if (response.page < 1) response.page = 1
		if (response.page > response.pageCount) response.page = response.pageCount

		response.currentOffset = (response.page - 1) * response.countPerPage
	} else {
		response.pageCount = 0
		response.currentOffset = 0
		response.page = 1
	}

	return response
}
