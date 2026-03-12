$baseDir = "d:\Aetherion\Hacktivators\swasthya-parivar"

$directories = @(
    "frontend/public", "frontend/src/assets", "frontend/src/components/common",
    "frontend/src/components/chatbot", "frontend/src/components/health",
    "frontend/src/components/hospitals", "frontend/src/components/rewards",
    "frontend/src/components/maps", "frontend/src/components/analytics",
    "frontend/src/pages/auth", "frontend/src/pages/user", "frontend/src/pages/admin",
    "frontend/src/services/api", "frontend/src/services/chatbot", "frontend/src/services/analytics",
    "frontend/src/hooks", "frontend/src/store", "frontend/src/utils", "frontend/src/firebase",
    "backend/src/config", "backend/src/routes", "backend/src/controllers",
    "backend/src/services/auth", "backend/src/services/health", "backend/src/services/rewards",
    "backend/src/services/notifications", "backend/src/services/analytics",
    "backend/src/models", "backend/src/middleware", "backend/src/utils",
    "ai-services/symptom-extraction", "ai-services/disease-prediction",
    "ai-services/outbreak-detection", "ai-services/chatbot-engine", "ai-services/pipelines",
    "database/schemas", "database/migrations", "database/seeds",
    "analytics/outbreak-analysis", "analytics/village-health-trends", "analytics/reports",
    "infrastructure/docker", "infrastructure/nginx", "infrastructure/kubernetes",
    "docs", "scripts"
)

foreach ($dir in $directories) {
    $path = Join-Path $baseDir $dir
    New-Item -ItemType Directory -Force -Path $path > $null
}

Set-Content -Path (Join-Path $baseDir "README.md") -Value "# Swasthya Parivar`n`nAI-powered rural healthcare platform."
Set-Content -Path (Join-Path $baseDir "frontend/README.md") -Value "# Frontend`nReact.js application."
Set-Content -Path (Join-Path $baseDir "backend/README.md") -Value "# Backend`nNode.js Express API."
Set-Content -Path (Join-Path $baseDir "ai-services/README.md") -Value "# AI Services`nPython microservices."

Write-Host "Scaffolding complete."
