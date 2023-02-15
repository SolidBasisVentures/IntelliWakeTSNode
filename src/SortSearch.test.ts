import {PaginatorReturnRowCount} from './SortSearch'
import {test, expect} from 'vitest'

test('SortSearch', () => {
	expect(PaginatorReturnRowCount({
		page: 1,
		pageCount: 0,
		rowCount: 0,
		countPerPage: 20,
		currentOffset: 0,
		rows: []
	}, 25)).toEqual({
		page: 1,
		pageCount: 2,
		rowCount: 25,
		countPerPage: 20,
		currentOffset: 0,
		rows: []
	})
	expect(PaginatorReturnRowCount({
		page: 2,
		pageCount: 0,
		rowCount: 0,
		countPerPage: 20,
		currentOffset: 0,
		rows: []
	}, 25)).toEqual({
		page: 2,
		pageCount: 2,
		rowCount: 25,
		countPerPage: 20,
		currentOffset: 20,
		rows: []
	})
})
