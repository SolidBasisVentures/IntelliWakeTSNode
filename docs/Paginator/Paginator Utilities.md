Pagination is critical for handling large amounts of data effectively in web browser.  However, implementing pagination takes a fair bit of coordination between the client and server side components so that the user is presented with a simple list of available page numbers with the server handling the complexity of querying the database effectively.

Features that are supported with these paginator utilities include:
- **Count per Page** - A parameter that specifies the number of items per page, handling queries from the database and adjusting the number of pages appropriately.
- **Sorting** - It's important to sort the database results so that the first page shows appropriate data and as the user moves between pages the data is organized in a consistent fashion. (Note: Changing the sort order is supported by other functions in the foundation library)
- **Search** - Sometimes the user wants to enter search criteria, and the results and number of pages adjusts appropriately
- **Filters** - In order to make the back-end code as re-usable as possible, filters can be passed to it so that the results could be specific to certain screens.  For instance, the same pagination result could be per customer, or per state, or per some other value(s).
- **Calculation for Page Numbers to Display** - With larger datasets, users may end up with 10's, 100's or even more pages.  In those instances, the list of page numbers a user has available to them might be limited.  For example, they might see page numbers like: 1, 2, 3, ..., 98, 99, 100., or if they were on page 50, they might see: 1, 2..., 49, 50, 51, ..., 99, 100.  This module has a routine to handle that.

Note that there are modules from the [IntelliWakeTSFoundation](https://github.com/SolidBasisVentures/IntelliWakeTSFoundation/wiki) library needed to make this work.  The reason it is split between two libraries is that this library is primarily meant to be used on a back-end node server (to integrate with SQL databases), while the Foundation library provides utilities that work on both the front and backend.

There are three steps to make this work:

### Step 1: Client requests data from the server
The first step is the client needs to place a request to the server, including what page the user is on, how many items to return on 1 page, plus search, filter and sort criteria. 

This will be done by passing on object to the server with the following interface type: `IPaginatorRequest`

For details on how to do this click here: [[Client Request]]

### Step 2: Server processes the request and returns the results
The server will go through the following steps after accepting the `IPaginatorRequest` object:
- **Count all available records in the database** - Available records means records that meet the `search`,  `active` and/or `filterValues` properties.
- **Compute offsets and updated page number** - These are values that the database will use to pick up the correct records
- **Retrieve rows for the correct offset and count** - Which will use the same where conditions for counting, but this time will only retrieve the rows necessary for the page being displayed.
- **Return an `IPaginatorResponse`** - Which will contain the updated properties and returned rows

One of the key features our process supports is handling the case where a user specifies a page beyond what is available.  So, if they request page 10, but there are only 5 pages, the results of this process will recompute for page 5 and send the appropriate results back to the client, along with an updated page number so the client can become aware of the change.

For details on how to do this click here: [[Server Process]]

### Step 3: Client displays the results
Finally, you'll need to display the results and handle any page changes the user requests.

For details on how to do this click here: [[Client Display]]