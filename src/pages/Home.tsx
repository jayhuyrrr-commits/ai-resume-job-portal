import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Layers,
  Search,
  CheckCircle2,
  TrendingUp,
  Globe
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: "AI Resume Enhancement",
      description: "Our AI optimizes your resume content to bypass ATS and catch the eye of top recruiters.",
      icon: Cpu,
      color: "text-blue-400"
    },
    {
      title: "Futuristic Templates",
      description: "Stand out with premium, glassmorphism-inspired templates designed for modern tech companies.",
      icon: Layers,
      color: "text-purple-400"
    },
    {
      title: "Smart Job Matching",
      description: "Get personalized job recommendations based on your skills and preferences automatically.",
      icon: Zap,
      color: "text-emerald-400"
    },
    {
      title: "Verified Credentials",
      description: "Securely store and showcase your certifications with our verified badge system.",
      icon: ShieldCheck,
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-brand-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>The Future of Careers is Here</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-tight">
            Design Your <span className="text-gradient">Professional</span> Future with AI
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            NexusAI combines advanced artificial intelligence with futuristic design to help you build the perfect resume and land your dream job in record time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/register" className="btn-primary flex items-center gap-2 px-10">
              Build My Resume <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/jobs" className="btn-glass flex items-center gap-2 px-10">
              Explore Jobs <Search className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-24 relative w-full max-w-5xl group"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-accent/20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
          <div className="relative glass-card overflow-hidden">
             <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             </div>
             <img 
               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
               alt="NexusAI Dashboard Preview" 
               className="w-full h-auto object-cover opacity-80"
             />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Users", val: "50k+" },
            { label: "Jobs Posted", val: "12k+" },
            { label: "Resumes Built", val: "100k+" },
            { label: "Hired Rate", val: "94%" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-2 p-6 glass rounded-2xl border-white/5"
            >
              <h3 className="text-3xl font-display font-bold text-white">{stat.val}</h3>
              <p className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Advanced AI Features</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Everything you need to showcase your talent and secure high-paying roles in the modern economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="glass-card p-8 group hover:border-brand-primary/50 transition-all"
            >
              <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden p-12 md:p-20 rounded-3xl glass border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              Ready to land your <span className="text-brand-accent italic">next big role?</span>
            </h2>
            <ul className="space-y-4">
              {[
                "Professional AI-powered resume builder",
                "Real-time job application tracking",
                "Advanced category & location filters",
                "Expert career growth dashboard"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register" className="btn-primary px-8">Get Started Now</Link>
              <button className="btn-glass px-8">Learn More</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4 pt-12">
                <div className="glass p-4 rounded-2xl border-white/10 group cursor-default">
                   <TrendingUp className="text-green-400 mb-2" />
                   <p className="text-xs text-slate-500 uppercase font-bold">Salary Boost</p>
                   <p className="text-lg font-bold text-white">+40% Avg.</p>
                </div>
                <div className="glass p-4 rounded-2xl border-white/10">
                   <Globe className="text-blue-400 mb-2" />
                   <p className="text-xs text-slate-500 uppercase font-bold">Global Reach</p>
                   <p className="text-lg font-bold text-white">Full Remote</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="glass p-4 rounded-2xl border-white/10 h-40 flex flex-col justify-end">
                   <p className="text-sm font-bold text-white">Join 10,000+ developers</p>
                   <p className="text-xs text-slate-400">using NexusAI täglich</p>
                </div>
                <div className="glass p-4 rounded-2xl border-white/10">
                   <Sparkles className="text-amber-400 mb-2" />
                   <p className="text-xs text-slate-500 uppercase font-bold">ATS Score</p>
                   <p className="text-lg font-bold text-white">98 / 100</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
