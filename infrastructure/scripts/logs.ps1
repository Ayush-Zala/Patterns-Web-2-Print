# logs.ps1
param (
    [string]$Service = ""
)

$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
$DockerDir = Join-Path $ScriptDir "..\docker"

Set-Location $DockerDir

if ([string]::IsNullOrWhiteSpace($Service)) {
    docker compose logs -f
} else {
    docker compose logs -f $Service
}
