/**
 * AI Service for communicating with the backend AI endpoints.
 * This ensures the API key remains secure on the server.
 */

export async function generateResumeSummary(data: any) {
  try {
    const response = await fetch('/api/ai/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result.summary;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "I am a dedicated professional with a strong background in my field, committed to delivering high-quality results and continuous growth.";
  }
}

export async function optimizeExperienceDescription(position: string, description: string) {
  try {
    const response = await fetch('/api/ai/optimize-experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position, description })
    });
    const result = await response.json();
    return result.optimized;
  } catch (error) {
    console.error("AI Service Error:", error);
    return description;
  }
}
