import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const INITIAL_JOBS = [
  {
    title: "Senior Full Stack Neural Engineer",
    company: "Aether Dynamics",
    location: "Neo Tokyo / Remote",
    salary: "$180k - $240k",
    type: "Full-time",
    category: "Full Stack",
    description: "Looking for an expert engineer to build our next-generation neural interface systems. You'll be working with cutting-edge holographic UI and AI-driven backends.",
    requirements: ["10+ years in distributed systems", "Expertise in React, Node.js and Rust", "Experience with Neural Link SDKs", "Strong orbital mechanics knowledge is a plus"],
    postedAt: new Date(),
    active: true
  },
  {
    title: "Lead UX Hologram Architect",
    company: "Prism Corp",
    location: "Glass City",
    salary: "$140k - $190k",
    type: "Remote",
    category: "Design",
    description: "Design immersive 3D professional environments for the remote workforce of tomorrow. We specialize in glass-morphism and spatial computing UX.",
    requirements: ["Deep understanding of spatial design", "Proficiency in Figma 3D and Blender", "Strong portfolio of futuristic UI", "UX research in VR/AR environments"],
    postedAt: new Date(),
    active: true
  },
  {
    title: "AI Security Systems Specialist",
    company: "Sentinels Ltd",
    location: "Global Defense Hub",
    salary: "$160k - $210k",
    type: "Full-time",
    category: "DevOps",
    description: "Ensure the integrity of our global AI grid. You will be responsible for defensive protocols against adversarial neural attacks.",
    requirements: ["Mastery of AI security frameworks", "Experience with real-time threat detection", "Proficiency in Python and Go", "Security clearance Level 4 or higher"],
    postedAt: new Date(),
    active: true
  }
];

async function seed() {
  console.log("Seeding initial job data...");
  for (const job of INITIAL_JOBS) {
    await addDoc(collection(db, 'jobs'), job);
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
