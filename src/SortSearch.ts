import {IPaginatorRequest, IPaginatorResponse} from '@solidbasisventures/intelliwaketsfoundation'

export const PaginatorInitializeResponseFromRequest = <T = any>(paginatorRequest: IPaginatorRequest): IPaginatorResponse<T> => ({
	page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
	pageCount: 1,
	rowCount: 0,
	countPerPage: paginatorRequest.countPerPage,
	currentOffset: 1,
	rows: []
})

export const PaginatorApplyRowCount = (paginatorResponse: IPaginatorResponse, rowCount: number) => {
	paginatorResponse.rowCount = rowCount
	
	if (rowCount > 0) {
		paginatorResponse.pageCount = Math.floor((rowCount + (paginatorResponse.countPerPage - 1)) / paginatorResponse.countPerPage)
		
		if (paginatorResponse.page < 1) paginatorResponse.page = 1
		if (paginatorResponse.page > paginatorResponse.pageCount) paginatorResponse.page = paginatorResponse.pageCount
		
		paginatorResponse.currentOffset = (paginatorResponse.page - 1) * paginatorResponse.pageCount
	} else {
		paginatorResponse.pageCount = 0
		paginatorResponse.currentOffset = 0
		paginatorResponse.page = 1
	}
}
