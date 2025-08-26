import { generateFieldSuggestions, analyzeSubmissions } from '@/lib/openai';

// Mock OpenAI
jest.mock('openai', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
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
        }),
      },
    },
  })),
}));

describe('OpenAI Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateFieldSuggestions', () => {
    it('should generate field suggestions for contact form', async () => {
      const formMeta = {
        title: 'Formulaire de contact',
        description: 'Contactez-nous pour toute question',
      };

      const suggestions = await generateFieldSuggestions(formMeta);

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0]).toHaveProperty('id');
      expect(suggestions[0]).toHaveProperty('type');
      expect(suggestions[0]).toHaveProperty('label');
      expect(suggestions[0]).toHaveProperty('required');
    });

    it('should return default suggestions when OpenAI is not configured', async () => {
      // Simuler l'absence de clé OpenAI
      const originalEnv = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const formMeta = { title: 'Test Form' };
      const suggestions = await generateFieldSuggestions(formMeta);

      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBeGreaterThan(0);

      // Restaurer l'environnement
      process.env.OPENAI_API_KEY = originalEnv;
    });
  });

  describe('analyzeSubmissions', () => {
    it('should analyze submissions and return insights', async () => {
      const mockSubmissions = [
        {
          id: '1',
          answers: [
            { fieldId: '1', value: 'John Doe' },
            { fieldId: '2', value: 'john@example.com' },
          ],
          createdAt: new Date(),
        },
        {
          id: '2',
          answers: [
            { fieldId: '1', value: 'Jane Smith' },
            { fieldId: '2', value: 'jane@example.com' },
          ],
          createdAt: new Date(),
        },
      ];

      const analysis = await analyzeSubmissions(mockSubmissions);

      expect(analysis).toBeDefined();
      expect(analysis.totalSubmissions).toBe(2);
      expect(analysis.completionRate).toBeGreaterThan(0);
      expect(Array.isArray(analysis.insights)).toBe(true);
    });

    it('should handle empty submissions', async () => {
      const analysis = await analyzeSubmissions([]);

      expect(analysis.totalSubmissions).toBe(0);
      expect(analysis.completionRate).toBe(0);
      expect(analysis.insights).toContain('Aucune soumission pour le moment');
    });
  });
});
