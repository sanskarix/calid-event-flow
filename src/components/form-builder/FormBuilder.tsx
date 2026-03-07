import React, { useState, useCallback } from 'react';
import { FieldLibrary } from './FieldLibrary';
import { FormCanvas } from './FormCanvas';
import { FieldSettings } from './FieldSettings';
import { FormPreview } from './FormPreview';
import {
  type FormSchema,
  type FormFieldConfig,
  type FieldType,
  createDefaultField,
  createDefaultSchema,
} from './types';
import { useToast } from '@/hooks/use-toast';

interface FormBuilderProps {
  initialSchema?: FormSchema;
  onSave?: (schema: FormSchema) => void;
  onPublish?: (schema: FormSchema) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  onSave,
  onPublish,
}) => {
  const [schema, setSchema] = useState<FormSchema>(initialSchema || createDefaultSchema());
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [settingsPanel, setSettingsPanel] = useState<'field' | 'header' | 'background' | 'submit'>('field');
  const { toast } = useToast();

  const selectedField = schema.fields.find(f => f.id === selectedFieldId) || null;

  const addField = useCallback((type: FieldType, index?: number) => {
    const field = createDefaultField(type);
    setSchema(prev => {
      const newFields = [...prev.fields];
      if (index !== undefined) {
        newFields.splice(index, 0, field);
      } else {
        newFields.push(field);
      }
      return { ...prev, fields: newFields };
    });
    setSelectedFieldId(field.id);
    setSettingsPanel('field');
  }, []);

  const updateField = useCallback((updates: Partial<FormFieldConfig>) => {
    if (!selectedFieldId) return;
    setSchema(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === selectedFieldId ? { ...f, ...updates } : f),
    }));
  }, [selectedFieldId]);

  const deleteField = useCallback((id?: string) => {
    const targetId = id || selectedFieldId;
    if (!targetId) return;
    setSchema(prev => ({ ...prev, fields: prev.fields.filter(f => f.id !== targetId) }));
    if (targetId === selectedFieldId) setSelectedFieldId(null);
  }, [selectedFieldId]);

  const duplicateField = useCallback((id?: string) => {
    const targetId = id || selectedFieldId;
    if (!targetId) return;
    setSchema(prev => {
      const idx = prev.fields.findIndex(f => f.id === targetId);
      if (idx === -1) return prev;
      const newField = { ...prev.fields[idx], id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
      const newFields = [...prev.fields];
      newFields.splice(idx + 1, 0, newField);
      return { ...prev, fields: newFields };
    });
  }, [selectedFieldId]);

  const reorderField = useCallback((from: number, to: number) => {
    setSchema(prev => {
      const newFields = [...prev.fields];
      const [moved] = newFields.splice(from, 1);
      newFields.splice(to, 0, moved);
      return { ...prev, fields: newFields };
    });
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] flex bg-muted/30">
      {/* Left Panel - Field Library */}
      <div className="w-56 border-r border-border bg-card flex-shrink-0 overflow-hidden">
        <FieldLibrary onAddField={addField} />
      </div>

      {/* Center Panel - Canvas */}
      <div className="flex-1 min-w-0 relative">
        <FormCanvas
          fields={schema.fields}
          selectedFieldId={selectedFieldId}
          header={schema.header}
          background={schema.background}
          submitButton={schema.submitButton}
          formWidth={schema.formWidth}
          onSelectField={setSelectedFieldId}
          onReorderField={reorderField}
          onDropNewField={(type, index) => addField(type as FieldType, index)}
          onDeleteField={(id) => deleteField(id)}
          onDuplicateField={(id) => duplicateField(id)}
        />
      </div>

      {/* Right Panel - Settings */}
      <div className="w-64 border-l border-border bg-card flex-shrink-0 overflow-hidden">
        <FieldSettings
          field={selectedField}
          header={schema.header}
          background={schema.background}
          submitButton={schema.submitButton}
          formWidth={schema.formWidth}
          onUpdateField={updateField}
          onDeleteField={() => deleteField()}
          onDuplicateField={() => duplicateField()}
          onUpdateHeader={updates => setSchema(prev => ({ ...prev, header: { ...prev.header, ...updates } }))}
          onUpdateBackground={updates => setSchema(prev => ({ ...prev, background: { ...prev.background, ...updates } }))}
          onUpdateSubmitButton={updates => setSchema(prev => ({ ...prev, submitButton: { ...prev.submitButton, ...updates } }))}
          onUpdateFormWidth={width => setSchema(prev => ({ ...prev, formWidth: width }))}
          activePanel={settingsPanel}
          onSetActivePanel={setSettingsPanel}
        />
      </div>
    </div>
  );
};
