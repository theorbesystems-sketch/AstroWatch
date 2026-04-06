# AstroWatch Deployment Script (PowerShell)
# This script handles the transition of the project to the new GitHub repository.

$NewRemoteUrl = "https://github.com/theorbesystems-sketch/AstroWatch.git"
$BranchName = "main"

Write-Host "--- Build Frontend? (Y/N) ---" -ForegroundColor Cyan
$BuildOption = Read-Host "Do you want to run the build command (npm run build) before pushing?"
if ($BuildOption -eq "Y" -or $BuildOption -eq "y") {
    Write-Host "Building frontend..." -ForegroundColor Cyan
    Set-Location -Path "astrowatch-frontend"
    npm run build
    Set-Location -Path ".."
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed! Please check the output above." -ForegroundColor Red
        Read-Host "Press Enter to exit or continue manually..."
    }
}

Write-Host "--- Configuring Git Remote ---" -ForegroundColor Cyan
git remote set-url origin $NewRemoteUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating origin remote..." -ForegroundColor Cyan
    git remote add origin $NewRemoteUrl
}

Write-Host "--- Preparing Changes ---" -ForegroundColor Cyan
git add .

$Status = git status --porcelain
if ($Status) {
    Write-Host "Committing changes..." -ForegroundColor Cyan
    git commit -m "chore: push project to theorbesystems-sketch/AstroWatch"
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}

Write-Host "--- Pushing to GitHub ---" -ForegroundColor Cyan
Write-Host "Note: You might be prompted for GitHub credentials if they are not cached." -ForegroundColor DarkGray
git push -u origin $BranchName

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Project pushed successfully to $NewRemoteUrl" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Failed to push. Please check your permissions for $NewRemoteUrl" -ForegroundColor Red
}

Read-Host "Press Enter to exit..."
