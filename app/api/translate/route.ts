import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Texto inválido' },
        { status: 400 }
      );
    }

    // Limpar texto: remover caracteres especiais e normalizar espaços
    const cleanText = text
      .replace(/\f/g, ' ') // Substituir form feed por espaço
      .replace(/\n/g, ' ') // Substituir quebras de linha por espaço
      .replace(/\s+/g, ' ') // Normalizar múltiplos espaços
      .trim();

    if (cleanText.length === 0) {
      return NextResponse.json({ translatedText: text });
    }

    // Tentar múltiplos endpoints do LibreTranslate
    const endpoints = [
      'https://libretranslate.com/translate',
      'https://libretranslate.de/translate',
    ];

    for (const endpoint of endpoints) {
      try {
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
        });

        if (response.ok) {
          const data = await response.json();
          if (data.translatedText) {
            return NextResponse.json({ translatedText: data.translatedText });
          }
        }
      } catch (error) {
        // Tentar próximo endpoint
        continue;
      }
    }

    // Se todos os endpoints falharem, retornar texto original
    return NextResponse.json({ translatedText: text });
  } catch (error) {
    console.error('Erro na API de tradução:', error);
    return NextResponse.json(
      { error: 'Erro ao traduzir texto' },
      { status: 500 }
    );
  }
}

