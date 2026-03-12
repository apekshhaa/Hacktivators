Project Name: Swasthya Parivar
Problem Statement ID: CS02HA
Team Name: OverRide 
College Name: St Joseph Engineering College 

Problem Statement: Creating an affordable health tracking system to promote regular medical check-ups, especially in rural areas. 

Proposed Solution: 
We are implementing an affordable health tracking system website that helps people monitor their health and stay connected with the healthcare system/workers.The system includes seperate logins for users and admins or health workers. We have focused mainly on three main features, those being, gamification (with chatbot to guide users in local languages), health record tracking and privacy of healthcare records for individuals within the same household. We have also added a feature of community-level health pattern detection, where similar diseases or medication usage across nearby households are treated as a collective health issue, enabling preventive, village‑wide interventions using time series analysis. Users can book appointments with doctors and admins can monitor these. Reschedule of appointments is also available which will be reflected in the admin's dashboard. 


Innovation and Creativity: The solution has three distinct features including the gamification model which makes use of the chatbot for guidance (in local languages), privacy of healthcare records for individuals within the same household and community-level health pattern detection using time series analysis. In gamification, we have added two types of rewards, one for individual households and one for the entire village (communal rewards). Individual points can be claimed for completing health checkups, and can be redeemed for either healthcare products/rations/discounts on healthcare checkups. Communal rewards are claimed when the entire village achieves a certain health goal, and can be redeemed for community-wide benefits such as better healthcare facilities or community events. 
Privacy of healthcare records for individuals within the same household ensures that the health records of one individual are not visible to other individuals within the same household. This is required because in rural areas, the families are often large and there is a lack of privacy. 
Time series analysis is used to detect community-level health patterns, where similar diseases or medication usage across nearby households are treated as a collective health issue, enabling preventive, village‑wide interventions.


Technical Complexity and Stack: 
Frontend: React.js for a dynamic UI, utilizing `react-router-dom` for navigation and `@react-google-maps/api` for location-based health tracking.
Backend: `Node.js` and `Express.js` providing a RESTful API, with MongoDB and Mongoose for flexible data modeling.
AI/ML: A hybrid LLM architecture using `Ollama (Llama3)` for local, privacy-preserving processing and `Google Gemini API` for advanced multilingual chatbot interactions.
Security & Auth: Firebase integration for secure authentication and individual data isolation within shared household IDs.
Data Analytics: Implementation of time series analysis using `ARIMA model` to identify community-level health trends and medication usage patterns.

Usability and Impact:
-Health Record Management: It provides a secure and private platform for tracking individual health data, ensuring strict confidentiality even within large, shared household environments.
-Gamified Healthcare Engagement: It boosts regular checkups in rural areas through a dual-reward system, offering individual healthcare products and communal benefits to motivate consistent health monitoring.
-Outbreak Prediction & Prevention: It utilizes time series analysis to detect community-level health patterns, enabling early identification of potential outbreaks and proactive, village-wide interventions.
Localized Accessibility: It bridges the communication gap in rural healthcare by providing guidance of the reward points through an AI chatbot which is capable of interacting in local languages.

Setup Instructions: 

`npm install` in both backend and frontend folders
`npm install firebase react-router-dom` in frontend folder
`npm install express mongoose` in backend folder
`npm install ollama` in backend folder
`npm install dotenv cors @google/generative-ai` in backend folder
`npm install axios` in frontend folder
`npm install @react-google-maps/api` in frontend folder

in three different terminals:
`run ollama server`
`run node server.js in backend folder`
`run npm run dev in frontend folder`

Create a .env file in the backend folder:
`PORT=5000`
`MONGO_URI=mongodb://localhost:27017/override_health`
`GEMINI_API_KEY=`

Create a .env file in the frontend folder:
`VITE_FIREBASE_API_KEY=AIzaSyD_mEsRpoWTOk2a-7P1y2aIq7sRi-cZ6YI`
`VITE_FIREBASE_AUTH_DOMAIN=override-c0834.firebaseapp.com`
`VITE_FIREBASE_PROJECT_ID=override-c0834`
`VITE_FIREBASE_STORAGE_BUCKET=override-c0834.firebasestorage.app`
`VITE_FIREBASE_MESSAGING_SENDER_ID=760523533856`
`VITE_FIREBASE_APP_ID=1:760523533856:web:9456538d4cfe1587931645`

Download the required LLM:
`ollama pull llama3`

Presentation and Demo Link: 


