import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Page = 'home' | 'login';

interface NavigationProps {
  currentPage: Page;
  isLoggedIn: boolean;
  userType: 'user' | 'admin';
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const navLinks = [
  { label: 'DASHBOARD', href: '#dashboard' },
  { label: 'HEALTH TRACKER', href: '#tracker' },
  { label: 'FAMILY', href: '#family' },
  { label: 'REWARDS', href: '#rewards' },
  { label: 'CONSULTATIONS', href: '#consultations' },
  { label: 'ALERTS', href: '#alerts' },
];

export default function Navigation({ 
  currentPage, 
  isLoggedIn, 
  userType,
  onNavigate, 
  onLogout 
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLandingPage = currentPage === 'home';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Heart className="w-8 h-8 text-gami-purple fill-gami-purple/20" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight">SWASTHYA PARIVAR</span>
          </motion.a>

          {/* Desktop Navigation */}
          {isLandingPage && (
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {userType === 'admin' ? 'Healthcare Worker' : 'Household'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-bg-secondary border-white/10">
                    <DropdownMenuItem 
                      onClick={() => onNavigate('home')}
                      className="text-white/70 hover:text-white focus:bg-white/5 cursor-pointer"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Go to Home
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={onLogout}
                      className="text-red-400 hover:text-red-300 focus:bg-white/5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden sm:flex border-white/20 text-white hover:bg-white/5 hover:border-white/40"
                  onClick={() => onNavigate('login')}
                >
                  REGISTER HOUSEHOLD
                </Button>
                <Button
                  className="bg-gami-purple hover:bg-gami-purple-dark text-white"
                  onClick={() => onNavigate('login')}
                >
                  LAUNCH APP
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            {isLandingPage && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white/70 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && isLandingPage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-bg-primary/95 backdrop-blur-xl border-b border-white/5"
          >
            <nav className="flex flex-col px-4 py-4 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
