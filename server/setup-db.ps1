# Setup script for database
Write-Host "Setting up database..." -ForegroundColor Yellow

# Find PostgreSQL installation
$pgPath = "C:\Program Files\PostgreSQL"
$psqlPath = $null

if (Test-Path $pgPath) {
    # Find the latest version of PostgreSQL
    $latestVersion = (Get-ChildItem $pgPath | Where-Object { $_.PSIsContainer } | Sort-Object Name -Descending | Select-Object -First 1).Name
    $psqlPath = Join-Path $pgPath "$latestVersion\bin\psql.exe"
}

if (-not (Test-Path $psqlPath)) {
    Write-Host "PostgreSQL might not be installed or psql.exe not found." -ForegroundColor Red
    Write-Host "Please make sure PostgreSQL is installed and the bin directory is in your PATH." -ForegroundColor Yellow
    Write-Host "Download PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Get credentials
$PGUSER = "postgres"
$PGPASSWORD = Read-Host "Enter PostgreSQL password for user 'postgres'" -AsSecureString
$PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($PGPASSWORD))

# Set environment variable for psql
$env:PGPASSWORD = $PGPASSWORD

try {
    # Use existing todoapp database
    Write-Host "Using existing todoapp database..." -ForegroundColor Yellow

    # Create tables
    Write-Host "Creating tables..." -ForegroundColor Yellow
    $currentPath = Get-Location
    $databaseSql = Join-Path $currentPath "database.sql"
    & $psqlPath -U $PGUSER -d todo_list -f $databaseSql

    Write-Host "Database setup completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error setting up database: $_" -ForegroundColor Red
} finally {
    # Clear password from environment
    $env:PGPASSWORD = ""
}