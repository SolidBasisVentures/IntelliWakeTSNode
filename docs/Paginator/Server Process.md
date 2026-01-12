Before proceeding, make sure you understand how the [[Client Request]] works.

The server will go through the following steps after accepting the `IPaginatorRequest` object:
- **Count all available records in the database** - Available records means records that meet the `search`,  `active` and/or `filterValues` properties.
- **Compute offsets and updated page number** - These are values that the database will use to pick up the correct records
- **Retrieve rows for the correct offset and count** - Which will use the same where conditions for counting, but this time will only retrieve the rows necessary for the page being displayed.
- **Return an `IPaginatorResponse`** - Which will contain the updated properties and returned rows

One of the key features our process supports is handling the case where a user specifies a page beyond what is available.  So, if they request page 10, but there are only 5 pages, the results of this process will recompute for page 5 and send the appropriate results back to the client, along with an updated page number so the client can become aware of the change.

## Count all available records in the database
The first query to the database is one that counts all available records across all pages.  This is necessary so that the following routines can calculate how many pages will ultimately be available.

```
const rowCount = await PGSQL.FetchOneValue<number>(connection, `SELECT count(*) FROM employee`)
```
Note: make sure to add any necessary where conditions based on the `search`, `active` and/or `filterValues` properties from the `IPaginatorRequest` object.  I would recommend creating a where variable with these conditions in it that can be reused below for retrieving the rows so you know that the values are the same.

## Compute offsets and updated page number
Fortunately, this is way easier than it sounds.  Simply call the `PaginatorResponseFromRequestCount(request, count)` function to get the the information stored in an `IPaginatorResponse` object (just without the actual rows, yet).

```
const paginatorResponse = PaginatorResponseFromRequestCount(paginatorRequest, rowCount)
```
This function calculates the offset, current page number, and row count to return all based off the paginatorRequest and rowCount calculated earlier.

## Retrieve rows for the correct offset and count
Now, you need to go ahead and return the appropriate values, but with the offsets and limits provided earlier.  

```
const rows = await PGSQL.FetchMany(connection, `SELECT * FROM employee LIMIT ${paginatorResponse.countPerPage} OFFSET ${paginatorResponse.currentOffset}`)
```

## Return the IPaginatorResponse
Now, you can return back through the API the `IPaginatorResponse` like so:

```
return {...paginatorResponse, rows: rows}
```

The `IPaginatorResponse` meets the following interface type:
```
interface IPaginatorResponse<T = Record<string, any>> {  
    page: number  
    pageCount: number  
    rowCount: number  
    countPerPage: number  
    currentOffset: number  
    rows: T[]  
}
```

### Generics
The following generics allow your application to provide some context about your data structures to ensure type safety:

- **T** - This is the type of the row being returned.  Example: `{id: number, name: string, customer_id: number}` Note: this should match the &lt;SORT&gt; generic in the `IPaginatorRequest` interface

### Properties
The properties sent to the server can be initiated with the `initialFilterSortPaginator` constant to set default values.  The values to be passed are as follows:

| Property      | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| page          | The actual page provided (which might be different than what was requested)  |
| pageCount     | Number of total pages available, based on the filtering criteria provided    |
| rowCount      | The number of rows returned, a value between 0 and the countPerPage provided |
| countPerPage  | The value provided by the request for the number of rows to group per page   |
| currentOffset | The number of database entries to offset before returning values             |
| rows[]        | The actual rows returned                                                     |
Finally, in the browser you can now display the results: [[Client Display]]