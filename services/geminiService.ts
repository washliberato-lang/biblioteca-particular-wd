
import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Função para gerar detalhes ricos no modal
export const getDetailedBookReview = async (book: Book): Promise<string> => {
  try {
    const prompt = `
      Atue como um crítico literário sênior e especialista.
      Escreva uma análise envolvente e profunda (aprox. 150 palavras) sobre o livro:
      
      Título: "${book.title}"
      Autor: "${book.author}"
      Ano: ${book.year}
      
      O foco deve ser:
      1. A importância da obra.
      2. Temas principais.
      3. Por que vale a pena ler.
      
      Não use markdown complexo, apenas texto corrido com parágrafos. Responda em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Error generating review:", error);
    return "Erro ao conectar com a Inteligência Artificial.";
  }
};

export const chatWithLibrary = async (
  message: string,
  libraryContext: Book[],
  history: { role: string; parts: { text: string }[] }[]
) => {
  try {
    const librarySummary = libraryContext.map(b => 
      `- "${b.title}" de ${b.author} (${b.genre})`
    ).join('\n');

    const systemInstruction = `
      Você é o bibliotecário da coleção "W&D".
      Acervo disponível:
      ${librarySummary}
      
      Responda perguntas sobre o acervo. Seja culto, educado e inspire a leitura.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history: history.map(h => ({ role: h.role, parts: h.parts }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "Desculpe, o bibliotecário está indisponível no momento.";
  }
};

export const enrichBookData = async (query: string): Promise<Partial<Book> | null> => {
  try {
    const prompt = `Identifique o livro baseado na busca: "${query}". Retorne os dados em JSON.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            year: { type: Type.INTEGER },
            genre: { type: Type.STRING },
            publisher: { type: Type.STRING },
            summary: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error enriching book:", error);
    return null;
  }
};

export const parseBookList = async (listText: string): Promise<Partial<Book>[]> => {
  try {
    const prompt = `Analise o texto e extraia uma lista de livros em JSON. Texto: ${listText}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              year: { type: Type.INTEGER },
              genre: { type: Type.STRING },
              publisher: { type: Type.STRING },
              summary: { type: Type.STRING },
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error parsing book list:", error);
    return [];
  }
};