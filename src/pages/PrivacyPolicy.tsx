import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileCheck, Cookie, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "User Data Privacy",
      icon: Eye,
      content: "At NexusAI, we prioritize the confidentiality of your personal information. We only collect data that is essential for providing our AI-driven career services, such as your professional history, skills, and contact details."
    },
    {
      title: "Firebase Authentication Security",
      icon: Lock,
      content: "We utilize Google Firebase for secure user authentication. Your password is never stored directly on our servers. Firebase employs industry-standard encryption and security protocols to keep your identity safe."
    },
    {
      title: "Resume Data Protection",
      icon: Shield,
      content: "Your resumes and professional documents are stored in encrypted cloud environments. You maintain full ownership and control over your data, with the ability to delete your profiles and resumes at any time."
    },
    {
      title: "AI-Generated Content Disclaimer",
      icon: FileCheck,
      content: "Our AI tools enhance your professional profile based on the data you provide. While we strive for perfection, we recommend reviewing all AI-generated suggestions before finalizing your documents."
    },
    {
      title: "Cookies Usage",
      icon: Cookie,
      content: "We use essential cookies to maintain your login session and enhance site performance. We do not use tracking cookies for third-party advertising or sell your browsing history."
    },
    {
      title: "Contact & Support",
      icon: Mail,
      content: "If you have questions regarding your data privacy or wish to request data export/deletion, please contact our security team at privacy@nexusai.tech."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider"
        >
          <Shield className="w-3 h-3" />
          Security Protocol
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
        >
          Privacy <span className="text-brand-accent">Policy</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto"
        >
          Last updated: May 15, 2026. Your trust is our most valuable asset. Learn how we protect your neural footprint and professional data.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass p-8 rounded-3xl border-white/5 hover:border-brand-primary/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
              <section.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{section.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-8 glass rounded-3xl border-white/5 bg-linear-to-br from-white/5 to-transparent text-center"
      >
        <p className="text-slate-500 text-xs italic">
          NexusAI is committed to the highest standards of data integrity and user privacy. Our systems are regularly audited to ensure compliance with modern security paradigms.
        </p>
      </motion.div>
    </div>
  );
}
