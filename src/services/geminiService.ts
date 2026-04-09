import { GoogleGenAI, Type } from "@google/genai";
import { StrategistResponse } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAIInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it to your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getRecommendations(
  userRequest: string,
  budget?: string,
  mainUse?: string,
  associateId: string = "default-21"
): Promise<StrategistResponse> {
  const ai = getAIInstance();
  const prompt = `
    Analizza la seguente richiesta dell'utente per prodotti su Amazon: "${userRequest}"
    ${budget ? `Budget: ${budget}` : ""}
    ${mainUse ? `Uso principale: ${mainUse}` : ""}

    REGOLE DI FERRO:
    1. Se l'utente non ha specificato chiaramente il budget o l'uso principale, imposta "needsMoreInfo" a true e chiedi i dettagli mancanti in "question".
    2. Se hai abbastanza informazioni, proponi esattamente 3 prodotti:
       - IL BEST-BUY: Il prodotto più recensito e con il miglior rapporto qualità/prezzo.
       - IL PROFESSIONALE: La scelta premium per chi vuole il massimo.
       - L'AFFARE DEL MOMENTO: Un'opzione economica ma affidabile.
    3. Per ogni prodotto, fornisci:
       - Nome Esatto
       - Perché comprarlo (beneficio chiave)
       - Punto debole (onesto, per costruire fiducia)
       - Link Amazon (usa il formato: https://www.amazon.it/dp/ASIN/?tag=${associateId} - inventa un ASIN verosimile se non lo conosci, o usa un placeholder realistico).
    4. Genera anche un "copyText" pronto per essere incollato su social/chat. 
       Il formato del copyText DEVE essere esattamente questo per ogni prodotto:
       
       *TIPO PRODOTTO* (es. 🏆 IL BEST-BUY)
       **Nome Esatto:** [Nome]
       **Perché comprarlo:** [Beneficio]
       **Punto debole:** [Difetto onesto]
       Controlla il prezzo e la disponibilità qui: [LINK-AMAZON]
       
       Usa i grassetti per i punti chiave e mantieni un tono da "Smart-Shopping Strategist".
    5. Usa un tono amichevole, esperto e sintetico.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          needsMoreInfo: { type: Type.BOOLEAN },
          question: { type: Type.STRING },
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["BEST-BUY", "PROFESSIONAL", "AFFARE DEL MOMENTO"] },
                name: { type: Type.STRING },
                whyBuy: { type: Type.STRING },
                weakPoint: { type: Type.STRING },
                amazonLink: { type: Type.STRING },
              },
              required: ["type", "name", "whyBuy", "weakPoint", "amazonLink"],
            },
          },
          copyText: { type: Type.STRING },
        },
        required: ["needsMoreInfo"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as StrategistResponse;
}
