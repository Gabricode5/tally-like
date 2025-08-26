import { NextRequest } from 'next/server';
import { POST as suggestionsHandler } from '@/app/api/ai/suggestions/route';
import { GET as analysisHandler } from '@/app/api/forms/[id]/analysis/route';

// Mock OpenAI
jest.mock('@/lib/openai', () => ({
  generateFieldSuggestions: jest.fn().mockResolvedValue([
    { id: '1', type: 'TEXT', label: 'Nom complet', required: true },
    { id: '2', type: 'EMAIL', label: 'Email', required: true },
  ]),
  analyzeSubmissions: jest.fn().mockResolvedValue({
    totalSubmissions: 10,
    completionRate: 95,
    insights: ['Tendance positive'],
    topResponses: {},
  }),
}));

// Mock RBAC
jest.mock('@/lib/rbac', () => ({
  requireAuth: jest.fn().mockResolvedValue('user123'),
  requireFormAccess: jest.fn().mockResolvedValue('user123'),
}));

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    submission: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          answers: [{ fieldId: '1', value: 'John Doe' }],
          createdAt: new Date(),
        },
      ]),
    },
  },
}));

describe('AI API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/ai/suggestions', () => {
    it('should generate field suggestions', async () => {
      const req = new NextRequest('http://localhost/api/ai/suggestions', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Formulaire de contact',
          description: 'Contactez-nous',
        }),
      });

      const response = await suggestionsHandler(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.suggestions).toBeDefined();
      expect(Array.isArray(data.suggestions)).toBe(true);
      expect(data.suggestions.length).toBeGreaterThan(0);
    });

    it('should return 400 for missing title', async () => {
      const req = new NextRequest('http://localhost/api/ai/suggestions', {
        method: 'POST',
        body: JSON.stringify({ description: 'Test' }),
      });

      const response = await suggestionsHandler(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('MISSING_TITLE');
    });
  });

  describe('GET /api/forms/[id]/analysis', () => {
    it('should return form analysis', async () => {
      const req = new NextRequest('http://localhost/api/forms/form123/analysis');
      const params = { id: 'form123' };

      const response = await analysisHandler(req, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.totalSubmissions).toBe(10);
      expect(data.completionRate).toBe(95);
      expect(Array.isArray(data.insights)).toBe(true);
    });

    it('should handle form not found', async () => {
      const { requireFormAccess } = require('@/lib/rbac');
      requireFormAccess.mockRejectedValue(new Error('NOT_FOUND'));

      const req = new NextRequest('http://localhost/api/forms/form123/analysis');
      const params = { id: 'form123' };

      const response = await analysisHandler(req, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('NOT_FOUND');
    });

    it('should handle forbidden access', async () => {
      const { requireFormAccess } = require('@/lib/rbac');
      requireFormAccess.mockRejectedValue(new Error('FORBIDDEN'));

      const req = new NextRequest('http://localhost/api/forms/form123/analysis');
      const params = { id: 'form123' };

      const response = await analysisHandler(req, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('FORBIDDEN');
    });
  });
});
