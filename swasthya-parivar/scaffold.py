import os

base_dir = r"d:\Aetherion\Hacktivators\swasthya-parivar"

directories = [
    "frontend/public",
    "frontend/src/assets",
    "frontend/src/components/common",
    "frontend/src/components/chatbot",
    "frontend/src/components/health",
    "frontend/src/components/hospitals",
    "frontend/src/components/rewards",
    "frontend/src/components/maps",
    "frontend/src/components/analytics",
    "frontend/src/pages/auth",
    "frontend/src/pages/user",
    "frontend/src/pages/admin",
    "frontend/src/services/api",
    "frontend/src/services/chatbot",
    "frontend/src/services/analytics",
    "frontend/src/hooks",
    "frontend/src/store",
    "frontend/src/utils",
    "frontend/src/firebase",
    "backend/src/config",
    "backend/src/routes",
    "backend/src/controllers",
    "backend/src/services/auth",
    "backend/src/services/health",
    "backend/src/services/rewards",
    "backend/src/services/notifications",
    "backend/src/services/analytics",
    "backend/src/models",
    "backend/src/middleware",
    "backend/src/utils",
    "ai-services/symptom-extraction",
    "ai-services/disease-prediction",
    "ai-services/outbreak-detection",
    "ai-services/chatbot-engine",
    "ai-services/pipelines",
    "database/schemas",
    "database/migrations",
    "database/seeds",
    "analytics/outbreak-analysis",
    "analytics/village-health-trends",
    "analytics/reports",
    "infrastructure/docker",
    "infrastructure/nginx",
    "infrastructure/kubernetes",
    "docs",
    "scripts"
]

files = {
    "README.md": "# Swasthya Parivar\n\nAI-powered rural healthcare platform.",
    "frontend/README.md": "# Frontend\nReact.js application.",
    "backend/README.md": "# Backend\nNode.js Express API.",
    "ai-services/README.md": "# AI Services\nPython microservices."
}

for d in directories:
    dir_path = os.path.join(base_dir, os.path.normpath(d))
    os.makedirs(dir_path, exist_ok=True)

for f, content in files.items():
    file_path = os.path.join(base_dir, os.path.normpath(f))
    with open(file_path, "w") as file:
        file.write(content)

print("Scaffolding complete.")
