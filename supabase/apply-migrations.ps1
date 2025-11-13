# Script to remind users to apply Supabase migrations
# This is a convenience script; actual migration must be run in Supabase Dashboard

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Supabase Migrations - Apply Manually" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Migrations location: supabase/migrations/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Steps to apply migrations:" -ForegroundColor Green
Write-Host "1. Go to https://app.supabase.com"
Write-Host "2. Select your project"
Write-Host "3. Open SQL Editor"
Write-Host "4. Copy the SQL from supabase/migrations/20251113_initial_tasks_schema.sql"
Write-Host "5. Paste and execute in the SQL Editor"
Write-Host ""
Write-Host "Alternatively, if you have supabase CLI installed:" -ForegroundColor Green
Write-Host "  supabase db push" -ForegroundColor Yellow
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan

# Read migration file content and display
$migrationFile = "supabase/migrations/20251113_initial_tasks_schema.sql"
if (Test-Path $migrationFile) {
    Write-Host ""
    Write-Host "Migration file preview:" -ForegroundColor Green
    Write-Host "---" -ForegroundColor Gray
    Get-Content $migrationFile | Select-Object -First 20
    Write-Host "..." -ForegroundColor Gray
    Write-Host "---" -ForegroundColor Gray
}
