import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Trash2, Plus, X, Copy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { FormFieldConfig, FormHeader, FormBackground, SubmitButtonConfig, TextAlignment } from './types';

interface FieldSettingsProps {
  field: FormFieldConfig | null;
  header: FormHeader;
  background: FormBackground;
  submitButton: SubmitButtonConfig;
  formWidth: number;
  onUpdateField: (updates: Partial<FormFieldConfig>) => void;
  onDeleteField: () => void;
  onDuplicateField: () => void;
  onUpdateHeader: (updates: Partial<FormHeader>) => void;
  onUpdateBackground: (updates: Partial<FormBackground>) => void;
  onUpdateSubmitButton: (updates: Partial<SubmitButtonConfig>) => void;
  onUpdateFormWidth: (width: number) => void;
  activePanel: 'field' | 'header' | 'background' | 'submit';
  onSetActivePanel: (panel: 'field' | 'header' | 'background' | 'submit') => void;
}

export const FieldSettings: React.FC<FieldSettingsProps> = ({
  field,
  header,
  background,
  submitButton,
  formWidth,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onUpdateHeader,
  onUpdateBackground,
  onUpdateSubmitButton,
  onUpdateFormWidth,
  activePanel,
  onSetActivePanel,
}) => {
  const tabs = [
    { key: 'field' as const, label: 'Field' },
    { key: 'header' as const, label: 'Header' },
    { key: 'background' as const, label: 'Background' },
    { key: 'submit' as const, label: 'Button' },
  ];

  const AlignmentPicker = ({ value, onChange }: { value: TextAlignment; onChange: (v: TextAlignment) => void }) => (
    <div className="flex gap-1">
      {(['left', 'center', 'right'] as const).map(a => (
        <Button
          key={a}
          variant={value === a ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(a)}
          className="flex-1 capitalize text-xs h-8"
        >
          {a}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onSetActivePanel(tab.key)}
              className={`flex-1 py-2.5 text-[11px] font-medium transition-colors border-b-2 ${
                activePanel === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {activePanel === 'field' && (
          <>
            {field ? (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={field.label}
                    onChange={e => onUpdateField({ label: e.target.value })}
                    placeholder="Field label"
                    className="h-9 text-sm"
                  />
                </div>

                {!['divider', 'heading', 'paragraph'].includes(field.type) && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        value={field.placeholder}
                        onChange={e => onUpdateField({ placeholder: e.target.value })}
                        placeholder="Placeholder text"
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Required</Label>
                      <Switch
                        checked={field.required}
                        onCheckedChange={checked => onUpdateField({ required: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Help Text</Label>
                      <Input
                        value={field.helpText}
                        onChange={e => onUpdateField({ helpText: e.target.value })}
                        placeholder="Help text below field"
                        className="h-9 text-sm"
                      />
                    </div>
                  </>
                )}

                {['heading', 'paragraph'].includes(field.type) && (
                  <div className="space-y-2">
                    <Label className="text-xs">Content</Label>
                    <Textarea
                      value={field.content || ''}
                      onChange={e => onUpdateField({ content: e.target.value })}
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs">Field Width</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={field.layout === 'full' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onUpdateField({ layout: 'full' })}
                      className="flex-1 text-xs h-8"
                    >
                      Full Width
                    </Button>
                    <Button
                      variant={field.layout === 'half' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onUpdateField({ layout: 'half' })}
                      className="flex-1 text-xs h-8"
                    >
                      Half Width
                    </Button>
                  </div>
                </div>

                {field.options && (
                  <div className="space-y-2">
                    <Label className="text-xs">Options</Label>
                    <div className="space-y-1.5">
                      {field.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Input
                            value={opt}
                            onChange={e => {
                              const newOpts = [...field.options!];
                              newOpts[i] = e.target.value;
                              onUpdateField({ options: newOpts });
                            }}
                            className="h-8 text-xs flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => {
                              const newOpts = field.options!.filter((_, idx) => idx !== i);
                              onUpdateField({ options: newOpts });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8"
                      onClick={() => onUpdateField({ options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] })}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Option
                    </Button>
                  </div>
                )}

                <div className="border-t border-border pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={onDuplicateField}>
                    <Copy className="h-3 w-3 mr-1" /> Duplicate
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1 text-xs h-8" onClick={onDeleteField}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Select a field to edit its settings</p>
              </div>
            )}
          </>
        )}

        {activePanel === 'header' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Title</Label>
              <Input
                value={header.title}
                onChange={e => onUpdateHeader({ title: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Subtitle</Label>
              <Input
                value={header.subtitle}
                onChange={e => onUpdateHeader({ subtitle: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Alignment</Label>
              <AlignmentPicker value={header.alignment} onChange={a => onUpdateHeader({ alignment: a })} />
            </div>
          </>
        )}

        {activePanel === 'background' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Form Width: {formWidth}px</Label>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={formWidth}
                onChange={e => onUpdateFormWidth(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>400px</span>
                <span>1200px</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Background Type</Label>
              <Select value={background.type} onValueChange={(v: any) => onUpdateBackground({ type: v })}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="color">Color</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {background.type === 'color' && (
              <div className="space-y-2">
                <Label className="text-xs">Color</Label>
                <Input
                  value={background.color}
                  onChange={e => onUpdateBackground({ color: e.target.value })}
                  placeholder="hsl(210 40% 96%)"
                  className="h-9 text-sm"
                />
              </div>
            )}

            {background.type === 'image' && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    value={background.imageUrl}
                    onChange={e => onUpdateBackground({ imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Overlay Opacity: {Math.round(background.overlayOpacity * 100)}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={background.overlayOpacity}
                    onChange={e => onUpdateBackground({ overlayOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Blur: {background.blur}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={background.blur}
                    onChange={e => onUpdateBackground({ blur: parseInt(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>
              </>
            )}
          </>
        )}

        {activePanel === 'submit' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Button Text</Label>
              <Input
                value={submitButton.text}
                onChange={e => onUpdateSubmitButton({ text: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Alignment</Label>
              <AlignmentPicker value={submitButton.alignment} onChange={a => onUpdateSubmitButton({ alignment: a })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Width</Label>
              <div className="flex gap-1">
                <Button
                  variant={submitButton.width === 'full' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onUpdateSubmitButton({ width: 'full' })}
                  className="flex-1 text-xs h-8"
                >
                  Full
                </Button>
                <Button
                  variant={submitButton.width === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onUpdateSubmitButton({ width: 'auto' })}
                  className="flex-1 text-xs h-8"
                >
                  Auto
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
