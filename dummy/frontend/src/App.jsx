// import Home from './pages/Home'
// import './index.css'

// function App() {
//   return (
//     <Home />
//   )
// }

// export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";
import Home from "./pages/user/Home";
import AdminHome from "./pages/admin/AdminHome";
import Summary from "./pages/user/Summary";
import MemberRiskDetails from "./pages/user/MemberRiskDetails";
import RewardsManagement from "./pages/admin/RewardsManagement";
import AdminRewardsPage from "./pages/admin/AdminRewardsPage";
import OutbreakPrediction from "./pages/admin/OutbreakPrediction";
import './index.css'
import GoogleTranslate from "./components/GoogleTranslate";

function App() {
  return (
    <BrowserRouter>
      <GoogleTranslate />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/member-risk/:householdId/:memberName" element={<MemberRiskDetails />} />
        <Route path="/rewards" element={<RewardsManagement />} />
        <Route path="/admin/rewards" element={<AdminRewardsPage />} />
        <Route path="/admin/outbreak" element={<OutbreakPrediction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
