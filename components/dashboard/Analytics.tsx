'use client';

import { useState, useEffect } from 'react';
import { SubmissionAnalysis } from '@/lib/openai';

interface AnalyticsProps {
  formId: string;
}

export default function Analytics({ formId }: AnalyticsProps) {
  const [analysis, setAnalysis] = useState<SubmissionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysis();
  }, [formId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forms/${formId}/analysis`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="text-center text-red-600">
          <p>Erreur lors du chargement des analytics : {error}</p>
          <button
            onClick={fetchAnalysis}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-gray-500 text-center">Aucune donnée d'analyse disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total des soumissions</h3>
          <p className="text-2xl font-bold text-gray-900">{analysis.totalSubmissions}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Champs moyens par soumission</h3>
          <p className="text-2xl font-bold text-gray-900">{analysis.averageFieldsPerSubmission}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Statut</h3>
          <p className="text-lg font-medium text-green-600">Actif</p>
        </div>
      </div>

      {analysis.insights && analysis.insights.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3">Insights</h3>
          <div className="space-y-2">
            {analysis.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(analysis.mostCommonValues).length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3">Valeurs les plus communes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.mostCommonValues).map(([field, value]) => (
              <div key={field} className="bg-gray-50 p-3 rounded border">
                <p className="text-sm font-medium text-gray-600">{field}</p>
                <p className="text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
