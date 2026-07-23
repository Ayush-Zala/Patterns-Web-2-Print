# stop.ps1
param ()

$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
$DockerDir = Join-Path $ScriptDir "..\docker"

Write-Host "Stopping infrastructure..." -ForegroundColor Yellow
Set-Location $DockerDir
docker compose stop

Write-Host "Infrastructure stopped." -ForegroundColor Green
