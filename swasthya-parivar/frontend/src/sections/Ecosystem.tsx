import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  Gift, 
  Stethoscope, 
  ShieldAlert,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const ecosystemCards = [
  {
    icon: LayoutDashboard,
    title: 'HOUSEHOLD DASHBOARD',
    description: 'Centralized dashboard to track family health records, checkup history, and medical appointments for all household members.',
    cta: 'OPEN DASHBOARD',
    ctaVariant: 'primary' as const,
    hasCode: false,
  },
  {
    icon: Activity,
    title: 'HEALTH TRACKER',
    description: 'Real-time health monitoring with fever, cough, and diarrhea tracking. View symptoms and environmental risk indicators.',
    cta: 'TRACK HEALTH',
    ctaVariant: 'primary' as const,
    hasCode: false,
  },
  {
    icon: Users,
    title: 'FAMILY MANAGEMENT',
    description: 'Register and manage family members, update health records, and track individual health status for each household member.',
    cta: 'MANAGE FAMILY',
    ctaVariant: 'outline' as const,
    hasCode: false,
  },
  {
    icon: Gift,
    title: 'REWARDS SYSTEM',
    description: 'Earn health points through regular checkups. Unlock badges, benefits, and incentives for maintaining family health.',
    cta: 'VIEW REWARDS',
    ctaVariant: 'primary' as const,
    hasCode: false,
  },
  {
    icon: Stethoscope,
    title: 'CONSULTATION BOOKING',
    description: 'Book free consultations with healthcare workers. Schedule appointments and receive reminders for upcoming visits.',
    cta: 'BOOK NOW',
    ctaVariant: 'outline' as const,
    hasCode: false,
  },
  {
    icon: ShieldAlert,
    title: 'OUTBREAK PREDICTION',
    description: 'AI-powered disease outbreak prediction for your community. Get alerts for dengue, flu, and other health risks.',
    cta: 'VIEW ALERTS',
    ctaVariant: 'outline' as const,
    hasCode: false,
  },
];

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="relative py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black italic tracking-tight mb-4">
            HEALTHCARE ECOSYSTEM
          </h2>
          <p className="text-sm text-white/40 font-mono tracking-wider">
            / SWASTHYA_PARIVAR / FEATURES / CORE_MODULES
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-gami-purple to-transparent" />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {ecosystemCards.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="group relative"
            >
              <div className="relative h-full p-6 rounded-2xl bg-bg-secondary border border-white/5 overflow-hidden transition-all duration-300 hover:border-gami-purple/30 hover:shadow-card-hover hover:-translate-y-1">
                {/* Corner Accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gami-purple" />
                  <div className="absolute bottom-0 right-0 h-full w-0.5 bg-gami-purple" />
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gami-purple/10 flex items-center justify-center mb-4 group-hover:bg-gami-purple/20 transition-colors">
                  <card.icon className="w-6 h-6 text-gami-purple" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* CTA */}
                <Button
                  variant={card.ctaVariant === 'primary' ? 'default' : 'outline'}
                  className={`w-full group/btn ${
                    card.ctaVariant === 'primary'
                      ? 'bg-gami-purple hover:bg-gami-purple-dark text-white'
                      : 'border-white/20 text-white hover:bg-white/5 hover:border-white/40'
                  }`}
                >
                  {card.cta}
                  <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* App Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-gami-purple/20 to-transparent border border-gami-purple/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gami-purple/20 flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-gami-purple" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Download Swasthya Parivar App</h3>
                <p className="text-white/50 text-sm">Available on iOS and Android</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-sm font-medium">App Store</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span className="text-sm font-medium">Google Play</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
