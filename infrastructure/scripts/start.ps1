# start.ps1
param ()

# Setup paths and ensure we are in the script's directory
$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
$DockerDir = Join-Path $ScriptDir "..\docker"

# Ensure .env exists
$EnvFile = Join-Path $DockerDir ".env"
$EnvExample = Join-Path $DockerDir ".env.example"

if (-Not (Test-Path $EnvFile)) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item $EnvExample -Destination $EnvFile
    Write-Host "Please configure $EnvFile before continuing if needed." -ForegroundColor Yellow
}

Write-Host "Starting infrastructure..." -ForegroundColor Green
Set-Location $DockerDir
docker compose up -d

Write-Host "Infrastructure started successfully!" -ForegroundColor Green
