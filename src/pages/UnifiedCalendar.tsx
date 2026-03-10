import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  Clock, MapPin, Users, Video, ExternalLink, Pencil, Trash2,
  Globe, AlertTriangle, PanelLeftClose, PanelLeft
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths, isToday, setHours, setMinutes, differenceInMinutes } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// ── Types ──
interface CalendarSource {
  id: string;
  name: string;
  provider: 'google' | 'zoho' | 'outlook';
  email: string;
  color: string;
  visible: boolean;
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
}

type ViewMode = 'day' | 'week' | 'month';

// ── Muted 4-color palette ──
const PALETTE = {
  slateBlue: 'hsl(220, 30%, 58%)',
  softEmerald: 'hsl(158, 28%, 50%)',
  mutedPurple: 'hsl(265, 25%, 58%)',
  neutralGray: 'hsl(220, 10%, 55%)',
};
const CALENDAR_COLORS = [PALETTE.slateBlue, PALETTE.softEmerald, PALETTE.mutedPurple, PALETTE.neutralGray];

const PROVIDER_LABELS: Record<string, string> = { google: 'GOOGLE', zoho: 'ZOHO', outlook: 'OUTLOOK' };
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo',
  'Asia/Kolkata', 'Asia/Dubai', 'Australia/Sydney',
];

// ── Mock data ──
const generateMockData = () => {
  const today = new Date();
  const calendars: CalendarSource[] = [
    { id: 'cal-1', name: 'Work', provider: 'google', email: 'user@gmail.com', color: PALETTE.slateBlue, visible: true },
    { id: 'cal-2', name: 'Personal', provider: 'google', email: 'user@gmail.com', color: PALETTE.softEmerald, visible: true },
    { id: 'cal-3', name: 'Meetings', provider: 'zoho', email: 'user@zoho.com', color: PALETTE.mutedPurple, visible: true },
    { id: 'cal-4', name: 'Office 365', provider: 'outlook', email: 'user@outlook.com', color: PALETTE.neutralGray, visible: true },
  ];
  const events: CalendarEvent[] = [
    { id: 'e1', title: 'Team Standup', start: setMinutes(setHours(today, 9), 0), end: setMinutes(setHours(today, 9), 30), calendarId: 'cal-1', attendees: ['alice@co.com', 'bob@co.com'], location: 'Room 3A', meetingLink: 'https://meet.google.com/abc' },
    { id: 'e2', title: 'Product Review', start: setMinutes(setHours(today, 11), 0), end: setMinutes(setHours(today, 12), 0), calendarId: 'cal-1', attendees: ['pm@co.com'], meetingLink: 'https://zoom.us/j/123' },
    { id: 'e3', title: 'Lunch with Sarah', start: setMinutes(setHours(today, 12), 30), end: setMinutes(setHours(today, 13), 30), calendarId: 'cal-2', attendees: ['sarah@email.com'], location: 'Downtown Café' },
    { id: 'e4', title: 'Client Call', start: setMinutes(setHours(today, 14), 0), end: setMinutes(setHours(today, 15), 0), calendarId: 'cal-3', attendees: ['client@biz.com', 'pm@co.com'], meetingLink: 'https://meet.google.com/xyz' },
    { id: 'e5', title: 'Sprint Planning', start: setMinutes(setHours(today, 15), 30), end: setMinutes(setHours(today, 16), 30), calendarId: 'cal-4', attendees: ['team@co.com'], location: 'Main Conference Room' },
    { id: 'e6', title: 'Yoga Class', start: setMinutes(setHours(today, 18), 0), end: setMinutes(setHours(today, 19), 0), calendarId: 'cal-2', attendees: [] },
    { id: 'e7', title: 'Design Review', start: setMinutes(setHours(addDays(today, 1), 10), 0), end: setMinutes(setHours(addDays(today, 1), 11), 0), calendarId: 'cal-1', attendees: ['designer@co.com'] },
    { id: 'e8', title: '1:1 with Manager', start: setMinutes(setHours(addDays(today, 1), 14), 0), end: setMinutes(setHours(addDays(today, 1), 14), 45), calendarId: 'cal-1', attendees: ['manager@co.com'] },
    { id: 'e9', title: 'Board Meeting', start: setMinutes(setHours(today, 14), 0), end: setMinutes(setHours(today, 15), 30), calendarId: 'cal-4', attendees: ['board@co.com'], description: 'Quarterly board meeting', location: 'Boardroom' },
    { id: 'e10', title: 'Workshop', start: setMinutes(setHours(addDays(today, 2), 9), 0), end: setMinutes(setHours(addDays(today, 2), 12), 0), calendarId: 'cal-3', attendees: ['team@co.com'] },
  ];
  return { calendars, events };
};

// ══════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════
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
      if (!map.has(c.provider)) map.set(c.provider, []);
      map.get(c.provider)!.push(c);
    });
    return map;
  }, [calendars]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs bg-muted/40 border-0 focus-visible:ring-1"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-5 pb-4">
          {Array.from(grouped.entries()).map(([provider, cals]) => (
            <div key={provider}>
              <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-[0.1em] mb-2.5">
                {PROVIDER_LABELS[provider]}
              </p>
              <div className="space-y-0.5">
                {cals.map(cal => (
                  <div
                    key={cal.id}
                    className="flex items-center gap-2.5 group rounded-md px-2 py-2 hover:bg-muted/50 transition-colors"
                  >
                    {/* Color dot — click to change */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="shrink-0 focus:outline-none">
                          <div
                            className="h-2 w-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: cal.color }}
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="p-2.5 w-auto">
                        <p className="text-[10px] font-medium text-muted-foreground mb-2">Calendar color</p>
                        <div className="flex gap-2">
                          {CALENDAR_COLORS.map(c => (
                            <button
                              key={c}
                              className={cn(
                                "h-5 w-5 rounded-full transition-all hover:scale-110",
                                cal.color === c && 'ring-2 ring-foreground/20 ring-offset-2 ring-offset-background'
                              )}
                              style={{ backgroundColor: c }}
                              onClick={() => onColorChange(cal.id, c)}
                            />
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <span className={cn("text-[13px] flex-1 truncate transition-colors", cal.visible ? "text-foreground" : "text-muted-foreground/50")}>
                      {cal.name}
                    </span>

                    {/* Disconnect — shown on hover */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onDisconnect(cal.id)}
                          className="p-0.5 rounded opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">Disconnect</TooltipContent>
                    </Tooltip>

                    <Switch
                      checked={cal.visible}
                      onCheckedChange={() => onToggle(cal.id)}
                      className="scale-[0.65] origin-right"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="px-4 py-3 border-t border-border/40">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          {calendars.filter(c => c.visible).length} of {calendars.length} visible
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// EVENT BLOCK (Clean card style)
// ══════════════════════════════════════════════
const EventBlock = ({
  event, calendar, style, onClick, isConflict, calendarMap, getConflicts
}: {
  event: CalendarEvent;
  calendar: CalendarSource;
  style: React.CSSProperties;
  onClick: () => void;
  isConflict: boolean;
  calendarMap: Map<string, CalendarSource>;
  getConflicts: (e: CalendarEvent) => CalendarEvent[];
}) => {
  const providerLabel = PROVIDER_LABELS[calendar.provider];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "absolute rounded-[6px] px-2.5 py-1.5 text-left overflow-hidden cursor-pointer",
            "bg-background border border-border/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]",
            "hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:border-border transition-all duration-150",
            "border-l-[3px] group"
          )}
          style={{
            ...style,
            borderLeftColor: isConflict ? 'hsl(0, 65%, 55%)' : calendar.color,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium truncate text-foreground leading-tight">{event.title}</span>
            {isConflict && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-2.5 w-2.5 text-destructive/70 shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="text-xs">Conflict with another event</TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight">
            {format(event.start, 'h:mm')} – {format(event.end, 'h:mm a')}
          </p>
          <p className="text-[9px] text-muted-foreground/50 mt-0.5 leading-tight">
            {providerLabel}
          </p>
        </button>
      </PopoverTrigger>
      {/* Hover preview card */}
      <PopoverContent
        side="right"
        align="start"
        className="w-56 p-0 shadow-lg border border-border/60 rounded-lg"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="p-3 space-y-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">{event.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(event.start, 'h:mm a')} – {format(event.end, 'h:mm a')}
            </p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{calendar.name} · {providerLabel}</p>
          </div>
          {isConflict && (
            <div className="flex items-center gap-1.5 text-[11px] text-destructive/80 bg-destructive/5 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Scheduling conflict</span>
            </div>
          )}
          <Separator className="bg-border/40" />
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground" onClick={onClick}>
              <Pencil className="h-3 w-3" /> Edit
            </Button>
            {event.meetingLink && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2 text-muted-foreground hover:text-foreground" asChild>
                <a href={event.meetingLink} target="_blank" rel="noreferrer">
                  <Video className="h-3 w-3" /> Join
                </a>
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ══════════════════════════════════════════════
// EVENT DETAIL PANEL
// ══════════════════════════════════════════════
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
    <div className="flex items-start gap-3">
      <div className="h-2.5 w-2.5 rounded-full mt-2 shrink-0 opacity-70" style={{ backgroundColor: calendar.color }} />
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-foreground">{event.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {calendar.name} · {PROVIDER_LABELS[calendar.provider]}
        </p>
      </div>
    </div>

    {conflicts.length > 0 && (
      <div className="flex items-center gap-2 text-xs text-destructive/80 bg-destructive/5 border border-destructive/10 rounded-md px-3 py-2">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>Overlaps with {conflicts.map(c => c.title).join(', ')}</span>
      </div>
    )}

    <Separator className="bg-border/40" />

    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm text-foreground/80">
        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
        <span>{format(event.start, 'EEEE, MMMM d, yyyy')}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-foreground/80">
        <Clock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
        <span>{format(event.start, 'h:mm a')} – {format(event.end, 'h:mm a')} · {differenceInMinutes(event.end, event.start)} min</span>
      </div>
      {event.location && (
        <div className="flex items-center gap-3 text-sm text-foreground/80">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          <span>{event.location}</span>
        </div>
      )}
      {event.meetingLink && (
        <div className="flex items-center gap-3 text-sm">
          <Video className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          <a href={event.meetingLink} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
            Join Meeting <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
      {event.attendees.length > 0 && (
        <div className="flex items-start gap-3 text-sm">
          <Users className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {event.attendees.map((a, i) => (
              <Badge key={i} variant="secondary" className="text-[11px] font-normal bg-muted/60 text-muted-foreground">{a}</Badge>
            ))}
          </div>
        </div>
      )}
      {event.description && (
        <p className="text-sm text-muted-foreground/80 pl-7">{event.description}</p>
      )}
    </div>

    <Separator className="bg-border/40" />

    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border/60" onClick={onEdit}>
        <Pencil className="h-3 w-3" /> Edit
      </Button>
      <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-destructive/70 hover:text-destructive border-border/60" onClick={onDelete}>
        <Trash2 className="h-3 w-3" /> Cancel
      </Button>
      {event.meetingLink && (
        <Button size="sm" className="h-8 gap-1.5 text-xs ml-auto" asChild>
          <a href={event.meetingLink} target="_blank" rel="noreferrer">
            <Video className="h-3 w-3" /> Join
          </a>
        </Button>
      )}
    </div>
  </div>
);

// ══════════════════════════════════════════════
// QUICK BOOKING FORM
// ══════════════════════════════════════════════
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
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Event Title</Label>
        <Input placeholder="Meeting title" value={title} onChange={e => setTitle(e.target.value)} className="h-9" autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Date & Time</Label>
          <div className="text-sm text-foreground/80 bg-muted/30 rounded-md px-3 py-2 border border-border/40">
            {format(startTime, 'MMM d, h:mm a')}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Duration</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['15', '30', '45', '60', '90', '120'].map(v => (
                <SelectItem key={v} value={v}>{parseInt(v) < 60 ? `${v} min` : `${parseInt(v) / 60} hr${parseInt(v) > 60 ? 's' : ''}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Calendar</Label>
        <Select value={calendarId} onValueChange={setCalendarId}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {calendars.map(c => (
              <SelectItem key={c.id} value={c.id}>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full opacity-70" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Attendees</Label>
        <Input placeholder="email@example.com (comma separated)" value={attendees} onChange={e => setAttendees(e.target.value)} className="h-9" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Meeting Link</Label>
        <Input placeholder="https://zoom.us/j/..." value={meetingLink} onChange={e => setMeetingLink(e.target.value)} className="h-9" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Notes</Label>
        <Textarea placeholder="Add notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="resize-none" />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClose}>Cancel</Button>
        <Button size="sm" className="h-8 text-xs" disabled={!title.trim()} onClick={() => {
          onSubmit({
            title: title.trim(), start: startTime, end: endTime, calendarId,
            attendees: attendees.split(',').map(a => a.trim()).filter(Boolean),
            meetingLink: meetingLink || undefined, description: notes || undefined,
          });
          onClose();
        }}>
          Create Booking
        </Button>
      </div>
    </div>
  );
};


// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
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

  useEffect(() => { const m = generateMockData(); setCalendars(m.calendars); setEvents(m.events); }, []);
  useEffect(() => { setHeaderMeta({ title: 'Unified Calendar', description: 'View and manage all your connected calendars in one place.' }); }, [setHeaderMeta]);
  useEffect(() => { if (isMobile) setViewMode('day'); }, [isMobile]);

  const nav = useCallback((dir: 'prev' | 'next') => {
    setCurrentDate(d => {
      if (viewMode === 'day') return dir === 'next' ? addDays(d, 1) : subDays(d, 1);
      if (viewMode === 'week') return dir === 'next' ? addWeeks(d, 1) : subWeeks(d, 1);
      return dir === 'next' ? addMonths(d, 1) : subMonths(d, 1);
    });
  }, [viewMode]);

  const visibleCalendarIds = useMemo(() => new Set(calendars.filter(c => c.visible).map(c => c.id)), [calendars]);
  const filteredEvents = useMemo(() => {
    let evts = events.filter(e => visibleCalendarIds.has(e.calendarId));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      evts = evts.filter(e => e.title.toLowerCase().includes(q) || e.attendees.some(a => a.toLowerCase().includes(q)));
    }
    return evts;
  }, [events, visibleCalendarIds, searchQuery]);

  const getConflicts = useCallback((event: CalendarEvent) => filteredEvents.filter(e => e.id !== event.id && e.start < event.end && e.end > event.start), [filteredEvents]);

  const viewDays = useMemo(() => {
    if (viewMode === 'day') return [currentDate];
    if (viewMode === 'week') { const s = startOfWeek(currentDate, { weekStartsOn: 1 }); return eachDayOfInterval({ start: s, end: addDays(s, 6) }); }
    const s = startOfMonth(currentDate); const e = endOfMonth(currentDate);
    return eachDayOfInterval({ start: startOfWeek(s, { weekStartsOn: 1 }), end: endOfWeek(e, { weekStartsOn: 1 }) });
  }, [currentDate, viewMode]);

  const headerTitle = useMemo(() => {
    if (viewMode === 'day') return format(currentDate, 'EEEE, MMMM d, yyyy');
    if (viewMode === 'week') { const s = startOfWeek(currentDate, { weekStartsOn: 1 }); return `${format(s, 'MMM d')} – ${format(addDays(s, 6), 'MMM d, yyyy')}`; }
    return format(currentDate, 'MMMM yyyy');
  }, [currentDate, viewMode]);

  const toggleCalendar = (id: string) => setCalendars(cs => cs.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  const changeCalendarColor = (id: string, color: string) => setCalendars(cs => cs.map(c => c.id === id ? { ...c, color } : c));
  const disconnectCalendar = (id: string) => { setCalendars(cs => cs.filter(c => c.id !== id)); setEvents(es => es.filter(e => e.calendarId !== id)); };
  const addEvent = (evt: Omit<CalendarEvent, 'id'>) => setEvents(es => [...es, { ...evt, id: `e-${Date.now()}` }]);
  const deleteEvent = (id: string) => { setEvents(es => es.filter(e => e.id !== id)); setSelectedEvent(null); };
  const calendarMap = useMemo(() => new Map(calendars.map(c => [c.id, c])), [calendars]);

  const now = new Date();
  const currentTimeTop = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100;

  // ── Render helpers ──

  const renderDayColumn = (day: Date) => {
    const dayEvents = filteredEvents.filter(e => isSameDay(e.start, day));
    const sorted = [...dayEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
    const columns: CalendarEvent[][] = [];
    sorted.forEach(evt => {
      let placed = false;
      for (const col of columns) { if (col[col.length - 1].end <= evt.start) { col.push(evt); placed = true; break; } }
      if (!placed) columns.push([evt]);
    });
    const evtColMap = new Map<string, { col: number; total: number }>();
    columns.forEach((col, ci) => col.forEach(evt => evtColMap.set(evt.id, { col: ci, total: columns.length })));

    return (
      <div key={day.toISOString()} className="relative" style={{ minHeight: '1440px' }}>
        {HOURS.map(h => (
          <div
            key={h}
            className="absolute left-0 right-0 border-t border-border/20 cursor-pointer hover:bg-muted/20 transition-colors"
            style={{ top: `${(h / 24) * 100}%`, height: `${100 / 24}%` }}
            onClick={() => setQuickBookSlot({ date: day, hour: h })}
          />
        ))}
        {/* Half-hour lines */}
        {HOURS.map(h => (
          <div key={`half-${h}`} className="absolute left-0 right-0 border-t border-border/[0.08]" style={{ top: `${((h + 0.5) / 24) * 100}%` }} />
        ))}
        {isToday(day) && (
          <div className="absolute left-0 right-0 z-20 flex items-center pointer-events-none" style={{ top: `${currentTimeTop}%` }}>
            <div className="h-2 w-2 rounded-full bg-destructive/70 -ml-1" />
            <div className="flex-1 h-px bg-destructive/50" />
          </div>
        )}
        {dayEvents.map(evt => {
          const cal = calendarMap.get(evt.calendarId);
          if (!cal) return null;
          const startMin = evt.start.getHours() * 60 + evt.start.getMinutes();
          const durMin = differenceInMinutes(evt.end, evt.start);
          const topPct = (startMin / 1440) * 100;
          const heightPct = Math.max((durMin / 1440) * 100, (20 / 1440) * 100);
          const ci = evtColMap.get(evt.id) || { col: 0, total: 1 };
          const wPct = 100 / ci.total;
          const lPct = ci.col * wPct;
          return (
            <EventBlock
              key={evt.id}
              event={evt}
              calendar={cal}
              isConflict={getConflicts(evt).length > 0}
              onClick={() => setSelectedEvent(evt)}
              calendarMap={calendarMap}
              getConflicts={getConflicts}
              style={{
                top: `${topPct}%`, height: `${heightPct}%`,
                left: `calc(${lPct}% + 4px)`, width: `calc(${wPct}% - 8px)`, minHeight: '28px',
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderTimeLabels = () => (
    <div className="relative w-12 shrink-0" style={{ minHeight: '1440px' }}>
      {HOURS.map(h => (
        <div key={h} className="absolute left-0 right-0 text-[10px] text-muted-foreground/50 pr-2 text-right -translate-y-1/2 font-light" style={{ top: `${(h / 24) * 100}%` }}>
          {h === 0 ? '' : format(setHours(new Date(), h), 'ha').toLowerCase()}
        </div>
      ))}
    </div>
  );

  const renderDayView = () => (
    <div className="flex">
      {renderTimeLabels()}
      <div className="flex-1 border-l border-border/20">{renderDayColumn(currentDate)}</div>
    </div>
  );

  const renderWeekView = () => (
    <div>
      <div className="flex border-b border-border/30 sticky top-0 bg-background z-10">
        <div className="w-12 shrink-0" />
        {viewDays.map(day => (
          <div
            key={day.toISOString()}
            className={cn("flex-1 text-center py-2.5 border-l border-border/20 cursor-pointer hover:bg-muted/20 transition-colors", isToday(day) && "bg-primary/[0.03]")}
            onClick={() => { setCurrentDate(day); setViewMode('day'); }}
          >
            <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-light">{format(day, 'EEE')}</p>
            <p className={cn("text-xs font-medium mt-1", isToday(day) && "bg-foreground text-background rounded-full w-6 h-6 flex items-center justify-center mx-auto", !isToday(day) && "text-foreground/70")}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        {renderTimeLabels()}
        <div className="flex flex-1">
          {viewDays.map(day => (
            <div key={day.toISOString()} className={cn("flex-1 border-l border-border/20", isToday(day) && "bg-primary/[0.015]")}>
              {renderDayColumn(day)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div>
      <div className="grid grid-cols-7 border-b border-border/30">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center py-2.5 text-[10px] text-muted-foreground/50 uppercase tracking-wider font-light">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {viewDays.map(day => {
          const dayEvents = filteredEvents.filter(e => isSameDay(e.start, day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[110px] border-b border-r border-border/20 p-1.5 cursor-pointer hover:bg-muted/15 transition-colors",
                !isCurrentMonth && "bg-muted/[0.04]",
                isToday(day) && "bg-primary/[0.03]"
              )}
              onClick={() => { setCurrentDate(day); setViewMode('day'); }}
            >
              <p className={cn(
                "text-[11px] font-medium mb-1",
                isToday(day) && "bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center text-[10px]",
                !isCurrentMonth && "text-muted-foreground/30",
                isCurrentMonth && !isToday(day) && "text-foreground/60"
              )}>
                {format(day, 'd')}
              </p>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map(evt => {
                  const cal = calendarMap.get(evt.calendarId);
                  return (
                    <button
                      key={evt.id}
                      className="w-full text-left text-[10px] rounded px-1.5 py-0.5 truncate bg-muted/30 text-foreground/60 hover:bg-muted/50 transition-colors border-l-2"
                      style={{ borderLeftColor: cal?.color || PALETTE.neutralGray }}
                      onClick={e => { e.stopPropagation(); setSelectedEvent(evt); }}
                    >
                      {format(evt.start, 'h:mm')} {evt.title}
                    </button>
                  );
                })}
                {dayEvents.length > 3 && <p className="text-[10px] text-muted-foreground/40 pl-1">+{dayEvents.length - 3} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Toolbar ── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center gap-2 px-4 py-2 flex-wrap">
          {/* Sidebar toggle */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/60 hover:text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>

          <Separator orientation="vertical" className="h-4 bg-border/30 mx-0.5" />

          {/* Navigation */}
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground px-2.5 rounded-md" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/50 hover:text-foreground" onClick={() => nav('prev')}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/50 hover:text-foreground" onClick={() => nav('next')}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">{headerTitle}</span>

          <div className="ml-auto flex items-center gap-2">
            {/* View switcher */}
            <div className="flex bg-muted/30 rounded-md p-0.5 border border-border/20">
              {(['day', 'week', 'month'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  className={cn(
                    "px-2.5 py-1 text-[11px] rounded-[4px] font-medium transition-all capitalize",
                    viewMode === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground/80"
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
                <SelectTrigger className="h-7 w-auto text-[11px] gap-1 border-border/30 text-muted-foreground/70 bg-transparent">
                  <Globe className="h-3 w-3" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(tz => <SelectItem key={tz} value={tz} className="text-xs">{tz.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            )}

            <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px] text-muted-foreground/70 hover:text-foreground border border-border/30 rounded-md px-2.5">
              <Plus className="h-3 w-3" /> Add Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && sidebarOpen && (
          <div className="w-52 shrink-0 border-r border-border/20 bg-muted/[0.03] h-[calc(100vh-105px)] sticky top-[105px]">
            <CalendarSidebar calendars={calendars} onToggle={toggleCalendar} onColorChange={changeCalendarColor} onDisconnect={disconnectCalendar} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
        )}

        {/* Mobile sidebar */}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="px-4 pt-4"><SheetTitle className="text-sm">Calendars</SheetTitle></SheetHeader>
              <CalendarSidebar calendars={calendars} onToggle={toggleCalendar} onColorChange={changeCalendarColor} onDisconnect={disconnectCalendar} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
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

      {/* ── Event Detail ── */}
      {selectedEvent && !isMobile && (
        <Sheet open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <SheetContent className="sm:max-w-sm">
            <SheetHeader><SheetTitle className="text-sm">Event Details</SheetTitle></SheetHeader>
            <div className="mt-4">
              <EventDetailPanel event={selectedEvent} calendar={calendarMap.get(selectedEvent.calendarId)!} onClose={() => setSelectedEvent(null)} onEdit={() => {}} onDelete={() => deleteEvent(selectedEvent.id)} conflicts={getConflicts(selectedEvent)} />
            </div>
          </SheetContent>
        </Sheet>
      )}
      {selectedEvent && isMobile && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-[95vw]">
            <DialogHeader><DialogTitle className="text-sm">Event Details</DialogTitle></DialogHeader>
            <EventDetailPanel event={selectedEvent} calendar={calendarMap.get(selectedEvent.calendarId)!} onClose={() => setSelectedEvent(null)} onEdit={() => {}} onDelete={() => deleteEvent(selectedEvent.id)} conflicts={getConflicts(selectedEvent)} />
          </DialogContent>
        </Dialog>
      )}

      {/* ── Quick Booking ── */}
      <Dialog open={!!quickBookSlot} onOpenChange={() => setQuickBookSlot(null)}>
        <DialogContent className={isMobile ? 'max-w-[95vw]' : 'sm:max-w-md'}>
          <DialogHeader><DialogTitle className="text-sm">New Booking</DialogTitle></DialogHeader>
          {quickBookSlot && (
            <QuickBookingForm initialDate={quickBookSlot.date} initialHour={quickBookSlot.hour} calendars={calendars.filter(c => c.visible)} onClose={() => setQuickBookSlot(null)} onSubmit={addEvent} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnifiedCalendar;
