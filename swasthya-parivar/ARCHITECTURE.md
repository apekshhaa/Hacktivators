# Swasthya Parivar - System Architecture

## 1. Overall System Architecture
Swasthya Parivar follows a **Microservices-ready, Modular Monolith Architecture** initially, designed to seamlessly split into true microservices as the platform scales.

- **Frontend Application (React.js):** A user-centric SPA (Single Page Application) for patients/villagers and an admin portal for healthcare workers. Contains maps for outbreak visualization, chatbots for interactions, and PWA capabilities for offline resilience.
- **Main Backend API API Gateway (Node.js/Express):** Handles main business logic, authentication, and routing. Acts as an API gateway for AI services. 
- **AI/ML Services (Python/FastAPI):** Separate services dedicated strictly to intensive compute tasks like ARIMA statistical modeling, classification, and text embeddings via LLaMA3/Gemini.
- **Database Layer (MongoDB/Mongoose):** Flexible schema database to handle dynamic health records, time-series metrics, scalable read/writes for chatbot history, and JSON payload logs.
- **Background/Data Pipelines:** Cron jobs and scheduled analytic processes that run offline to aggregate village-level records to prevent slowing down real-time transactional APIs.

## 2. Separation of Concerns & Modular Design
To support long-term maintainability, the system is strictly split:
- **Presentation Layer (Frontend):** Pure UI components, Redux/Zustand store, and API hooks. No direct logic bypassing backend.
- **API & Orchestration Layer (Backend):** Express Controllers coordinate business rules. Middleware validates tokens (Firebase).
- **Intelligence Layer (AI Services):** Isolated computational pipelines. Independent scaling since Python services consume different memory limits.
- **Storage Layer (Database Layer):** Fully decoupled. Repositories/Mongoose models abstract exact queries away from controllers.

## 3. Technology Stack & Suggestions
- **Frontend / UI:** React.js, React Router, Vite (for fast HMR), Tailwind CSS (for quick styling), and Google Maps API.
- **Backend API:** Node.js + Express.js.
- **Database:** MongoDB (main storage for records). *Suggestion: In the future, add Redis for caching village-level aggregations and chatbot rate-limiting.*
- **Authentication:** Firebase Authentication (handles JWT, OTP for rural phone numbers seamlessly).
- **AI/ML Layer:** Python + FastAPI (better performance and typed APIs than Flask). 
  - *Outbreak Detection:* `statsmodels` (ARIMA), `prophet`.
  - *NLP Symptoms:* `spaCy` or `Transformers`.
- **LLM Engine:** Ollama running LLaMA3 locally for privacy, fallback to Google Gemini API for fast, dynamic multilingual requests.
- **Messaging/Event System (Future Microservices prep):** *Suggestion: RabbitMQ or Kafka.* Node backend publishes "New Symptom Reported" event; Python service consumes it to update regional models without blocking user requests.

## 4. Logical Modules
- **Authentication Module:** Handles villagers vs. healthcare worker roles. OTP/Password management via Firebase token verification.
- **AI Health Prediction Module:** Machine learning inference endpoints to predict possible diseases from vectors of symptoms.
- **Chatbot Module:** Maintains session context, acts as an API integration layer with LLaMA3/Gemini answering rural queries in localized languages.
- **Rewards Module:** Gamification system tracking preventative actions (e.g., vaccination) and issuing points.
- **Notifications & Alerts Module:** SMS/Push-notification dispatcher to warn communities of nearby outbreaks.
- **Analytics Module:** Time-series dashboards aggregating household data to village, block, and district levels.

## 5. Required REST APIs (Core Contracts)
Between Frontend and Backend:

**Auth & Users:**
- `POST /api/v1/auth/login` (Firebase Token Verification)
- `GET /api/v1/users/profile` (Retrieve user/household info)

**Health & Symptoms:**
- `POST /api/v1/health/symptoms` (Log symptoms, triggers Python AI sync event)
- `GET /api/v1/health/records/:userId` (Fetch historical reports)

**Chatbot:**
- `POST /api/v1/chatbot/message` (Send query, returns localized text response + intents)

**Appointments:**
- `POST /api/v1/appointments/book`
- `GET /api/v1/appointments/user/:userId`

**Rewards:**
- `GET /api/v1/rewards/balance`
- `POST /api/v1/rewards/redeem`

**Analytics & Outbreaks (Admin/Health Worker):**
- `GET /api/v1/analytics/village/:villageId/trends` (Aggregated ARIMA results)
- `GET /api/v1/alerts/broadcasts` (Active alerts in area)

Between Node.js Backend & Python AI Services:
- `POST /internal/ai/predict-disease` (Takes symptoms array, returns probability matrix)
- `POST /internal/ai/outbreak-risk` (Takes region data, returns anomaly detection scores)
- `POST /internal/ai/extract-symptoms` (Takes raw NLP text from user, returns structured JSON of symptoms)

## 6. Directory Tree & Responsibilities Breakdown

```text
swasthya-parivar/
├── frontend/                  # React.js UI Application
│   ├── public/                # Static assets (favicons, manifest for PWA)
│   └── src/
│       ├── assets/            # Images, icons, global CSS
│       ├── components/        # Reusable UI building blocks
│       │   ├── common/        # Buttons, Modals, Inputs
│       │   ├── chatbot/       # Chat window, message bubbles
│       │   ├── health/        # Symptom forms, health record cards
│       │   ├── hospitals/     # Hospital location lists, Google Map pins
│       │   ├── rewards/       # Gamification badges, point displays
│       │   ├── maps/          # Google Maps API wrapper components
│       │   └── analytics/     # Charts (Recharts/Chartjs) for admin dashboard
│       ├── pages/             # Route-level components
│       │   ├── auth/          # Login/Signup/OTP pages
│       │   ├── user/          # Villager dashboards (records, bot)
│       │   └── admin/         # Health worker dashboards (trends, alerts)
│       ├── services/          # API call wrappers (Axios)
│       │   ├── api/           # Base queries
│       │   ├── chatbot/       # Websocket or POST chat hooks
│       │   └── analytics/     # Admin data fetching
│       ├── hooks/             # Custom React Hooks (useAuth, useMap)
│       ├── store/             # Global State (Zustand/Redux)
│       ├── utils/             # Formatters (Dates, Translations)
│       └── firebase/          # Firebase initialization & SDKs
│
├── backend/                   # Node.js + Express Main API
│   ├── src/
│   │   ├── config/            # Env variables, DB connections
│   │   ├── routes/            # API URI definitions
│   │   ├── controllers/       # HTTP Request/Response handling logic
│   │   ├── services/          # Core Business Logic (Modules decoupled from HTTP)
│   │   │   ├── auth/          # Verifies Firebase, checks Roles
│   │   │   ├── health/        # CRUD for records
│   │   │   ├── rewards/       # Point calculations
│   │   │   ├── notifications/ # SMS/Push dispatchers
│   │   │   └── analytics/     # Report generation logic
│   │   ├── models/            # Mongoose Schemas (User, Household, Appointment, Reward, Alert)
│   │   ├── middleware/        # JWT verifiers, Error handlers, Rate limiters
│   │   └── utils/             # Helpers, custom loggers
│
├── ai-services/               # Python/FastAPI Microservices
│   ├── symptom-extraction/    # NLP pipeline for free-text analysis
│   ├── disease-prediction/    # ML models (sklearn/TensorFlow) for risk
│   ├── outbreak-detection/    # ARIMA Time-series cron processing
│   ├── chatbot-engine/        # LangChain / Ollama integration 
│   └── pipelines/             # Data cleaning/ETL scripts for ML training
│
├── database/                  # DB Infrastructure
│   ├── schemas/               # Raw JSON/Schema references (non-platform specific)
│   ├── migrations/            # Scripts to upgrade DB schema/data
│   └── seeds/                 # Fake data for local Dev (villages, dummy patients)
│
├── analytics/                 # Advanced Data Analytics 
│   ├── outbreak-analysis/     # Heavy geographic query scripts & maps
│   ├── village-health-trends/ # Jupyter Notebooks / scripts for analysis
│   └── reports/               # Scheduled PDF/CSV generators layout
│
├── infrastructure/            # DevOps, CI/CD, Deployment
│   ├── docker/                # Dockerfiles, docker-compose.yml 
│   ├── nginx/                 # Reverse proxy and load balancing configs
│   └── kubernetes/            # K8s manifests (Deployments, Services, ConfigMaps)
│
├── docs/                      # Technical Documentation, Architecture diagrams, swagger 
├── scripts/                   # Utility automation scripts (build, run services, test)
└── README.md                  # Project overview, Setup instructions
```
