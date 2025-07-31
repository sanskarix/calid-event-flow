
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (selectedEventTypes: string[]) => void;
}

export const BulkUpdateModal = ({ isOpen, onClose, onUpdate }: BulkUpdateModalProps) => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([
    'recurring-event',
    'product-demo',
    'everything-else',
    'interviews',
    'product-hunt-chats'
  ]);

  const eventTypes = [
    { id: 'recurring-event', name: 'Recurring Event' },
    { id: 'product-demo', name: 'Product Demo' },
    { id: 'everything-else', name: 'Everything Else' },
    { id: 'interviews', name: 'Interviews' },
    { id: 'product-hunt-chats', name: 'Product Hunt Chats' }
  ];

  const handleSelectAll = () => {
    if (selectedEventTypes.length === eventTypes.length) {
      setSelectedEventTypes([]);
    } else {
      setSelectedEventTypes(eventTypes.map(et => et.id));
    }
  };

  const handleEventTypeToggle = (eventTypeId: string) => {
    setSelectedEventTypes(prev =>
      prev.includes(eventTypeId)
        ? prev.filter(id => id !== eventTypeId)
        : [...prev, eventTypeId]
    );
  };

  const handleUpdate = () => {
    onUpdate(selectedEventTypes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">Bulk update existing event types</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Update the schedules for the selected event types
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-border">
              <Checkbox
                id="select-all"
                checked={selectedEventTypes.length === eventTypes.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select All
              </label>
            </div>

            <div className="space-y-3">
              {eventTypes.map((eventType) => (
                <div key={eventType.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={eventType.id}
                    checked={selectedEventTypes.includes(eventType.id)}
                    onCheckedChange={() => handleEventTypeToggle(eventType.id)}
                  />
                  <label htmlFor={eventType.id} className="text-sm cursor-pointer">
                    {eventType.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={selectedEventTypes.length === 0}>
              Update Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
