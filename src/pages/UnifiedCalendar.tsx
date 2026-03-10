import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Plus, ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon,
  Clock, MapPin, Users, Video, ExternalLink, Pencil, Trash2, X,
  Globe, RefreshCw, AlertTriangle, Eye, EyeOff, Palette, MoreVertical
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths, isToday, setHours, setMinutes, differenceInMinutes } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Types
interface CalendarSource {
  id: string;
  name: string;
  provider: 'google' | 'zoho' | 'outlook';
  email: string;
  color: string;
  visible: boolean;
  syncing: boolean;
  lastSynced: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: string;
  location?: string;
  meetingLink?: string;
  attendees: string[];
  description?: string;
  isAllDay?: boolean;
}

type ViewMode = 'day' | 'week' | 'month';

const PROVIDER_ICONS: Record<string, string> = {
  google: '🔵',
  zoho: '🟣',
  outlook: '🔷',
};

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  zoho: 'Zoho',
  outlook: 'Outlook',
};

const CALENDAR_COLORS = [
  'hsl(207, 100%, 45%)', 'hsl(142, 71%, 45%)', 'hsl(346, 87%, 55%)',
  'hsl(262, 83%, 58%)', 'hsl(24, 95%, 53%)', 'hsl(173, 58%, 39%)',
  'hsl(43, 74%, 49%)', 'hsl(330, 81%, 60%)',
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo',
  'Asia/Kolkata', 'Asia/Dubai', 'Australia/Sydney',
];

// Mock data
const generateMockData = (): { calendars: CalendarSource[]; events: CalendarEvent[] } => {
  const today = new Date();
  const calendars: CalendarSource[] = [
    { id: 'cal-1', name: 'Work', provider: 'google', email: 'user@gmail.com', color: CALENDAR_COLORS[0], visible: true, syncing: false, lastSynced: new Date() },
    { id: 'cal-2', name: 'Personal', provider: 'google', email: 'user@gmail.com', color: CALENDAR_COLORS[1], visible: true, syncing: false, lastSynced: new Date() },
    { id: 'cal-3', name: 'Meetings', provider: 'zoho', email: 'user@zoho.com', color: CALENDAR_COLORS[3], visible: true, syncing: false, lastSynced: subDays(new Date(), 1) },
    { id: 'cal-4', name: 'Office 365', provider: 'outlook', email: 'user@outlook.com', color: CALENDAR_COLORS[2], visible: true, syncing: false, lastSynced: new Date() },
  ];

  const events: CalendarEvent[] = [
    { id: 'e1', title: 'Team Standup', start: setMinutes(setHours(today, 9), 0), end: setMinutes(setHours(today, 9), 30), calendarId: 'cal-1', attendees: ['alice@co.com', 'bob@co.com'], location: 'Room 3A', meetingLink: 'https://meet.google.com/abc' },
    { id: 'e2', title: 'Product Review', start: setMinutes(setHours(today, 11), 0), end: setMinutes(setHours(today, 12), 0), calendarId: 'cal-1', attendees: ['pm@co.com'], meetingLink: 'https://zoom.us/j/123' },
    { id: 'e3', title: 'Lunch with Sarah', start: setMinutes(setHours(today, 12), 30), end: setMinutes(setHours(today, 13), 30), calendarId: 'cal-2', attendees: ['sarah@email.com'], location: 'Downtown Café' },
    { id: 'e4', title: 'Client Call', start: setMinutes(setHours(today, 14), 0), end: setMinutes(setHours(today, 15), 0), calendarId: 'cal-3', attendees: ['client@biz.com', 'pm@co.com'], meetingLink: 'https://meet.google.com/xyz' },
    { id: 'e5', title: 'Sprint Planning', start: setMinutes(setHours(today, 15), 30), end: setMinutes(setHours(today, 16), 30), calendarId: 'cal-4', attendees: ['team@co.com'], location: 'Main Conference Room' },
    { id: 'e6', title: 'Yoga Class', start: setMinutes(setHours(today, 18), 0), end: setMinutes(setHours(today, 19), 0), calendarId: 'cal-2', attendees: [] },
    // Tomorrow
    { id: 'e7', title: 'Design Review', start: setMinutes(setHours(addDays(today, 1), 10), 0), end: setMinutes(setHours(addDays(today, 1), 11), 0), calendarId: 'cal-1', attendees: ['designer@co.com'] },
    { id: 'e8', title: '1:1 with Manager', start: setMinutes(setHours(addDays(today, 1), 14), 0), end: setMinutes(setHours(addDays(today, 1), 14), 45), calendarId: 'cal-1', attendees: ['manager@co.com'] },
    // Conflict example
    { id: 'e9', title: 'Board Meeting', start: setMinutes(setHours(today, 14), 0), end: setMinutes(setHours(today, 15), 30), calendarId: 'cal-4', attendees: ['board@co.com'], description: 'Quarterly board meeting', location: 'Boardroom' },
    // Day after tomorrow
    { id: 'e10', title: 'Workshop', start: setMinutes(setHours(addDays(today, 2), 9), 0), end: setMinutes(setHours(addDays(today, 2), 12), 0), calendarId: 'cal-3', attendees: ['team@co.com'] },
  ];

  return { calendars, events };
};

// --- Sub-components ---

const CalendarSidebar = ({
  calendars, onToggle, onColorChange, onDisconnect, searchQuery, onSearchChange
}: {
  calendars: CalendarSource[];
  onToggle: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onDisconnect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) => {
  const grouped = useMemo(() => {
    const map = new Map<string, CalendarSource[]>();
    calendars.forEach(c => {
      const key = c.provider;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return map;
  }, [calendars]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([provider, cals]) => (
            <div key={provider}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>{PROVIDER_ICONS[provider]}</span>
                {PROVIDER_LABELS[provider]}
              </p>
              <div className="space-y-1">
                {cals.map(cal => (
                  <div key={cal.id} className="flex items-center gap-2 group rounded-md px-2 py-1.5 hover:bg-accent/50 transition-colors">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="h-3 w-3 rounded-full shrink-0 ring-1 ring-border cursor-pointer hover:scale-125 transition-transform"
                          style={{ backgroundColor: cal.color }}
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="p-2">
                        <p className="text-xs font-medium mb-2 px-1">Pick color</p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {CALENDAR_COLORS.map(c => (
                            <button
                              key={c}
                              className={cn("h-6 w-6 rounded-full ring-1 ring-border hover:scale-110 transition-transform", cal.color === c && 'ring-2 ring-primary')}
                              style={{ backgroundColor: c }}
                              onClick={() => onColorChange(cal.id, c)}
                            />
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span className="text-sm flex-1 truncate">{cal.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => onDisconnect(cal.id)} className="p-0.5 rounded hover:bg-destructive/10">
                            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Disconnect</TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      checked={cal.visible}
                      onCheckedChange={() => onToggle(cal.id)}
                      className="scale-75"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-3 text-center">
        <p className="text-[10px] text-muted-foreground">
          {calendars.filter(c => c.visible).length} of {calendars.length} calendars visible
        </p>
      </div>
    </div>
  );
};

// Event Block
const EventBlock = ({
  event, calendar, style, onClick, isConflict
}: {
  event: CalendarEvent;
  calendar: CalendarSource;
  style: React.CSSProperties;
  onClick: () => void;
  isConflict: boolean;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "absolute left-1 right-1 rounded-md px-2 py-1 text-left overflow-hidden cursor-pointer transition-all hover:shadow-md hover:brightness-95 group border-l-[3px]",
      isConflict && "ring-1 ring-destructive/40"
    )}
    style={{
      ...style,
      backgroundColor: `${calendar.color}18`,
      borderLeftColor: calendar.color,
    }}
  >
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-medium truncate text-foreground">{event.title}</span>
      {isConflict && <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />}
    </div>
    <div className="flex items-center gap-1 mt-0.5">
      <Clock className="h-2.5 w-2.5 text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground">
        {format(event.start, 'h:mm a')} – {format(event.end, 'h:mm a')}
      </span>
    </div>
    {event.attendees.length > 0 && (
      <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Users className="h-2.5 w-2.5 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{event.attendees.length}</span>
      </div>
    )}
  </button>
);

// Event Detail Panel
const EventDetailPanel = ({
  event, calendar, onClose, onEdit, onDelete, conflicts
}: {
  event: CalendarEvent;
  calendar: CalendarSource;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  conflicts: CalendarEvent[];
}) => (
  <div className="space-y-5">
    {/* Header */}
    <div className="flex items-start gap-3">
      <div className="h-3 w-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: calendar.color }} />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
          <span>{PROVIDER_ICONS[calendar.provider]}</span>
          {calendar.name} · {calendar.email}
        </p>
      </div>
    </div>

    {/* Conflict Warning */}
    {conflicts.length > 0 && (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-destructive">Scheduling Conflict</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overlaps with: {conflicts.map(c => c.title).join(', ')}
          </p>
        </div>
      </div>
    )}

    <Separator />

    {/* Details */}
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        <span>{format(event.start, 'EEEE, MMMM d, yyyy')}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
        <span>{format(event.start, 'h:mm a')} – {format(event.end, 'h:mm a')} ({differenceInMinutes(event.end, event.start)} min)</span>
      </div>
      {event.location && (
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{event.location}</span>
        </div>
      )}
      {event.meetingLink && (
        <div className="flex items-center gap-3 text-sm">
          <Video className="h-4 w-4 text-muted-foreground shrink-0" />
          <a href={event.meetingLink} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
            Join Meeting <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
      {event.attendees.length > 0 && (
        <div className="flex items-start gap-3 text-sm">
          <Users className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {event.attendees.map((a, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">{a}</Badge>
            ))}
          </div>
        </div>
      )}
      {event.description && (
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>
      )}
    </div>

    <Separator />

    {/* Actions */}
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
        <Pencil className="h-3.5 w-3.5" /> Edit
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5" /> Cancel
      </Button>
      {event.meetingLink && (
        <Button size="sm" className="gap-1.5 ml-auto" asChild>
          <a href={event.meetingLink} target="_blank" rel="noreferrer">
            <Video className="h-3.5 w-3.5" /> Join
          </a>
        </Button>
      )}
    </div>
  </div>
);

// Quick Booking Form
const QuickBookingForm = ({
  initialDate, initialHour, calendars, onClose, onSubmit
}: {
  initialDate: Date;
  initialHour: number;
  calendars: CalendarSource[];
  onClose: () => void;
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
}) => {
  const [title, setTitle] = useState('');
  const [calendarId, setCalendarId] = useState(calendars[0]?.id || '');
  const [duration, setDuration] = useState('30');
  const [attendees, setAttendees] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');

  const startTime = setMinutes(setHours(initialDate, initialHour), 0);
  const endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Event Title</Label>
        <Input placeholder="Meeting title" value={title} onChange={e => setTitle(e.target.value)} className="h-9" autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Date & Time</Label>
          <div className="text-sm text-foreground bg-muted/50 rounded-md px-3 py-2">
            {format(startTime, 'MMM d, h:mm a')}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 min</SelectItem>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="45">45 min</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Calendar</Label>
        <Select value={calendarId} onValueChange={setCalendarId}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {calendars.filter(c => c.visible).map(c => (
              <SelectItem key={c.id} value={c.id}>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Attendees (comma separated)</Label>
        <Input placeholder="email@example.com" value={attendees} onChange={e => setAttendees(e.target.value)} className="h-9" />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Meeting Link</Label>
        <Input placeholder="https://zoom.us/j/..." value={meetingLink} onChange={e => setMeetingLink(e.target.value)} className="h-9" />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Notes</Label>
        <Textarea placeholder="Add notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" disabled={!title.trim()} onClick={() => {
          onSubmit({
            title: title.trim(),
            start: startTime,
            end: endTime,
            calendarId,
            attendees: attendees.split(',').map(a => a.trim()).filter(Boolean),
            meetingLink: meetingLink || undefined,
            description: notes || undefined,
          });
          onClose();
        }}>
          Create Booking
        </Button>
      </div>
    </div>
  );
};


// ============ MAIN COMPONENT ============

const UnifiedCalendar = () => {
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  const isMobile = useIsMobile();

  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? 'day' : 'week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');

  const [calendars, setCalendars] = useState<CalendarSource[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [quickBookSlot, setQuickBookSlot] = useState<{ date: Date; hour: number } | null>(null);

  // Init mock data
  useEffect(() => {
    const mock = generateMockData();
    setCalendars(mock.calendars);
    setEvents(mock.events);
  }, []);

  useEffect(() => {
    setHeaderMeta({ title: 'Unified Calendar', description: 'View and manage all your connected calendars in one place.' });
  }, [setHeaderMeta]);

  useEffect(() => {
    if (isMobile) setViewMode('day');
  }, [isMobile]);

  // Navigation
  const navigate = useCallback((dir: 'prev' | 'next') => {
    setCurrentDate(d => {
      if (viewMode === 'day') return dir === 'next' ? addDays(d, 1) : subDays(d, 1);
      if (viewMode === 'week') return dir === 'next' ? addWeeks(d, 1) : subWeeks(d, 1);
      return dir === 'next' ? addMonths(d, 1) : subMonths(d, 1);
    });
  }, [viewMode]);

  const goToToday = () => setCurrentDate(new Date());

  // Visible events
  const visibleCalendarIds = useMemo(() => new Set(calendars.filter(c => c.visible).map(c => c.id)), [calendars]);

  const filteredEvents = useMemo(() => {
    let evts = events.filter(e => visibleCalendarIds.has(e.calendarId));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      evts = evts.filter(e => e.title.toLowerCase().includes(q) || e.attendees.some(a => a.toLowerCase().includes(q)));
    }
    return evts;
  }, [events, visibleCalendarIds, searchQuery]);

  // Conflict detection
  const getConflicts = useCallback((event: CalendarEvent) => {
    return filteredEvents.filter(
      e => e.id !== event.id && e.start < event.end && e.end > event.start
    );
  }, [filteredEvents]);

  // Date range for current view
  const viewDays = useMemo(() => {
    if (viewMode === 'day') return [currentDate];
    if (viewMode === 'week') {
      const s = startOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: s, end: addDays(s, 6) });
    }
    const s = startOfMonth(currentDate);
    const e = endOfMonth(currentDate);
    const weekStart = startOfWeek(s, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(e, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate, viewMode]);

  // Title
  const headerTitle = useMemo(() => {
    if (viewMode === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
    if (viewMode === 'week') {
      const s = startOfWeek(currentDate, { weekStartsOn: 1 });
      const e = addDays(s, 6);
      return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
  }, [currentDate, viewMode]);

  // Calendar actions
  const toggleCalendar = (id: string) => setCalendars(cs => cs.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  const changeCalendarColor = (id: string, color: string) => setCalendars(cs => cs.map(c => c.id === id ? { ...c, color } : c));
  const disconnectCalendar = (id: string) => {
    setCalendars(cs => cs.filter(c => c.id !== id));
    setEvents(es => es.filter(e => e.calendarId !== id));
  };

  const addEvent = (evt: Omit<CalendarEvent, 'id'>) => {
    setEvents(es => [...es, { ...evt, id: `e-${Date.now()}` }]);
  };

  const deleteEvent = (id: string) => {
    setEvents(es => es.filter(e => e.id !== id));
    setSelectedEvent(null);
  };

  const calendarMap = useMemo(() => new Map(calendars.map(c => [c.id, c])), [calendars]);

  // Current time position
  const now = new Date();
  const currentTimeTop = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100;

  // ---- RENDERS ----

  const renderDayColumn = (day: Date, colWidth?: string) => {
    const dayEvents = filteredEvents.filter(e => isSameDay(e.start, day));

    // Group overlapping events
    const sortedEvents = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
    const columns: CalendarEvent[][] = [];
    sortedEvents.forEach(evt => {
      let placed = false;
      for (const col of columns) {
        const last = col[col.length - 1];
        if (last.end <= evt.start) { col.push(evt); placed = true; break; }
      }
      if (!placed) columns.push([evt]);
    });

    const eventColumnMap = new Map<string, { col: number; totalCols: number }>();
    columns.forEach((col, colIdx) => {
      col.forEach(evt => eventColumnMap.set(evt.id, { col: colIdx, totalCols: columns.length }));
    });

    return (
      <div key={day.toISOString()} className={cn("relative", colWidth)} style={{ minHeight: '1440px' }}>
        {/* Hour lines */}
        {HOURS.map(h => (
          <div
            key={h}
            className="absolute left-0 right-0 border-t border-border/50 cursor-pointer hover:bg-accent/30 transition-colors"
            style={{ top: `${(h / 24) * 100}%`, height: `${100 / 24}%` }}
            onClick={() => setQuickBookSlot({ date: day, hour: h })}
          />
        ))}
        {/* Current time line */}
        {isToday(day) && (
          <div className="absolute left-0 right-0 z-20 flex items-center pointer-events-none" style={{ top: `${currentTimeTop}%` }}>
            <div className="h-2.5 w-2.5 rounded-full bg-destructive -ml-1" />
            <div className="flex-1 h-[2px] bg-destructive" />
          </div>
        )}
        {/* Events */}
        {dayEvents.map(evt => {
          const cal = calendarMap.get(evt.calendarId);
          if (!cal) return null;
          const startMin = evt.start.getHours() * 60 + evt.start.getMinutes();
          const durMin = differenceInMinutes(evt.end, evt.start);
          const topPct = (startMin / 1440) * 100;
          const heightPct = Math.max((durMin / 1440) * 100, (20 / 1440) * 100);
          const colInfo = eventColumnMap.get(evt.id) || { col: 0, totalCols: 1 };
          const widthPct = 100 / colInfo.totalCols;
          const leftPct = colInfo.col * widthPct;
          const conflicts = getConflicts(evt);
          return (
            <EventBlock
              key={evt.id}
              event={evt}
              calendar={cal}
              isConflict={conflicts.length > 0}
              onClick={() => setSelectedEvent(evt)}
              style={{
                top: `${topPct}%`,
                height: `${heightPct}%`,
                left: `calc(${leftPct}% + 4px)`,
                width: `calc(${widthPct}% - 8px)`,
                minHeight: '24px',
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderTimeLabels = () => (
    <div className="relative w-14 shrink-0" style={{ minHeight: '1440px' }}>
      {HOURS.map(h => (
        <div
          key={h}
          className="absolute left-0 right-0 text-[10px] text-muted-foreground pr-2 text-right -translate-y-1/2"
          style={{ top: `${(h / 24) * 100}%` }}
        >
          {format(setHours(new Date(), h), 'ha')}
        </div>
      ))}
    </div>
  );

  const renderDayView = () => (
    <div className="flex">
      {renderTimeLabels()}
      <div className="flex-1 border-l border-border">
        {renderDayColumn(currentDate)}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div>
      {/* Day headers */}
      <div className="flex border-b border-border sticky top-0 bg-background z-10">
        <div className="w-14 shrink-0" />
        {viewDays.map(day => (
          <div
            key={day.toISOString()}
            className={cn(
              "flex-1 text-center py-2 border-l border-border cursor-pointer hover:bg-accent/30 transition-colors",
              isToday(day) && "bg-primary/5"
            )}
            onClick={() => { setCurrentDate(day); setViewMode('day'); }}
          >
            <p className="text-[10px] text-muted-foreground uppercase">{format(day, 'EEE')}</p>
            <p className={cn(
              "text-sm font-medium mt-0.5",
              isToday(day) && "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto"
            )}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>
      {/* Grid */}
      <div className="flex">
        {renderTimeLabels()}
        <div className="flex flex-1">
          {viewDays.map(day => (
            <div key={day.toISOString()} className="flex-1 border-l border-border">
              {renderDayColumn(day)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div>
      {/* Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center py-2 text-xs text-muted-foreground font-medium">{d}</div>
        ))}
      </div>
      {/* Days */}
      <div className="grid grid-cols-7">
        {viewDays.map(day => {
          const dayEvents = filteredEvents.filter(e => isSameDay(e.start, day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[100px] border-b border-r border-border p-1.5 cursor-pointer hover:bg-accent/30 transition-colors",
                !isCurrentMonth && "bg-muted/30"
              )}
              onClick={() => { setCurrentDate(day); setViewMode('day'); }}
            >
              <p className={cn(
                "text-xs font-medium mb-1",
                isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center",
                !isCurrentMonth && "text-muted-foreground"
              )}>
                {format(day, 'd')}
              </p>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map(evt => {
                  const cal = calendarMap.get(evt.calendarId);
                  return (
                    <button
                      key={evt.id}
                      className="w-full text-left text-[10px] rounded px-1 py-0.5 truncate hover:brightness-90 transition-colors"
                      style={{ backgroundColor: `${cal?.color || '#888'}25`, color: cal?.color }}
                      onClick={e => { e.stopPropagation(); setSelectedEvent(evt); }}
                    >
                      {format(evt.start, 'h:mma')} {evt.title}
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const connectedProviders = useMemo(() => [...new Set(calendars.map(c => c.provider))], [calendars]);

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="flex items-center gap-2 px-4 py-2.5 flex-wrap">
          {/* Sidebar toggle */}
          {!isMobile && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          {isMobile && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          )}

          {/* Connected indicators */}
          <div className="flex items-center gap-1">
            {connectedProviders.map(p => (
              <Tooltip key={p}>
                <TooltipTrigger>
                  <span className="text-base">{PROVIDER_ICONS[p]}</span>
                </TooltipTrigger>
                <TooltipContent>{PROVIDER_LABELS[p]} connected</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Nav */}
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={goToToday}>Today</Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm font-medium text-foreground whitespace-nowrap">{headerTitle}</span>

          <div className="ml-auto flex items-center gap-2">
            {/* View switcher */}
            <div className="flex bg-muted rounded-md p-0.5">
              {(['day', 'week', 'month'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded font-medium transition-colors capitalize",
                    viewMode === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setViewMode(v)}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Timezone */}
            {!isMobile && (
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-8 w-auto text-xs gap-1">
                  <Globe className="h-3 w-3" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => (
                    <SelectItem key={tz} value={tz} className="text-xs">{tz.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && sidebarOpen && (
          <div className="w-56 shrink-0 border-r border-border bg-card/50 h-[calc(100vh-105px)] sticky top-[105px]">
            <CalendarSidebar
              calendars={calendars}
              onToggle={toggleCalendar}
              onColorChange={changeCalendarColor}
              onDisconnect={disconnectCalendar}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {/* Mobile sidebar drawer */}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-4 pt-4">
                <SheetTitle>Calendars</SheetTitle>
              </SheetHeader>
              <CalendarSidebar
                calendars={calendars}
                onToggle={toggleCalendar}
                onColorChange={changeCalendarColor}
                onDisconnect={disconnectCalendar}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </SheetContent>
          </Sheet>
        )}

        {/* Calendar Grid */}
        <ScrollArea className="flex-1 h-[calc(100vh-105px)]">
          <div className="min-w-0">
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'month' && renderMonthView()}
          </div>
        </ScrollArea>
      </div>

      {/* Event Detail (Sheet on desktop, Dialog on mobile) */}
      {selectedEvent && !isMobile && (
        <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Event Details</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <EventDetailPanel
                event={selectedEvent}
                calendar={calendarMap.get(selectedEvent.calendarId)!}
                onClose={() => setSelectedEvent(null)}
                onEdit={() => {}}
                onDelete={() => deleteEvent(selectedEvent.id)}
                conflicts={getConflicts(selectedEvent)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {selectedEvent && isMobile && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-[95vw]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            <EventDetailPanel
              event={selectedEvent}
              calendar={calendarMap.get(selectedEvent.calendarId)!}
              onClose={() => setSelectedEvent(null)}
              onEdit={() => {}}
              onDelete={() => deleteEvent(selectedEvent.id)}
              conflicts={getConflicts(selectedEvent)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Quick Booking */}
      <Dialog open={!!quickBookSlot} onOpenChange={() => setQuickBookSlot(null)}>
        <DialogContent className={isMobile ? 'max-w-[95vw]' : 'sm:max-w-lg'}>
          <DialogHeader>
            <DialogTitle>Quick Booking</DialogTitle>
          </DialogHeader>
          {quickBookSlot && (
            <QuickBookingForm
              initialDate={quickBookSlot.date}
              initialHour={quickBookSlot.hour}
              calendars={calendars.filter(c => c.visible)}
              onClose={() => setQuickBookSlot(null)}
              onSubmit={addEvent}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedCalendar;
