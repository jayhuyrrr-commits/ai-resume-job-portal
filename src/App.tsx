import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { UserProfile } from './types';
import { Toaster } from 'sonner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import JobPortal from './pages/JobPortal';
import AdminDashboard from './pages/AdminDashboard';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Layout from './components/Layout';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          // New user might still be in registration flow
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brand-primary/30 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" theme="dark" richColors />
      <Routes>
        <Route path="/" element={<Layout user={user}><Home /></Layout>} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/privacy" element={<Layout user={user}><PrivacyPolicy /></Layout>} />
        <Route path="/help" element={<Layout user={user}><HelpCenter /></Layout>} />
        <Route path="/terms" element={<Layout user={user}><TermsOfService /></Layout>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Layout user={user}><Dashboard user={user} /></Layout> : <Navigate to="/login" />} />
        <Route path="/builder" element={user ? <Layout user={user}><ResumeBuilder user={user}/></Layout> : <Navigate to="/login" />} />
        <Route path="/builder/:id" element={user ? <Layout user={user}><ResumeBuilder user={user}/></Layout> : <Navigate to="/login" />} />
        <Route path="/jobs" element={<Layout user={user}><JobPortal user={user} /></Layout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={user?.role === 'admin' ? <Layout user={user}><AdminDashboard user={user} /></Layout> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
