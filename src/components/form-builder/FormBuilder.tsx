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
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [showJson, setShowJson] = useState(false);
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

  const handleSave = () => {
    onSave?.(schema);
    toast({ title: 'Form saved', description: 'Your form has been saved successfully.' });
  };

  const handlePublish = () => {
    onPublish?.(schema);
    toast({ title: 'Form published', description: 'Your form is now live.' });
  };

  if (showPreview) {
    return <FormPreview schema={schema} onClose={() => setShowPreview(false)} />;
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-muted/30">
      {/* Toolbar */}
      <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-1">
          <Button
            variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
            className="h-8 w-8 p-0"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="h-8 w-8 p-0"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowJson(!showJson)}>
            <Code className="h-3.5 w-3.5 mr-1" /> JSON
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowPreview(true)}>
            <Eye className="h-3.5 w-3.5 mr-1" /> Preview
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1" /> Save
          </Button>
          <Button size="sm" className="h-8 text-xs" onClick={handlePublish}>
            <Send className="h-3.5 w-3.5 mr-1" /> Publish
          </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Field Library */}
        <div className="w-56 border-r border-border bg-card flex-shrink-0 overflow-hidden">
          <FieldLibrary onAddField={addField} />
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 min-w-0 relative">
          {showJson ? (
            <div className="h-full overflow-auto p-6">
              <pre className="text-xs bg-card border border-border rounded-lg p-4 overflow-auto max-h-full font-mono text-foreground">
                {JSON.stringify(schema, null, 2)}
              </pre>
            </div>
          ) : (
            <FormCanvas
              fields={schema.fields}
              selectedFieldId={selectedFieldId}
              header={schema.header}
              background={schema.background}
              submitButton={schema.submitButton}
              previewMode={previewMode}
              onSelectField={setSelectedFieldId}
              onReorderField={reorderField}
              onDropNewField={(type, index) => addField(type as FieldType, index)}
              onDeleteField={(id) => deleteField(id)}
              onDuplicateField={(id) => duplicateField(id)}
            />
          )}
        </div>

        {/* Right Panel - Settings */}
        <div className="w-64 border-l border-border bg-card flex-shrink-0 overflow-hidden">
          <FieldSettings
            field={selectedField}
            header={schema.header}
            background={schema.background}
            submitButton={schema.submitButton}
            onUpdateField={updateField}
            onDeleteField={() => deleteField()}
            onDuplicateField={() => duplicateField()}
            onUpdateHeader={updates => setSchema(prev => ({ ...prev, header: { ...prev.header, ...updates } }))}
            onUpdateBackground={updates => setSchema(prev => ({ ...prev, background: { ...prev.background, ...updates } }))}
            onUpdateSubmitButton={updates => setSchema(prev => ({ ...prev, submitButton: { ...prev.submitButton, ...updates } }))}
            activePanel={settingsPanel}
            onSetActivePanel={setSettingsPanel}
          />
        </div>
      </div>
    </div>
  );
};
