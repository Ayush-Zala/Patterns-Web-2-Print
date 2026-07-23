# reset.ps1
param ()

$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
$DockerDir = Join-Path $ScriptDir "..\docker"

Write-Host "WARNING: This will DESTROY all containers, networks, and named volumes!" -ForegroundColor Red
$confirmation = Read-Host "Are you sure you want to proceed? (yes/no)"

if ($confirmation -eq 'yes') {
    Set-Location $DockerDir
    Write-Host "Destroying infrastructure..." -ForegroundColor Yellow
    docker compose down -v
    Write-Host "Reset complete." -ForegroundColor Green
} else {
    Write-Host "Reset aborted." -ForegroundColor Green
}
