import { GoogleGenAI } from '@google/genai';

export const analyzeResume = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }

  // Initialize the Google Gen AI SDK
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const prompt = `
      You are an expert technical recruiter and AI Career Assistant.
      I will provide you with the raw text extracted from a student's resume.
      Your task is to analyze it and extract the following information in strict JSON format.
      Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON string.
      
      Extract the following fields:
      - "name": The student's full name. If not found, return an empty string.
      - "roll": The student's college Roll Number, Student ID, or Registration Number (e.g. 24CSB0B36). If not found, return an empty string.
      - "college": The student's college or university. If not found, return an empty string.
      - "branch": The student's degree, major, or branch (e.g., Computer Science, Mechanical). If not found, return an empty string.
      - "cgpa": The student's CGPA or GPA as a number (e.g. 8.5 or 3.8). Extract only the numerical decimal value. If written as a percentage (e.g. 85%), convert it to a 10-point scale (e.g. 8.5). If not found or not specified, return 0.
      - "skills": An array of technical skills mentioned (e.g., ["JavaScript", "React", "Python"]).
      - "aiReadinessScore": A number from 0 to 100 indicating how "placement-ready" the resume looks based on standard industry expectations for entry-level tech roles.
      - "aiRoadmap": An array of 3 to 5 actionable steps the student can take to improve their skills and resume (e.g., ["Build a full-stack project using React and Node.js", "Contribute to open-source projects"]).

      Resume Text:
      """
      ${resumeText}
      """
    `;

    let response;
    let retries = 3;
    let delay = 1500;

    for (let i = 0; i < retries; i++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        break; // Success, break the retry loop
      } catch (err) {
        console.warn(`⚠️ Gemini API Attempt ${i + 1} failed:`, err.message || err);
        if (i === retries - 1) {
          throw err; // Re-throw the error if it was the final attempt
        }
        // Wait with exponential backoff before next attempt
        await new Promise(res => setTimeout(res, delay * (i + 1)));
      }
    }
    
    let textOutput = response.text;
    
    // Clean up any potential markdown formatting
    textOutput = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Robust extraction of JSON block to prevent SyntaxError
    const firstBrace = textOutput.indexOf('{');
    const lastBrace = textOutput.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        textOutput = textOutput.substring(firstBrace, lastBrace + 1);
    }
    
    const parsedData = JSON.parse(textOutput);
    return parsedData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze resume with AI.");
  }
};
