# Migration Setup Summary

## What Was Created

✅ **Supabase Migrations Infrastructure**

- `supabase/` directory with migrations folder
- `supabase/migrations/20251113_initial_tasks_schema.sql` — Initial schema with tasks table
- `supabase/migrations/README.md` — Migration documentation
- `supabase/.gitignore` — Exclude local secrets
- `supabase/apply-migrations.ps1` — PowerShell helper script
- `supabase/apply-migrations.sh` — Bash helper script
- `APPLY_MIGRATIONS.md` — Step-by-step guide

## Next Steps (Must Do)

### 1. Apply the Migration to Supabase (Required)

The tasks table needs to be created in your Supabase database.

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to https://app.supabase.com
2. Open SQL Editor
3. Copy entire contents of `supabase/migrations/20251113_initial_tasks_schema.sql`
4. Paste into SQL Editor and click **Run**

**Option B: Via PowerShell (Windows)**
```powershell
cd h:\MY\PRACTISE\NEXTJS\dargdrops\app1
.\supabase\apply-migrations.ps1
```
(Then manually paste SQL into Supabase Dashboard)

### 2. Test Task Creation

After running the migration:
1. Start app: `npm run dev`
2. Go to `http://localhost:3000`
3. Create a task via the modal
4. Check Supabase Table Editor to see the task appear

## Schema Details

The migration creates:

- **tasks table** with:
  - `id` (text, primary key)
  - `title` (text, required)
  - `description` (text, optional)
  - `status` (text, one of: todo, in-progress, ready, production)
  - `priority` (text, one of: low, medium, high, urgent)
  - `assignees` (jsonb array, defaults to [])
  - `created_at` (timestamp, auto-set)

- **Indexes** for performance:
  - `idx_tasks_status` — Fast filtering by status
  - `idx_tasks_created_at` — Fast sorting by creation time

- **Row Level Security (RLS)**:
  - Public read/write allowed (adjust for production auth)

## Notes

⚠️ **Security**: RLS policies currently allow public access. For production, implement proper authentication:
- Create JWT-based auth with Supabase Auth
- Restrict policies to `auth.uid()` matching task owner
- Use Anon key for client, Service Role for server

📝 **Version Control**: Migrations are git-tracked, making schema changes reviewable and deployable

🔄 **Future CLI**: Once Supabase CLI is available, replace manual steps with `supabase db push`

## API Integration

Your API routes (`app/api/tasks/route.ts`) are already wired to:
- GET `/api/tasks` — List all tasks
- POST `/api/tasks` — Create task
- PUT `/api/tasks` — Update task
- DELETE `/api/tasks` — Delete task

Once the table exists, tasks will persist to Supabase immediately and be queryable.
