# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

IntelliWakeTSNode is a TypeScript library for Node.js backend servers, providing PostgreSQL ORM capabilities, database utilities, and pagination helpers. The library is published as `@solidbasisventures/intelliwaketsnode` on npm.

## Essential Commands

### Development
```bash
# Run tests in watch mode
pnpm run Vitest-Watch

# Run console/development file with watch
pnpm run ConsoleWatch

# Update IntelliWake foundation dependency
pnpm run Install-IntelliWake
```

### Building & Publishing
```bash
# Build the library (TypeScript compilation + Vite bundling)
pnpm run Build

# Version bump (minor)
pnpm run Version-Minor-Advance

# Full publish workflow: patch version, build, publish to npm, git push with tags
pnpm run Publish
```

### Testing
```bash
# Run all tests
vitest

# Run specific test file
vitest src/Database/PGSQL/PGSQL.test.ts

# Run tests with UI
vitest --ui
```

## Architecture

### Module Structure

The library is organized into three main areas:

1. **CTableBase ORM** (`src/Database/CTableBase.ts`)
   - Abstract base class for type-safe CRUD operations on PostgreSQL tables
   - One class per database table, extending CTableBase
   - Provides lifecycle hooks (preInsert, postInsert, preUpdate, postUpdate, etc.)
   - Multiple load methods: loadByID, loadValues, loadSQL, etc.
   - Change tracking via recordBaseline
   - Supports read/write connection separation via `readerConnection`
   - Constraint validation via `constraint` property

2. **PGSQL Utilities** (`src/Database/PGSQL/`)
   - Low-level PostgreSQL query and CRUD utilities
   - **PGSQL.ts**: Core query functions (FetchOne, FetchMany, FetchExists, FetchOneValue, Save, Delete, InsertAndGetID)
   - **PGParams.ts**: SQL injection prevention via parameterized queries
   - **PGTable.ts**: Table introspection and metadata
   - **PGColumn.ts**, **PGView.ts**, **PGMatView.ts**, **PGFunc.ts**: Schema object utilities
   - **PGEnum.ts**, **PGForeignKey.ts**, **PGIndex.ts**: Schema constraint utilities
   - Transaction support via `transact` function
   - Performance monitoring hooks

3. **Pagination** (`src/SortSearch.ts`)
   - Server-side pagination calculations
   - Works with IPaginatorRequest/IPaginatorResponse from @solidbasisventures/intelliwaketsfoundation
   - Functions: PaginatorResponseFromRequestCount, PaginatorInitializeResponseFromRequest, PaginatorReturnRowCount
   - Handles out-of-bounds page requests gracefully

### Key Patterns

**CTableBase Usage Pattern:**
```typescript
// Extend CTableBase for each table
class CUser extends CTableBase<IUser, 'user'> {
  readonly table = 'user'

  constructor(connection: TConnection) {
    super(connection, defaultUserRecord, {
      constraint: userConstraint,
      nullIfFalsey: ['middle_name'],
      excludeColumnsUpdate: ['inserted_ts']
    })
  }
}

// Usage
const user = await new CUser(connection).loadByID(123)
user.record.name = 'Updated Name'
await user.save()
```

**PGParams Safe Query Pattern:**
```typescript
const params = new PGParams()
const result = await PGSQL.FetchOne(
  connection,
  `SELECT * FROM users WHERE id = ${params.add(userId)} AND status = ${params.add('active')}`,
  params.values
)
```

### Database Conventions

The library enforces these PostgreSQL standards:

- **Table names**: Singular (e.g., `user` not `users`)
- **Standard columns**: `id`, `is_active`, `inserted_ts`, `inserted_sysuser_id`, `updated_ts`, `updated_sysuser_id`
- **Foreign keys**: `{table}_id` or `{descriptor}_{table}_id`
- **Soft deletes**: Use `is_active` flag (default true); rarely hard delete
- **Timestamps**: Use `_ts` suffix for timestamp columns
- **Functions**: Prefix with table name, use snake_case

See `docs/Database Principles/` for full details.

### Build Configuration

- **TypeScript**: ES2020 target, ESNext modules, strict type checking enabled
- **Vite**: Builds both ES modules (.js) and CommonJS (.cjs) formats
- **Entry point**: `src/main.ts` exports all public APIs
- **Output**: `dist/` directory with types, sourcemaps, and dual-format bundles
- **External dependencies**: pg, pg-pool, Node.js built-ins (fs, net, etc.)

### Testing

- **Framework**: Vitest
- **Config**: `vitest.config.ts` with custom TypeScript config (`tsconfig.vitest.json`)
- **Test files**: `*.test.ts` files co-located with source
- **Current tests**: 3 test files covering PGSQL utilities and PGTable

### Dependency Notes

- Core dependency: `@solidbasisventures/intelliwaketsfoundation` (shared foundation library)
- Database: `pg` (node-postgres) with `pg-cursor` support
- All dependencies are in `devDependencies` since this is a library package

## Documentation

Comprehensive documentation exists in `docs/`:
- `CTableBase.md`: Complete ORM reference
- `PGSQL.md`: Database utilities and PGParams guide
- `Database Principles/`: Database design standards
- `Paginator/`: Pagination implementation guides
- `llms.txt`: Quick reference for LLMs

When modifying core functionality, update corresponding documentation.
