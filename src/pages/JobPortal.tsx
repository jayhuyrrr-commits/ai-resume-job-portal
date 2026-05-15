import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter, 
  Clock, 
  ChevronRight, 
  Building2,
  X,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowRight
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job, UserProfile, Resume, Application } from '../types';
import { toast } from 'sonner';

interface JobPortalProps {
  user: UserProfile | null;
}

export default function JobPortal({ user }: JobPortalProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applying, setApplying] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'Design', 'Data Science', 'Mobile', 'DevOps'];

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobsQuery = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'));
        const querySnapshot = await getDocs(jobsQuery);
        setJobs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job)));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();

    if (user) {
      async function fetchUserData() {
        try {
          // Fetch Resumes
          const resumeQuery = query(collection(db, 'resumes'), where('userId', '==', user.uid));
          const resumeDocs = await getDocs(resumeQuery);
          setResumes(resumeDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resume)));

          // Fetch Applications
          const appQuery = query(collection(db, 'applications'), where('userId', '==', user.uid));
          const appDocs = await getDocs(appQuery);
          setUserApplications(appDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      fetchUserData();
    }
  }, [user?.uid]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || job.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getJobApplication = (jobId: string) => {
    return userApplications.find(app => app.jobId === jobId);
  };

  const handleApply = async () => {
    if (!user) return toast.error("Please login to apply");
    if (!selectedResumeId) return toast.error("Please select a resume to apply");
    if (!selectedJob) return;

    if (getJobApplication(selectedJob.id)) {
      return toast.error("Application already synchronized for this hub.");
    }

    setApplying(true);
    try {
      const docRef = await addDoc(collection(db, 'applications'), {
        jobId: selectedJob.id,
        userId: user.uid,
        resumeId: selectedResumeId,
        status: 'pending',
        appliedAt: serverTimestamp()
      });
      
      const newApp = {
        id: docRef.id,
        jobId: selectedJob.id,
        userId: user.uid,
        resumeId: selectedResumeId,
        status: 'pending' as const,
        appliedAt: new Date()
      };
      
      setUserApplications([...userApplications, newApp]);
      toast.success(`Successfully applied to ${selectedJob.company}!`);
      setSelectedJob(null);
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
           <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
             Explore <span className="text-gradient">Opportunities</span>
           </h1>
           <p className="text-slate-400 max-w-xl mx-auto">
             Find the next milestone in your professional journey with listings from top-tier tech companies globally.
           </p>
        </div>

        <div className="max-w-4xl mx-auto glass p-2 rounded-2xl flex flex-col md:flex-row gap-2 border-white/5 shadow-2xl">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by job title or company..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent p-4 pl-12 text-white outline-none"
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/5 text-slate-300 px-6 rounded-xl border border-white/10 outline-none focus:border-brand-primary"
              >
                {categories.map(c => <option key={c} value={c} className="bg-[#030712]">{c}</option>)}
              </select>
              <button className="btn-primary px-8">Find Hubs</button>
           </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card h-80 animate-pulse"></div>
          ))
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-card flex flex-col group h-full hover:border-brand-primary/50 transition-all cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="p-6 flex-1 space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                       {job.logo ? (
                          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                       ) : (
                          <Building2 className="text-slate-600 w-6 h-6" />
                       )}
                    </div>
                    {getJobApplication(job.id) ? (
                      <div className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                        getJobApplication(job.id)?.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        getJobApplication(job.id)?.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        getJobApplication(job.id)?.status === 'reviewed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                         {getJobApplication(job.id)?.status}
                      </div>
                    ) : (
                      <button className="text-slate-600 hover:text-brand-accent transition-colors"><Bookmark className="w-5 h-5" /></button>
                    )}
                 </div>
                 
                 <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">{job.title}</h3>
                    <p className="text-brand-accent/80 font-medium text-sm">{job.company}</p>
                 </div>

                 <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                       <MapPin className="w-3 h-3" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                       <Clock className="w-3 h-3" /> {job.type}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-emerald-400">
                       <DollarSign className="w-3 h-3" /> {job.salary}
                    </div>
                 </div>

                 <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {job.description}
                 </p>
              </div>

              <div className="p-4 border-t border-white/5 flex items-center justify-between">
                 <span className="text-[10px] text-slate-600 font-mono uppercase">
                    Posted {job.postedAt?.toDate ? job.postedAt.toDate().toLocaleDateString() : 'A few cycles ago'}
                 </span>
                 <button className="text-white flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:text-brand-accent">
                    Details <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="p-4 glass rounded-full w-fit mx-auto"><Filter className="w-8 h-8 text-slate-700" /></div>
             <p className="text-slate-500 italic">No opportunities found matching your neural filters.</p>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl glass-card border border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-10 overflow-y-auto space-y-8">
                 <button 
                   onClick={() => setSelectedJob(null)}
                   className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-500"
                 >
                   <X />
                 </button>

                 <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                       {selectedJob.logo ? (
                          <img src={selectedJob.logo} alt={selectedJob.company} className="w-full h-full object-cover" />
                       ) : (
                          <Building2 className="text-slate-600 w-10 h-10" />
                       )}
                    </div>
                    <div className="space-y-4 flex-1">
                       <div className="space-y-1">
                          <h2 className="text-3xl font-display font-bold text-white">{selectedJob.title}</h2>
                          <div className="flex items-center gap-2 text-brand-accent font-semibold">
                             {selectedJob.company} <CheckCircle2 className="w-4 h-4" />
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedJob.location}</div>
                          <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {selectedJob.type}</div>
                          <div className="flex items-center gap-1.5 text-emerald-400"><DollarSign className="w-4 h-4" /> {selectedJob.salary}</div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-8">
                       <div className="space-y-4">
                          <h4 className="text-lg font-bold text-white">Project Description</h4>
                          <p className="text-slate-400 leading-relaxed">{selectedJob.description}</p>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-lg font-bold text-white">Mission Requirements</h4>
                          <ul className="space-y-3">
                             {selectedJob.requirements.map((req, i) => (
                               <li key={i} className="flex gap-3 text-slate-400">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0"></div>
                                  {req}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Application Protocol</h4>
                          {!user ? (
                             <div className="text-center space-y-4 p-4 border border-dashed border-white/10 rounded-xl">
                                <p className="text-xs text-slate-500">Log in to apply for this mission</p>
                                <button className="btn-glass w-full py-2 text-xs">Login Required</button>
                             </div>
                          ) : getJobApplication(selectedJob.id) ? (
                            <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                               <div className="p-3 bg-emerald-500/10 rounded-full w-fit mx-auto text-emerald-400">
                                  <CheckCircle2 className="w-6 h-6" />
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-white uppercase tracking-tight">Application Synchronized</p>
                                  <p className="text-[10px] text-slate-500 mt-1">Status: <span className="text-brand-accent uppercase">{getJobApplication(selectedJob.id)?.status}</span></p>
                               </div>
                               <div className="text-[10px] text-slate-600 italic">
                                  Your neural profile has already been transmitted for this hub.
                               </div>
                            </div>
                          ) : (
                             <div className="space-y-4">
                                <div className="space-y-2">
                                   <label className="text-[10px] uppercase font-bold text-slate-500">Transmitted via Resume</label>
                                   <select 
                                     value={selectedResumeId}
                                     onChange={(e) => setSelectedResumeId(e.target.value)}
                                     className="w-full bg-[#0a0a0a] border border-white/10 p-2.5 rounded-xl text-sm outline-none focus:border-brand-primary"
                                   >
                                      <option value="">Select a neural profile...</option>
                                      {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                   </select>
                                </div>
                                <button 
                                   onClick={handleApply}
                                   disabled={applying}
                                   className="btn-primary w-full py-3 flex items-center justify-center gap-2 group"
                                >
                                   {applying ? "Synchronizing..." : "Initiate Application"}
                                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                             </div>
                          )}
                       </div>
                       
                       <div className="flex gap-2">
                          <button className="flex-1 btn-glass py-3 flex items-center justify-center gap-2 text-xs">
                             <Share2 className="w-4 h-4" /> Share Hub
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
