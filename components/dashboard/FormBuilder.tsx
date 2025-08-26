'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AISuggestions from './AISuggestions';

type FieldType = 'TEXT' | 'EMAIL' | 'NUMBER' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'RADIO';

interface Field {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
  order: number;
}

interface FormBuilderProps {
  formId: string;
  initialData?: {
    title: string;
    description?: string;
    fields: Field[];
  };
  onSave: (data: { title: string; description?: string; fields: Field[] }) => void;
}

export default function FormBuilder({ formId, initialData, onSave }: FormBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [fields, setFields] = useState<Field[]>(initialData?.fields || []);
  const [loading, setLoading] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const addField = (type: FieldType) => {
    const newField: Field = {
      id: `field_${Date.now()}`,
      type,
      label: `Nouveau champ ${type.toLowerCase()}`,
      required: false,
      order: fields.length,
    };

    if (type === 'SELECT' || type === 'RADIO') {
      newField.options = ['Option 1', 'Option 2'];
    }

    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    
    // Mettre à jour l'ordre
    setFields(newFields.map((field, index) => ({ ...field, order: index })));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ title, description, fields });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestions = (suggestions: any[]) => {
    const newFields: Field[] = suggestions.map((suggestion, index) => ({
      id: `ai_field_${Date.now()}_${index}`,
      type: suggestion.type,
      label: suggestion.label,
      required: suggestion.required,
      options: suggestion.options,
      order: fields.length + index,
    }));

    setFields([...fields, ...newFields]);
    setShowAISuggestions(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête du formulaire */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre du formulaire *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de votre formulaire"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description optionnelle"
          />
        </div>
      </div>

      {/* Bouton IA Suggestions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Champs du formulaire</h3>
        <Button
          type="button"
          onClick={() => setShowAISuggestions(!showAISuggestions)}
          variant="outline"
          size="sm"
        >
          {showAISuggestions ? 'Fermer IA' : 'Suggestions IA'}
        </Button>
      </div>

      {/* Suggestions IA */}
      {showAISuggestions && (
        <AISuggestions onApplySuggestions={handleAISuggestions} />
      )}

      {/* Boutons d'ajout de champs */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => addField('TEXT')}
          size="sm"
          variant="outline"
        >
          + Texte
        </Button>
        <Button
          type="button"
          onClick={() => addField('EMAIL')}
          size="sm"
          variant="outline"
        >
          + Email
        </Button>
        <Button
          type="button"
          onClick={() => addField('NUMBER')}
          size="sm"
          variant="outline"
        >
          + Nombre
        </Button>
        <Button
          type="button"
          onClick={() => addField('TEXTAREA')}
          size="sm"
          variant="outline"
        >
          + Zone de texte
        </Button>
        <Button
          type="button"
          onClick={() => addField('SELECT')}
          size="sm"
          variant="outline"
        >
          + Liste déroulante
        </Button>
        <Button
          type="button"
          onClick={() => addField('RADIO')}
          size="sm"
          variant="outline"
        >
          + Boutons radio
        </Button>
        <Button
          type="button"
          onClick={() => addField('CHECKBOX')}
          size="sm"
          variant="outline"
        >
          + Case à cocher
        </Button>
      </div>

      {/* Liste des champs */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {field.type}
                </span>
                <span className="text-xs text-gray-500">
                  #{index + 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => removeField(field.id)}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Libellé *</label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="Libellé du champ"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`required-${field.id}`}
                  checked={field.required}
                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor={`required-${field.id}`} className="text-sm">
                  Champ obligatoire
                </label>
              </div>

              {(field.type === 'SELECT' || field.type === 'RADIO') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Options</label>
                  <div className="space-y-2">
                    {field.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[optionIndex] = e.target.value;
                            updateField(field.id, { options: newOptions });
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const newOptions = field.options?.filter((_, i) => i !== optionIndex) || [];
                            updateField(field.id, { options: newOptions });
                          }}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                        updateField(field.id, { options: newOptions });
                      }}
                      size="sm"
                      variant="outline"
                    >
                      + Ajouter une option
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading || !title.trim()}
          className="px-6"
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  );
}


