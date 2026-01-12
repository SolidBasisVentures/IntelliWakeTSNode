# IntelliWakeTSNode
IntelliwakeTSNode, short for the IntelliWake TypeScript Node Library provides multiple helper functions for back-end Node servers that are not present in vanilla JavaScript.

This library is meant to be used on the server side.

## Base Table Class
For providing CRUD/ORM like capabilities to the system. [[CTableBase]]

## Database Principles
For consistency across projects (although some of our older projects deviate slightly), we want the following principles adhered to when managing databases.

We are primarily a PostgreSQL shop, so these principles will apply most directly to that database architecture.

[[PostgreSQL Database Principles]]

## Paginator Calculations
Paginators are a key feature for web-based solutions, particularly for large sets of data.  Users want to be able to see the first page of items and then be able to page through the rest of the items, or filter the items and see the results, possibly also in pages.

For this type of action, see our section on [[Paginator Utilities]]
