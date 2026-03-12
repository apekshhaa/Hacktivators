import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Clock,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Page = 'home' | 'login' | 'dashboard' | 'rewards' | 'admin';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

const familyMembers = [
  { name: 'Kavita Mishra', relation: 'Head', age: 34, gender: 'Male', status: 'healthy' },
  { name: 'Vikram Mishra', relation: 'Sister', age: 54, gender: 'Female', status: 'healthy' },
  { name: 'Vikram Mishra', relation: 'Wife', age: 51, gender: 'Female', status: 'follow-up', flag: 'Fever' },
  { name: 'Sneha Mishra', relation: 'Father', age: 54, gender: 'Male', status: 'healthy' },
];

const checkupHistory = [
  { date: '25/2/2025', status: 'done', note: 'Routine visit recorded.' },
  { date: '9/4/2025', status: 'done', note: 'Routine visit recorded.' },
  { date: '10/5/2025', status: 'done', note: 'Routine visit recorded.' },
  { date: '15/11/2025', status: 'missed', note: 'Routine visit recorded.' },
  { date: '22/6/2025', status: 'done', note: 'Routine visit recorded.' },
  { date: '17/5/2024', status: 'missed', note: 'Routine visit recorded.' },
];

const healthMetrics = [
  { label: 'Fever/Day', value: 0, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  { label: 'Cough/Day', value: 0, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  { label: 'Diarrhea/Day', value: 0, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { label: 'Env. Risk', value: '0/10', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
];

export default function DashboardPage({ }: DashboardPageProps) {
  return (
    <div className="min-h-screen pt-[72px] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Left - Title & CTAs */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Smarter
              <br />
              Healthcare
              <br />
              Starts
              <br />
              With <span className="text-lime-accent">Swasthya</span>
              <br />
              <span className="text-lime-accent">Parivar.</span>
            </h1>
            <p className="text-white/60 mb-6 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-lime-accent/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-lime-accent" />
              </span>
              Track Household Health
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-lime-accent text-black hover:bg-lime-accent/90"
                onClick={() => {}}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Book a Free Consultation
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/5"
                onClick={() => {}}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearby Hospitals
              </Button>
            </div>
          </div>

          {/* Right - Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-64 h-80">
              {/* Robot Mascot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-56 rounded-3xl bg-gradient-to-b from-white/95 to-white/80 relative shadow-2xl">
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
                    <div className="w-8 h-8 rounded-full bg-gami-purple/20 flex items-center justify-center">
                      <span className="text-gami-purple text-xs">+</span>
                    </div>
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
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Community Health Pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-lime-accent" />
            <h3 className="font-semibold">Community Health Pulse</h3>
          </div>
          <p className="text-sm text-white/50 mb-4">Live 14-day outbreak risk indicator for your village</p>
          
          <div className="p-6 rounded-2xl bg-bg-secondary border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-lg">🌍</span>
                </div>
                <div>
                  <p className="font-medium">Community Health Risk</p>
                  <p className="text-xs text-white/50">Sodepur • Last 14 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm">Unknown</span>
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">Unknown</span>
              </div>
            </div>
            
            <p className="text-sm text-white/60 mb-4">Community health data not available</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {healthMetrics.map((metric) => (
                <div key={metric.label} className={`p-4 rounded-xl ${metric.bgColor}`}>
                  <p className="text-xs text-white/50 mb-1">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="p-6 rounded-2xl bg-bg-secondary border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-5 h-5 text-gami-purple" />
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-white/50 mb-1">Last Visit Date</p>
            <p className="text-2xl font-bold">25/2/2025</p>
            <p className="text-xs text-white/40 mt-1">Routine Community Checkup</p>
          </div>

          <div className="p-6 rounded-2xl bg-bg-secondary border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-sm text-white/50 mb-1">Active Health Flags</p>
            <p className="text-lg font-semibold text-red-400">Fever: Wife</p>
            <p className="text-xs text-white/40 mt-1">Follow-up required</p>
          </div>

          <div className="p-6 rounded-2xl bg-bg-secondary border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-5 h-5 text-lime-accent" />
              <Calendar className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-sm text-white/50 mb-1">Next Scheduled Visit</p>
            <p className="text-2xl font-bold text-lime-accent">26/03/2026</p>
            <Button variant="link" className="text-xs text-white/40 p-0 h-auto mt-1">
              Reschedule Visit
            </Button>
          </div>
        </motion.div>

        {/* Family Health Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-lime-accent" />
              <h3 className="font-semibold">Family Health Details</h3>
            </div>
            <span className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full">
              4 Members
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {familyMembers.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-xl bg-bg-secondary border border-white/5 hover:border-gami-purple/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <Avatar className="w-10 h-10 bg-white/10">
                    <AvatarFallback className="text-sm bg-gami-purple/20 text-gami-purple">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {member.status === 'follow-up' && (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-white/50 mb-2">
                  {member.relation} • {member.age} Yrs • {member.gender}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === 'healthy' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {member.status === 'healthy' ? 'Healthy' : 'Follow-up'}
                  </span>
                </div>
                {member.flag && (
                  <p className="text-xs text-red-400 mt-2">{member.flag}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Checkup History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="font-semibold mb-4">Checkup History</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
            
            <div className="space-y-4">
              {checkupHistory.map((item, index) => (
                <motion.div
                  key={item.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="relative pl-12"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-2 w-5 h-5 rounded-full border-2 border-bg-primary ${
                    item.status === 'done' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  
                  <div className="p-4 rounded-xl bg-bg-secondary border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.date}</p>
                      <p className="text-sm text-white/50">{item.note}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      item.status === 'done'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.status === 'done' ? 'Done' : 'Missed'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
