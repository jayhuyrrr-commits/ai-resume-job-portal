import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';
import { auth } from '../lib/firebase';
import { LayoutDashboard, FileText, Briefcase, Settings, LogOut, Menu, X, Orbit } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
}

export default function Layout({ children, user }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Resume Builder', path: '/builder', icon: FileText, protected: true },
    { name: 'Job Portal', path: '/jobs', icon: Briefcase, protected: false },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: Settings, protected: true });
  }

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-x-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-brand-accent/10 blur-[100px] rounded-full animate-pulse delay-500"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass py-3 px-6 rounded-2xl border-white/5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-tr from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Orbit className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">Nexus<span className="text-brand-accent">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              (!link.protected || user) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 transition-colors ${
                    location.pathname === link.path ? 'text-brand-accent' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-semibold text-white">{user.displayName}</span>
                  <span className="text-xs text-slate-400 capitalize">{user.role}</span>
                </div>
                {user.photoURL ? (
                   <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border border-white/10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30 text-brand-primary font-bold">
                    {user.displayName[0].toUpperCase()}
                  </div>
                )}
                <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-6 text-sm">Join Now</Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-6 top-24 z-40 md:hidden glass p-6 rounded-2xl border-white/5"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              (!link.protected || user) && (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-brand-accent" />
                  <span className="text-slate-200">{link.name}</span>
                </Link>
              )
            ))}
            <div className="pt-4 border-t border-white/5">
              {user ? (
                <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-400/5 rounded-xl transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="btn-glass text-center py-3">Login</Link>
                  <Link to="/register" className="btn-primary text-center py-3">Register</Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <main className="pt-32 pb-20 relative z-10 max-w-7xl mx-auto px-6">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <Orbit className="text-brand-primary w-6 h-6" />
              <span className="text-xl font-display font-bold text-white">NexusAI</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Empowering the next generation of professionals with AI-driven career growth tools and a futuristic job portal.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/builder" className="hover:text-brand-accent transition-colors">Resume Builder</Link></li>
              <li><Link to="/jobs" className="hover:text-brand-accent transition-colors">Job Portal</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-accent transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/help" className="hover:text-brand-accent transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-brand-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm gap-4">
          <p>© 2026 NexusAI. Built for BCA Final Year Major Project.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
