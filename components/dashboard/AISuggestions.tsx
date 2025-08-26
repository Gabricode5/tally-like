'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FieldSuggestion } from '@/lib/openai';

interface AISuggestionsProps {
  onApplySuggestions: (suggestions: FieldSuggestion[]) => void;
}

export default function AISuggestions({ onApplySuggestions }: AISuggestionsProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);
  const [error, setError] = useState('');

  const generateSuggestions = async () => {
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError('Impossible de générer des suggestions pour le moment');
      console.error('AI suggestions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestions = () => {
    onApplySuggestions(suggestions);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Suggestions IA</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Titre du formulaire *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Formulaire de contact"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le but de votre formulaire"
            disabled={loading}
          />
        </div>
      </div>

      <Button
        onClick={generateSuggestions}
        disabled={loading || !title.trim()}
        className="w-full"
      >
        {loading ? 'Génération...' : 'Générer des suggestions'}
      </Button>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Suggestions générées :</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-white border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{suggestion.label}</p>
                    <p className="text-sm text-gray-600">
                      Type: {suggestion.type} • 
                      {suggestion.required ? ' Requis' : ' Optionnel'}
                    </p>
                    {suggestion.options && (
                      <p className="text-sm text-gray-500">
                        Options: {suggestion.options.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            onClick={applySuggestions}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Appliquer ces suggestions
          </Button>
        </div>
      )}
    </div>
  );
}
