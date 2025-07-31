import React, { useState } from 'react';
import { X, ChevronDown, Users, RotateCcw, Settings } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../components/ui/dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: any) => void;
}

export const CreateEventModal = ({
  isOpen,
  onClose,
  onCreateEvent,
}: Props) => {
  const [eventType, setEventType] = useState<string>('');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    duration: '30',
  });

  const durationSuggestions = [
    { value: '15', label: '15 mins', unit: 'minutes' as const },
    { value: '30', label: '30 mins', unit: 'minutes' as const },
    { value: '45', label: '45 mins', unit: 'minutes' as const },
    { value: '60', label: '60 mins', unit: 'minutes' as const },
    { value: '90', label: '90 mins', unit: 'minutes' as const },
    { value: '2', label: '2 hrs', unit: 'hours' as const },
    { value: '2.5', label: '2.5 hrs', unit: 'hours' as const },
    { value: '3', label: '3 hrs', unit: 'hours' as const },
  ];

  const handleCreate = () => {
    if (!formData.title.trim()) return;

    const eventData = {
      ...formData,
      duration: durationUnit === 'hours'
        ? (parseFloat(formData.duration) * 60).toString()
        : formData.duration,
      eventType: 'personal',
    };

    onCreateEvent(eventData);
    onClose();
  };

  const handleDurationSelect = (suggestion: typeof durationSuggestions[0]) => {
    setFormData({ ...formData, duration: suggestion.value });
    setDurationUnit(suggestion.unit);
    setShowDurationDropdown(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new event type</DialogTitle>
          <DialogDescription>Create a new event type for people to book times with.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                placeholder="Quick Chat"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg  bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-border bg-muted text-muted-foreground text-sm rounded-l-lg">
                  cal.id/sanskar
                </span>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-border rounded-r-lg  bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="A quick video meeting."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg  bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <div className="relative">
                <div className="flex">
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    onFocus={() => setShowDurationDropdown(true)}
                    className="flex-1 px-3 py-2 border border-r-0 border-border rounded-l-lg  bg-background"
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) =>
                      setDurationUnit(e.target.value as 'minutes' | 'hours')
                    }
                    className="px-3 py-2 border border-border bg-muted text-sm rounded-r-lg "
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>

                {showDurationDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 animate-scale-in">
                    <div className="py-1 max-h-48 overflow-y-auto">
                      {durationSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.value}
                          onClick={() => handleDurationSelect(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
            <DialogClose asChild>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </DialogClose>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Create
            </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
