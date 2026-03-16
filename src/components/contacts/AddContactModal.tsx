import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Save, X } from 'lucide-react';
import type { Contact } from '@/data/contactsData';

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
  onSave: (data: Partial<Contact>) => void;
}

export function AddContactModal({ open, onOpenChange, contact, onSave }: AddContactModalProps) {
  const isEdit = !!contact;
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contact) {
      setForm({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        jobTitle: contact.jobTitle,
        notes: contact.notes,
      });
    } else {
      setForm({ name: '', email: '', phone: '', company: '', jobTitle: '', notes: '' });
    }
    setErrors({});
  }, [contact, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.company.trim()) e.company = 'Company is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...form,
      ...(contact ? { id: contact.id } : {}),
    });
    onOpenChange(false);
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            {isEdit ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isEdit ? 'Edit Contact' : 'Add Contact'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              placeholder="e.g. Sarah Chen"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. sarah@acme.com"
              value={form.email}
              onChange={e => updateField('email', e.target.value)}
              readOnly={isEdit}
              className={`${errors.email ? 'border-destructive' : ''} ${isEdit ? 'bg-muted cursor-not-allowed' : ''}`}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={e => updateField('phone', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company <span className="text-destructive">*</span></Label>
              <Input
                id="company"
                placeholder="e.g. Acme Corp"
                value={form.company}
                onChange={e => updateField('company', e.target.value)}
                className={errors.company ? 'border-destructive' : ''}
              />
              {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Product Manager"
              value={form.jobTitle}
              onChange={e => updateField('jobTitle', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant notes..."
              value={form.notes}
              onChange={e => updateField('notes', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-3.5 w-3.5 mr-1" /> Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? <Save className="h-3.5 w-3.5 mr-1" /> : <UserPlus className="h-3.5 w-3.5 mr-1" />}
            {isEdit ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
