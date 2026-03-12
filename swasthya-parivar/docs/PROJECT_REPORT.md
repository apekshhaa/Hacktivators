# Swasthya Parivar (OverRide) - Project Report

## 1. Problem Statement
In many rural and semi-urban communities, tracking household-level health data is a manual, error-prone, and inefficient process. Community health workers (ASHAs) struggle to keep track of immunization schedules, regular checkups, and health alerts. Furthermore, there is a lack of engagement and motivation for families to actively participate in their own health monitoring, leading to missed checkups and poor health outcomes.

## 2. Proposed Solution
**Swasthya Parivar** is a comprehensive, AI-powered Community Health Tracking System designed to bridge the gap between healthcare workers and households. It digitizes health records, automates tracking of checkup statuses (Done, Due, Missed), and introduces a novel gamification layer to incentivize healthy behaviors.

### Key Features:
*   **Role-Based Access:** Distinct portals for Users (Households) and Admins (Health Workers).
*   **Household Health Tracking:** Real-time monitoring of health status for every family member.
*   **Gamified Rewards System:** Users earn points for timely checkups which can be redeemed for health products or benefits.
*   **Community Alerts:** Broadcast system for health camps, vaccination drives, and emergencies.
*   **AI Medi-Bot:** An integrated AI assistant to answer basic health queries and provide guidance.
*   **Multilingual Support:** Accessible in local languages to ensure inclusivity.

## 3. Innovation and Creativity
*   **Gamification of Health:** Unlike traditional health apps that simply record data, Swasthya Parivar actively motivates users through a "Rewards Store," turning health maintenance into a positive, rewarding activity.
*   **AI-Driven Insights:** Integration of Google's Generative AI (Gemini) to provide intelligent health summaries and actionable advice.
*   **Visual-First Design:** A highly responsive, modern interface with glassmorphism effects, smooth animations, and intuitive navigation that breaks the stereotype of clunky government/health portals.
*   **Proactive Community Engagement:** The Community Alerts feature transforms the platform from a passive tracker into an active communication hub for public health.

## 4. Technical Complexity and Stack
The application is built as a modern full-stack web application ensuring scalability, performance, and security.

### Tech Stack:
*   **Frontend:**
    *   **Framework:** React.js (Vite)
    *   **Styling:** TailwindCSS, Vanilla CSS (custom animations)
    *   **Icons & UI:** Lucide React
    *   **Routing:** React Router v7
    *   **Build Tool:** Vite
*   **Backend:**
    *   **Runtime:** Node.js
    *   **Framework:** Express.js
    *   **Database:** MongoDB (NoSQL for flexible health records)
*   **Services:**
    *   **Authentication:** Firebase Auth (Secure Email & Google Login)
    *   **AI:** Google Generative AI (Gemini) API
    *   **Cloud:** Firebase/Vercel (Deployment ready)

### Technical Highlights:
*   **Secure Authentication flow** utilizing Firebase with role-based redirection.
*   **Complex State Management** for tracking rewards, points, and household data across the session.
*   **Responsive & Interactive UI** with custom CSS animations (floating elements, gradients) handling different screen sizes seamlessly.
*   **RESTful API Architecture** connecting the React frontend with the Node/Express backend.

## 5. Usability and Impact
*   **For Health Workers:** Drastically reduces paperwork and the time spent identifying families overdue for checkups. The dashboard provides an instant "Red/Green/Yellow" status overview.
*   **For Families:** Makes health tracking transparent and rewarding. The simple interface removes barriers to entry for digital health adoption.
*   **Social Impact:** By incentivizing preventive care, the system aims to improve overall community health metrics, reduce disease burden, and ensure timely interventions for vulnerable groups (children, elderly).

## 6. Setup Instructions

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB installed locally or a MongoDB Atlas URI
*   Firebase Project (for Authentication)

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone <repository_url>
    cd OverRide
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Create a .env file with your Firebase config
    # VITE_FIREBASE_API_KEY=...
    npm run dev
    ```

3.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file
    # MONGO_URI=...
    # GEMINI_API_KEY=...
    npm start
    ```

4.  **Access the Application**
    *   Frontend running at: `http://localhost:5173`
    *   Backend running at: `http://localhost:5000`

### Troubleshooting
*   **Module Not Found:** Ensure you have run `npm install` in both `frontend` and `backend` directories.
*   **Login Issues:** Verify Firebase configuration in `frontend/src/firebase/firebaseConfig.js`.

---
*Generated for CodeSprint 2026*
