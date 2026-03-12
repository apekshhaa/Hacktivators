import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Ecosystem from './sections/Ecosystem';
import Layer2Metrics from './sections/Layer2Metrics';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import LoginPage from './sections/LoginPage';

type Page = 'home' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');

  const handleLogin = (type: 'user' | 'admin') => {
    setIsLoggedIn(true);
    setUserType(type);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('user');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-white overflow-x-hidden">
      <Navigation 
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        userType={userType}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero onLaunchApp={() => setCurrentPage('login')} />
            <Ecosystem />
            <Layer2Metrics />
            <CTA />
            <Footer />
          </motion.main>
        )}
        
        {currentPage === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage 
              onLogin={handleLogin}
              onBack={() => setCurrentPage('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
