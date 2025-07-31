import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Check, Plus } from 'lucide-react';
interface AddGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (emails: string[]) => void;
}
export const AddGuestsModal = ({
  isOpen,
  onClose,
  onAdd
}: AddGuestsModalProps) => {
  const [emails, setEmails] = useState(['']);
  const addEmailField = () => {
    setEmails([...emails, '']);
  };
  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };
  const handleAdd = () => {
    const validEmails = emails.filter(email => email.trim() !== '');
    onAdd(validEmails);
    setEmails(['']);
    onClose();
  };
  const handleCancel = () => {
    setEmails(['']);
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Guests</DialogTitle>
          <p className="text-sm text-muted-foreground">Add email addresses to add guests.</p>
        </DialogHeader>
        
        <div className="space-y-3">
          {emails.map((email, index) => <div key={index} className="flex items-center space-x-2">
              <input type="email" placeholder="Enter email address" value={email} onChange={e => updateEmail(index, e.target.value)} className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
            </div>)}
          
          <Button type="button" variant="ghost" onClick={addEmailField} className="w-full justify-start text-muted-foreground hover:bg-muted">
            <Plus className="h-4 w-4 mr-2" />
            Add another
          </Button>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};