import OpenAI from 'openai';

// Types pour les suggestions de champs
export interface FieldSuggestion {
  id: string;
  type: 'TEXT' | 'EMAIL' | 'NUMBER' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'RADIO';
  label: string;
  required: boolean;
  options?: string[]; // Pour SELECT et RADIO
  placeholder?: string;
}

export interface FormMeta {
  title: string;
  description?: string;
  category?: string;
}

export interface SubmissionAnalysis {
  totalSubmissions: number;
  completionRate: number;
  averageTimeToComplete?: number;
  topResponses: Record<string, string[]>;
  insights: string[];
}

// Configuration OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('OPENAI_API_KEY missing in production');
}

// Client OpenAI (undefined en dev/test pour utiliser les mocks)
export const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : undefined;

// Mock pour le développement et les tests
const mockOpenAI = {
  chat: {
    completions: {
      create: async (params: any) => {
        if (process.env.NODE_ENV === 'test') {
          // Retourner des réponses mockées pour les tests
          return {
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    fields: [
                      { id: '1', type: 'TEXT', label: 'Nom complet', required: true },
                      { id: '2', type: 'EMAIL', label: 'Email', required: true },
                    ],
                  }),
                },
              },
            ],
          };
        }
        throw new Error('OpenAI not configured');
      },
    },
  },
};

const client = openai || mockOpenAI;

/**
 * Génère des suggestions de champs basées sur les métadonnées du formulaire
 */
export async function generateFieldSuggestions(formMeta: FormMeta): Promise<FieldSuggestion[]> {
  if (!OPENAI_API_KEY) {
    // Retourner des suggestions par défaut si OpenAI n'est pas configuré
    return getDefaultFieldSuggestions(formMeta);
  }

  try {
    const prompt = `Génère 3-5 suggestions de champs pour un formulaire "${formMeta.title}"${formMeta.description ? ` (${formMeta.description})` : ''}.
    
    Retourne uniquement un JSON valide avec cette structure:
    {
      "fields": [
        {
          "id": "unique_id",
          "type": "TEXT|EMAIL|NUMBER|TEXTAREA|SELECT|CHECKBOX|RADIO",
          "label": "Label du champ",
          "required": true/false,
          "options": ["option1", "option2"] // seulement pour SELECT/RADIO
        }
      ]
    }`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    const parsed = JSON.parse(content);
    return parsed.fields || [];
  } catch (error) {
    console.error('OpenAI field suggestions error:', error);
    return getDefaultFieldSuggestions(formMeta);
  }
}

/**
 * Analyse les soumissions pour générer des insights
 */
export async function analyzeSubmissions(submissions: any[]): Promise<SubmissionAnalysis> {
  if (!OPENAI_API_KEY || submissions.length === 0) {
    return getDefaultAnalysis(submissions);
  }

  try {
    // Préparer les données pour l'analyse
    const submissionData = submissions.map(sub => ({
      id: sub.id,
      answers: sub.answers,
      createdAt: sub.createdAt,
    }));

    const prompt = `Analyse ces ${submissions.length} soumissions de formulaire et génère des insights.
    
    Données: ${JSON.stringify(submissionData, null, 2)}
    
    Retourne uniquement un JSON valide avec cette structure:
    {
      "totalSubmissions": number,
      "completionRate": number (0-100),
      "averageTimeToComplete": number (en secondes, optionnel),
      "topResponses": { "fieldId": ["réponse1", "réponse2"] },
      "insights": ["insight1", "insight2", "insight3"]
    }`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    const parsed = JSON.parse(content);
    return {
      totalSubmissions: parsed.totalSubmissions || submissions.length,
      completionRate: parsed.completionRate || 100,
      averageTimeToComplete: parsed.averageTimeToComplete,
      topResponses: parsed.topResponses || {},
      insights: parsed.insights || ['Aucune donnée suffisante pour l\'analyse'],
    };
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return getDefaultAnalysis(submissions);
  }
}

// Fonctions de fallback
function getDefaultFieldSuggestions(formMeta: FormMeta): FieldSuggestion[] {
  const suggestions: FieldSuggestion[] = [
    { id: '1', type: 'TEXT', label: 'Nom complet', required: true },
    { id: '2', type: 'EMAIL', label: 'Email', required: true },
  ];

  // Ajouter des suggestions basées sur le titre
  const title = formMeta.title.toLowerCase();
  if (title.includes('contact') || title.includes('demande')) {
    suggestions.push(
      { id: '3', type: 'TEXTAREA', label: 'Message', required: true },
      { id: '4', type: 'SELECT', label: 'Sujet', required: true, options: ['Général', 'Support', 'Commercial'] }
    );
  } else if (title.includes('inscription') || title.includes('register')) {
    suggestions.push(
      { id: '3', type: 'TEXT', label: 'Téléphone', required: false },
      { id: '4', type: 'SELECT', label: 'Source', required: false, options: ['Site web', 'Réseaux sociaux', 'Recommandation'] }
    );
  }

  return suggestions;
}

function getDefaultAnalysis(submissions: any[]): SubmissionAnalysis {
  return {
    totalSubmissions: submissions.length,
    completionRate: submissions.length > 0 ? 100 : 0,
    topResponses: {},
    insights: submissions.length > 0 
      ? [`${submissions.length} soumission(s) reçue(s)`]
      : ['Aucune soumission pour le moment'],
  };
}
