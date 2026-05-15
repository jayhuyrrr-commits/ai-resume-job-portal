import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  HelpCircle, 
  User, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  ChevronRight,
  LifeBuoy
} from 'lucide-react';

export default function HelpCenter() {
  const faqs = [
    {
      category: "Account & Access",
      icon: User,
      questions: [
        "How do I reset my secure login?",
        "Can I link multiple Google profiles?",
        "How do I update my primary email hub?"
      ]
    },
    {
      category: "Resume Intelligence",
      icon: FileText,
      questions: [
        "How does the AI optimize my skills?",
        "Can I export resumes to neural PDF formats?",
        "How many resume iterations can I store?"
      ]
    },
    {
      category: "Job Synchronization",
      icon: Briefcase,
      questions: [
        "How are mission matches calculated?",
        "Can I track my application transmission status?",
        "Are recruitment hubs notified of my updates?"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-wider"
          >
            <LifeBuoy className="w-3 h-3" />
            Support Matrix
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight"
          >
            Nexus <span className="text-brand-primary">Support</span> Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Find answers to common transmissions or connect directly with our technical intelligence team.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-xl mx-auto"
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search the knowledge base..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Grid of FAQ Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {faqs.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass p-8 rounded-3xl border-white/5 space-y-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent/10 transition-colors">
                <group.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{group.category}</h3>
            </div>
            <div className="space-y-4">
              {group.questions.map((q) => (
                <button 
                  key={q} 
                  className="w-full text-left flex items-center justify-between p-4 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-sm font-medium border border-transparent hover:border-white/5"
                >
                  {q}
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass p-12 rounded-[2rem] border-white/5 bg-linear-to-br from-brand-primary/5 to-transparent relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-display font-bold text-white tracking-tight">Need Direct Assistance?</h2>
            <p className="text-slate-400 max-w-md">
              Can't find what you're looking for? Our elite support engineers are ready to assist with your specific career synchronization needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary py-4 px-8 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Open Secure Ticket
            </button>
            <button className="btn-glass py-4 px-8 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Live Feed
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
