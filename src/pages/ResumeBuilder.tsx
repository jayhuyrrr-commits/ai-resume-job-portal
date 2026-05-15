import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Trash2, 
  Plus, 
  Download, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Layout,
  Layers,
  Settings,
  Wand2
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import { db } from '../lib/firebase';
import { UserProfile, Resume } from '../types';
import { toast } from 'sonner';
import { generateResumeSummary, optimizeExperienceDescription } from '../services/aiService';

interface ResumeBuilderProps {
  user: UserProfile;
}

const INITIAL_RESUME: Partial<Resume> = {
  title: 'My Professional Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    jobTitle: ''
  },
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  templateId: 'modern-dark'
};

export default function ResumeBuilder({ user }: ResumeBuilderProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Partial<Resume>>(INITIAL_RESUME);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      async function loadResume() {
        const docRef = doc(db, 'resumes', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          setResume({ id: docSnap.id, ...docSnap.data() } as Resume);
        } else {
          toast.error("Resume not found or access denied");
          navigate('/builder');
        }
      }
      loadResume();
    } else {
      setResume({ ...INITIAL_RESUME, userId: user.uid, personalInfo: { ...INITIAL_RESUME.personalInfo!, fullName: user.displayName, email: user.email } });
    }
  }, [id, user.uid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (resume.id) {
        await updateDoc(doc(db, 'resumes', resume.id), {
          ...resume,
          updatedAt: serverTimestamp()
        });
        toast.success("Resume updated successfully");
      } else {
        const docRef = await addDoc(collection(db, 'resumes'), {
          ...resume,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setResume({ ...resume, id: docRef.id });
        navigate(`/builder/${docRef.id}`);
        toast.success("Resume created successfully");
      }
    } catch (error) {
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resume.personalInfo?.fullName || 'Resume'} - ${resume.title}`,
  });

  const generateAIContent = async () => {
    if (!resume.personalInfo?.jobTitle || resume.skills.length === 0) {
      return toast.warning("Add a job title and some skills first for better AI suggestions!");
    }
    setAiGenerating(true);
    try {
      const summary = await generateResumeSummary(resume);
      setResume(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo!, summary }
      }));
      toast.success("AI Summary generated!");
    } catch (error) {
       toast.error("AI Generation failed");
    } finally {
      setAiGenerating(false);
    }
  };

  const addItem = (field: 'education' | 'experience' | 'projects') => {
    const newItem = field === 'education' 
      ? { school: '', degree: '', year: '' }
      : field === 'experience'
      ? { company: '', position: '', duration: '', description: '' }
      : { name: '', description: '', link: '' };
    
    setResume(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem]
    }));
  };

  const removeItem = (field: 'education' | 'experience' | 'projects' | 'skills', index: number) => {
    setResume(prev => {
       const newList = [...(prev[field] as any[])];
       newList.splice(index, 1);
       return { ...prev, [field]: newList };
    });
  };

  const updateItem = (field: 'education' | 'experience' | 'projects', index: number, data: any) => {
     setResume(prev => {
        const newList = [...(prev[field] as any[])];
        newList[index] = { ...newList[index], ...data };
        return { ...prev, [field]: newList };
     });
  };

  const tabs = [
    { id: 'personal', label: 'Identity', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Hard Tech', icon: Code },
    { id: 'education', label: 'Knowledge', icon: GraduationCap },
    { id: 'templates', label: 'Holograms', icon: Layout },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 min-h-screen">
      {/* Editor Panel */}
      <div className="space-y-8 h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-hide">
        <div className="flex items-center justify-between glass py-4 px-6 rounded-2xl sticky top-0 z-20 border-white/5 shadow-lg">
           <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
                 <ChevronLeft className="w-5 h-5" />
              </Link>
              <input 
                type="text" 
                value={resume.title} 
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                className="bg-transparent text-white font-display font-bold text-lg outline-none border-b border-transparent hover:border-white/20 focus:border-brand-primary"
              />
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="btn-glass p-2 border-white/5"
              >
                <Save className={`w-5 h-5 ${saving ? 'animate-pulse text-brand-accent' : 'text-slate-400'}`} />
              </button>
              <button 
                 onClick={() => handlePrint()}
                 className="btn-primary py-2 px-6 text-sm flex items-center gap-2"
              >
                 <Download className="w-4 h-4" /> Download PDF
              </button>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                 activeTab === tab.id 
                   ? 'glass-morphism text-brand-accent' 
                   : 'text-slate-400 hover:text-white'
               }`}
             >
               <tab.icon className="w-4 h-4" />
               <span className="text-sm font-medium">{tab.label}</span>
             </button>
           ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8 pb-32">
           {activeTab === 'personal' && (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Full Identity</label>
                      <input 
                        type="text" 
                        value={resume.personalInfo?.fullName} 
                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo!, fullName: e.target.value } })}
                        placeholder="John Cyber"
                        className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Designation</label>
                      <input 
                        type="text" 
                        value={resume.personalInfo?.jobTitle} 
                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo!, jobTitle: e.target.value } })}
                        placeholder="Full Stack Neural Engineer"
                        className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                      />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Direct Comms (Email)</label>
                      <input 
                        type="email" 
                        value={resume.personalInfo?.email} 
                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo!, email: e.target.value } })}
                        className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Uplink (Phone)</label>
                      <input 
                        type="text" 
                        value={resume.personalInfo?.phone} 
                        onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo!, phone: e.target.value } })}
                        className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                      <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">Synthetic Summary (AI Powered)</label>
                      <button 
                        onClick={generateAIContent}
                        disabled={aiGenerating}
                        className="text-xs text-brand-accent flex items-center gap-1 hover:underline disabled:opacity-50"
                      >
                         <Wand2 className={`w-3 h-3 ${aiGenerating ? 'animate-spin' : ''}`} /> Generate with AI
                      </button>
                   </div>
                   <textarea 
                     rows={5}
                     value={resume.personalInfo?.summary}
                     onChange={(e) => setResume({ ...resume, personalInfo: { ...resume.personalInfo!, summary: e.target.value } })}
                     placeholder="A high-performance engineer focused on..."
                     className="w-full glass-morphism p-3 rounded-xl text-white outline-none focus:border-brand-primary resize-none"
                   ></textarea>
                </div>
             </motion.div>
           )}

           {activeTab === 'experience' && (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {(resume.experience || []).map((exp, i) => (
                  <div key={i} className="glass p-6 rounded-2xl space-y-4 relative group">
                     <button 
                       onClick={() => removeItem('experience', i)}
                       className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                     <div className="grid grid-cols-2 gap-4">
                        <input 
                          placeholder="Company" 
                          value={exp.company} 
                          onChange={(e) => updateItem('experience', i, { company: e.target.value })}
                          className="glass-morphism p-3 rounded-xl text-white w-full outline-none"
                        />
                        <input 
                          placeholder="Position" 
                          value={exp.position} 
                          onChange={(e) => updateItem('experience', i, { position: e.target.value })}
                          className="glass-morphism p-3 rounded-xl text-white w-full outline-none"
                        />
                     </div>
                     <input 
                       placeholder="Duration (e.g. 2024 - Present)" 
                       value={exp.duration} 
                       onChange={(e) => updateItem('experience', i, { duration: e.target.value })}
                       className="glass-morphism p-3 rounded-xl text-white w-full outline-none"
                     />
                     <textarea 
                       placeholder="Detailed Achievements..." 
                       value={exp.description} 
                       onChange={(e) => updateItem('experience', i, { description: e.target.value })}
                       className="glass-morphism p-3 rounded-xl text-white w-full outline-none h-24 resize-none"
                     />
                  </div>
                ))}
                <button onClick={() => addItem('experience')} className="w-full py-4 glass border-dashed border-white/20 rounded-2xl text-slate-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                   <Plus className="w-5 h-5" /> Add Experience Block
                </button>
             </motion.div>
           )}

           {activeTab === 'skills' && (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex flex-wrap gap-3">
                   {(resume.skills || []).map((skill, i) => (
                     <div key={i} className="glass py-2 px-4 rounded-full flex items-center gap-2 text-sm text-brand-accent font-medium">
                        {skill}
                        <button onClick={() => removeItem('skills', i)}><Trash2 className="w-3 h-3 text-red-500/50 hover:text-red-500" /></button>
                     </div>
                   ))}
                </div>
                <div className="flex gap-4">
                   <input 
                     id="skill-input"
                     type="text" 
                     placeholder="Type a skill and hit Enter..." 
                     className="flex-1 glass p-3 rounded-xl text-white outline-none focus:border-brand-primary"
                     onKeyDown={(e: any) => {
                        if (e.key === 'Enter' && e.target.value) {
                           setResume(prev => ({ ...prev, skills: [...(prev.skills || []), e.target.value] }));
                           e.target.value = '';
                        }
                     }}
                   />
                </div>
             </motion.div>
           )}

           {activeTab === 'education' && (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {(resume.education || []).map((edu, i) => (
                  <div key={i} className="glass p-6 rounded-2xl gap-4 grid grid-cols-1 md:grid-cols-2 relative group">
                     <button 
                       onClick={() => removeItem('education', i)}
                       className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                     <input 
                       placeholder="School/University" 
                       value={edu.school} 
                       onChange={(e) => updateItem('education', i, { school: e.target.value })}
                       className="glass-morphism p-3 rounded-xl text-white w-full outline-none"
                     />
                     <input 
                       placeholder="Degree/Certification" 
                       value={edu.degree} 
                       onChange={(e) => updateItem('education', i, { degree: e.target.value })}
                       className="glass-morphism p-3 rounded-xl text-white w-full outline-none"
                     />
                     <input 
                       placeholder="Year" 
                       value={edu.year} 
                       onChange={(e) => updateItem('education', i, { year: e.target.value })}
                       className="glass-morphism p-3 rounded-xl text-white w-full outline-none col-span-2"
                     />
                  </div>
                ))}
                <button onClick={() => addItem('education')} className="w-full py-4 glass border-dashed border-white/20 rounded-2xl text-slate-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                   <Plus className="w-5 h-5" /> Add Knowledge Hub
                </button>
             </motion.div>
           )}

           {activeTab === 'templates' && (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-2 gap-6">
                {[
                  { id: 'modern-dark', name: 'Cyberpunk Dark' },
                  { id: 'glass-prism', name: 'Glass Prism' },
                  { id: 'minimal-light', name: 'Neural Minimal' },
                  { id: 'editorial', name: 'Executive Print' }
                ].map((tpl) => (
                  <button 
                    key={tpl.id}
                    onClick={() => setResume({ ...resume, templateId: tpl.id })}
                    className={`aspect-[3/4] rounded-2xl border-2 transition-all p-4 flex flex-col items-center justify-center gap-4 ${
                      resume.templateId === tpl.id ? 'border-brand-primary bg-brand-primary/10' : 'border-white/5 glass hover:border-white/20'
                    }`}
                  >
                    <Layout className={`w-12 h-12 ${resume.templateId === tpl.id ? 'text-brand-primary' : 'text-slate-600'}`} />
                    <span className="text-sm font-bold text-white">{tpl.name}</span>
                  </button>
                ))}
             </motion.div>
           )}
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="hidden xl:block h-[calc(100vh-160px)] overflow-y-auto pr-4 perspective-1000 scrollbar-hide">
         <motion.div
           layout
           initial={{ rotateY: 10, scale: 0.95 }}
           id="resume-printable"
           ref={previewRef}
           className={`w-[21cm] min-h-[29.7cm] mx-auto p-12 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 text-slate-300 font-sans print:p-0 print:shadow-none print:bg-white print:text-black`}
         >
           <header className="mb-10 space-y-4">
              <div>
                 <h1 className="text-4xl font-display font-extrabold tracking-tight text-white print:text-black uppercase">{resume.personalInfo?.fullName || 'IDENT_NAME'}</h1>
                 <p className="text-brand-accent font-bold tracking-widest text-sm uppercase">{resume.personalInfo?.jobTitle || 'JOB_TITLE_PENDING'}</p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-400 font-medium">
                 <p>{resume.personalInfo?.email}</p>
                 <p>{resume.personalInfo?.phone}</p>
                 <p>{resume.personalInfo?.location}</p>
              </div>
              <div className="h-px bg-white/5 print:bg-black/10 w-full"></div>
              <p className="text-sm leading-relaxed italic">{resume.personalInfo?.summary || 'Generating neural profile summary...'}</p>
           </header>

           <div className="grid grid-cols-3 gap-12">
              <div className="col-span-2 space-y-10">
                 {resume.experience && resume.experience.length > 0 && (
                   <section className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent p-1 border-b border-brand-accent/20 w-fit">Deployment Log</h3>
                      <div className="space-y-8">
                         {resume.experience.map((exp, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="font-bold text-white print:text-black">{exp.position}</h4>
                                    <p className="text-sm text-slate-400">{exp.company}</p>
                                 </div>
                                 <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400 print:text-black">{exp.duration}</span>
                              </div>
                              <p className="text-xs leading-relaxed">{exp.description}</p>
                           </div>
                         ))}
                      </div>
                   </section>
                 )}

                 {resume.projects && resume.projects.length > 0 && (
                   <section className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent p-1 border-b border-brand-accent/20 w-fit">Neural Projects</h3>
                      <div className="space-y-6">
                         {resume.projects.map((proj, i) => (
                           <div key={i} className="space-y-1">
                              <h4 className="font-bold text-white print:text-black">{proj.name}</h4>
                              <p className="text-xs text-slate-400">{proj.description}</p>
                           </div>
                         ))}
                      </div>
                   </section>
                 )}
              </div>

              <div className="space-y-10">
                 <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent p-1 border-b border-brand-accent/20 w-fit">Core Modules</h3>
                    <div className="flex flex-wrap gap-2">
                       {resume.skills?.map((skill, i) => (
                         <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-300 print:border print:border-black/10 print:text-black">{skill}</span>
                       ))}
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent p-1 border-b border-brand-accent/20 w-fit">Academic Path</h3>
                    {resume.education?.map((edu, i) => (
                      <div key={i} className="space-y-1">
                         <h4 className="font-bold text-white text-xs print:text-black">{edu.school}</h4>
                         <p className="text-[10px] text-slate-400 uppercase">{edu.degree}</p>
                         <p className="text-[10px] text-slate-500 font-mono italic">{edu.year}</p>
                      </div>
                    ))}
                 </section>
              </div>
           </div>
         </motion.div>
      </div>
    </div>
  );
}
