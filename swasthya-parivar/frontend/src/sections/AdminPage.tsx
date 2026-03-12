import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Gift, 
  AlertTriangle,
  ArrowRight,
  Plus,
  Calendar,
  Clock,
  Stethoscope,
  Settings
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

type Page = 'home' | 'login' | 'dashboard' | 'rewards' | 'admin';

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

const appointments = [
  { name: 'Ramesh Kumar', type: 'General User', time: '10:00 AM', initial: 'R' },
  { name: 'Savitri Devi', type: 'Follow-up', time: '11:30 AM', initial: 'S' },
  { name: 'Rahul (Child)', type: 'Vaccination', time: '02:00 PM', initial: 'R' },
];

const outbreakRisks = [
  { name: 'Dengue Risk', level: 'high', percentage: 85 },
  { name: 'Seasonal Flu', level: 'moderate', percentage: 45 },
];

export default function AdminPage({ onNavigate }: AdminPageProps) {
  return (
    <div className="min-h-screen pt-[72px] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-lime-accent/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-lime-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Swasthya Parivar</h1>
            <p className="text-xs text-white/50">Administrator Panel</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary border border-white/5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/60">SYSTEM ACTIVE</span>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Health Tracker Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-white/5 hover:border-gami-purple/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-lime-accent" />
                <h3 className="font-semibold text-lime-accent">Health Tracker</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Access the summary dashboard to track household health records and history.
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-lime-accent hover:underline"
                onClick={() => onNavigate('dashboard')}
              >
                Go to Summary
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              
              {/* Decorative wave */}
              <div className="mt-4 opacity-20">
                <svg viewBox="0 0 200 50" className="w-full h-12">
                  <path
                    d="M0 25 Q25 5, 50 25 T100 25 T150 25 T200 25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-lime-accent"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Household Management Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-white/5 hover:border-gami-purple/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-lime-accent" />
                <h3 className="font-semibold text-lime-accent">Household Management</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Register new households or update existing family records.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-lime-accent hover:underline flex items-center"
                >
                  Add New Household
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <br />
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-lime-accent hover:underline flex items-center"
                >
                  Update Household
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              {/* Decorative icon */}
              <div className="mt-4 flex justify-end opacity-20">
                <Users className="w-16 h-16 text-lime-accent" />
              </div>
            </motion.div>

            {/* Outbreak Prediction Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-red-400">Outbreak Prediction</h3>
              </div>
              
              <div className="space-y-4">
                {outbreakRisks.map((risk) => (
                  <div key={risk.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{risk.name}</span>
                      <span className={risk.level === 'high' ? 'text-red-400' : 'text-yellow-400'}>
                        {risk.level === 'high' ? 'High' : 'Moderate'} ({risk.percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={risk.percentage} 
                      className={`h-2 bg-white/10 ${
                        risk.level === 'high' ? '[&>div]:bg-red-400' : '[&>div]:bg-yellow-400'
                      }`}
                    />
                  </div>
                ))}
              </div>
              
              {/* Decorative chart */}
              <div className="mt-4 opacity-20">
                <svg viewBox="0 0 200 50" className="w-full h-12">
                  <path
                    d="M0 40 L30 35 L60 38 L90 20 L120 25 L150 15 L180 30 L200 25"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Center - Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 flex items-center justify-center"
          >
            <div className="relative w-64 h-80">
              {/* Robot Mascot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-48 h-56 rounded-3xl bg-gradient-to-b from-white/95 to-white/80 relative shadow-2xl"
                >
                  {/* Head */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-28 rounded-full bg-white shadow-lg">
                    {/* Eyes */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-4">
                      <div className="w-4 h-4 rounded-full bg-black" />
                      <div className="w-4 h-4 rounded-full bg-black" />
                    </div>
                    {/* Line */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-black" />
                  </div>
                  {/* Body */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-28 h-24 rounded-full bg-white/50" />
                  {/* Stethoscope */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2">
                    <Stethoscope className="w-6 h-6 text-gami-purple" />
                  </div>
                  {/* Medi-bot label */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/10">
                    <span className="text-xs text-black/60 font-mono">MEDI-BOT</span>
                  </div>
                  {/* Hand with scanner */}
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-24 -right-4 w-12 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-400/50 animate-pulse" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Future Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-lime-accent" />
                <h3 className="font-semibold text-lime-accent">Future Appointments</h3>
              </div>
              
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div 
                    key={apt.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary"
                  >
                    <Avatar className="w-8 h-8 bg-white/10">
                      <AvatarFallback className="text-xs bg-gami-purple/20 text-gami-purple">
                        {apt.initial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{apt.name}</p>
                      <p className="text-xs text-white/50">{apt.type}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-lime-accent">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Update Rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-white/5 hover:border-gami-purple/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-5 h-5 text-lime-accent" />
                <h3 className="font-semibold text-lime-accent">Update Rewards</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Manage and distribute health rewards.
              </p>
              <Button 
                className="w-full bg-lime-accent text-black hover:bg-lime-accent/90"
                onClick={() => onNavigate('rewards')}
              >
                Manage Rewards
              </Button>
              
              {/* Decorative gift */}
              <div className="mt-4 flex justify-end opacity-20">
                <Gift className="w-16 h-16 text-lime-accent" />
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl bg-bg-secondary border border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-gami-purple" />
                <h3 className="font-semibold">Quick Actions</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Member
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Health Log
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs">
                  <Gift className="w-3 h-3 mr-1" />
                  Assign Reward
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
