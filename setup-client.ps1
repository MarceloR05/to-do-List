# Setup script for Todo List Client
Write-Host "Setting up Todo List Client..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Client setup completed!" -ForegroundColor Green
Write-Host "To start the client, run: npm run dev" -ForegroundColor Cyan