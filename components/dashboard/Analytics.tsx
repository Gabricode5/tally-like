'use client';

import { useState, useEffect } from 'react';
import { SubmissionAnalysis } from '@/lib/openai';

interface AnalyticsProps {
  formId: string;
}

export default function Analytics({ formId }: AnalyticsProps) {
  const [analysis, setAnalysis] = useState<SubmissionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [formId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forms/${formId}/analysis`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'analyse');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Impossible de charger l\'analyse pour le moment');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Analyse en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAnalysis}
          className="mt-2 text-blue-600 hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 text-center text-gray-600">
        Aucune donnée d'analyse disponible
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total soumissions</h3>
          <p className="text-2xl font-bold text-gray-900">{analysis.totalSubmissions}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Taux de completion</h3>
          <p className="text-2xl font-bold text-gray-900">{analysis.completionRate}%</p>
        </div>
        
        {analysis.averageTimeToComplete && (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Temps moyen</h3>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(analysis.averageTimeToComplete)}s
            </p>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Insights IA</h3>
        <div className="space-y-3">
          {analysis.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Réponses populaires */}
      {Object.keys(analysis.topResponses).length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Réponses populaires</h3>
          <div className="space-y-4">
            {Object.entries(analysis.topResponses).map(([fieldId, responses]) => (
              <div key={fieldId} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Champ {fieldId}</h4>
                <div className="mt-2 space-y-1">
                  {responses.map((response, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      • {response}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton de rafraîchissement */}
      <div className="text-center">
        <button
          onClick={fetchAnalysis}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualiser l'analyse
        </button>
      </div>
    </div>
  );
}
