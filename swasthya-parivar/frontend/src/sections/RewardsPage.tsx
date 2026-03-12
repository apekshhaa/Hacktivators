import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Gift, 
  Lock,
  Edit2,
  Trash2,
  RefreshCw,
  FileText,
  Printer
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RewardsPageProps {
  onBack: () => void;
}

const stats = [
  { icon: Trophy, label: 'TOTAL POINTS', value: '1179', action: 'Update' },
  { icon: Star, label: 'CHECKUP STREAK', value: '3', action: 'Update' },
  { icon: Trophy, label: 'BADGES EARNED', value: '0', action: 'Manage Badges' },
  { icon: Gift, label: 'ELIGIBLE BENEFITS', value: '0', action: 'Configure Benefits' },
];

const achievementBadges = [
  { 
    name: 'Regular Checkup Family', 
    description: '10+ checkups completed',
    status: 'locked',
    icon: '👥'
  },
  { 
    name: 'Health Champion', 
    description: 'Maintained 6-month streak',
    status: 'locked',
    icon: '🏆'
  },
  { 
    name: 'Vaccination Hero', 
    description: 'All family vaccinated',
    status: 'locked',
    icon: '💉'
  },
  { 
    name: 'Perfect Attendance', 
    description: 'No missed appointments',
    status: 'locked',
    icon: '✨'
  },
];

const benefits = [
  { name: 'Monthly Ration Kit', points: 400, progress: 100, status: 'not-eligible' },
  { name: 'Free Medicine Voucher', points: 300, progress: 100, status: 'not-eligible' },
  { name: 'Health Insurance Subsidy', points: 600, progress: 100, status: 'not-eligible' },
];

export default function RewardsPage({ onBack }: RewardsPageProps) {
  return (
    <div className="min-h-screen pt-[72px] pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            className="text-white/50 hover:text-white mb-4"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Household <span className="text-lime-accent">Rewards</span>
          </h1>
          <p className="text-white/50">
            Search and view household reward information and benefit eligibility
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-2xl bg-bg-secondary border border-white/5 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Circular Progress */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${48 * 3.52} ${100 * 3.52}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">48%</span>
                <span className="text-xs text-white/50">HEALTH</span>
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👥</span>
                <span className="text-white/60">Community Health Progress</span>
              </div>
              <p className="text-2xl font-bold mb-2">
                24 of 50 <span className="text-white/60 font-normal">Households Done</span>
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/50">⭐ REWARDS UNLOCK AT 73%</span>
                <div className="flex-1 max-w-xs">
                  <Progress value={48} className="h-2 bg-white/10" />
                </div>
              </div>
            </div>

            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              View Details
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </div>
        </motion.div>

        {/* Household ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-lime-accent/20 to-lime-accent/5 border border-lime-accent/30 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-lime-accent uppercase tracking-wider mb-1">Household Identification</p>
              <p className="text-3xl font-bold">HH-2024-1001</p>
            </div>
            <span className="px-4 py-2 rounded-full bg-lime-accent/20 text-lime-accent text-sm font-medium">
              Active Account
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-bg-secondary border border-white/5">
              <stat.icon className="w-6 h-6 text-lime-accent mb-3" />
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-3">{stat.label}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs border-white/10 hover:bg-white/5"
              >
                {stat.action}
              </Button>
            </div>
          ))}
        </motion.div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-lime-accent" />
              <h3 className="font-semibold">Achievement Badges</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-white/50">
              + Add Badge
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievementBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="p-4 rounded-xl bg-bg-secondary border border-white/5 hover:border-gami-purple/30 transition-colors group"
              >
                <div className="text-3xl mb-3">{badge.icon}</div>
                <p className="font-medium text-sm mb-1 truncate">{badge.name}</p>
                <p className="text-xs text-white/50 mb-3">{badge.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    badge.status === 'locked'
                      ? 'bg-white/5 text-white/40'
                      : 'bg-lime-accent/20 text-lime-accent'
                  }`}>
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                  <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefit Eligibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-lime-accent" />
              <h3 className="font-semibold">Benefit Eligibility</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-white/50">
              + Add Benefit
            </Button>
          </div>

          <div className="rounded-xl bg-bg-secondary border border-white/5 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs text-white/50 uppercase tracking-wider">
              <div className="col-span-4">Benefit Program</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Required Points</div>
              <div className="col-span-2 text-center">Progress</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>

            {/* Table Rows */}
            {benefits.map((benefit) => (
              <div 
                key={benefit.name}
                className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 last:border-0 items-center"
              >
                <div className="col-span-4 font-medium">{benefit.name}</div>
                <div className="col-span-2 text-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    benefit.status === 'eligible'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {benefit.status === 'eligible' ? '✓ ELIGIBLE' : 'NOT ELIGIBLE'}
                  </span>
                </div>
                <div className="col-span-2 text-center text-white/60">{benefit.points} points</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Progress value={benefit.progress} className="h-2 bg-white/10 flex-1" />
                    <span className="text-xs text-white/60">{benefit.progress}%</span>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              <Printer className="w-4 h-4 mr-2" />
              Print Details
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="destructive" className="ml-auto">
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Rewards
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
