# Applying Supabase Migrations

## Quick Start

You have created a migration file: `supabase/migrations/20251113_initial_tasks_schema.sql`

This migration creates the `tasks` table needed for the Kanban app to work with Supabase.

### Step 1: Open Supabase Dashboard

Go to: https://app.supabase.com

### Step 2: Select Your Project

- Click on your project: `dragdropapp1` (or your project name)

### Step 3: Open SQL Editor

In the left sidebar, click **SQL Editor** (or go to `/sql`)

### Step 4: Create a New Query

Click **+ New Query**

### Step 5: Copy the Migration SQL

Open the file: `supabase/migrations/20251113_initial_tasks_schema.sql`

Copy all the SQL code.

### Step 6: Paste into SQL Editor

Paste the SQL into the query editor in the Supabase Dashboard.

### Step 7: Execute

Click **Run** (or press `Ctrl+Enter`)

You should see output like:
```
Query execution successful

0 rows affected
```

### Step 8: Verify

Go to **Table Editor** in the left sidebar. You should now see a `tasks` table with columns:
- `id` (text, primary key)
- `title` (text)
- `description` (text)
- `status` (text)
- `priority` (text)
- `assignees` (jsonb)
- `created_at` (timestamptz)

## Testing

Once the table is created:

1. Start the app: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Create a new task via the modal
4. If it works, the queue panel should show the request as processed (no errors)
5. Go to Supabase **Table Editor** → `tasks` and verify the task appears

## Troubleshooting

### "Table 'public.tasks' not found"
- The migration hasn't been run yet. Follow steps 1-7 above.

### "Permission denied" error
- Ensure you're using the **Service Role Key** (not the Anon key) in `.env`
- Check `.env` has correct `SUPABASE_SERVICE_ROLE_KEY`

### SQL syntax error
- Verify you copied the entire migration file without truncation
- Check for any paste errors in the SQL Editor

## Future: Automated Migrations

Once the Supabase CLI is available for your environment, you can automate this:

```bash
supabase db push
```

This will apply all pending migrations automatically.

## Adding New Migrations

For future schema changes:

1. Create a new file in `supabase/migrations/` with name: `YYYYMMDD_description.sql`
2. Write your SQL (make it idempotent — use `CREATE TABLE IF NOT EXISTS`, `DROP IF EXISTS`, etc.)
3. Test in Supabase Dashboard first
4. Run via dashboard or CLI
5. Commit the file to Git

Example:
```sql
-- supabase/migrations/20251114_add_user_table.sql
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
```
