import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, ArrowRight, Stethoscope, Shield } from 'lucide-react';

interface HeroProps {
  onLaunchApp: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export default function Hero({ onLaunchApp }: HeroProps) {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    const hideTimer = setTimeout(() => setShowNotification(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">
      {/* Hexagon Grid Background */}
      <div className="absolute inset-0 hexagon-pattern opacity-50" />
      
      {/* Purple Gradient Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gami-purple/20 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gami-purple/10 border border-gami-purple/30 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-gami-purple animate-pulse" />
                HEALTHCARE FOR EVERY FAMILY // LIVE NOW
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6"
            >
              <span className="block">SMARTER</span>
              <span className="block">HEALTHCARE</span>
              <span className="block text-gradient-purple">STARTS HERE.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-white/60 mb-8 leading-relaxed"
            >
              Track your family's health, book consultations, earn rewards for healthy habits, and stay protected with AI-powered outbreak predictions.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
              <Button
                size="lg"
                className="bg-gami-purple hover:bg-gami-purple-dark text-white px-8 py-6 text-base font-semibold group"
                onClick={onLaunchApp}
              >
                LAUNCH APP
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 hover:border-white/40 px-8 py-6 text-base font-semibold"
              >
                BOOK CONSULTATION
              </Button>
            </motion.div>

            {/* Partner Logos */}
            <motion.div variants={itemVariants}>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Trusted Partners</p>
              <div className="flex items-center gap-6">
                {['WHO', 'UNICEF', 'MINISTRY OF HEALTH'].map((partner) => (
                  <span key={partner} className="text-sm font-bold text-white/30 hover:text-white/50 transition-colors cursor-default">
                    {partner}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Healthcare Mascot Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-center perspective-1000"
          >
            {/* 3D Card Container */}
            <div className="relative w-[300px] h-[400px] sm:w-[350px] sm:h-[450px]">
              {/* Healthcare Robot Mascot */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-56 h-72 rounded-3xl bg-gradient-to-b from-white/95 to-white/80 relative shadow-2xl">
                  {/* Head */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-32 rounded-full bg-white shadow-lg">
                    {/* Eyes */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-5">
                      <div className="w-5 h-5 rounded-full bg-black" />
                      <div className="w-5 h-5 rounded-full bg-black" />
                    </div>
                    {/* Line */}
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black" />
                  </div>
                  {/* Body */}
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32 h-28 rounded-full bg-white/50" />
                  {/* Stethoscope */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2">
                    <Stethoscope className="w-8 h-8 text-gami-purple" />
                  </div>
                  {/* Medi-bot label */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/10">
                    <span className="text-sm text-black/60 font-mono font-bold">MEDI-BOT</span>
                  </div>
                  {/* Hand with scanner */}
                  <motion.div
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-28 -right-6 w-14 h-20 rounded-full bg-white shadow-lg flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-400/50 animate-pulse" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg bg-bg-secondary border border-white/10 text-xs font-medium shadow-card"
              >
                <Heart className="w-4 h-4 text-red-400 inline mr-1" />
                <span className="text-white/60">Health Score: 85%</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-lg bg-bg-secondary border border-white/10 text-xs font-medium shadow-card"
              >
                <Shield className="w-4 h-4 text-gami-purple inline mr-1" />
                <span className="text-white/60">Protected</span>
              </motion.div>

              {/* Notification Popup */}
              {showNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute -bottom-16 right-0 left-0 mx-auto w-max max-w-[90%] px-4 py-3 rounded-xl bg-bg-secondary border border-gami-purple/30 shadow-glow-purple"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gami-purple/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-gami-purple" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">CHECKUP REMINDER</p>
                      <p className="text-xs text-white/60">Your next appointment is tomorrow at 10:00 AM</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
