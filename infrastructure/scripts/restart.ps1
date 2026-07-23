# restart.ps1
param ()

$ScriptDir = Split-Path $MyInvocation.MyCommand.Path

Write-Host "Restarting infrastructure..." -ForegroundColor Cyan
& (Join-Path $ScriptDir "stop.ps1")
& (Join-Path $ScriptDir "start.ps1")
