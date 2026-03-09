import React, { useState } from 'react';
import { GripVertical, Trash2, Copy, ChevronUp, ChevronDown, Calendar, Clock, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { Button } from '../ui/button';
import type { FormFieldConfig, FormHeader, FormBackground, SubmitButtonConfig, FormStyle, FieldStyle } from './types';

interface FormCanvasProps {
  fields: FormFieldConfig[];
  selectedFieldId: string | null;
  header: FormHeader;
  background: FormBackground;
  submitButton: SubmitButtonConfig;
  formStyle: FormStyle;
  formWidth: number;
  onSelectField: (id: string | null) => void;
  onReorderField: (fromIndex: number, toIndex: number) => void;
  onDropNewField: (type: string, index?: number) => void;
  onDeleteField: (id: string) => void;
  onDuplicateField: (id: string) => void;
}

const underlineClass = 'w-full bg-transparent border-0 border-b border-[#d6d6d6] rounded-none px-0 py-2.5 text-sm text-foreground outline-none shadow-none transition-colors focus:border-b-2 focus:border-foreground placeholder:text-muted-foreground';
const defaultBase = 'w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-muted-foreground';

const UnderlineField: React.FC<{ placeholder: string; rightIcon?: React.ReactNode; isTextarea?: boolean }> = ({ placeholder, rightIcon, isTextarea }) => (
  <div className="relative">
    {isTextarea ? (
      <textarea disabled placeholder={placeholder} rows={2} className={`${underlineClass} resize-none`} />
    ) : (
      <input type="text" disabled placeholder={placeholder} className={underlineClass} />
    )}
    {rightIcon && <div className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{rightIcon}</div>}
  </div>
);

const FieldRenderer: React.FC<{ field: FormFieldConfig; fieldStyle: FieldStyle }> = ({ field, fieldStyle }) => {
  const isUnderline = fieldStyle === 'underline';
  const inputClass = isUnderline ? underlineClass : defaultBase;
  const placeholderLabel = (field.label || 'Untitled') + (field.required ? '*' : '');

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
      if (isUnderline) {
        return <UnderlineField placeholder={field.placeholder || placeholderLabel} />;
      }
      return <input type="text" placeholder={field.placeholder || `Enter ${field.type}...`} disabled className={inputClass} />;

    case 'textarea':
      if (isUnderline) {
        return (
          <UnderlineWrapper label={field.label || 'Untitled'} required={field.required}>
            <textarea disabled placeholder={field.placeholder || 'Enter text...'} rows={2} className={`${underlineBase} resize-none`} />
          </UnderlineWrapper>
        );
      }
      return <textarea placeholder={field.placeholder || 'Enter text...'} disabled rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground resize-none" />;

    case 'date':
      if (isUnderline) {
        return (
          <UnderlineWrapper label={field.label || 'Date'} required={field.required} rightIcon={<Calendar className="h-4 w-4" />}>
            <input type="text" disabled placeholder="Select date" className={inputClass} />
          </UnderlineWrapper>
        );
      }
      return <input type="date" disabled className={inputClass} />;

    case 'time':
      if (isUnderline) {
        return (
          <UnderlineWrapper label={field.label || 'Time'} required={field.required} rightIcon={<Clock className="h-4 w-4" />}>
            <input type="text" disabled placeholder="Select time" className={inputClass} />
          </UnderlineWrapper>
        );
      }
      return <input type="time" disabled className={inputClass} />;

    case 'file':
      return (
        <div className="w-full h-20 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
          Click or drag to upload
        </div>
      );

    case 'dropdown':
      if (isUnderline) {
        return (
          <UnderlineWrapper label={field.label || 'Select'} required={field.required} rightIcon={<ChevronDownIcon className="h-4 w-4" />}>
            <input type="text" disabled placeholder={field.placeholder || 'Select...'} className={inputClass} />
          </UnderlineWrapper>
        );
      }
      return (
        <select disabled className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-muted-foreground">
          <option>{field.placeholder || 'Select...'}</option>
        </select>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {(field.options || []).map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-foreground">
              <input type="radio" disabled name={field.id} className="accent-primary" />
              {opt}
            </label>
          ))}
        </div>
      );

    case 'checkbox': {
      const dir = field.checkboxDirection || 'column';
      return (
        <div className={dir === 'row' ? 'flex flex-wrap gap-x-5 gap-y-2' : 'space-y-2'}>
          {(field.options || []).map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" disabled className="accent-primary rounded" />
              {opt}
            </label>
          ))}
        </div>
      );
    }

    case 'divider':
      return <hr className="border-border my-2" />;
    case 'heading':
      return <h3 className="text-lg font-semibold text-foreground">{field.content || 'Heading'}</h3>;
    case 'paragraph':
      return <p className="text-sm text-muted-foreground">{field.content || 'Paragraph text'}</p>;
    default:
      return null;
  }
};

export const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  selectedFieldId,
  header,
  background,
  submitButton,
  formStyle,
  formWidth,
  onSelectField,
  onReorderField,
  onDropNewField,
  onDeleteField,
  onDuplicateField,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const isMobile = formWidth <= 500;
  const isUnderline = formStyle.fieldStyle === 'underline';

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const fieldType = e.dataTransfer.getData('fieldType');
    const fromIndex = e.dataTransfer.getData('fieldIndex');
    if (fieldType) {
      onDropNewField(fieldType, index);
    } else if (fromIndex !== '') {
      onReorderField(parseInt(fromIndex), index);
    }
    setDraggingIndex(null);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
    const fieldType = e.dataTransfer.getData('fieldType');
    if (fieldType) onDropNewField(fieldType);
    setDraggingIndex(null);
  };

  const renderFieldsGrid = () => {
    const rows: { fields: (FormFieldConfig & { originalIndex: number })[]; }[] = [];
    let currentRow: (FormFieldConfig & { originalIndex: number })[] = [];
    let currentCols = 0;

    fields.forEach((field, index) => {
      const cols = isMobile || field.layout === 'full' ? 12 : 6;
      if (currentCols + cols > 12) {
        if (currentRow.length > 0) rows.push({ fields: currentRow });
        currentRow = [{ ...field, originalIndex: index }];
        currentCols = cols;
      } else {
        currentRow.push({ ...field, originalIndex: index });
        currentCols += cols;
      }
      if (currentCols >= 12) {
        rows.push({ fields: currentRow });
        currentRow = [];
        currentCols = 0;
      }
    });
    if (currentRow.length > 0) rows.push({ fields: currentRow });

    return rows.map((row, rowIdx) => (
      <div key={rowIdx} className="flex gap-4 w-full">
        {row.fields.map(field => {
          const isSelected = selectedFieldId === field.id;
          const widthClass = isMobile || field.layout === 'full' ? 'w-full' : 'w-[calc(50%-0.5rem)]';
          const showLabel = !isUnderline && !['divider', 'heading', 'paragraph'].includes(field.type);

          return (
            <div
              key={field.id}
              className={`${widthClass} relative group transition-all duration-150`}
              onDragOver={e => handleDragOver(e, field.originalIndex)}
              onDrop={e => handleDrop(e, field.originalIndex)}
            >
              {dragOverIndex === field.originalIndex && (
                <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary rounded-full z-10" />
              )}
              <div
                onClick={(e) => { e.stopPropagation(); onSelectField(field.id); }}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent hover:border-border'
                } ${draggingIndex === field.originalIndex ? 'opacity-40' : ''}`}
              >
                {/* Toolbar */}
                <div className={`absolute -top-3 right-2 flex items-center gap-0.5 bg-card border border-border rounded-md shadow-sm px-1 py-0.5 transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <button
                    className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('fieldIndex', field.originalIndex.toString());
                      setDraggingIndex(field.originalIndex);
                    }}
                    onDragEnd={() => setDraggingIndex(null)}
                  >
                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button className="p-1 hover:bg-muted rounded" onClick={(e) => { e.stopPropagation(); onDuplicateField(field.id); }}>
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button className="p-1 hover:bg-destructive/10 rounded" onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                  {field.originalIndex > 0 && (
                    <button className="p-1 hover:bg-muted rounded" onClick={(e) => { e.stopPropagation(); onReorderField(field.originalIndex, field.originalIndex - 1); }}>
                      <ChevronUp className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                  {field.originalIndex < fields.length - 1 && (
                    <button className="p-1 hover:bg-muted rounded" onClick={(e) => { e.stopPropagation(); onReorderField(field.originalIndex, field.originalIndex + 1); }}>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Label (default style only) */}
                {showLabel && (
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {field.label || 'Untitled'}
                    {field.required && <span className="text-destructive ml-0.5">*</span>}
                  </label>
                )}

                <FieldRenderer field={field} fieldStyle={formStyle.fieldStyle} />

                {field.helpText && (
                  <p className="text-xs text-muted-foreground mt-1.5">{field.helpText}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  const bgStyle: React.CSSProperties = {};
  if (background.type === 'color') bgStyle.backgroundColor = background.color;

  const submitAlignClass = submitButton.alignment === 'left' ? 'justify-start' : submitButton.alignment === 'right' ? 'justify-end' : 'justify-center';

  const btnStyle: React.CSSProperties = {};
  if (submitButton.color) btnStyle.backgroundColor = submitButton.color;
  if (submitButton.textColor) btnStyle.color = submitButton.textColor;
  if (submitButton.borderRadius !== undefined) btnStyle.borderRadius = `${submitButton.borderRadius}px`;

  const formCardStyle: React.CSSProperties = {
    maxWidth: `${formWidth}px`,
    borderRadius: `${formStyle.formBorderRadius}px`,
    padding: `${formStyle.formPadding}px`,
  };
  if (formStyle.formBgColor) formCardStyle.backgroundColor = formStyle.formBgColor;

  return (
    <div
      className="h-full overflow-y-auto relative"
      onClick={() => onSelectField(null)}
      onDragOver={e => { e.preventDefault(); }}
      onDrop={handleCanvasDrop}
    >
      <div className="min-h-full relative" style={bgStyle}>
        {background.type === 'image' && background.imageUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${background.imageUrl})`,
                filter: background.blur ? `blur(${background.blur}px)` : undefined,
              }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${background.overlayOpacity})` }} />
          </>
        )}

        <div className="relative z-10 py-12 px-4">
          {(header.title || header.subtitle) && (
            <div className="max-w-[900px] mx-auto mb-8" style={{ textAlign: header.alignment }}>
              {header.title && (
                <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: background.type !== 'none' ? header.color : undefined }}>
                  {header.title}
                </h1>
              )}
              {header.subtitle && (
                <p className="text-base opacity-80" style={{ color: background.type !== 'none' ? header.color : undefined }}>
                  {header.subtitle}
                </p>
              )}
            </div>
          )}

          <div
            className="mx-auto bg-card shadow-lg border border-border transition-all duration-300"
            style={formCardStyle}
          >
            {fields.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-lg">
                <p className="text-muted-foreground text-sm">Drag fields here or click from the library</p>
                <p className="text-muted-foreground text-xs mt-1">Your form will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {renderFieldsGrid()}

                <div className={`flex pt-4 ${submitAlignClass}`}>
                  <Button
                    className={`${submitButton.width === 'full' ? 'w-full' : 'px-8'} h-11 text-sm font-medium`}
                    style={btnStyle}
                  >
                    {submitButton.text || 'Submit'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {fields.length > 0 && (
        <div
          className="h-20"
          onDragOver={e => { e.preventDefault(); setDragOverIndex(fields.length); }}
          onDrop={e => handleDrop(e, fields.length)}
        />
      )}
    </div>
  );
};
