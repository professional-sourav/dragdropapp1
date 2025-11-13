# Supabase Migrations

This folder contains version-controlled database migrations for the Kanban app.

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended for now)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Open **SQL Editor**
4. Copy the contents of the migration file (e.g., `20251113_initial_tasks_schema.sql`)
5. Paste and execute

### Option 2: Supabase CLI (Future)
Once the Supabase CLI is available:
```bash
supabase db push
```

## Migration Files

| File | Purpose |
|------|---------|
| `20251113_initial_tasks_schema.sql` | Create `tasks` table with status/priority constraints, indexes, and RLS policies |

## Notes

- Migrations are named with timestamp prefix `YYYYMMDD_` for ordering
- All migrations should be idempotent (safe to run multiple times)
- Never modify past migrations; create new ones instead
- Update this README when adding new migrations
