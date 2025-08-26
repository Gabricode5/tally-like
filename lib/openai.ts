import OpenAI from 'openai';

export interface FieldSuggestion {
  type: 'TEXT' | 'EMAIL' | 'NUMBER' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'RADIO';
  label: string;
  required: boolean;
  options?: string[];
}

export interface FormMeta {
  title: string;
  description?: string;
}

export interface SubmissionAnalysis {
  totalSubmissions: number;
  averageFieldsPerSubmission: number;
  mostCommonValues: Record<string, string>;
  insights: string[];
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-your-openai-api-key';
export const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : undefined;

// Mock OpenAI pour le développement et les tests
const mockOpenAI = {
  chat: {
    completions: {
      create: async ({ messages }: any) => ({
        choices: [
          {
            message: {
              content: JSON.stringify([
                {
                  type: 'TEXT',
                  label: 'Nom',
                  required: true,
                },
                {
                  type: 'EMAIL',
                  label: 'Email',
                  required: true,
                },
                {
                  type: 'TEXTAREA',
                  label: 'Message',
                  required: true,
                },
              ]),
            },
          },
        ],
      }),
    },
  },
};

export async function generateFieldSuggestions(formMeta: FormMeta): Promise<FieldSuggestion[]> {
  if (!openai) {
    return getDefaultFieldSuggestions(formMeta);
  }

  try {
    const prompt = `Génère des suggestions de champs pour un formulaire avec le titre "${formMeta.title}" et la description "${formMeta.description || 'Aucune description'}"`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en UX qui suggère des champs de formulaire appropriés. Réponds uniquement avec un JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        return getDefaultFieldSuggestions(formMeta);
      }
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
  }

  return getDefaultFieldSuggestions(formMeta);
}

export async function analyzeSubmissions(submissions: any[]): Promise<SubmissionAnalysis> {
  if (!openai) {
    return getDefaultAnalysis(submissions);
  }

  try {
    const prompt = `Analyse ces soumissions de formulaire et fournis des insights utiles. Réponds uniquement avec un JSON valide.`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un analyste de données qui fournit des insights sur les soumissions de formulaire. Réponds uniquement avec un JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      try {
        return JSON.parse(content);
      } catch {
        return getDefaultAnalysis(submissions);
      }
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
  }

  return getDefaultAnalysis(submissions);
}

function getDefaultFieldSuggestions(formMeta: FormMeta): FieldSuggestion[] {
  return [
    {
      type: 'TEXT',
      label: 'Nom',
      required: true,
    },
    {
      type: 'EMAIL',
      label: 'Email',
      required: true,
    },
    {
      type: 'TEXTAREA',
      label: 'Message',
      required: true,
    },
  ];
}

function getDefaultAnalysis(submissions: any[]): SubmissionAnalysis {
  return {
    totalSubmissions: submissions.length,
    averageFieldsPerSubmission: submissions.length > 0 ? submissions[0]?.answers?.length || 0 : 0,
    mostCommonValues: {},
    insights: [
      'Analyse basée sur les données disponibles',
      'Utilisez OpenAI pour des insights plus détaillés',
    ],
  };
}
