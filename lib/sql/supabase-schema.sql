-- Supabase / Postgres schema for tasks table
-- Run this in your Supabase SQL editor or psql

CREATE TABLE IF NOT EXISTS public.tasks (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text NOT NULL,
  priority text NOT NULL,
  assignees jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Optional index for faster status queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);
