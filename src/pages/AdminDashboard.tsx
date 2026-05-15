import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  FileText, 
  BarChart3, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  X,
  LayoutDashboard,
  Eye,
  CheckCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { collection, query, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job, Application, UserProfile } from '../types';
import { toast } from 'sonner';

interface AdminDashboardProps {
  user: UserProfile;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'jobs' | 'applications'>('stats');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    category: 'Full Stack',
    description: '',
    requirements: ['']
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const jobsSnap = await getDocs(query(collection(db, 'jobs'), orderBy('postedAt', 'desc')));
        const appsSnap = await getDocs(query(collection(db, 'applications'), orderBy('appliedAt', 'desc')));
        const usersSnap = await getDocs(collection(db, 'users'));
        
        setJobs(jobsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Job)));
        setApplications(appsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Application)));
        setUsersCount(usersSnap.size);
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdateStatus = async (appId: string, status: Application['status']) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status });
      setApplications(applications.map(app => app.id === appId ? { ...app, status } : app));
      toast.success(`Application status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jobs'), {
        ...newJob,
        postedAt: serverTimestamp(),
        active: true
      });
      toast.success("Job portal updated with new listing");
      setIsAddJobOpen(false);
      // Refresh
      const jobsSnap = await getDocs(query(collection(db, 'jobs'), orderBy('postedAt', 'desc')));
      setJobs(jobsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Job)));
    } catch (error) {
       toast.error("Failed to sequence new job");
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to terminate this listing?")) return;
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs(jobs.filter(j => j.id !== jobId));
      toast.success("Job listing terminated");
    } catch (error) {
       toast.error("Deletion failed");
    }
  };

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse">Loading Admin Console...</div>;
  }

  return (
    <div className="space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/20 rounded-2xl border border-brand-primary/30 text-brand-primary">
               <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-3xl font-display font-bold text-white tracking-tight">Admin Terminal</h1>
               <p className="text-slate-500 text-sm">System oversight and neural data management.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <button onClick={() => setIsAddJobOpen(true)} className="btn-primary flex items-center gap-2">
               <Plus className="w-5 h-5" /> Deploy New Job
            </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-8">
         {[
           { id: 'stats', label: 'Overview', icon: BarChart3 },
           { id: 'jobs', label: 'Job Flux', icon: Briefcase },
           { id: 'applications', label: 'Apps Transmissions', icon: FileText }
         ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-brand-accent' : 'text-slate-500 hover:text-white'
              }`}
            >
               <tab.icon className="w-4 h-4" />
               {tab.label}
               {activeTab === tab.id && (
                 <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_10px_rgb(34,211,238,0.5)]"></motion.div>
               )}
            </button>
         ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="glass-card p-8 space-y-4">
              <Users className="text-blue-400 w-8 h-8" />
              <div>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Entities</p>
                 <h3 className="text-3xl font-bold text-white">{usersCount}</h3>
              </div>
           </div>
           <div className="glass-card p-8 space-y-4">
              <Briefcase className="text-purple-400 w-8 h-8" />
              <div>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Listings</p>
                 <h3 className="text-3xl font-bold text-white">{jobs.length}</h3>
              </div>
           </div>
           <div className="glass-card p-8 space-y-4">
              <FileText className="text-brand-accent w-8 h-8" />
              <div>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Applications</p>
                 <h3 className="text-3xl font-bold text-white">{applications.length}</h3>
              </div>
           </div>
           <div className="glass-card p-8 space-y-4">
              <LayoutDashboard className="text-emerald-400 w-8 h-8" />
              <div>
                 <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">System Status</p>
                 <h3 className="text-3xl font-bold text-white">NOMINAL</h3>
              </div>
           </div>
        </div>
      )}

      {/* Jobs Management Tab */}
      {activeTab === 'jobs' && (
         <div className="glass rounded-3xl overflow-hidden border-white/5">
            <table className="w-full text-left">
               <thead className="bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-white/5">
                  <tr>
                     <th className="px-8 py-4">Position & Field</th>
                     <th className="px-8 py-4">Company</th>
                     <th className="px-8 py-4">Date Deployed</th>
                     <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                       <td className="px-8 py-6">
                          <div>
                             <p className="text-white font-bold mb-1">{job.title}</p>
                             <p className="text-[10px] text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded w-fit">{job.category}</p>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-slate-300 font-medium">{job.company}</td>
                       <td className="px-8 py-6 text-slate-500 text-sm">
                          {job.postedAt?.toDate ? job.postedAt.toDate().toLocaleDateString() : 'Unknown'}
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => deleteJob(job.id)}
                            className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500 transition-all"
                          >
                             <Trash2 className="w-5 h-5" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

      {/* Applications Management Tab */}
      {activeTab === 'applications' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {applications.map((app, i) => {
               const job = jobs.find(j => j.id === app.jobId);
               return (
                 <motion.div 
                   key={app.id} 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="glass p-6 rounded-3xl border-white/10 group flex flex-col gap-4"
                 >
                    <div className="flex justify-between items-start">
                       <div className="flex gap-4 items-center">
                          <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                             <FileText className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-white font-bold text-sm uppercase tracking-tight">
                                {job?.title || "Unknown Mission"}
                             </p>
                             <p className="text-[10px] text-brand-accent">{job?.company || "Classified Entity"}</p>
                          </div>
                       </div>
                       <select 
                         value={app.status}
                         onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                         className={`text-[10px] px-3 py-1 rounded-full border outline-none transition-colors border-white/10 ${
                           app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                           app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                           app.status === 'reviewed' ? 'bg-purple-500/10 text-purple-400' :
                           'bg-blue-500/10 text-blue-400'
                         }`}
                       >
                          <option value="pending" className="bg-[#030712]">PENDING</option>
                          <option value="reviewed" className="bg-[#030712]">REVIEWED</option>
                          <option value="accepted" className="bg-[#030712]">ACCEPTED</option>
                          <option value="rejected" className="bg-[#030712]">REJECTED</option>
                       </select>
                    </div>
                    
                    <div className="h-px bg-white/5"></div>
                    
                    <div className="flex justify-between items-center text-xs">
                       <div className="space-y-1">
                          <p className="text-slate-500 uppercase font-bold">Candidate UID</p>
                          <p className="text-slate-200">{app.userId.slice(-10)}</p>
                       </div>
                       <div className="space-y-1 text-right">
                          <p className="text-slate-500 uppercase font-bold">Arrival Date</p>
                          <p className="text-slate-200">{app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString() : 'Awaiting sync'}</p>
                       </div>
                    </div>
   
                    <button className="btn-glass py-2 px-4 text-xs font-bold w-full transition-all group-hover:bg-white/10">
                       ACCESS NEURAL PROFILE
                    </button>
                 </motion.div>
               );
             })}
         </div>
      )}

      {/* Add Job Modal */}
      <AnimatePresence>
        {isAddJobOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm" onClick={() => setIsAddJobOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-card border border-white/10 p-8 md:p-10 space-y-8 max-h-[90vh] overflow-y-auto"
            >
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight">New Listing Sequence</h2>
                  <button onClick={() => setIsAddJobOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><X /></button>
               </div>

               <form onSubmit={handleAddJob} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Hub Category</label>
                        <select 
                           value={newJob.category}
                           onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                           className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                        >
                           <option value="Frontend">Frontend</option>
                           <option value="Backend">Backend</option>
                           <option value="Full Stack">Full Stack</option>
                           <option value="Design">Design</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Employment Sync</label>
                        <select 
                           value={newJob.type}
                           onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                           className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                        >
                           <option value="Full-time">Full-time</option>
                           <option value="Remote">Remote</option>
                           <option value="Internship">Internship</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Position Title</label>
                     <input 
                        required
                        type="text" 
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                        placeholder="Lead Neural Architect"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Company Entity</label>
                        <input 
                           required
                           type="text" 
                           value={newJob.company}
                           onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                           className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                           placeholder="Stark Industries"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Geographic Node</label>
                        <input 
                           required
                           type="text" 
                           value={newJob.location}
                           onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                           className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                           placeholder="Neo Tokyo / Remote"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Compensation Range</label>
                     <input 
                        type="text" 
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                        placeholder="$150k - $220k"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Mission Objective (Description)</label>
                     <textarea 
                        required
                        rows={4}
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary resize-none"
                     ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 uppercase font-bold tracking-widest text-sm shadow-emerald-500/20">
                     Authorize Listing Deployment
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
