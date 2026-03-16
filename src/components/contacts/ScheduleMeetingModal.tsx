import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowRight, ArrowLeft, Check, Clock, Users, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Contact } from '@/data/contactsData';
import { toast } from '@/hooks/use-toast';

const eventTypes = [
  { id: '1', title: 'Discovery Call', duration: 30 },
  { id: '2', title: 'Strategy Session', duration: 45 },
  { id: '3', title: 'Quick Check-in', duration: 15 },
  { id: '4', title: 'Product Demo', duration: 60 },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

interface ScheduleMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export function ScheduleMeetingModal({ open, onOpenChange, contact }: ScheduleMeetingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [additionalGuests, setAdditionalGuests] = useState('');

  const resetAndClose = (v: boolean) => {
    if (!v) { setStep(1); setSelectedEvent(''); setSelectedDate(undefined); setSelectedTime(''); setAdditionalGuests(''); }
    onOpenChange(v);
  };

  const handleConfirm = () => {
    toast({
      title: 'Meeting scheduled',
      description: `Meeting with ${contact?.name} confirmed for ${selectedDate ? format(selectedDate, 'PPP') : ''} at ${selectedTime}.`,
    });
    resetAndClose(false);
  };

  const eventInfo = eventTypes.find(e => e.id === selectedEvent);

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Video className="h-4 w-4" />
            Schedule Meeting {contact ? `with ${contact.name}` : ''}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>{s}</div>
              {s < 4 && <div className={`h-px w-6 ${s < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
          <span className="ml-2 text-xs text-muted-foreground">
            {step === 1 ? 'Event Type' : step === 2 ? 'Date & Time' : step === 3 ? 'Guests' : 'Confirm'}
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-2 pt-2">
            <Label>Select Event Type</Label>
            <div className="space-y-2">
              {eventTypes.map(et => (
                <button
                  key={et.id}
                  onClick={() => setSelectedEvent(et.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    selectedEvent === et.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="text-sm font-medium">{et.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {et.duration} min
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button disabled={!selectedEvent} onClick={() => setStep(2)}>
                Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={date => date < new Date()}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {selectedDate && (
              <div className="space-y-1.5">
                <Label>Select Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                        selectedTime === t ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:bg-muted/50'
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <Button disabled={!selectedDate || !selectedTime} onClick={() => setStep(3)}>
                Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="text-sm font-medium">{contact?.name}</div>
              <div className="text-xs text-muted-foreground">{contact?.email}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Additional Guests</Label>
              <Input
                placeholder="guest1@email.com, guest2@email.com"
                value={additionalGuests}
                onChange={e => setAdditionalGuests(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-lg border border-border space-y-3">
              <h4 className="text-sm font-semibold">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{eventInfo?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedDate ? format(selectedDate, 'PPP') : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{eventInfo?.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-medium">{contact?.name}</span>
                </div>
                {additionalGuests && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium text-right text-xs">{additionalGuests}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <Button onClick={handleConfirm}>
                <Check className="h-3.5 w-3.5 mr-1" /> Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
