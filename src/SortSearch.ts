import {CleanNumber, IPaginatorRequest, IPaginatorResponse} from '@solidbasisventures/intelliwaketsfoundation'

export const PaginatorResponseFromRequestCount = <T = Record<string, any>>(paginatorRequest: IPaginatorRequest<T>, rowCount: number) =>
	PaginatorReturnRowCount(PaginatorInitializeResponseFromRequest(paginatorRequest), CleanNumber(rowCount))

export const PaginatorInitializeResponseFromRequest = <T = Record<string, any>>(paginatorRequest: IPaginatorRequest<T>): IPaginatorResponse<T> => ({
	page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
	pageCount: 1,
	rowCount: 0,
	countPerPage: paginatorRequest.countPerPage,
	currentOffset: 1,
	rows: []
})

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
