-- Initial migration: Create tasks table schema
-- Migration ID: 20251113_initial_tasks_schema
-- Created: 2025-11-13

CREATE TABLE IF NOT EXISTS public.tasks (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text NOT NULL CHECK (status IN ('todo', 'in-progress', 'ready', 'production')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignees jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks (created_at);

-- Add RLS (Row Level Security) - allow public read/write for now (update as needed)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read" ON public.tasks;
DROP POLICY IF EXISTS "Allow public insert" ON public.tasks;
DROP POLICY IF EXISTS "Allow public update" ON public.tasks;
DROP POLICY IF EXISTS "Allow public delete" ON public.tasks;

-- Create policies for public access (adjust auth as needed)
CREATE POLICY "Allow public read" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.tasks FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.tasks FOR DELETE USING (true);
