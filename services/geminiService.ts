import { GoogleGenAI, Schema, Type } from "@google/genai";

// Helper to get API key (simulated for this environment as per instructions)
const getApiKey = () => process.env.API_KEY || '';

export const generateViralMetadata = async (videoTopic: string) => {
  if (!getApiKey()) {
    console.warn("No API Key found");
    return { caption: "Check out this crazy video! 😱", hashtags: ["#shorts", "#viral"] };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a viral, clickbaity short caption and 5 trending hashtags for a TikTok/Reel video about: ${videoTopic}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING, description: "A catchy, short caption under 10 words" },
            hashtags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "5 trending hashtags including #fyp"
            }
          },
          required: ["caption", "hashtags"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error("No text returned");
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return { caption: `Must watch: ${videoTopic} 🔥`, hashtags: ["#viral", "#fyp", "#trending"] };
  }
};

export const generateVeoBackground = async (prompt: string): Promise<string | null> => {
  // NOTE: In a real implementation, we would use window.aistudio.hasSelectedApiKey() flow here
  // For this specific code structure, we assume the key is in process.env as per 'GenAI Coding Guidelines'
  
  if (!getApiKey()) {
    throw new Error("API Key missing for Veo generation");
  }

  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Satisfying abstract geometric shapes moving smoothly, neon colors, dark background',
      config: {
        numberOfVideos: 1,
        resolution: '720p', // 1080p not always available in preview
        aspectRatio: '9:16' // Perfect for shorts
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    // The guidelines state we must append the key when fetching/displaying
    if (videoUri) {
        return `${videoUri}&key=${getApiKey()}`;
    }
    return null;

  } catch (error) {
    console.error("Veo generation failed:", error);
    throw error;
  }
};
