# Supabase Integration Setup

This project includes a basic server-side integration with Supabase. Follow these steps to enable it locally and in deployments.

1. Install new dependencies

```powershell
# from project root
npm install zod @supabase/supabase-js
```

2. Add environment variables (never commit these)

Create a `.env.local` in the project root with:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key)
```

Use the service role key only on the server. Do not expose it to the browser.

3. Create the `tasks` table

The schema is version-controlled in `supabase/migrations/20251113_initial_tasks_schema.sql`.

**To apply the migration:**

1. Go to [Supabase Dashboard](https://app.supabase.com) → SQL Editor
2. Copy the contents of `supabase/migrations/20251113_initial_tasks_schema.sql`
3. Paste and execute in the SQL Editor

This will create:
- `public.tasks` table with id, title, description, status, priority, assignees, created_at
- Indexes on `status` and `created_at` for query performance
- Row Level Security (RLS) policies allowing public read/write (adjust as needed for production)

4. API routes

A server-only helper `lib/supabase-server.ts` creates a Supabase client using the service role key. Use the built-in API route at `app/api/tasks/route.ts` to list/create/update/delete tasks.

Example requests (client-side):

```ts
// GET
fetch('/api/tasks').then(r => r.json()).then(console.log)

// POST
fetch('/api/tasks', { method: 'POST', body: JSON.stringify(task) })

// PUT
fetch('/api/tasks', { method: 'PUT', body: JSON.stringify({ id: taskId, title: 'New' }) })

// DELETE
fetch('/api/tasks?id=task-1', { method: 'DELETE' })
```

5. Notes

- The server maps `createdAt` (JS) to `created_at` (Postgres) automatically in the route handlers.
- Imported/exported JSON is validated using Zod (`lib/schemas/taskSchema.ts`). Import must match the shape or validation will fail with descriptive errors.

If you want, I can now:
- Wire an optional write-through sync from `KanbanBoard` to call the API on create/update/delete.
- Add a background sync queue for optimistic updates / retries.
- Add stronger DB transactional logic or conflict resolution.

Which of those should I implement next?  
