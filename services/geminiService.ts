import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Book } from "../types";

// Ensure API KEY is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const bookSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Official title of the book" },
    author: { type: Type.STRING, description: "Full name of the author" },
    year: { type: Type.INTEGER, description: "Year of original publication" },
    genre: { type: Type.STRING, description: "Primary genre (e.g., Ficção, Biografia, Técnico)" },
    publisher: { type: Type.STRING, description: "Publisher company name (Editora). If unknown, estimate based on classic editions or leave empty." },
    summary: { type: Type.STRING, description: "A concise 2-sentence summary in Portuguese" }
  },
  required: ["title", "author", "year", "genre", "summary"],
};

const bookListSchema: Schema = {
  type: Type.ARRAY,
  items: bookSchema
};

export const enrichBookData = async (query: string): Promise<Partial<Book> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Identify the book details for: "${query}". Return the details in Portuguese, including the most likely Publisher (Editora).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: bookSchema,
        systemInstruction: "You are a helpful librarian assistant. Always provide accurate book data in Portuguese."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Book>;
    }
    return null;
  } catch (error) {
    console.error("Error enriching book data:", error);
    throw error;
  }
};

export const parseBookList = async (rawData: string): Promise<Partial<Book>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analise este texto bruto que veio de uma planilha (CSV ou copiado e colado).
        Extraia uma lista de livros.
        
        DADOS BRUTOS:
        ${rawData}
        
        INSTRUÇÕES:
        1. Identifique Título, Autor, Ano, Editora (Publisher) e Gênero se houver.
        2. Se o Ano, Autor ou Gênero estiver faltando, use seu conhecimento para preencher.
        3. Gere um resumo curto (summary) para cada livro.
        4. Ignore cabeçalhos como "Título, Autor, etc".
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: bookListSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Book>[];
    }
    return [];
  } catch (error) {
    console.error("Error parsing bulk list:", error);
    throw error;
  }
};

export const chatWithLibrary = async (
  message: string,
  libraryContext: Book[],
  history: { role: string; parts: { text: string }[] }[]
) => {
  try {
    // Create a lightweight context of the user's library
    const librarySummary = libraryContext.map(b => 
      `- "${b.title}" de ${b.author} (${b.year}, ${b.publisher || 'Ed. Desconhecida'})`
    ).join('\n');

    const systemInstruction = `
      Você é o bibliotecário pessoal da "Biblioteca Particular W&D".
      O usuário possui os seguintes livros na coleção:
      ${librarySummary}
      
      Responda a perguntas sobre a coleção, sugira leituras baseadas nela, 
      ou discuta sobre os autores presentes. Seja conciso, educado e responda sempre em Português.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "Desculpe, tive um problema ao consultar sua biblioteca. Tente novamente.";
  }
};