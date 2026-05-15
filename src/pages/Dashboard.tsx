import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { UserProfile, Resume, Application, Job } from '../types';

interface DashboardProps {
  user: UserProfile;
}

export default function Dashboard({ user }: DashboardProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<(Application & { job?: Job })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch User's Resumes
        const resumePath = 'resumes';
        const resumeQuery = query(
          collection(db, resumePath), 
          where('userId', '==', user.uid),
          orderBy('updatedAt', 'desc'),
          limit(3)
        );
        const resumeDocs = await getDocs(resumeQuery).catch(e => handleFirestoreError(e, OperationType.LIST, resumePath));
        if (resumeDocs) {
          setResumes(resumeDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resume)));
        }

        // Fetch User's Applications
        const appPath = 'applications';
        const appQuery = query(
          collection(db, appPath),
          where('userId', '==', user.uid),
          orderBy('appliedAt', 'desc'),
          limit(5)
        );
        const appDocs = await getDocs(appQuery).catch(e => handleFirestoreError(e, OperationType.LIST, appPath));
        
        if (appDocs) {
          const fetchedApps = appDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
          
          // Fetch Job details for each application
          const appsWithJobs = await Promise.all(fetchedApps.map(async (app) => {
            const jobPath = `jobs/${app.jobId}`;
            const jobDocs = await getDocs(query(collection(db, 'jobs'), where('__name__', '==', app.jobId))).catch(e => handleFirestoreError(e, OperationType.GET, jobPath));
            const jobData = (jobDocs && jobDocs.docs.length > 0) ? { id: jobDocs.docs[0].id, ...jobDocs.docs[0].data() } as Job : undefined;
            return { ...app, job: jobData };
          }));
          setApplications(appsWithJobs);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user.uid]);

  const stats = [
    { label: "My Resumes", val: resumes.length, icon: FileText, color: "text-blue-400" },
    { label: "Applications", val: applications.length, icon: Briefcase, color: "text-purple-400" },
    { label: "Profile Views", val: "128", icon: TrendingUp, color: "text-brand-accent" }
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-32 w-full glass rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-24 glass rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="h-64 glass rounded-3xl"></div>
           <div className="h-64 glass rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Card */}
      <section className="relative overflow-hidden p-8 rounded-3xl bg-linear-to-r from-brand-primary/20 via-brand-secondary/10 to-transparent border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-white">Welcome back, {user.displayName || 'Pioneer'}!</h1>
              <p className="text-slate-400">Here's a snapshot of your career progression on NexusAI.</p>
           </div>
           <Link to="/builder" className="btn-primary group">
              <Plus className="w-5 h-5 inline-block mr-2" /> 
              Create New Resume
           </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center justify-between group"
          >
            <div className="space-y-1">
               <p className="text-sm font-medium text-slate-400">{stat.label}</p>
               <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
               <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Resumes */}
        <section className="space-y-6">
           <div className="flex justify-between items-end">
              <h2 className="text-2xl font-display font-bold text-white">My Resumes</h2>
              <Link to="/builder" className="text-sm text-brand-accent hover:underline flex items-center gap-1">
                 View all <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
           
           <div className="space-y-4">
              {resumes.length > 0 ? resumes.map((resume, i) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass group p-4 rounded-2xl flex items-center justify-between border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                        <FileText className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-white mb-0.5">{resume.title || "Untitled Resume"}</h4>
                        <p className="text-xs text-slate-500">Updated {resume.updatedAt?.toDate ? resume.updatedAt.toDate().toLocaleDateString() : 'Recently'}</p>
                     </div>
                  </div>
                  <Link to={`/builder/${resume.id}`} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                     <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              )) : (
                 <div className="glass p-12 rounded-3xl border-dashed border-white/10 text-center space-y-4">
                    <FileText className="w-12 h-12 text-slate-700 mx-auto" />
                    <p className="text-slate-400">No resumes found. Create your first one to get started!</p>
                    <Link to="/builder" className="btn-glass inline-block py-2">Start Building</Link>
                 </div>
              )}
           </div>
        </section>

        {/* Recent Applications */}
        <section className="space-y-6">
           <div className="flex justify-between items-end">
              <h2 className="text-2xl font-display font-bold text-white">Recent Applications</h2>
              <Link to="/jobs" className="text-sm text-brand-accent hover:underline flex items-center gap-1">
                 Find Jobs <ChevronRight className="w-4 h-4" />
              </Link>
           </div>

           <div className="glass-card overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-white/5 border-b border-white/5 text-xs uppercase text-slate-400 font-bold">
                    <tr>
                       <th className="px-6 py-4">Job Info</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {applications.length > 0 ? applications.map((app, i) => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                 {app.job?.logo ? (
                                    <img src={app.job.logo} alt={app.job.company} className="w-full h-full object-cover" />
                                 ) : (
                                    <Briefcase className="w-4 h-4 text-slate-500" />
                                 )}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white mb-0.5">{app.job?.title || "Position"}</p>
                                 <p className="text-xs text-slate-500">{app.job?.company || "Company"}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                             app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                             app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                             app.status === 'reviewed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                             'bg-blue-500/10 text-blue-400 border-blue-500/20'
                           }`}>
                              {app.status === 'pending' && <Clock className="w-3 h-3" />}
                              {app.status === 'reviewed' && <FileText className="w-3 h-3" />}
                              {app.status === 'accepted' && <CheckCircle className="w-3 h-3" />}
                              {app.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                              <span className="uppercase">{app.status || 'Pending'}</span>
                           </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                           {app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString() : 'Just now'}
                        </td>
                      </tr>
                    )) : (
                       <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">
                             Explore the job portal to start applying!
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </section>
      </div>
    </div>
  );
}
