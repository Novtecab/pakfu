import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateListingImage(prompt: string, style?: string): Promise<string | null> {
  try {
    const fullPrompt = style 
      ? `High-quality automotive photography: ${prompt}, ${style} style, professional lighting, centered composition, photorealistic, 4k resolution.`
      : `High-quality automotive photography: ${prompt}, professional lighting, centered composition, photorealistic, 4k resolution.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
