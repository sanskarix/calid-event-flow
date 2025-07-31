import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

const triggerOptions = [
  { value: 'new-event-booked', label: 'When new event is booked' },
  { value: 'before-event-starts', label: 'Before event starts' },
  { value: 'event-rescheduled', label: 'When event is rescheduled' },
  { value: 'after-event-ends', label: 'After event ends' },
  { value: 'event-canceled', label: 'When event is canceled' },
  { value: 'invitee-no-show', label: 'Invitee is marked no-show' }
];

const actionOptions = [
  { value: 'email-host', label: 'Send email to host' },
  { value: 'email-attendees', label: 'Send email to attendees' },
  { value: 'email-specific', label: 'Send email to a specific email address' },
  { value: 'sms-attendees', label: 'Send SMS to attendees' },
  { value: 'sms-specific', label: 'Send SMS to a specific number' },
  { value: 'whatsapp-attendee', label: 'Send WhatsApp message to attendee' },
  { value: 'whatsapp-specific', label: 'Send WhatsApp message to a specific number' }
];

const getTimingLabel = (trigger: string) => {
  switch (trigger) {
    case 'new-event-booked':
      return 'How long after a new event is booked?';
    case 'before-event-starts':
      return 'How long before event starts?';
    case 'event-rescheduled':
      return 'How long after event is rescheduled?';
    case 'after-event-ends':
      return 'How long after event ends?';
    case 'event-canceled':
      return 'How long after event is canceled?';
    case 'invitee-no-show':
      return 'How long after invitee is marked no-show?';
    default:
      return 'How long after trigger?';
  }
};

const getImmediateLabel = (trigger: string) => {
  const triggerLabels = triggerOptions.find(opt => opt.value === trigger)?.label || 'trigger';
  return `Immediately when ${triggerLabels.toLowerCase()}`;
};

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  open,
  onOpenChange,
  onContinue
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [timingType, setTimingType] = useState('immediate');
  const [timingValue, setTimingValue] = useState('1');
  const [timingUnit, setTimingUnit] = useState('hours');
  const [showTiming, setShowTiming] = useState(false);

  const handleTriggerChange = (value: string) => {
    setSelectedTrigger(value);
    setShowTiming(true);
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a workflow</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Trigger workflow</Label>
            <Select value={selectedTrigger} onValueChange={handleTriggerChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select trigger..." />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showTiming && (
            <div className="space-y-4 animate-fade-in">
              <Label className="text-base font-medium">
                {getTimingLabel(selectedTrigger)}
              </Label>
              
              <RadioGroup value={timingType} onValueChange={setTimingType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate" className="text-sm">
                    {getImmediateLabel(selectedTrigger)}
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delayed" id="delayed" />
                  <Label htmlFor="delayed" className="text-sm">Custom timing</Label>
                </div>
              </RadioGroup>

              {timingType === 'delayed' && (
                <div className="flex items-center space-x-2 ml-6">
                  <Input
                    type="number"
                    value={timingValue}
                    onChange={(e) => setTimingValue(e.target.value)}
                    className="w-20"
                    min="1"
                  />
                  <Select value={timingUnit} onValueChange={setTimingUnit}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">minutes</SelectItem>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="days">days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                *When testing this workflow, be aware that Emails and SMS can only be scheduled at least 1 hour in advance
              </p>
            </div>
          )}

          {showTiming && (
            <div className="space-y-4 animate-fade-in">
              <Label className="text-base font-medium">Actions</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedTrigger && selectedAction && (
            <div className="flex justify-end">
              <Button onClick={handleContinue}>
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};