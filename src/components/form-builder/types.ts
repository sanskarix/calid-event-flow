export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'date'
  | 'time'
  | 'file'
  | 'divider'
  | 'heading'
  | 'paragraph';

export type FieldLayout = 'full' | 'half';

export type BackgroundType = 'none' | 'color' | 'image';

export type TextAlignment = 'left' | 'center' | 'right';

export interface FormFieldConfig {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  helpText: string;
  layout: FieldLayout;
  options?: string[];
  content?: string; // for heading/paragraph
}

export interface FormHeader {
  title: string;
  subtitle: string;
  alignment: TextAlignment;
  color: string;
}

export interface FormBackground {
  type: BackgroundType;
  color: string;
  imageUrl: string;
  overlayOpacity: number;
  blur: number;
}

export interface SubmitButtonConfig {
  text: string;
  alignment: TextAlignment;
  color: string;
  width: 'auto' | 'full';
}

export interface RoutingRule {
  id: string;
  fieldId: string;
  operator: 'equals' | 'not-equals' | 'contains';
  value: string;
  routeTo: string;
}

export interface FormSchema {
  title: string;
  header: FormHeader;
  background: FormBackground;
  submitButton: SubmitButtonConfig;
  fields: FormFieldConfig[];
  routingRules: RoutingRule[];
}

export const FIELD_LIBRARY: { type: FieldType; label: string; icon: string; category: 'input' | 'selection' | 'layout' }[] = [
  { type: 'text', label: 'Text Input', icon: 'Type', category: 'input' },
  { type: 'email', label: 'Email', icon: 'Mail', category: 'input' },
  { type: 'phone', label: 'Phone', icon: 'Phone', category: 'input' },
  { type: 'textarea', label: 'Textarea', icon: 'AlignLeft', category: 'input' },
  { type: 'date', label: 'Date Picker', icon: 'Calendar', category: 'input' },
  { type: 'time', label: 'Time Picker', icon: 'Clock', category: 'input' },
  { type: 'file', label: 'File Upload', icon: 'Upload', category: 'input' },
  { type: 'dropdown', label: 'Dropdown', icon: 'ChevronDown', category: 'selection' },
  { type: 'radio', label: 'Radio', icon: 'Circle', category: 'selection' },
  { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare', category: 'selection' },
  { type: 'divider', label: 'Divider', icon: 'Minus', category: 'layout' },
  { type: 'heading', label: 'Heading', icon: 'Heading', category: 'layout' },
  { type: 'paragraph', label: 'Paragraph', icon: 'FileText', category: 'layout' },
];

export function createDefaultField(type: FieldType): FormFieldConfig {
  return {
    id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    label: type === 'divider' ? '' : type === 'heading' ? 'Section Title' : type === 'paragraph' ? 'Enter your text here' : '',
    placeholder: '',
    required: false,
    helpText: '',
    layout: type === 'textarea' || type === 'divider' || type === 'heading' || type === 'paragraph' ? 'full' : 'half',
    options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    content: type === 'heading' ? 'Section Title' : type === 'paragraph' ? 'Enter your description text here.' : undefined,
  };
}

export function createDefaultSchema(): FormSchema {
  return {
    title: 'Untitled Form',
    header: {
      title: 'Start Your Bespoke Journey',
      subtitle: 'Fill out the form below and we\'ll get back to you shortly.',
      alignment: 'center',
      color: 'hsl(0 0% 100%)',
    },
    background: {
      type: 'none',
      color: 'hsl(210 40% 96%)',
      imageUrl: '',
      overlayOpacity: 0.3,
      blur: 0,
    },
    submitButton: {
      text: 'Submit',
      alignment: 'center',
      color: '',
      width: 'full',
    },
    fields: [],
    routingRules: [],
  };
}
