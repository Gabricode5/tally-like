'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FieldType } from '@prisma/client';
import AISuggestions from './AISuggestions';

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
            placeholder="Ex: Formulaire de contact"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le but de votre formulaire"
          />
        </div>
      </div>

      {/* Suggestions IA */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Champs du formulaire</h3>
          <Button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            variant="outline"
            size="sm"
          >
            {showAISuggestions ? 'Masquer' : 'Suggestions IA'}
          </Button>
        </div>

        {showAISuggestions && (
          <AISuggestions onApplySuggestions={handleAISuggestions} />
        )}
      </div>

      {/* Types de champs disponibles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.values(FieldType).map((type) => (
          <Button
            key={type}
            onClick={() => addField(type)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            + {type}
          </Button>
        ))}
      </div>

      {/* Liste des champs */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 space-y-3">
                <Input
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="Label du champ"
                />
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="mr-2"
                    />
                    Requis
                  </label>
                  
                  <span className="text-sm text-gray-500">
                    Type: {field.type}
                  </span>
                </div>

                {/* Options pour SELECT et RADIO */}
                {(field.type === 'SELECT' || field.type === 'RADIO') && field.options && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Options:</label>
                    {field.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...field.options!];
                            newOptions[optionIndex] = e.target.value;
                            updateField(field.id, { options: newOptions });
                          }}
                          placeholder={`Option ${optionIndex + 1}`}
                          size="sm"
                        />
                        <Button
                          onClick={() => {
                            const newOptions = field.options!.filter((_, i) => i !== optionIndex);
                            updateField(field.id, { options: newOptions });
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        const newOptions = [...field.options!, `Option ${field.options!.length + 1}`];
                        updateField(field.id, { options: newOptions });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      + Ajouter option
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {index > 0 && (
                  <Button
                    onClick={() => moveField(index, index - 1)}
                    variant="outline"
                    size="sm"
                  >
                    ↑
                  </Button>
                )}
                {index < fields.length - 1 && (
                  <Button
                    onClick={() => moveField(index, index + 1)}
                    variant="outline"
                    size="sm"
                  >
                    ↓
                  </Button>
                )}
                <Button
                  onClick={() => removeField(field.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          onClick={handleSave}
          disabled={loading || !title.trim() || fields.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder le formulaire'}
        </Button>
      </div>
    </div>
  );
}


