import {CleanNumber, IPaginatorRequest, IPaginatorResponse} from '@solidbasisventures/intelliwaketsfoundation'

export const PaginatorInitializeResponseFromRequest = <T = any>(paginatorRequest: IPaginatorRequest): IPaginatorResponse<T> => ({
	page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
	pageCount: 1,
	rowCount: 0,
	countPerPage: paginatorRequest.countPerPage,
	currentOffset: 1,
	rows: []
})

export const PaginatorApplyRowCount = (paginatorResponse: IPaginatorResponse, rowCount: number) => {
	console.warn('"PaginatorApplyRowCount" will deprecate for "PaginatorReturnRowCount"')
	paginatorResponse.rowCount = +rowCount
	
	if (+rowCount > 0) {
		paginatorResponse.pageCount = Math.floor((+rowCount + (+paginatorResponse.countPerPage - 1)) / +paginatorResponse.countPerPage)
		
		if (+paginatorResponse.page < 1) paginatorResponse.page = 1
		if (+paginatorResponse.page > +paginatorResponse.pageCount) paginatorResponse.page = +paginatorResponse.pageCount
		
		paginatorResponse.currentOffset = (+paginatorResponse.page - 1) * +paginatorResponse.countPerPage
	} else {
		paginatorResponse.pageCount = 0
		paginatorResponse.currentOffset = 0
		paginatorResponse.page = 1
	}
}

export const PaginatorReturnRowCount = (paginatorResponse: IPaginatorResponse, rowCount: number): IPaginatorResponse => {
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
