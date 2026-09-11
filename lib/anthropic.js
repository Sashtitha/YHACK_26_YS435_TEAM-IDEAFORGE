let gemini = null;

class NoApiKeyError extends Error {
  constructor() {
    super('GEMINI_API_KEY is not set');
    this.name = 'NoApiKeyError';
  }
}

async function getGemini() {
  if (gemini) return gemini;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new NoApiKeyError();
  }

  const { GoogleGenAI } = await import('@google/genai');

  gemini = new GoogleGenAI({
    apiKey
  });

  return gemini;
}

async function callGeminiJSON({
  system,
  user,
  maxTokens = 4000
}) {
  const ai = await getGemini();

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',

        contents: user,

        config: {
          systemInstruction: system,
          responseMimeType: 'application/json',
          maxOutputTokens: maxTokens,
          temperature: 0.1
        }
      });

      const text = response.text;

      if (!text) {
        throw new Error(
          'Gemini returned an empty response'
        );
      }

      let cleaned = text.trim();

      // Remove accidental Markdown code fences.
      if (cleaned.startsWith('```')) {
        cleaned = cleaned
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
      }

      try {
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error(
          '[Gemini] Invalid JSON response:'
        );

        console.error(cleaned);

        throw new Error(
          'Gemini response was not valid JSON'
        );
      }

    } catch (error) {

      const message =
        String(error?.message || error);

      // ------------------------------------------------------
      // QUOTA ERROR
      // ------------------------------------------------------

      if (
        message.includes('429') ||
        message.includes('RESOURCE_EXHAUSTED') ||
        message.toLowerCase().includes('quota')
      ) {
        console.error(
          '[Gemini] API quota exhausted.'
        );

        throw error;
      }

      // ------------------------------------------------------
      // TEMPORARY SERVER OVERLOAD
      // ------------------------------------------------------

      const temporary =
        message.includes('503') ||
        message.includes('UNAVAILABLE') ||
        message.includes('high demand');

      if (
        !temporary ||
        attempt === 2
      ) {
        throw error;
      }

      console.log(
        `[Gemini] Temporary overload. Retrying (${attempt}/2)...`
      );

      await new Promise(
        resolve =>
          setTimeout(resolve, 2000)
      );
    }
  }
}

module.exports = {
  callGeminiJSON,
  NoApiKeyError
};