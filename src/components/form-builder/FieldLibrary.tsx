import React from 'react';
import {
  Type, Mail, Phone, AlignLeft, Calendar, Clock, Upload,
  ChevronDown, Circle, CheckSquare, Minus, Heading, FileText, GripVertical
} from 'lucide-react';
import { FIELD_LIBRARY, type FieldType } from './types';

const iconMap: Record<string, React.ElementType> = {
  Type, Mail, Phone, AlignLeft, Calendar, Clock, Upload,
  ChevronDown, Circle, CheckSquare, Minus, Heading, FileText,
};

interface FieldLibraryProps {
  onAddField: (type: FieldType) => void;
}

export const FieldLibrary: React.FC<FieldLibraryProps> = ({ onAddField }) => {
  const categories = [
    { key: 'input' as const, label: 'Input Fields' },
    { key: 'selection' as const, label: 'Selection' },
    { key: 'layout' as const, label: 'Layout' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Field Library</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag or click to add</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map(cat => (
          <div key={cat.key}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              {cat.label}
            </p>
            <div className="space-y-1">
              {FIELD_LIBRARY.filter(f => f.category === cat.key).map(field => {
                const Icon = iconMap[field.icon] || Type;
                return (
                  <button
                    key={field.type}
                    onClick={() => onAddField(field.type)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors group cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('fieldType', field.type);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                  >
                    <GripVertical className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium">{field.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
