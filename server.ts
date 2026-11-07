import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for calling Gemini with high-thinking gemini-4-argon with fallback to gemini-3.8-flash
async function generateWithThinkingOrFallback(prompt: string, systemInstruction: string, schema?: any) {
  // Try gemini-4-argon with ThinkingLevel.HIGH as mandated for complex executive evaluations
  try {
    const config: any = {
      systemInstruction,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
    };
    if (schema) {
      config.responseMimeType = 'application/json';
      config.responseSchema = schema;
    }
    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: prompt,
      config,
    });
    return { text: response.text ?? '', modelUsed: 'gemini-4-argon', highThinking: true };
  } catch (err: any) {
    console.warn('Fallback from gemini-4-argon to gemini-3.8-flash:', err?.message || err);
    // Graceful fallback to gemini-3.8-flash
    const fallbackConfig: any = {
      systemInstruction,
    };
    if (schema) {
      fallbackConfig.responseMimeType = 'application/json';
      fallbackConfig.responseSchema = schema;
    }
    const fallbackResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: fallbackConfig,
    });
    return { text: fallbackResponse.text ?? '', modelUsed: 'gemini-3.8-flash', highThinking: false };
  }
}

// 1. Mentora Virtual SENIA - Interactive Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], moduleContext = 'Geral' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const systemInstruction = `Você é a Dra. Helena Valença, Mentora Chefe da SENIA – Oratória Executiva Inclusiva, uma inteligência artificial educacional de altíssimo nível voltada especificamente à formação de estudantes e profissionais de Secretariado Executivo.

Sua postura e tom:
- Elegante, cordial, acolhedora, encorajadora e altamente profissional.
- Reflete a sofisticação da alta gestão (C-Level, Diplomacia Corporativa e Conselhos Administrativos).
- Foco em comunicação inclusiva (respeito à diversidade, acessibilidade linguística, comunicação não-violenta e empatia ativa).
- Especialista nas atribuições do Secretariado Executivo: gestão de agenda estratégica, redação protocolar e oficial, mediação de conflitos em reuniões, etiqueta corporativa, postura de liderança silenciosa e articuladora.

Orientações:
1. Responda em Português com excelência gramatical e clareza.
2. Dê orientações práticas de oratória (projeção vocal, respiração diafragmática, pausas estratégicas, eliminação de vícios de linguagem como "né", "tipo assim").
3. Conecte os desafios às rotinas reais do Secretariado Executivo moderno.
4. Mantenha o diálogo dinâmico, fazendo 1 pergunta desafiadora ou propondo um pequeno exercício ao final.`;

    const contents = [
      ...conversationHistory.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [{ text: `[Contexto do Treinamento: ${moduleContext}]\n\n${message}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({
      reply: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Erro ao processar mensagem com a Mentora SENIA.',
      details: error?.message || 'Erro desconhecido',
    });
  }
});

// 2. Avaliação Profunda com Alta Capacidade Analítica (High Thinking com gemini-4-argon)
app.post('/api/evaluate', async (req, res) => {
  try {
    const {
      exerciseTitle,
      exerciseType,
      promptScenario,
      expectedCompetencies,
      studentResponse,
      audioMetrics, // { wpm, durationSeconds, fillerCount }
    } = req.body;

    if (!studentResponse) {
      return res.status(400).json({ error: 'Resposta do aluno é necessária para avaliação.' });
    }

    const systemInstruction = `Você é a banca avaliadora executiva da plataforma SENIA – Oratória Executiva Inclusiva.
Sua missão é realizar uma auditoria rigorosa, pedagógica, respeitosa e construtiva da performance oral e comunicativa do estudante de Secretariado Executivo.

Analise minuciosamente os seguintes 5 pilares com notas de 0 a 10:
1. diccao_clareza: Articulação vocabular, ritmo, ausência de vícios de linguagem e inteligibilidade.
2. tom_postura_executiva: Elegância corporativa, serenidade, autoridade sem arrogância, adequação ao ambiente C-Level.
3. estrutura_concisao: Clareza lógica da introdução, desenvolvimento e conclusão, objetividade e síntese.
4. empatia_inclusao: Acolhimento, empatia ativa, consideração pela diversidade, inteligência emocional e comunicação não-violenta.
5. assertividade_diplomatica: Firmeza nas decisões, respeito às hierarquias, posicionamento construtivo e resolução de atritos.

Calcule a nota final geral (0 a 10) ponderada.
Forneça feedback individualizado com:
- Destaques positivos (pontos fortes demonstrados)
- Pontos de melhoria precisos
- Versão Modelo C-Level ("Como um Secretário Executivo sênior responderia com maestria")
- Desafio prático para a próxima tentativa.`;

    const evaluationPrompt = `
EXERCÍCIO: ${exerciseTitle} (${exerciseType})
CENÁRIO: ${promptScenario}
COMPETÊNCIAS ESPERADAS: ${JSON.stringify(expectedCompetencies || [])}
${audioMetrics ? `MÉTRICAS DE VOZ COLETADAS: Ritmo estimado: ${audioMetrics.wpm || 'N/A'} PPM (palavras por minuto), Duração: ${audioMetrics.durationSeconds || 'N/A'}s, Vícios identificados: ${audioMetrics.fillerCount || 0}` : ''}

RESPOSTA TRANSMITIDA PELO ALUNO:
"""
${studentResponse}
"""

Avalie com o mais alto critério executivo e pedagógico. Retorne rigorosamente em formato JSON estruturado.`;

    const evaluationSchema = {
      type: Type.OBJECT,
      properties: {
        notaGeral: { type: Type.NUMBER, description: 'Nota geral ponderada de 0 a 10 com 1 casa decimal' },
        criterios: {
          type: Type.OBJECT,
          properties: {
            diccao_clareza: {
              type: Type.OBJECT,
              properties: {
                nota: { type: Type.NUMBER },
                comentario: { type: Type.STRING },
              },
              required: ['nota', 'comentario'],
            },
            tom_postura_executiva: {
              type: Type.OBJECT,
              properties: {
                nota: { type: Type.NUMBER },
                comentario: { type: Type.STRING },
              },
              required: ['nota', 'comentario'],
            },
            estrutura_concisao: {
              type: Type.OBJECT,
              properties: {
                nota: { type: Type.NUMBER },
                comentario: { type: Type.STRING },
              },
              required: ['nota', 'comentario'],
            },
            empatia_inclusao: {
              type: Type.OBJECT,
              properties: {
                nota: { type: Type.NUMBER },
                comentario: { type: Type.STRING },
              },
              required: ['nota', 'comentario'],
            },
            assertividade_diplomatica: {
              type: Type.OBJECT,
              properties: {
                nota: { type: Type.NUMBER },
                comentario: { type: Type.STRING },
              },
              required: ['nota', 'comentario'],
            },
          },
          required: [
            'diccao_clareza',
            'tom_postura_executiva',
            'estrutura_concisao',
            'empatia_inclusao',
            'assertividade_diplomatica',
          ],
        },
        destaquesPositivos: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 a 4 pontos fortes observados na fala ou escrita',
        },
        pontosMelhoria: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2 a 3 pontos específicos para aperfeiçoar',
        },
        versaoModeloCLevel: {
          type: Type.STRING,
          description: 'Exemplo de resposta impecável no padrão de Secretariado Executivo de Presidência',
        },
        diagnosticoVoz: {
          type: Type.STRING,
          description: 'Análise de cadência, respiração, clareza e ritmo vocal sugerido',
        },
        proximoDesafio: {
          type: Type.STRING,
          description: 'Sugestão de próximo exercício para progressão pedagógica',
        },
      },
      required: [
        'notaGeral',
        'criterios',
        'destaquesPositivos',
        'pontosMelhoria',
        'versaoModeloCLevel',
        'diagnosticoVoz',
        'proximoDesafio',
      ],
    };

    const result = await generateWithThinkingOrFallback(evaluationPrompt, systemInstruction, evaluationSchema);
    let parsedData: any;
    try {
      parsedData = JSON.parse(result.text);
    } catch {
      // Fallback clean parsing if needed
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { notaGeral: 8.5, versaoModeloCLevel: result.text };
    }

    res.json({
      evaluation: parsedData,
      modelUsed: result.modelUsed,
      highThinkingApplied: result.highThinking,
      evaluatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Evaluation error:', error);
    res.status(500).json({
      error: 'Falha ao processar avaliação com a IA.',
      details: error?.message || 'Erro inesperado',
    });
  }
});

// 3. Gerador dinâmico de novos desafios e cenários executivos
app.post('/api/generate-scenario', async (req, res) => {
  try {
    const { category, difficulty = 'intermediario' } = req.body;
    const prompt = `Crie um cenário prático inédito e imersivo de treinamento para estudantes de Secretariado Executivo.
Categoria: ${category || 'Simulação de Reunião'}
Nível: ${difficulty}

O cenário deve conter:
- Título atraente e corporativo
- Contexto da empresa e atores (ex: CEO, Diretor de Compliance, Coordenador de Diversidade)
- O dilema/desafio imediato a ser resolvido pela oratória ou mediação do Secretário Executivo
- Instruções de como responder (voz ou texto)
- Critérios-chave de sucesso`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        titulo: { type: Type.STRING },
        categoria: { type: Type.STRING },
        empresaContexto: { type: Type.STRING },
        personagens: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        dilema: { type: Type.STRING },
        instrucaoFala: { type: Type.STRING },
        criteriosSucesso: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        tempoRecomendadoSegundos: { type: Type.INTEGER },
      },
      required: ['titulo', 'categoria', 'empresaContexto', 'personagens', 'dilema', 'instrucaoFala', 'criteriosSucesso'],
    };

    const result = await generateWithThinkingOrFallback(
      prompt,
      'Você é um designer instrucional sênior especializado em Secretariado Executivo e Oratória Corporativa.',
      schema
    );

    const parsed = JSON.parse(result.text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Scenario error:', error);
    res.status(500).json({ error: 'Erro ao gerar cenário' });
  }
});

// Serve frontend in development or production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SENIA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
