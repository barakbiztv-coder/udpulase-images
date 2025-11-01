
import { GoogleGenAI, Modality } from "@google/genai";
import type { Part } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImageWithPrompt = async (imagePart: Part, prompt: string): Promise<string> => {
    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstCandidate = response.candidates?.[0];
        if (!firstCandidate) {
            throw new Error("לא התקבלו תוצאות מהמודל.");
        }

        const imageOutputPart = firstCandidate.content.parts.find(part => part.inlineData);

        if (imageOutputPart && imageOutputPart.inlineData) {
            return imageOutputPart.inlineData.data;
        } else {
            // Check for safety ratings or other reasons for no output
            const safetyRatings = firstCandidate.safetyRatings;
            if(safetyRatings && safetyRatings.some(rating => rating.probability !== 'NEGLIGIBLE')) {
                throw new Error("התוכן נחסם עקב מדיניות בטיחות.");
            }
            throw new Error("לא נמצאה תמונה בתגובת המודל.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("שגיאה בתקשורת עם שירות התמונות.");
    }
};
