import { GoogleGenAI } from "@google/genai";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemma-3-1b-it";

let conversationHistory = [];

async function runChat(userInput) {
  if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY environment variable");
    return "Sorry, I encountered an error processing your request.";
  }

  // Add the new user message to conversation history
  conversationHistory.push({
    role: "user",
    parts: [{ text: userInput }],
  });

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const config = {
    responseMimeType: "text/plain",
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config,
      contents: conversationHistory,
    });

    const aiMessage = response.text;
    conversationHistory.push({
      role: "model",
      parts: [{ text: aiMessage }],
    });

    return aiMessage;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return "Sorry, I encountered an error processing your request.";
  }
}

function clearChatHistory() {
  conversationHistory = [];
  return "Conversation history cleared.";
}

export default runChat;
export { clearChatHistory };
