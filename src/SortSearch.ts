import {IPaginatorRequest, IPaginatorReturn} from '@solidbasisventures/intelliwaketsfoundation'

export const PaginatorInitializeReturnFromRequest = <T = any>(paginatorRequest: IPaginatorRequest): IPaginatorReturn<T> => ({
	page: paginatorRequest.page < 1 ? 1 : paginatorRequest.page,
	pageCount: 1,
	rowCount: 0,
	countPerPage: paginatorRequest.countPerPage,
	currentOffset: 1,
	rows: []
})

export const PaginatorApplyRowCount = (paginatorReturn: IPaginatorReturn, rowCount: number) => {
	paginatorReturn.rowCount = 0
	
	if (rowCount > 0) {
		paginatorReturn.pageCount = Math.floor((rowCount + (paginatorReturn.countPerPage - 1)) / paginatorReturn.countPerPage)
		
		if (paginatorReturn.page < 1) paginatorReturn.page = 1
		if (paginatorReturn.page > paginatorReturn.pageCount) paginatorReturn.page = paginatorReturn.pageCount
		
		paginatorReturn.currentOffset = (paginatorReturn.page - 1) * paginatorReturn.pageCount
	} else {
		paginatorReturn.pageCount = 0
		paginatorReturn.currentOffset = 0
		paginatorReturn.page = 1
	}
}
