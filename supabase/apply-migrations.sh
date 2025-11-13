#!/bin/bash
# Script to remind users to apply Supabase migrations
# This is a convenience script; actual migration must be run in Supabase Dashboard

echo "======================================"
echo "Supabase Migrations - Apply Manually"
echo "======================================"
echo ""
echo "Migrations location: supabase/migrations/"
echo ""
echo "Steps to apply migrations:"
echo "1. Go to https://app.supabase.com"
echo "2. Select your project"
echo "3. Open SQL Editor"
echo "4. Copy the SQL from supabase/migrations/20251113_initial_tasks_schema.sql"
echo "5. Paste and execute in the SQL Editor"
echo ""
echo "Alternatively, if you have supabase CLI installed:"
echo "  supabase db push"
echo ""
echo "======================================"
