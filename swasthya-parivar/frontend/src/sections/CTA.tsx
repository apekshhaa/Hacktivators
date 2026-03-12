import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Users, Heart, Building2 } from 'lucide-react';

const stats = [
  { icon: Users, value: '50K+', label: 'HOUSEHOLDS' },
  { icon: Heart, value: '200K+', label: 'FAMILY MEMBERS' },
  { icon: Building2, value: '500+', label: 'HEALTHCARE WORKERS' },
];

export default function CTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gami-purple via-gami-purple to-gami-purple-dark" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 hexagon-pattern" />
      </div>
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tight text-black mb-6">
            JOIN THE HEALTH
            <br />
            REVOLUTION
          </h2>

          {/* Description */}
          <p className="text-lg text-black/70 mb-10 max-w-2xl mx-auto">
            Register your household today and get access to free health checkups, personalized health tracking, and exclusive rewards for maintaining your family's well-being.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-12">
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-6 bg-black/20 border-black/20 text-white placeholder:text-white/50 rounded-xl focus:border-white/40 focus:ring-white/20"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 bg-white text-gami-purple hover:bg-white/90 font-semibold rounded-xl group"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                'REGISTERED!'
              ) : (
                <>
                  REGISTER NOW
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-black text-black mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium text-black/60 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
