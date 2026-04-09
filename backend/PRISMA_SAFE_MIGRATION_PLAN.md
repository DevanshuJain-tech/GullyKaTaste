## Prisma Safe Migration Alignment Plan (Non-Destructive)

This plan aligns Prisma to the current database **without dropping legacy data**.

### Current DB state discovered

In `public` schema, existing legacy tables are:

- `User`
- `Asset`
- `_prisma_migrations`

These are legacy and not part of the new Gully Ka Taste domain model.

### Why data-loss warning happened

`prisma db push` previously targeted `public` and attempted to reconcile schema with current Prisma models, so it wanted to drop unmanaged legacy tables (`User`, `Asset`).

### Safe strategy implemented

1. **Isolate new app schema**
   - Runtime Prisma now uses:
     - `PRISMA_DATABASE_URL=.../postgres?schema=gully`
   - This keeps legacy tables in `public` untouched.

2. **Keep legacy mapping snapshot**
   - Added `prisma/legacy-public-mapping.prisma` documenting exact legacy table shapes:
     - `LegacyUser` -> `User`
     - `LegacyAsset` -> `Asset`
   - This provides explicit mapping proof and future migration reference.

3. **Controlled push only to `gully` schema**
   - `prisma db push` now creates/updates only app tables in `gully`.
   - No destructive change to `public`.

### Controlled execution commands

Run from `backend/`:

1) Validate environment:

```bash
echo $PRISMA_DATABASE_URL
```

2) Generate client:

```bash
npm run prisma:generate
```

3) Push app schema to isolated namespace:

```bash
npm run prisma:push
```

### Verification checklist

After push, verify:

- `public.User` still exists
- `public.Asset` still exists
- `gully.users`, `gully.vendors`, `gully.posts`, etc. exist

Suggested SQL checks:

```sql
select table_schema, table_name
from information_schema.tables
where table_schema in ('public', 'gully')
order by table_schema, table_name;
```

### Rollback strategy

Because this is schema-isolated, rollback is simple and non-destructive:

- Keep `public` untouched
- If needed, drop only `gully` schema:

```sql
DROP SCHEMA IF EXISTS gully CASCADE;
CREATE SCHEMA gully;
```

### Next migration phases (safe)

1. Stabilize app on `gully` schema.
2. Export legacy data if any cross-mapping is needed.
3. Plan explicit one-time ETL if migrating legacy records into app models.
4. Only after verified backup, decide whether to retire legacy `public` tables.

