import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Copy, Send, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Contact } from '@/data/contactsData';
import { toast } from '@/hooks/use-toast';

const eventTypes = [
  { id: '1', title: 'Discovery Call', duration: 30 },
  { id: '2', title: 'Strategy Session', duration: 45 },
  { id: '3', title: 'Quick Check-in', duration: 15 },
  { id: '4', title: 'Product Demo', duration: 60 },
];

interface ShareAvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export function ShareAvailabilityModal({ open, onOpenChange, contact }: ShareAvailabilityModalProps) {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const bookingLink = `https://cal.id/sanskar/${selectedEvent ? eventTypes.find(e => e.id === selectedEvent)?.title.toLowerCase().replace(/\s+/g, '-') : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Link copied', description: 'Booking link copied to clipboard.' });
  };

  const handleSend = () => {
    toast({ title: 'Link sent', description: `Scheduling link sent to ${contact?.name}.` });
    onOpenChange(false);
    setStep(1);
    setSelectedEvent('');
    setMessage('');
  };

  const resetAndClose = (v: boolean) => {
    if (!v) { setStep(1); setSelectedEvent(''); setMessage(''); }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Share2 className="h-4 w-4" />
            Share Availability {contact ? `with ${contact.name}` : ''}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>{s}</div>
              {s < 3 && <div className={`h-px w-8 ${s < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
          <span className="ml-2 text-xs text-muted-foreground">
            {step === 1 ? 'Select Event' : step === 2 ? 'Add Message' : 'Share Link'}
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
                    selectedEvent === et.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="text-sm font-medium">{et.title}</div>
                  <div className="text-xs text-muted-foreground">{et.duration} min</div>
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
              <Label>Message (optional)</Label>
              <Textarea
                placeholder="Hi! Here's my availability for our meeting..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Booking Link</Label>
              <div className="flex gap-2">
                <Input value={bookingLink} readOnly className="bg-muted text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <Button onClick={handleSend}>
                <Send className="h-3.5 w-3.5 mr-1" /> Send Link
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
