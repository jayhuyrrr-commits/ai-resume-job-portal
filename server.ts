import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "NexusAI Backend is running" });
  });

  app.post("/api/ai/generate-summary", async (req, res) => {
    try {
      const { fullName, jobTitle, skills, experience } = req.body;
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const prompt = `Based on these professional details, generate a 2-3 sentence high-impact professional resume summary for a ${jobTitle || 'professional'}. Name: ${fullName}. Skills: ${skills?.join(', ')}. Recent Experience: ${JSON.stringify(experience?.[0] || {})}. Focus on achievements and a futuristic tone.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      res.json({ summary: response.text || "Dedicated professional committed to delivering high-quality results." });
    } catch (error: any) {
      console.error("AI Generation Backend Error:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  app.post("/api/ai/optimize-experience", async (req, res) => {
    try {
      const { position, description } = req.body;
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const prompt = `Rewrite the following job achievement in a more impactful, professional, and action-oriented way for a resume. Position: ${position}. Achievement: ${description}. Use strong action verbs and metrics if possible. Keep it concise.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      res.json({ optimized: response.text || description });
    } catch (error: any) {
      console.error("AI Optimization Backend Error:", error);
      res.status(500).json({ error: "Failed to optimize experience" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NexusAI Server running on http://localhost:${PORT}`);
  });
}

startServer();
