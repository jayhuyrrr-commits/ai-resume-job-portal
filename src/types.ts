export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: any;
  updatedAt: any;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    jobTitle: string;
  };
  skills: string[];
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
  certifications: string[];
  languages: string[];
  templateId: string;
  createdAt: any;
  updatedAt: any;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Internship';
  category: string;
  description: string;
  requirements: string[];
  postedAt: any;
  active: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: any;
}
