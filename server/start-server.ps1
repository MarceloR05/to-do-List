# Start script for server with environment variables
Write-Host "Starting server..." -ForegroundColor Yellow

# Generate a random JWT secret if not provided
$JWT_SECRET = [System.Web.Security.Membership]::GeneratePassword(32, 8)

# Set environment variables
$env:JWT_SECRET = $JWT_SECRET
$env:PORT = 3000
$env:DB_USER = "postgres"
$env:DB_HOST = "localhost"
$env:DB_NAME = "todoapp"
$env:DB_PORT = 5432

# Ask for database password
$DB_PASSWORD = Read-Host "Enter PostgreSQL password" -AsSecureString
$DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))
$env:DB_PASSWORD = $DB_PASSWORD

Write-Host "Environment variables set:" -ForegroundColor Green
Write-Host "JWT_SECRET: [SECRET]"
Write-Host "PORT: $env:PORT"
Write-Host "DB_USER: $env:DB_USER"
Write-Host "DB_HOST: $env:DB_HOST"
Write-Host "DB_NAME: $env:DB_NAME"
Write-Host "DB_PORT: $env:DB_PORT"
Write-Host "DB_PASSWORD: [SECRET]"

# Start the server
Write-Host "`nStarting server..." -ForegroundColor Yellow
npm run dev