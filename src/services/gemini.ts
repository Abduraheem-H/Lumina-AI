import { GoogleGenAI } from '@google/genai';
import { Message } from '../types/chat';

const apiKey = process.env.GEMINI_API_KEY;

export async function generateChatResponse(messages: Message[]) {
  if (!apiKey) {
    throw new Error('Gemini API key is missing.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const history = messages.slice(0, -1).map((message) => ({
    role: message.role === 'user' ? 'user' : 'model',
    parts: [{ text: message.content }],
  }));

  const lastMessage = messages[messages.length - 1].content;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts: [{ text: lastMessage }] }],
  });

  return response.text || 'Sorry, I was unable to respond.';
}