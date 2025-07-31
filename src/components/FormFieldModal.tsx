
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Plus, X, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface FormFieldModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  field?: FormField;
}

export interface FormField {
  id: string;
  label: string;
  identifier: string;
  type: 'short-text' | 'number' | 'long-text' | 'single-selection' | 'multiple-selection' | 'phone' | 'email';
  required: boolean;
  options?: string[];
  collapsed?: boolean;
}

export const FormFieldModal: React.FC<FormFieldModalProps> = ({
  open,
  onClose,
  onSave,
  field
}) => {
  const [label, setLabel] = useState(field?.label || '');
  const [identifier, setIdentifier] = useState(field?.identifier || '');
  const [type, setType] = useState<FormField['type']>(field?.type || 'short-text');
  const [required, setRequired] = useState(field?.required || false);
  const [options, setOptions] = useState<string[]>(field?.options || ['']);

  const handleSave = () => {
    const newField: FormField = {
      id: field?.id || `field-${Date.now()}`,
      label,
      identifier,
      type,
      required,
      options: ['single-selection', 'multiple-selection'].includes(type) ? options.filter(opt => opt.trim()) : undefined,
      collapsed: false
    };
    onSave(newField);
    onClose();
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...options];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < options.length) {
      [newOptions[index], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[index]];
      setOptions(newOptions);
    }
  };

  const showOptions = ['single-selection', 'multiple-selection'].includes(type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Field</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="This is what your users would see"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Identifies field by this name."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: FormField['type']) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short-text">Short Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="long-text">Long Text</SelectItem>
                <SelectItem value="single-selection">Single Selection</SelectItem>
                <SelectItem value="multiple-selection">Multiple Selection</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showOptions && (
            <div className="space-y-4">
              <Label>Options</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveOption(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveOption(index, 'down')}
                        disabled={index === options.length - 1}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`< ${index + 1 <= 9 ? index + 1 : index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={addOption} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add an option
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Required</Label>
            <div className="flex space-x-4">
              <Button
                variant={required ? 'default' : 'outline'}
                onClick={() => setRequired(true)}
                className="flex-1"
              >
                Yes
              </Button>
              <Button
                variant={!required ? 'default' : 'outline'}
                onClick={() => setRequired(false)}
                className="flex-1"
              >
                No
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Field
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
