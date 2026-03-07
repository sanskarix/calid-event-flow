import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X, Monitor, Smartphone } from 'lucide-react';
import type { FormSchema } from './types';

interface FormPreviewProps {
  schema: FormSchema;
  onClose: () => void;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ schema, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const isMobile = device === 'mobile';

  const bgStyle: React.CSSProperties = {};
  if (schema.background.type === 'color') {
    bgStyle.backgroundColor = schema.background.color;
  }

  const renderField = (field: typeof schema.fields[0]) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return <input type={field.type === 'text' ? 'text' : field.type} placeholder={field.placeholder} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm" />;
      case 'textarea':
        return <textarea placeholder={field.placeholder} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />;
      case 'date':
        return <input type="date" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm" />;
      case 'time':
        return <input type="time" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm" />;
      case 'file':
        return <div className="w-full h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">Click or drag to upload</div>;
      case 'dropdown':
        return (
          <select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm">
            <option>{field.placeholder || 'Select...'}</option>
            {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm"><input type="radio" name={field.id} className="accent-primary" />{opt}</label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary rounded" />{opt}</label>
            ))}
          </div>
        );
      case 'divider':
        return <hr className="border-border" />;
      case 'heading':
        return <h3 className="text-lg font-semibold">{field.content}</h3>;
      case 'paragraph':
        return <p className="text-sm text-muted-foreground">{field.content}</p>;
      default:
        return null;
    }
  };

  // Build rows
  const rows: (typeof schema.fields[number])[][] = [];
  let currentRow: (typeof schema.fields[number])[] = [];
  let cols = 0;
  schema.fields.forEach(f => {
    const c = isMobile || f.layout === 'full' ? 12 : 6;
    if (cols + c > 12) {
      if (currentRow.length) rows.push(currentRow);
      currentRow = [f];
      cols = c;
    } else {
      currentRow.push(f);
      cols += c;
    }
    if (cols >= 12) { rows.push(currentRow); currentRow = []; cols = 0; }
  });
  if (currentRow.length) rows.push(currentRow);

  const submitAlignClass = schema.submitButton.alignment === 'left' ? 'justify-start' : schema.submitButton.alignment === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant={device === 'desktop' ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0" onClick={() => setDevice('desktop')}>
            <Monitor className="h-4 w-4" />
          </Button>
          <Button variant={device === 'mobile' ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0" onClick={() => setDevice('mobile')}>
            <Smartphone className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium ml-2">Preview</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto" style={bgStyle}>
        <div className="min-h-full relative">
          {schema.background.type === 'image' && schema.background.imageUrl && (
            <>
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${schema.background.imageUrl})`, filter: schema.background.blur ? `blur(${schema.background.blur}px)` : undefined }} />
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${schema.background.overlayOpacity})` }} />
            </>
          )}

          <div className="relative z-10 py-12 px-4">
            {(schema.header.title || schema.header.subtitle) && (
              <div className={`max-w-[900px] mx-auto mb-8`} style={{ textAlign: schema.header.alignment }}>
                {schema.header.title && <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: schema.background.type !== 'none' ? schema.header.color : undefined }}>{schema.header.title}</h1>}
                {schema.header.subtitle && <p className="text-base opacity-80" style={{ color: schema.background.type !== 'none' ? schema.header.color : undefined }}>{schema.header.subtitle}</p>}
              </div>
            )}

            <div className={`mx-auto bg-card rounded-xl shadow-lg border border-border ${isMobile ? 'max-w-[375px] p-5' : 'max-w-[900px] p-10'}`}>
              <div className="space-y-6">
                {rows.map((row, ri) => (
                  <div key={ri} className="flex gap-4">
                    {row.map(field => (
                      <div key={field.id} className={isMobile || field.layout === 'full' ? 'w-full' : 'w-[calc(50%-0.5rem)]'}>
                        {!['divider', 'heading', 'paragraph'].includes(field.type) && (
                          <label className="block text-sm font-medium mb-1.5">
                            {field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}
                          </label>
                        )}
                        {renderField(field)}
                        {field.helpText && <p className="text-xs text-muted-foreground mt-1">{field.helpText}</p>}
                      </div>
                    ))}
                  </div>
                ))}

                <div className={`flex pt-4 ${submitAlignClass}`}>
                  <Button className={`${schema.submitButton.width === 'full' ? 'w-full' : 'px-8'} h-11 rounded-lg`}>
                    {schema.submitButton.text || 'Submit'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
