declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(config: { apiKey?: string | null; httpOptions?: Record<string, any> });
    models: {
      generateContent(config: {
        model: string;
        contents: any[];
      }): Promise<{ text?: string }>;
    };
  }
}