import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft, Mail, Phone, Edit2, Trash2, Share2, CalendarPlus,
  Video, Clock, CheckCircle2, XCircle, CalendarDays, StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockContacts, mockMeetings, type Contact } from '@/data/contactsData';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { ShareAvailabilityModal } from '@/components/contacts/ShareAvailabilityModal';
import { ScheduleMeetingModal } from '@/components/contacts/ScheduleMeetingModal';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const statusConfig = {
  upcoming: { icon: CalendarDays, className: 'text-primary', label: 'Upcoming' },
  completed: { icon: CheckCircle2, className: 'text-emerald-600', label: 'Completed' },
  cancelled: { icon: XCircle, className: 'text-muted-foreground', label: 'Cancelled' },
};

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const contact = mockContacts.find(c => c.id === id);
  const meetings = useMemo(() =>
    mockMeetings.filter(m => m.contactId === id).sort((a, b) => b.date.getTime() - a.date.getTime()),
    [id]
  );
  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming');
  const pastMeetings = meetings.filter(m => m.status !== 'upcoming');

  const [notes, setNotes] = useState(contact?.notes || '');
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold mb-1">Contact not found</h3>
        <p className="text-sm text-muted-foreground mb-4">This contact may have been removed.</p>
        <Button variant="outline" onClick={() => navigate('/contacts')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Contacts
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    toast({ title: 'Contact deleted', description: `${contact.name} has been removed.` });
    navigate('/contacts');
  };

  const handleSaveContact = () => {
    toast({ title: 'Contact updated' });
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/contacts')} className="text-muted-foreground -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Contacts
      </Button>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}>
        {/* Left: Contact Info */}
        <div className="space-y-6">
          {/* Profile card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-3">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">{contact.avatar}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold">{contact.name}</h2>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setEditOpen(true)}>
                  <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit Contact
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setShareOpen(true)}>
                  <Share2 className="h-3.5 w-3.5 mr-2" /> Share Availability
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setScheduleOpen(true)}>
                  <CalendarPlus className="h-3.5 w-3.5 mr-2" /> Schedule Meeting
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Contact
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {contact.name}?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. All meeting history will be preserved.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Added {format(contact.createdAt, 'MMM d, yyyy')}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <StickyNote className="h-4 w-4" /> Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about this contact..."
                rows={4}
                className="text-sm"
              />
              {notes !== contact.notes && (
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => toast({ title: 'Notes saved' })}
                >
                  Save Notes
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Meetings */}
        <div className={`${isMobile ? '' : 'col-span-2'} space-y-6`}>
          {/* Upcoming */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Upcoming Meetings
                {upcomingMeetings.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] ml-1">{upcomingMeetings.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No upcoming meetings</p>
              ) : (
                <div className="space-y-2">
                  {upcomingMeetings.map(m => (
                    <MeetingCard key={m.id} meeting={m} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" /> Meeting History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pastMeetings.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No past meetings</p>
              ) : (
                <div className="space-y-2">
                  {pastMeetings.map(m => (
                    <MeetingCard key={m.id} meeting={m} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AddContactModal open={editOpen} onOpenChange={setEditOpen} contact={contact} onSave={handleSaveContact} />
      <ShareAvailabilityModal open={shareOpen} onOpenChange={setShareOpen} contact={contact} />
      <ScheduleMeetingModal open={scheduleOpen} onOpenChange={setScheduleOpen} contact={contact} />
    </div>
  );
}

function MeetingCard({ meeting }: { meeting: typeof mockMeetings[0] }) {
  const config = statusConfig[meeting.status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
      <StatusIcon className={`h-4 w-4 shrink-0 ${config.className}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{meeting.title}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
          <span>{format(meeting.date, 'MMM d, yyyy · h:mm a')}</span>
          <span>·</span>
          <span>{meeting.duration} min</span>
        </div>
        {meeting.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{meeting.notes}</p>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Badge variant="outline" className="text-[10px]">{config.label}</Badge>
        {meeting.meetingLink && meeting.status === 'upcoming' && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(meeting.meetingLink, '_blank')}>
            <Video className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
