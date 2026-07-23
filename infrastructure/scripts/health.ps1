# health.ps1
param ()

$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
$DockerDir = Join-Path $ScriptDir "..\docker"

Write-Host "Checking health of infrastructure services..." -ForegroundColor Cyan
Set-Location $DockerDir
docker compose ps
