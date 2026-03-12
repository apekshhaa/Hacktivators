import { motion } from 'framer-motion';
import { Heart, Twitter, MessageCircle, Send } from 'lucide-react';

const footerLinks = {
  features: [
    { label: 'Household Dashboard', href: '#' },
    { label: 'Health Tracker', href: '#' },
    { label: 'Family Management', href: '#' },
    { label: 'Rewards System', href: '#' },
  ],
  services: [
    { label: 'Book Consultation', href: '#' },
    { label: 'Find Hospitals', href: '#' },
    { label: 'Health Alerts', href: '#' },
    { label: 'Outbreak Prediction', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Healthcare Workers', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'X' },
  { icon: MessageCircle, href: '#', label: 'WhatsApp' },
  { icon: Send, href: '#', label: 'Telegram' },
];

export default function Footer() {
  return (
    <footer className="relative py-16 lg:py-20 bg-bg-primary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-4 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Heart className="w-8 h-8 text-gami-purple fill-gami-purple/20" strokeWidth={2} />
              </div>
              <span className="text-xl font-bold tracking-tight">SWASTHYA PARIVAR</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering families with accessible healthcare tracking, rewards, and AI-powered health predictions.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Features Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-3">
              {footerLinks.features.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-white/40">
            © 2024 SWASTHYA PARIVAR. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/40 font-mono">VERSION 2.0.1</span>
            <span className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ACTIVE
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
