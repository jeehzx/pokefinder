/**
 * Traduz texto de inglês para português usando APIs gratuitas
 * Esta função funciona em Server Components do Next.js (sem problemas de CORS)
 * @param text - Texto em inglês para traduzir
 * @returns Promise com o texto traduzido em português, ou o texto original em caso de erro
 */
export async function translateDescription(text: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    return text;
  }

  // Limpar texto: remover caracteres especiais e normalizar espaços
  const cleanText = text
    .replace(/\f/g, ' ') // Substituir form feed por espaço
    .replace(/\n/g, ' ') // Substituir quebras de linha por espaço
    .replace(/\s+/g, ' ') // Normalizar múltiplos espaços
    .trim();

  if (cleanText.length === 0) {
    return text; // Retornar original se ficar vazio após limpeza
  }

  // Método 1: Tentar MyMemory Translation API (mais confiável e gratuito)
  try {
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|pt`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos
    
    const response = await fetch(myMemoryUrl, {
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache por 24 horas
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.responseData && data.responseData.translatedText) {
        const translated = data.responseData.translatedText.trim();
        // Verificar se a tradução é diferente do original e não está vazia
        if (translated && 
            translated.toLowerCase() !== cleanText.toLowerCase() &&
            translated.length > 0) {
          return translated;
        }
      }
    }
  } catch (error) {
    // Continuar para próximo método
  }

  // Método 2: Tentar LibreTranslate (fallback)
  const libreTranslateEndpoints = [
    'https://libretranslate.com/translate',
    'https://libretranslate.de/translate',
  ];

  for (const endpoint of libreTranslateEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: cleanText,
          source: 'en',
          target: 'pt',
          format: 'text',
        }),
        signal: controller.signal,
        next: { revalidate: 86400 }, // Cache por 24 horas
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.translatedText && 
            data.translatedText !== cleanText &&
            data.translatedText.trim().length > 0) {
          return data.translatedText.trim();
        }
      }
    } catch (error) {
      // Tentar próximo endpoint
      continue;
    }
  }

  // Se todos os métodos falharem, retornar texto original
  return text;
}

