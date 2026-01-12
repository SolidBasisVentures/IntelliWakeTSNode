# PGSQL

## Overview

The `PGSQL` namespace provides a comprehensive PostgreSQL database utility library with type-safe query execution, transaction management, and parameter handling. It wraps the `pg` library with convenient helper functions and automatic query performance monitoring.

## Key Components

### PGParams Class (⚠️ IMPORTANT)

`PGParams` is a parameter management class that safely handles SQL query parameters by managing placeholders and values separately, preventing SQL injection while providing clean template literal integration.

**Core Concept**: When adding values, `add()` returns the SQL position (`$1`, `$2`, etc.) while maintaining an internal `values` array that gets passed to the query.

#### Basic Usage

```typescript
import {PGSQL, PGParams} from '@solidbasisventures/intelliwaketsnode'

const params = new PGParams()
const sql = `SELECT * FROM employee WHERE id = ${params.add(5)}`
// sql = "SELECT * FROM employee WHERE id = $1"
// params.values = [5]

const employee = await PGSQL.FetchOne(connection, sql, params.values)
```

#### PGParams Methods

| Method | Description | Example |
|--------|-------------|---------|
| `add(value)` | Adds value and returns position | `params.add(123)` → `"$1"` |
| `addLike(value)` | Adds value wrapped with `%` for LIKE queries | `params.addLike('john')` → `"$1"` with value `"%john%"` |
| `addEqualNullable(field, value)` | Handles nullable comparisons | `params.addEqualNullable('salary', null)` → `"salary IS NULL"` |
| `reset()` | Clears all parameters for reuse | `params.reset()` |
| `replaceSQLWithValues(sql)` | Replaces placeholders with actual values (for debugging) | Returns SQL with values inline |

#### Advanced PGParams Examples

```typescript
// Multiple parameters
const params = new PGParams()
const sql = `
  SELECT * FROM employee
  WHERE department_id = ${params.add(10)}
    AND salary > ${params.add(50000)}
    AND name ILIKE ${params.addLike('smith')}
`
// sql = "SELECT * FROM employee WHERE department_id = $1 AND salary > $2 AND name ILIKE $3"
// params.values = [10, 50000, '%smith%']

const employees = await PGSQL.FetchMany(connection, sql, params.values)
```

```typescript
// Nullable field handling
const params = new PGParams()
const sql = `
  SELECT * FROM employee
  WHERE ${params.addEqualNullable('manager_id', null)}
    AND is_active = ${params.add(true)}
`
// sql = "SELECT * FROM employee WHERE manager_id IS NULL AND is_active = $1"
// params.values = [true]

const results = await PGSQL.FetchMany(connection, sql, params.values)
```

```typescript
// Reusing PGParams instance
const params = new PGParams()

// First query
const user = await PGSQL.FetchOne(
  connection,
  `SELECT * FROM users WHERE id = ${params.add(userId)}`,
  params.values
)

// Reset and reuse for second query
params.reset()
const orders = await PGSQL.FetchMany(
  connection,
  `SELECT * FROM orders WHERE user_id = ${params.add(userId)} AND status = ${params.add('active')}`,
  params.values
)
```

```typescript
// Debug SQL with actual values
const params = new PGParams()
const sql = `SELECT * FROM users WHERE email = ${params.add('john@example.com')} AND age > ${params.add(25)}`
console.log(params.replaceSQLWithValues(sql))
// Output: "SELECT * FROM users WHERE email = 'john@example.com' AND age > 25"
```

## Query Operations

### FetchOne - Single Row Query

Fetches a single row from the database, returns `null` if no match.

```typescript
const params = new PGParams()
const user = await PGSQL.FetchOne<{id: number, email: string, name: string}>(
  connection,
  `SELECT * FROM users WHERE id = ${params.add(123)}`,
  params.values
)

if (user) {
  console.log(user.name) // Type-safe access
}
```

### FetchOneValue - Single Value

Fetches the first column value from the first row.

```typescript
const params = new PGParams()
const count = await PGSQL.FetchOneValue<number>(
  connection,
  `SELECT COUNT(*) FROM users WHERE is_active = ${params.add(true)}`,
  params.values
)
// Returns: 42 (or null if no results)
```

### FetchMany - Multiple Rows

Fetches all matching rows as an array.

```typescript
const params = new PGParams()
const employees = await PGSQL.FetchMany<{id: number, name: string, salary: number}>(
  connection,
  `SELECT * FROM employee WHERE department_id = ${params.add(10)} ORDER BY salary DESC`,
  params.values
)
// Returns: [{id: 1, name: 'John', salary: 75000}, ...]
```

### FetchExists - Check Existence

Checks if any rows match the query.

```typescript
const params = new PGParams()
const exists = await PGSQL.FetchExists(
  connection,
  `SELECT 1 FROM users WHERE email = ${params.add('john@example.com')}`,
  params.values
)
// Returns: true or false
```

## Transaction Management

### Transaction - Execute in Transaction

Wraps operations in BEGIN/COMMIT with automatic ROLLBACK on error.

```typescript
const result = await PGSQL.Transaction(connection, async (client) => {
  const params1 = new PGParams()
  await PGSQL.Execute(
    client,
    `UPDATE accounts SET balance = balance - ${params1.add(100)} WHERE id = ${params1.add(1)}`,
    params1.values
  )

  const params2 = new PGParams()
  await PGSQL.Execute(
    client,
    `UPDATE accounts SET balance = balance + ${params2.add(100)} WHERE id = ${params2.add(2)}`,
    params2.values
  )

  return {success: true}
})
// Both updates succeed or both rollback
```

## Performance Monitoring

Set a performance alert threshold to log slow queries:

```typescript
// Log queries taking longer than 1000ms
PGSQL.SetDBMSAlert(1000)

// Disable monitoring
PGSQL.SetDBMSAlert()
```

When a query exceeds the threshold, it logs:
```
----- Long SQL Query 2.145 s [timestamp]
SELECT * FROM large_table WHERE ...
```

## Connection Types

`TConnection` accepts multiple connection types:
- `Pool` - Connection pool (recommended for most cases)
- `PoolClient` - Individual client from pool
- `Client` - Direct database client
- Custom connection objects with `query()` method

```typescript
import {Pool} from 'pg'

const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  user: 'postgres',
  password: 'password',
  port: 5432
})

// Use pool directly
const users = await PGSQL.FetchMany(pool, 'SELECT * FROM users', [])
```

## Best Practices

1. **Always use PGParams** for dynamic values to prevent SQL injection
   ```typescript
   // ❌ NEVER DO THIS
   const sql = `SELECT * FROM users WHERE id = ${userId}` // SQL injection risk!

   // ✅ ALWAYS DO THIS
   const params = new PGParams()
   const sql = `SELECT * FROM users WHERE id = ${params.add(userId)}`
   await PGSQL.FetchOne(connection, sql, params.values)
   ```

2. **Use transactions** for multi-step operations that must succeed or fail together

3. **Prefer typed queries** using TypeScript generics for type safety
   ```typescript
   type TUser = {id: number, email: string, name: string}
   const user = await PGSQL.FetchOne<TUser>(connection, sql, values)
   ```

4. **Use connection pools** for better performance and resource management

5. **Monitor performance** with `SetDBMSAlert()` during development

## Related Documentation

- [[CTableBase]] - ORM layer built on top of PGSQL utilities
- [[PostgreSQL Database Principles]] - Database design standards
- [[Typical Table Structure]] - Recommended table schemas

## Source

Implementation: [src/Database/PGSQL/PGSQL.ts](../src/Database/PGSQL/PGSQL.ts)
PGParams: [src/Database/PGSQL/PGParams.ts](../src/Database/PGSQL/PGParams.ts)
