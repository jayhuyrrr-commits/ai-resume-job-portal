import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Mail, Lock, User, Github, Chrome, ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: formData.name,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success("Account created successfully! Welcome to NexusAI.");
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if profile exists, if not create
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast.success("Welcome, " + user.displayName);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 glass rounded-3xl overflow-hidden border-white/5 shadow-2xl">
        {/* Left Side - Form */}
        <div className="p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-white">Create Account</h1>
            <p className="text-slate-400">Join NexusAI and start building your future today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#030712] px-2 text-slate-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleGoogleSignIn} className="btn-glass py-3 flex items-center justify-center gap-2 text-sm">
              <Chrome className="w-5 h-5" /> Google
            </button>
            <button className="btn-glass py-3 flex items-center justify-center gap-2 text-sm opacity-50 cursor-not-allowed">
              <Github className="w-5 h-5" /> GitHub
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm">
            Already have an account? <Link to="/login" className="text-brand-accent hover:underline">Login here</Link>
          </p>
        </div>

        {/* Right Side - Image/Info */}
        <div className="hidden lg:block relative bg-linear-to-br from-brand-primary/20 via-brand-secondary/20 to-transparent p-12 overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072')] mix-blend-overlay opacity-30 grayscale"></div>
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                    <Sparkles className="text-brand-accent w-6 h-6" />
                 </div>
                 <h2 className="text-4xl font-display font-bold text-white">Unlock Your AI-Powered Potential</h2>
                 <p className="text-slate-300 text-lg">NexusAI helps you navigate the professional galaxy with state-of-the-art tools and templates.</p>
              </div>
              
              <div className="glass p-6 rounded-2xl border-white/10 space-y-4 translate-x-12 translate-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-green-400 to-emerald-600"></div>
                    <div>
                       <p className="text-sm font-bold text-white">Sarah Jenkins</p>
                       <p className="text-xs text-slate-400">Senior UX Researcher</p>
                    </div>
                 </div>
                 <p className="text-sm text-slate-300 italic">"NexusAI's builder is incredible. It turned my scattered experience into a professional masterpiece that landed me roles at Google and Netflix."</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
