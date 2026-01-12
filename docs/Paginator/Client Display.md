Before proceeding, make sure you understand how the [[Client Request]] and [[Server Process]] works.

Finally, you'll need to display the results and handle any page changes the user requests.

For this, we won't get into how to display the table, there's nothing special about that.

But, the one complicating factor we discovered was determining which page numbers to show the user.  If there are 100 pages, we really don't want to show 100 quick buttons to navigate between them.  In those instances, the list of page numbers a user has available to them might be limited.  For example, they might see page numbers like: 1, 2, 3, ..., 98, 99, 100., or if they were on page 50, they might see: 1, 2..., 49, 50, 51, ..., 99, 100.  

So, the library provides the following method `PagesForRange(page, pages, spread)` for calculating which pages should be displayed to the user, with an optional spread parameter based on how much room you have to display pages.  It returns an array, either with a valid page number to display and allow a user to click on, or with a null, indicating that there are more pages between the range that are not displayed.

If you're on page 1 of 10, you'll want to see the numbers mostly grouped around the first page:
```
PagesForRange(1, 10)
```
`[1, 2, 3, null, 10]`

If you're on page 50 of 100, you'll want to see just the pages surrounding you:
```
PagesForRange(50, 100)
```
`[1, null, 49, 50, 51, null, 100]`

And, if you have more space, specify a bigger spread around the page you are on:
```
PagesForRange(50, 100, 3)
```
`[1, null, 48, 49, 50, 51, 52, null, 100]`
