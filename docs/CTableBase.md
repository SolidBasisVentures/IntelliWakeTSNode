# CTableBase

## Overview

`CTableBase` is an abstract base class that provides a complete ORM (Object-Relational Mapping) interface for PostgreSQL tables. Each database table gets its own class that extends `CTableBase`, providing type-safe CRUD operations, change tracking, and lifecycle hooks.

## Key Concepts

- **Inheritance-based**: Create one class per table that extends `CTableBase`
- **Type-safe**: Uses TypeScript generics for full type safety
- **Lifecycle hooks**: Pre/post hooks for insert, update, delete, and select operations
- **Change tracking**: Maintains baseline state to detect modifications
- **Flexible loading**: Multiple methods for loading records (by ID, by values, with fallbacks)
- **Read/write separation**: Optional separate connection for read operations

## Core Properties

| Property | Description |
|----------|-------------|
| `record` | Current record state (mutable) |
| `recordDefault` | Default values template (immutable) |
| `recordBaseline` | Baseline for change detection (updated after save/load) |
| `table` | Table name (abstract, must be implemented) |
| `updateID` | Column(s) used as identifier for updates (default: `'id'`) |
| `connection` | Primary database connection (for writes) |
| `readerConnection` | Optional read-only connection (for queries) |
| `constraint` | Validation constraints for the record |
| `nullIfFalsey` | Columns to set to null if falsey |
| `excludeColumnsSave` | Columns excluded from all save operations |
| `excludeColumnsInsert` | Columns excluded from inserts |
| `excludeColumnsUpdate` | Columns excluded from updates |

## Constructor Pattern

```typescript
type Ttable = {
	id: number
	email: string
	name: string
	is_active: boolean
	created_at: Date
	updated_at: Date
}

class Ctable extends CTableBase<Ttable, 'table'> {
	readonly table = 'table' as const

	constructor(connection: TConnection, readerConnection?: TConnection) {
		super(connection, {
			id: 0,
			email: '',
			name: '',
			is_active: true,
			created_at: new Date(),
			updated_at: new Date()
		}, {
			constraint: {
				email: {type: 'string', maxLength: 255},
				name: {type: 'string', maxLength: 100}
			},
			excludeColumnsInsert: ['id', 'created_at', 'updated_at'],
			excludeColumnsUpdate: ['created_at'],
			readerConnection
		})
	}
}
```

## CRUD Operations

### `insert(): Promise<this>`
Inserts a new record into the database. Automatically populates fields returned by the database (like auto-increment IDs).

**Flow**: `preInsert()` → `constrainRecord()` → `convertToSave()` → DB insert → `setFromAny()` → `convertAfterLoad()` → `postInsert()` → `setBaseline()`

```typescript
const table = new Ctable(connection)
table.record.email = 'john@example.com'
table.record.name = 'John Doe'
await table.insert()
console.log(table.record.id) // Auto-generated ID
```

### `update(): Promise<this>`
Updates an existing record using the `updateID` column(s) as identifier.

**Flow**: `preUpdate()` → `constrainRecord()` → `convertToSave()` → DB update → `setFromAny()` → `convertAfterLoad()` → `postUpdate()` → `setBaseline()`

```typescript
table.record.name = 'Jane Doe'
await table.update() // Updates WHERE id = table.record.id
```

### `save(): Promise<this>`
Intelligently calls `insert()` or `update()` based on whether the record exists (checks if `id > 0`).

**Flow**: `preIDCheck()` → `isSaved()` → calls `update()` or `insert()`

```typescript
// Works for both new and existing records
table.record.email = 'user@example.com'
await table.save() // Inserts if new, updates if existing
```

### `delete(): Promise<this>`
Deletes the record from the database.  Do NOT use very often.  Prefer soft-deletes with 'is_active = false'

**Flow**: `preDelete()` → DB delete

```typescript
await table.delete()
```

## Loading Operations

### `loadID(id: number | string, ignoreCustomerCheck?: boolean): Promise<this>`
Loads a record by ID. **Throws error** if not found.

```typescript
await table.loadID(123) // Throws if table 123 doesn't exist
```

### `loadByID(id: number | string, ignoreCustomerCheck?: boolean): Promise<this | null>`
Loads a record by ID. Returns `null` if not found.

```typescript
const result = await table.loadByID(123)
if (result) {
  console.log(table.record.name)
}
```

### `loadValues(values: Partial<RECORD>, options?: TLoadOptions<RECORD>): Promise<this>`
Loads first record matching the given values. **Throws error** if not found.

```typescript
await table.loadValues(
  { email: 'john@example.com' },
  { sortPrimary: 'created_at', ascendingPrimary: false }
)
```

### `loadByValues(values: Partial<RECORD>, options?: TLoadOptions<RECORD>): Promise<this | null>`
Loads first record matching values. Returns `null` if not found.

```typescript
const result = await table.loadByValues({ email: 'john@example.com' })
```

### `loadIDOrInitial(id: number | string, ignoreCustomerCheck?: boolean): Promise<this>`
Loads by ID if provided, otherwise returns the current instance unchanged.

```typescript
await table.loadIDOrInitial(req.params.id) // Safe even if ID is null/undefined
```

### `loadValuesOrInitial(values: Partial<RECORD>, options?: TLoadOptions<RECORD>): Promise<this>`
Loads by values if found, otherwise returns the current instance unchanged.

```typescript
await table.loadValuesOrInitial({ email: 'john@example.com' })
```

### `loadValuesOrInitialSet(values: Partial<RECORD>, options?: TLoadOptions<RECORD>): Promise<this>`
Loads by values if found, otherwise sets the values on the current instance.

```typescript
// If table exists, loads it; otherwise creates new instance with email set
await table.loadValuesOrInitialSet({ email: 'john@example.com' })
```

### `loadByIDAndSetChanges(values: Partial<RECORD>, ignoreCustomerCheck?: boolean): Promise<this>`
Loads by ID from values, then applies remaining values as changes.

```typescript
// Loads table 123, then sets name to 'Updated Name'
await table.loadByIDAndSetChanges({ id: 123, name: 'Updated Name' })
```

### `reload(): Promise<void>`
Reloads the current record from the database.

```typescript
await table.reload() // Refreshes table.record from DB
```

## Query Operations

### `listRecordsByIDs(ids?: number[]): Promise<RECORD[]>`
Returns array of records matching the given IDs.

```typescript
const tables = await table.listRecordsByIDs([1, 2, 3])
```

### `listRecordsByValues(whereValues?: Partial<RECORD>, options?: TLoadOptions<RECORD>): Promise<RECORD[]>`
Returns array of records matching the given values with optional sorting.

```typescript
const activeUsers = await table.listRecordsByValues(
  { status: 'active' },
  { sortPrimary: 'name', ascendingPrimary: true }
)
```

### `listIDsByValues(whereValues?: Partial<RECORD>, sortPrimary?, ascendingPrimary?, sortSecondary?, ascendingSecondary?): Promise<number[]>`
Returns array of IDs matching the given values.

```typescript
const tableIDs = await table.listIDsByValues({ status: 'active' })
```

### `getRecordByValues(whereValues?: Partial<RECORD>, options?: TLoadOptions<RECORD>): Promise<RECORD | null>`
Returns single record matching values (doesn't modify instance state).

```typescript
const record = await table.getRecordByValues({ email: 'john@example.com' })
```

### `getRecordByID(id: number): Promise<RECORD>`
Returns record by ID (doesn't modify instance state). **Throws** if not found.

```typescript
const record = await table.getRecordByID(123)
```

### `existsValues(values: Partial<RECORD>, ignoreCustomerCheck?: boolean): Promise<boolean>`
Checks if a record matching the values exists.

```typescript
const emailExists = await table.existsValues({ email: 'john@example.com' })
```

## Record Manipulation

### `setFromAny(values: Partial<RECORD>): this`
Updates the record with provided values and applies constraints.

```typescript
table.setFromAny({ name: 'New Name', email: 'new@example.com' })
```

### `setFromFormData(formData: FormData, options?: TObjectFromFormDataOptions<RECORD>): this`
Populates record from FormData object (useful for web forms).

```typescript
table.setFromFormData(request.formData())
```

### `constrainRecord(): this`
Applies validation constraints to the record (called automatically during save).

```typescript
table.record.name = 'A'.repeat(500)
table.constrainRecord() // Truncates to maxLength from constraint
```

## Lifecycle Hooks (Override in Subclasses)

All hooks are async and can be overridden to add custom behavior.

### `preIDCheck(): Promise<void>`
Called before checking ID in `save()` operation.

### `preSave(): Promise<void>`
Called before both insert and update operations.

### `preInsert(): Promise<void>`
Called before insert. Default implementation calls `preSave()`.

```typescript
async preInsert() {
  this.record.created_at = new Date()
  return super.preInsert()
}
```

### `preUpdate(): Promise<void>`
Called before update. Default implementation calls `preSave()`.

```typescript
async preUpdate() {
  this.record.updated_at = new Date()
  return super.preUpdate()
}
```

### `preDelete(): Promise<void>`
Called before delete operation.

```typescript
async preDelete() {
  // Archive before deletion
  await archiveUser(this.record.id)
	return super.preDelete()
}
```

### `postSave(): Promise<void>`
Called after both insert and update operations.

### `postInsert(): Promise<void>`
Called after insert. Default implementation calls `postSave()`.

```typescript
async postInsert() {
  await sendWelcomeEmail(this.record.email)
  return super.postInsert()
}
```

### `postUpdate(): Promise<void>`
Called after update. Default implementation calls `postSave()`.

### `postSelect(): Promise<void>`
Called after any load operation. Default implementation calls `convertAfterLoad()`.

```typescript
async postSelect() {
  // Enrich record with computed fields
  return super.postSelect()
}
```

### `convertToSave(): Promise<void>`
Called before saving to database. Use for encryption, hashing, or transformation.

```typescript
protected async convertToSave() {
  if (this.record.password && !this.record.password.startsWith('$2')) {
    this.record.password = await bcrypt.hash(this.record.password, 10)
  }
}
```

### `convertAfterLoad(): Promise<void>`
Called after loading from database. Use for decryption or transformation.

```typescript
protected async convertAfterLoad() {
  if (this.record.encrypted_data) {
    this.record.decrypted_data = await decrypt(this.record.encrypted_data)
  }
}
```

## Change Tracking

### `setBaseline(): this`
Sets the current record as the baseline for change detection. Called automatically after save/load.

```typescript
table.setBaseline()
```

### `hasBaselineChanged(forColumn?: keyof RECORD | (keyof RECORD)[]): boolean`
Checks if record has changed since baseline was set.

```typescript
table.record.name = 'Changed Name'
if (table.hasBaselineChanged()) {
  console.log('Record has unsaved changes')
}

if (table.hasBaselineChanged('name')) {
  console.log('Name field changed')
}

if (table.hasBaselineChanged(['name', 'email'])) {
  console.log('Name or email changed')
}
```

### `reportDiffs(comparedTo: any): any`
Returns object containing only fields that differ from the comparison object.

```typescript
const changes = table.reportDiffs(table.recordBaseline)
console.log(changes) // { name: 'New Name' }
```

## Utility Methods

### `isSaved(): Promise<boolean>`
Checks if record is saved (has `id > 0`).

```typescript
if (await table.isSaved()) {
  await table.update()
}
```

### `setIgnoreCustomerCheck(ignore?: boolean): this`
Sets whether to ignore customer checks (for multi-tenant systems).

```typescript
table.setIgnoreCustomerCheck(true).loadID(123)
```

### `ignoreReaderConnection(): this`
Forces use of primary connection instead of reader connection.

```typescript
table.ignoreReaderConnection().reload()
```

## Complete Usage Example

```typescript
import { CTableBase } from './CTableBase'
import { TConnection } from './PGSQL/PGSQL'

type Ttable = {
  id: number
  email: string
  password: string
  name: string
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

class Ctable extends CTableBase<Ttable, 'table'> {
  readonly table = 'table' as const

  constructor(connection: TConnection) {
    super(connection, {
      id: 0,
      email: '',
      password: '',
      name: '',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      constraint: {
        email: { type: 'string', maxLength: 255 },
        name: { type: 'string', maxLength: 100 },
        status: { type: 'string', enum: ['active', 'inactive'] }
      },
      excludeColumnsInsert: ['id', 'created_at', 'updated_at'],
      excludeColumnsUpdate: ['created_at']
    })
  }

  // Hash password before saving
  protected async convertToSave() {
    if (this.record.password && !this.record.password.startsWith('$2')) {
      this.record.password = await bcrypt.hash(this.record.password, 10)
    }
  }

  // Send welcome email after insert
  async postInsert() {
    await super.postInsert()
    await sendWelcomeEmail(this.record.email)
  }

  // Update timestamp before updates
  async preUpdate() {
    await super.preUpdate()
    this.record.updated_at = new Date()
  }
}

// Usage examples:

// Create new table
const table = new Ctable(connection)
table.record.email = 'john@example.com'
table.record.password = 'secret123'
table.record.name = 'John Doe'
await table.save() // Calls insert, hashes password, sends email
console.log(table.record.id) // Auto-generated ID

// Load and update table
await table.loadByID(123)
table.record.status = 'inactive'
await table.save() // Calls update, updates timestamp

// Query tables
const activeUsers = await table.listRecordsByValues(
  { status: 'active' },
  { sortPrimary: 'name', ascendingPrimary: true }
)

// Check for changes
table.record.name = 'Jane Doe'
if (table.hasBaselineChanged('name')) {
  await table.save()
}

// Load or create
await table.loadValuesOrInitialSet({ email: 'new@example.com' })
await table.save()
```

## Best Practices

1. **One class per table**: Create a dedicated class for each database table
2. **Use type definitions**: Define record types for full type safety
3. **Leverage hooks**: Put business logic in pre/post hooks rather than scattered throughout code
4. **Change tracking**: Use `hasBaselineChanged()` to avoid unnecessary updates
5. **Constraints**: Define constraints in constructor for automatic validation
6. **Read replicas**: Use `readerConnection` for read operations to reduce load on primary DB
7. **Exclude columns**: Use `excludeColumnsInsert`/`excludeColumnsUpdate` for auto-generated fields
8. **Transform data**: Use `convertToSave()`/`convertAfterLoad()` for encryption, hashing, etc.
9. **Error handling**: Use `loadByID()` / `loadByValues()` (returns null) when errors should be handled, use `loadID()` / `loadValues()` (throws) when record must exist
10. **Flexible loading**: Use `loadValuesOrInitialSet()` for "load or create" patterns

## Common Patterns

### Upsert Pattern
```typescript
await table.loadValuesOrInitialSet({ email: 'john@example.com' })
table.record.name = 'John Doe'
await table.save()
```

### Conditional Update
```typescript
await table.loadID(123)
if (table.hasBaselineChanged()) {
  await table.save()
}
```

### Soft Delete
```typescript
class Ctable extends CTableBase<Ttable, 'table'> {
  async delete() {
    this.record.is_acitve = false
    return this.update()
  }
}
```

### Audit Trail
```typescript
async postUpdate() {
  const changes = this.reportDiffs(this.recordBaseline)
  await logAuditTrail(this.record.id, 'UPDATE', changes)
  return super.postUpdate()
}
```
