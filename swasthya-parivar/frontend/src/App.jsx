import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Ecosystem from './sections/Ecosystem';
import Layer2Metrics from './sections/Layer2Metrics';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import Login from './auth/Login';
import AdminHome from './admin/AdminHome';

// Main layout wrapper that includes the navbar and footer (for /home)
function MainLayout({ onLogout }) {
  return (
    <div className="min-h-screen bg-bg-primary text-white overflow-x-hidden">
      <Navigation 
        currentPage="home"
        isLoggedIn={true}
        userType="user"
        onNavigate={() => {}}
        onLogout={onLogout}
      />
      <motion.main
        key="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Hero onLaunchApp={() => {}} />
        <Ecosystem />
        <Layer2Metrics />
        <CTA />
        <Footer />
      </motion.main>
    </div>
  );
}

// Layout without Nav (for login and admin)
function AppRoutes() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainLayout onLogout={handleLogout} />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
