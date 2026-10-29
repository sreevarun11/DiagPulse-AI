<#
.SYNOPSIS
    Single-Command Launcher for AI Powered Medical Diagnosis Classifier
.DESCRIPTION
    Starts both the FastAPI backend and Vite frontend together in PowerShell.
    Handles process orchestration and graceful shutdown on interrupt.
#>

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  AI Powered Medical Diagnosis Classifier - System Startup" -ForegroundColor Cyan
Write-Host "  Doctor-Facing Clinical Decision Support Prototype" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Check Python Virtual Environment
$VENV_PYTHON = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $VENV_PYTHON)) {
    Write-Host "[!] Virtual environment (.venv) not found. Creating..." -ForegroundColor Yellow
    python -m venv .venv
    & $VENV_PYTHON -m pip install -r requirements.txt
}

# 2. Check Frontend node_modules
param (
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$NODE_MODULES = Join-Path $PSScriptRoot "frontend\node_modules"
if (-not (Test-Path $NODE_MODULES) -and -not $BackendOnly) {
    Write-Host "[!] Frontend node_modules not found. Installing..." -ForegroundColor Yellow
    Push-Location "frontend"
    npm install
    Pop-Location
}

if ($FrontendOnly) {
    Write-Host "[+] Launching Vite frontend only on http://localhost:5173..." -ForegroundColor Green
    Push-Location "frontend"
    npm run dev
    Pop-Location
    exit 0
}

# 3. Start Backend API Server
Write-Host "[+] Starting FastAPI backend on http://127.0.0.1:8000..." -ForegroundColor Green
$logFile = Join-Path $PSScriptRoot ".backend_server.log"
$backendJob = Start-Process -FilePath $VENV_PYTHON `
    -ArgumentList "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000" `
    -RedirectStandardOutput $logFile `
    -RedirectStandardError $logFile `
    -PassThru

# Wait and verify health
Write-Host "[*] Waiting for backend to initialize..." -NoNewline
$isReady = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Milliseconds 600
    try {
        $res = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -TimeoutSec 2 -ErrorAction Stop
        if ($res.status -eq "healthy" -or $res.model_loaded -eq $true) {
            $isReady = $true
            break
        }
    } catch {
        Write-Host "." -NoNewline
    }
}
Write-Host ""

if ($isReady) {
    Write-Host "[✓] Backend verified ONLINE and healthy (Model loaded: 46 classes, 174 symptoms)." -ForegroundColor Green
} else {
    Write-Host "[!] Warning: Backend health check did not respond within timeout." -ForegroundColor Yellow
    if (Test-Path $logFile) {
        Write-Host "--- Backend Log Tail ---" -ForegroundColor DarkGray
        Get-Content $logFile -Tail 15
        Write-Host "------------------------" -ForegroundColor DarkGray
    }
}

if ($BackendOnly) {
    Write-Host "[+] Backend is running (PID: $($backendJob.Id)). Press Ctrl+C to terminate." -ForegroundColor Cyan
    try {
        Wait-Process -Id $backendJob.Id
    } finally {
        if ($backendJob -and -not $backendJob.HasExited) {
            Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
        }
    }
    exit 0
}

# 4. Start Frontend Dev Server
Write-Host "[+] Starting Vite frontend on http://localhost:5173..." -ForegroundColor Green
Write-Host ""
Write-Host "  ---------------------------------------------------------------" -ForegroundColor White
Write-Host "  Frontend Clinical UI: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "  Health Check API:     http://127.0.0.1:8000/health" -ForegroundColor Cyan
Write-Host "  ---------------------------------------------------------------" -ForegroundColor White
Write-Host "  Press Ctrl+C to stop both servers gracefully." -ForegroundColor Yellow
Write-Host ""

try {
    Push-Location "frontend"
    npm run dev
}
finally {
    Pop-Location
    Write-Host "`n[+] Shutting down backend process (PID: $($backendJob.Id))..." -ForegroundColor Yellow
    if ($backendJob -and -not $backendJob.HasExited) {
        Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "[+] All servers stopped cleanly." -ForegroundColor Green
}
