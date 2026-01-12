The first step is the client needs to place a request to the server, including what page the user is on, how many items to return on 1 page, plus search, filter and sort criteria. 

This will be done by passing on object to the server with the following interface type: `IPaginatorRequest`

```
interface IPaginatorRequest<SORT = Record<string, any>, FILTER = Record<string, any>> {  
    page: number  
    countPerPage: number  
    search: string  
    sortColumns: ISortColumn<SORT>  
    active: TFindIsActive  
    filterValues: FILTER  
}
```

## Generics
The following generics allow your application to provide some context about your data structures to ensure type safety:

- **SORT** - This would be a type field that matches the return data set, so that you can sort by appropriate field names.  Example: `{id: number, name: string, customer_id: number}`
- **FILTER** - If you need to filter the data results (for instance, if you're running the paginator for a set of data related to a single customer) you can specify the type in this generic.  Example: `{customer_id?: number}`

## Properties
The properties sent to the server can be initiated with the `initialFilterSortPaginator` constant to set default values.  The values to be passed are as follows:

| Property     | Description                                                                   | Default                                 |
| ------------ | ----------------------------------------------------------------------------- | --------------------------------------- |
| page         | Current page requested by the user                                            | 1                                       |
| countPerPage | Number of items to group per page                                             | 50                                      |
| search       | A search string to query the database with                                    | ''                                      |
| sortColumns  | An ISortColumn&lt;SORT&gt; object that tells the server how to sort the table | {...initialSortColumn, primarySort: ''} |
| active       | Show active (true), inactive (false) or all values (null)                     | true                                    |
| filterValues | How to filter the records before counting and retrieving them                 | {}                                      |

Simplest example (without searching or filtering):
```
{
	...initialFilterSortPaginator,
	page: 1,
	sortColumns: {
		...initialSortColumn,
		primarySort: 'name'
	}
}
```
This will return the first page of the results sorted by name.

More extensive example:
```
{
	...initialFilterSortPaginator,
	page: 5,
	search: 'Bob',
	sortColumns: {
		...initialSortColumn,
		primarySort: 'name',
		primaryAscending: false,
		secondarySort: 'id',
		secondaryAscending: true
	},
	active: false,
	filterValues: {customer_id: 1}
}
```
This will return the 5th page, when searching for 'Bob', sorted by name descending then id ascending, and only inactive items for customer id 1.

Note: Changing the sort order is supported by other functions in the foundation library.

After sending this to the server, you'll need to code up the [[Server Process]]
