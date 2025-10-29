# Setup script for Todo List Server
Write-Host "Setting up Todo List Server..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Navigate to server directory
Set-Location -Path ".\server"

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
npm install

# Check if PostgreSQL is installed and find psql
$pgPath = "C:\Program Files\PostgreSQL"
$psqlPath = $null

if (Test-Path $pgPath) {
    # Find the latest version of PostgreSQL
    $latestVersion = (Get-ChildItem $pgPath | Where-Object { $_.PSIsContainer } | Sort-Object Name -Descending | Select-Object -First 1).Name
    $psqlPath = Join-Path $pgPath "$latestVersion\bin\psql.exe"
}

if (-not (Test-Path $psqlPath)) {
    Write-Host "PostgreSQL might not be installed or psql.exe not found." -ForegroundColor Yellow
    Write-Host "Please make sure PostgreSQL is installed and the bin directory is in your PATH." -ForegroundColor Yellow
    Write-Host "Download PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Create database and tables
Write-Host "Setting up database..." -ForegroundColor Yellow
Write-Host "Please enter your PostgreSQL credentials:"
$PGUSER = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($PGUSER)) {
    $PGUSER = "postgres"
}
$PGPASSWORD = Read-Host "Enter PostgreSQL password" -AsSecureString
$PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($PGPASSWORD))

# Create database and import schema
$env:PGPASSWORD = $PGPASSWORD
if (Test-Path $psqlPath) {
    & $psqlPath -U $PGUSER -c "CREATE DATABASE todoapp;"
    & $psqlPath -U $PGUSER -d todoapp -f "database.sql"
} else {
    # Try using psql from PATH
    psql -U $PGUSER -c "CREATE DATABASE todoapp;"
    psql -U $PGUSER -d todoapp -f "database.sql"
}

Write-Host "Server setup completed!" -ForegroundColor Green
Write-Host "To start the server, run: npm run dev" -ForegroundColor Cyan