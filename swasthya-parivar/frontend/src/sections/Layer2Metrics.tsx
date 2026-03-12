import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Activity, Brain, Shield } from 'lucide-react';

interface MetricBarProps {
  label: string;
  value: string;
  percentage: number;
  delay: number;
}

function MetricBar({ label, value, percentage, delay }: MetricBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, percentage, delay]);

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-white/60 uppercase tracking-wider">{label}</span>
        <span className="text-white font-mono">{value}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${displayPercentage}%` : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay }}
          className="h-full bg-gradient-to-r from-gami-purple to-gami-purple-light rounded-full"
        />
      </div>
    </div>
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function CountUp({ end, duration = 2, prefix = '', suffix = '', decimals = 0 }: CountUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

const features = [
  {
    icon: Activity,
    number: '1',
    title: 'Health Monitoring',
    description: 'Real-time symptom tracking → Health Dashboard → Alerts',
  },
  {
    icon: Brain,
    number: '2',
    title: 'AI Prediction Engine',
    description: 'AI analyzes patterns and predicts outbreak risks in your community.',
  },
  {
    icon: Shield,
    number: '3',
    title: 'Data Privacy',
    description: 'End-to-end encryption ensures your health data stays secure.',
  },
];

export default function Layer2Metrics() {
  return (
    <section className="relative py-24 lg:py-32 bg-bg-primary">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gami-purple/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">
              AI-POWERED
            </h2>
            <p className="text-lg text-white/40 font-mono tracking-wider mb-6">
              HEALTH INTELLIGENCE
            </p>
            <p className="text-white/60 leading-relaxed mb-10">
              Swasthya Parivar uses advanced AI to monitor community health patterns, predict disease outbreaks, and provide personalized health recommendations for your family.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gami-purple/20 flex items-center justify-center">
                    <span className="text-gami-purple font-bold text-sm">{feature.number}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      <feature.icon className="w-4 h-4 text-gami-purple" />
                      {feature.title}
                    </h4>
                    <p className="text-sm text-white/50">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Health Metrics Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative p-6 rounded-2xl bg-bg-secondary border border-white/10 shadow-card">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                <span className="text-xs font-mono text-white/40">HEALTH_METRICS_DASHBOARD</span>
              </div>

              {/* Metrics */}
              <MetricBar
                label="Community Health Score"
                value="48%"
                percentage={48}
                delay={0.3}
              />
              <MetricBar
                label="Checkup Completion Rate"
                value="73%"
                percentage={73}
                delay={0.5}
              />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-bg-tertiary">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Active Households</p>
                  <p className="text-2xl font-mono font-bold text-gami-purple">
                    <CountUp end={50} duration={2} suffix="K+" />
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-bg-tertiary">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Avg Response Time</p>
                  <p className="text-2xl font-mono font-bold text-lime-accent">
                    <CountUp end={8} duration={1.5} suffix="s" />
                  </p>
                </div>
              </div>

              {/* Pulse Effect */}
              <div className="absolute inset-0 rounded-2xl animate-pulse-glow pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
