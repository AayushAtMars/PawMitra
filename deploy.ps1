# PawMitra Deployment Script
# Run this after setting up MongoDB and Render

Write-Host "🐾 PawMitra Deployment Helper 🐾" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if we're in the right directory
if (!(Test-Path "frontend\app.json")) {
    Write-Host "❌ Error: Please run this script from the PawMitra root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Deployment Checklist:" -ForegroundColor Yellow
Write-Host ""

# Get backend URL
Write-Host "Step 1: Enter your Render backend URL" -ForegroundColor Green
Write-Host "Example: https://pawmitra-backend.onrender.com" -ForegroundColor Gray
$backendUrl = Read-Host "Backend URL"

if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    Write-Host "❌ Backend URL is required!" -ForegroundColor Red
    exit 1
}

# Remove trailing slash if present
$backendUrl = $backendUrl.TrimEnd('/')

Write-Host ""
Write-Host "✅ Backend URL: $backendUrl" -ForegroundColor Green
Write-Host ""

# Step 2: Update app.json
Write-Host "Step 2: Updating frontend/app.json..." -ForegroundColor Green

$appJsonPath = "frontend\app.json"
$appJson = Get-Content $appJsonPath -Raw | ConvertFrom-Json

# Update URLs
$appJson.expo.extra.apiUrl = "$backendUrl/api"
$appJson.expo.extra.socketUrl = $backendUrl

# Save updated app.json
$appJson | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath

Write-Host "✅ Updated app.json with production URLs" -ForegroundColor Green
Write-Host ""

# Step 3: Show next steps
Write-Host "📱 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Commit changes:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   git add app.json" -ForegroundColor Gray
Write-Host "   git commit -m 'Update API URLs for production'" -ForegroundColor Gray
Write-Host "   git push" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Install EAS CLI (if not installed):" -ForegroundColor Cyan
Write-Host "   npm install -g eas-cli" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Login to Expo:" -ForegroundColor Cyan
Write-Host "   eas login" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Build APK:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   eas build --platform android --profile preview" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Configuration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your app will connect to: $backendUrl" -ForegroundColor Cyan
