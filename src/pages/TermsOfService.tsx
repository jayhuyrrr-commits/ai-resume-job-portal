import React from 'react';
import { motion } from 'framer-motion';
import { Scale, UserCheck, Zap, AlertTriangle, Gavel, Ban, ShieldAlert } from 'lucide-react';

export default function TermsOfService() {
  const terms = [
    {
      title: "1. Acceptance of Protocol",
      icon: Scale,
      content: "By accessing logical nodes of NexusAI, you agree to be bound by these Terms of Service. If you do not agree with any part of these protocols, you are prohibited from utilizing our neural career optimization services."
    },
    {
      title: "2. User Vector Responsibility",
      icon: UserCheck,
      content: "You are responsible for maintaining the security of your authentication tokens and account access. Any activity originating from your unique identifier is your sole responsibility. NexusAI reserves the right to terminate access for security breaches."
    },
    {
      title: "3. Intellectual Property",
      icon: Zap,
      content: "The AI algorithms, UI infrastructure, and trademarked 'Nexus' elements are the exclusive property of NexusAI. While you own the data you input, the architectural generated outputs and platform code remain protected under global intellectual property law."
    },
    {
      title: "4. Prohibited Neural Practices",
      icon: Ban,
      content: "Users may not utilize our platform to generate fraudulent career documentation, bypass recruitment firewalls, or reverse-engineer our AI models. Automated scraping or 'botting' of our job portals is strictly forbidden."
    },
    {
      title: "5. AI Liability Limitation",
      icon: AlertTriangle,
      content: "NexusAI provides AI-generated suggestions as-is. We do not guarantee employment outcomes or 'perfect' accuracy of AI optimizations. Users must perform final validation on all generated professional signatures."
    },
    {
      title: "6. Governing Jurisdiction",
      icon: Gavel,
      content: "These terms are governed by the laws of the digital jurisdiction in which NexusAI operates. Any disputes arising from platform usage shall be resolved through binding technical arbitration."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest"
        >
          <ShieldAlert className="w-3 h-3 text-brand-primary" />
          Legal Framework v2.0
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
        >
          Terms of <span className="text-brand-primary">Service</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto"
        >
          Please review the operational boundaries and legal requirements for participating in the NexusAI career ecosystem.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {terms.map((term, index) => (
          <motion.div
            key={term.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass p-8 rounded-[2rem] border-white/5 bg-linear-to-b from-white/5 to-transparent flex flex-col gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <term.icon className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white tracking-tight">{term.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed antialiased">
                {term.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="p-10 glass rounded-[2.5rem] border-white/5 text-center space-y-6"
      >
        <div className="space-y-2">
          <p className="text-white font-bold uppercase tracking-widest text-xs">Agreement Confirmation</p>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            By continuing your session, you acknowledge that your professional data will be processed according to these neural protocols and our privacy standard.
          </p>
        </div>
        <div className="h-px w-24 bg-white/10 mx-auto"></div>
        <p className="text-[10px] text-slate-600">© 2026 NEXUSAI TECHNOLOGIES. ALL TRANSMISSIONS LOGGED.</p>
      </motion.div>
    </div>
  );
}
