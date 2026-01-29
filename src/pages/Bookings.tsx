import React, { useState, useRef, useEffect } from 'react';
import { Filter, Download, Search, Calendar, MapPin, Video, MoreHorizontal, Edit, UserPlus, Clock, X, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Undo, Redo, Check, Copy, Eye, ChevronDown, ChevronUp, Mail, Globe, Trash2, Info, CheckCircle, XCircle, Plus, Users, MessageSquare, Target, Zap, Briefcase, GraduationCap, Heart, Rocket, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Checkbox } from '../components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { AddGuestsModal } from '../components/AddGuestsModal';
import { useToast } from '../hooks/use-toast';
import type { DateRange } from 'react-day-picker';
import type { HeaderMeta } from '../components/Layout';
import { useOutletContext } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { BookingCard } from '../components/BookingCard';
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  attendees: Array<{
    name: string;
    email: string;
    avatar?: string;
    timezone?: string;
  }>;
  location: {
    type: 'online' | 'physical';
    name: string;
    address?: string;
    logo?: string;
  };
  notes?: string;
  eventType: string;
  status: 'upcoming' | 'unconfirmed' | 'recurring' | 'past' | 'canceled';
  recurringInfo?: string;
  isToday?: boolean;
  duration?: string;
  recurringDates?: string[];
  host?: string;
  isHost?: boolean;
  recurringSchedule?: {
    interval: number;
    totalMeetings: number;
    meetings: Array<{
      date: string;
      time: string;
      completed: boolean;
    }>;
  };
  additionalNotes?: string;
}
const mockMeetings: Meeting[] = [{
  id: '1',
  title: 'Product Hunt Chats',
  date: 'Mon, 14 Jul',
  time: '9:00am',
  endTime: '9:30am',
  duration: '30 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Sanskar Yadav',
    email: 'sanskar@example.com',
    timezone: 'Asia/Calcutta'
  }],
  location: {
    type: 'online',
    name: 'Google Meet',
    logo: '📹'
  },
  eventType: 'Product Hunt Chats',
  status: 'upcoming',
  isToday: true,
  additionalNotes: 'Please prepare the product demo and have the latest metrics ready for discussion.'
}, {
  id: '2',
  title: 'Discovery Call',
  date: 'Mon, 14 Jul',
  time: '2:00pm',
  endTime: '2:15pm',
  duration: '15 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Emily Rodriguez',
    email: 'emily.r@techcorp.com',
    timezone: 'America/New_York'
  }],
  location: {
    type: 'online',
    name: 'Zoom',
    logo: '📹'
  },
  eventType: 'Discovery Call',
  status: 'upcoming',
  isToday: true
}, {
  id: '3',
  title: 'Team Strategy Session',
  date: 'Tue, 15 Jul',
  time: '10:00am',
  endTime: '11:00am',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Michael Johnson',
    email: 'michael.j@company.com',
    timezone: 'America/New_York'
  }, {
    name: 'Sarah Williams',
    email: 'sarah.w@company.com',
    timezone: 'America/Los_Angeles'
  }, {
    name: 'David Chen',
    email: 'david.c@company.com',
    timezone: 'Asia/Shanghai'
  }],
  location: {
    type: 'online',
    name: 'Teams',
    logo: '📹'
  },
  eventType: 'Team Strategy Session',
  status: 'upcoming',
  isToday: false,
  additionalNotes: 'Review Q3 roadmap and discuss resource allocation for upcoming projects.'
}, {
  id: '4',
  title: 'Product Demo',
  date: 'Tue, 15 Jul',
  time: '3:00pm',
  endTime: '4:00pm',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Lisa Thompson',
    email: 'lisa.t@client.com',
    timezone: 'Europe/London'
  }, {
    name: 'Robert Davis',
    email: 'robert.d@client.com',
    timezone: 'Europe/London'
  }],
  location: {
    type: 'online',
    name: 'Zoom',
    logo: '📹'
  },
  eventType: 'Product Demo',
  status: 'upcoming',
  isToday: false
}, {
  id: '5',
  title: 'Client Consultation',
  date: 'Wed, 16 Jul',
  time: '11:00am',
  endTime: '12:00pm',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Jennifer Wilson',
    email: 'jennifer.w@enterprise.com',
    timezone: 'America/Chicago'
  }, {
    name: 'Mark Anderson',
    email: 'mark.a@enterprise.com',
    timezone: 'America/Chicago'
  }, {
    name: 'Anna Martinez',
    email: 'anna.m@enterprise.com',
    timezone: 'America/Denver'
  }],
  location: {
    type: 'online',
    name: 'Google Meet',
    logo: '📹'
  },
  eventType: 'Client Consultation',
  status: 'upcoming',
  isToday: false,
  additionalNotes: 'Bring contract templates and pricing sheets. Client is interested in enterprise package.'
}, {
  id: '6',
  title: 'Design Review',
  date: 'Wed, 16 Jul',
  time: '2:00pm',
  endTime: '3:00pm',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Alex Turner',
    email: 'alex.t@design.com',
    timezone: 'Europe/Berlin'
  }, {
    name: 'Emma Clarke',
    email: 'emma.c@design.com',
    timezone: 'Europe/Paris'
  }, {
    name: 'James Wright',
    email: 'james.w@design.com',
    timezone: 'Europe/Madrid'
  }, {
    name: 'Sophie Miller',
    email: 'sophie.m@design.com',
    timezone: 'Europe/Rome'
  }],
  location: {
    type: 'online',
    name: 'Teams',
    logo: '📹'
  },
  eventType: 'Design Review',
  status: 'upcoming',
  isToday: false
}, {
  id: '7',
  title: 'Sales Pipeline Review',
  date: 'Thu, 17 Jul',
  time: '9:00am',
  endTime: '10:00am',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Carlos Rodriguez',
    email: 'carlos.r@sales.com',
    timezone: 'America/Mexico_City'
  }, {
    name: 'Rachel Green',
    email: 'rachel.g@sales.com',
    timezone: 'America/New_York'
  }, {
    name: 'Tom Wilson',
    email: 'tom.w@sales.com',
    timezone: 'America/Los_Angeles'
  }],
  location: {
    type: 'online',
    name: 'Zoom',
    logo: '📹'
  },
  eventType: 'Sales Pipeline Review',
  status: 'upcoming',
  isToday: false
}];
const unconfirmedMeetings: Meeting[] = [{
  id: 'unconf-1',
  title: 'Strategy Session',
  date: 'Tue, 15 Jul',
  time: '10:00am',
  endTime: '10:30am',
  duration: '30 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Alex Chen',
    email: 'alex.chen@startup.io',
    timezone: 'Asia/Singapore'
  }],
  location: {
    type: 'online',
    name: 'Teams',
    logo: '📹'
  },
  eventType: 'Strategy Session',
  status: 'unconfirmed',
  isToday: false
}, {
  id: 'unconf-2',
  title: 'Client Consultation',
  date: 'Wed, 16 Jul',
  time: '3:00pm',
  endTime: '4:00pm',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'Sarah Wilson',
    email: 'sarah.w@agency.co',
    timezone: 'America/Los_Angeles'
  }],
  location: {
    type: 'online',
    name: 'Zoom',
    logo: '📹'
  },
  eventType: 'Client Consultation',
  status: 'unconfirmed',
  isToday: false
}];
const recurringMeetings: Meeting[] = [{
  id: 'recur-1',
  title: 'Design Review',
  date: 'Thu, 17 Jul',
  time: '11:00am',
  endTime: '12:00pm',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  recurringSchedule: {
    interval: 7,
    totalMeetings: 5,
    meetings: [{
      date: '14 July 2025',
      time: '2:30pm',
      completed: true
    }, {
      date: '21 July 2025',
      time: '2:30pm',
      completed: false
    }, {
      date: '28 July 2025',
      time: '2:30pm',
      completed: false
    }, {
      date: '4 August 2025',
      time: '2:30pm',
      completed: false
    }, {
      date: '11 August 2025',
      time: '2:30pm',
      completed: false
    }]
  },
  attendees: [{
    name: 'James Thompson',
    email: 'james.t@design.studio',
    timezone: 'Europe/London'
  }],
  location: {
    type: 'online',
    name: 'Zoom',
    logo: '📹'
  },
  eventType: 'Design Review',
  status: 'recurring',
  isToday: false
}, {
  id: 'recur-2',
  title: 'Weekly Standup',
  date: 'Mon, 14 Jul',
  time: '9:00am',
  endTime: '9:30am',
  duration: '30 minutes',
  host: 'You',
  isHost: true,
  recurringSchedule: {
    interval: 7,
    totalMeetings: 5,
    meetings: [{
      date: '14 July 2025',
      time: '9:00am',
      completed: true
    }, {
      date: '21 July 2025',
      time: '9:00am',
      completed: false
    }, {
      date: '28 July 2025',
      time: '9:00am',
      completed: false
    }, {
      date: '4 August 2025',
      time: '9:00am',
      completed: false
    }, {
      date: '11 August 2025',
      time: '9:00am',
      completed: false
    }]
  },
  attendees: [{
    name: 'Maria Garcia',
    email: 'maria.garcia@consulting.com',
    timezone: 'Europe/Madrid'
  }],
  location: {
    type: 'online',
    name: 'Google Meet',
    logo: '📹'
  },
  eventType: 'Weekly Standup',
  status: 'recurring',
  isToday: true
}];
const pastMeetings: Meeting[] = [{
  id: 'past-1',
  title: 'Onboarding Call',
  date: 'Fri, 12 Jul',
  time: '2:00pm',
  endTime: '3:00pm',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'John Doe',
    email: 'john.doe@company.com',
    timezone: 'America/New_York'
  }],
  location: {
    type: 'online',
    name: 'Teams',
    logo: '📹'
  },
  eventType: 'Onboarding Call',
  status: 'past',
  isToday: false
}];
const canceledMeetings: Meeting[] = [{
  id: 'cancel-1',
  title: 'Product Demo',
  date: 'Wed, 16 Jul',
  time: '3:00pm',
  endTime: '4:00pm',
  duration: '60 minutes',
  host: 'You',
  isHost: true,
  attendees: [{
    name: 'David Kim',
    email: 'david.kim@enterprise.com',
    timezone: 'Asia/Seoul'
  }],
  location: {
    type: 'online',
    name: 'Google Meet',
    logo: '📹'
  },
  eventType: 'Product Demo',
  status: 'canceled',
  isToday: false
}];
const allMeetings = {
  upcoming: mockMeetings,
  unconfirmed: unconfirmedMeetings,
  recurring: recurringMeetings,
  past: pastMeetings,
  canceled: canceledMeetings
};
const teamNames = ['Personal', 'Development Team', 'Design Team', 'Marketing Team', 'Sales Team', 'Engineering Team', 'Product Team', 'Customer Success'];
export default function Bookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null);
  const [showAddGuests, setShowAddGuests] = useState(false);
  const [showMeetingNotes, setShowMeetingNotes] = useState(false);
  const [showNoShow, setShowNoShow] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelSelection, setShowCancelSelection] = useState(false);
  const [showEditLocation, setShowEditLocation] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetingNotes, setMeetingNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);
  const [showAttendeesDropdown, setShowAttendeesDropdown] = useState<string | null>(null);
  const [showAttendeeDetails, setShowAttendeeDetails] = useState<string | null>(null);
  const [selectedRecurringDates, setSelectedRecurringDates] = useState<string[]>([]);
  const [showRecurringHover, setShowRecurringHover] = useState<string | null>(null);
  const [guestEmails, setGuestEmails] = useState<string[]>(['']);
  const [filteredAttendee, setFilteredAttendee] = useState('All');
  const [filteredHost, setFilteredHost] = useState('All');
  const [filteredEventType, setFilteredEventType] = useState('All');
  const [filteredTeam, setFilteredTeam] = useState('All');
  const {
    setHeaderMeta
  } = useOutletContext<{
    setHeaderMeta: (meta: HeaderMeta) => void;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const currentMeetings = allMeetings[activeTab as keyof typeof allMeetings] || [];
  const todayMeetings = currentMeetings.filter(m => m.isToday);
  const otherMeetings = currentMeetings.filter(m => !m.isToday);
  const handleExport = () => {
    toast({
      description: <div className="flex items-center gap-2">
          <Check className="h-5 w-5" style={{
          color: '#008c44'
        }} />
          <span>Export successful: Your bookings will be sent to your email shortly.</span>
        </div>,
      duration: 3000
    });
  };
  const handleReschedule = (_meeting?: Meeting) => {
    navigate('/scheduling-coming-soon');
  };
  const handleCancelEvent = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    if (meeting.status === 'recurring') {
      setShowCancelSelection(true);
    } else {
      setShowCancelConfirm(true);
    }
  };
  const handleMarkNoShow = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowNoShow(true);
  };
  const addGuestEmail = () => {
    setGuestEmails([...guestEmails, '']);
  };
  const removeGuestEmail = (index: number) => {
    const newEmails = guestEmails.filter((_, i) => i !== index);
    setGuestEmails(newEmails.length > 0 ? newEmails : ['']);
  };
  const updateGuestEmail = (index: number, value: string) => {
    const newEmails = [...guestEmails];
    newEmails[index] = value;
    setGuestEmails(newEmails);
  };
  const isCurrentTime = (time: string) => {
    const currentHour = new Date().getHours();
    const meetingHour = parseInt(time.split(':')[0]);
    return currentHour > meetingHour;
  };
  const getAttendeeDisplay = (meeting: Meeting) => {
    const attendees = meeting.attendees;
    if (attendees.length === 0) return null;
    if (attendees.length === 1) return attendees[0].name.split(' ')[0];
    if (attendees.length === 2) return `${attendees[0].name.split(' ')[0]}, ${attendees[1].name.split(' ')[0]}`;
    return {
      display: `${attendees[0].name.split(' ')[0]}, ${attendees[1].name.split(' ')[0]}`,
      moreCount: attendees.length - 2
    };
  };
  const getAllAttendees = () => {
    const allAttendees = new Set<string>();
    Object.values(allMeetings).flat().forEach(meeting => {
      meeting.attendees.forEach(attendee => {
        allAttendees.add(attendee.name);
      });
    });
    return Array.from(allAttendees);
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Email copied",
      duration: 2000
    });
  };
  const MeetingCard = ({
    meeting
  }: {
    meeting: Meeting;
  }) => {
    const isExpanded = expandedMeeting === meeting.id;
    const attendeeDisplay = getAttendeeDisplay(meeting);
    const showActionButtons = meeting.status !== 'past' && meeting.status !== 'canceled';
    const showExpandedActions = meeting.status !== 'past' && meeting.status !== 'canceled';
    const isHost = meeting.isHost;
    const getActionButtons = () => {
      if (meeting.status === 'past' || meeting.status === 'canceled') {
        return isHost ? <Button variant="outline" size="sm" onClick={e => {
          e.stopPropagation();
          setExpandedMeeting(isExpanded ? null : meeting.id);
        }}>
            Details
          </Button> : null;
      }
      if (meeting.status === 'unconfirmed') {
        return <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={e => {
            e.stopPropagation();
            toast({
              description: "Meeting accepted",
              duration: 2000
            });
          }}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button variant="outline" size="sm" onClick={e => {
            e.stopPropagation();
            toast({
              description: "Meeting rejected",
              duration: 2000
            });
          }}>
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>;
      }
      if (meeting.status === 'recurring') {
        return <Button variant="outline" size="sm" onClick={e => {
          e.stopPropagation();
          handleCancelEvent(meeting);
        }}>
            Cancel
          </Button>;
      }
      return (
        <div className="flex flex-col space-y-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={e => {
              e.stopPropagation();
              handleReschedule();
            }}>
              Reschedule
            </Button>
            <Button variant="outline" size="sm" onClick={e => {
              e.stopPropagation();
              handleCancelEvent(meeting);
            }}>
              Cancel
            </Button>
            <div className="relative">
              <Button variant="outline" size="sm" onClick={e => {
                e.stopPropagation();
                setShowEditDropdown(showEditDropdown === meeting.id ? null : meeting.id);
              }}>
                Edit
              </Button>
              {showEditDropdown === meeting.id && (
                <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-4">
                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2" onClick={e => {
                    e.stopPropagation();
                    setSelectedMeeting(meeting);
                    setShowEditLocation(true);
                    setShowEditDropdown(null);
                  }}>
                    <MapPin className="h-4 w-4" />
                    Edit location
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2" onClick={e => {
                    e.stopPropagation();
                    setSelectedMeeting(meeting);
                    setShowAddGuests(true);
                    setShowEditDropdown(null);
                  }}>
                    <UserPlus className="h-4 w-4" />
                    Add guests
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            {isHost ? (
              <button
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={e => {
                  e.stopPropagation();
                  setExpandedMeeting(isExpanded ? null : meeting.id);
                }}
              >
                <span>Details</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            ) : (
              <span className="text-sm text-muted-foreground">Host</span>
            )}
          </div>
        </div>
      );
    };
    return <div className={`bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow ${isHost ? 'cursor-pointer' : ''}`} onClick={() => {
      if (isHost) {
        setExpandedMeeting(isExpanded ? null : meeting.id);
      }
    }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Content - removed icon section */}
            <div className="flex-1 min-w-0">
              {/* Title and Attendees */}
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={`text-lg font-semibold ${meeting.status === 'canceled' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {meeting.title}
                </h3>
                {attendeeDisplay && <>
                    <span className="text-sm text-muted-foreground">with</span>
                    <div className="flex items-center space-x-1">
                      <div className="relative">
                        {typeof attendeeDisplay === 'object' ? <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">{attendeeDisplay.display}</span>
                            <button className="text-sm text-muted-foreground hover:text-foreground font-medium" onClick={e => {
                        e.stopPropagation();
                        setShowAttendeesDropdown(showAttendeesDropdown === meeting.id ? null : meeting.id);
                      }}>
                              + {attendeeDisplay.moreCount} More
                            </button>
                          </div> : <button className="text-sm text-muted-foreground hover:text-foreground font-medium" onClick={e => {
                      e.stopPropagation();
                      copyToClipboard(meeting.attendees[0].email);
                    }}>
                            {attendeeDisplay}
                          </button>}
                        
                        {showAttendeesDropdown === meeting.id && typeof attendeeDisplay === 'object' && <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-48">
                            <div className="p-2">
                              <div className="text-xs font-medium text-muted-foreground mb-2">All Attendees</div>
                              {meeting.attendees.map((attendee, index) => <button key={index} className="w-full text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground py-1 px-2 rounded" onClick={e => {
                          e.stopPropagation();
                          copyToClipboard(attendee.email);
                          setShowAttendeesDropdown(null);
                        }}>
                                  {attendee.name}
                                </button>)}
                            </div>
                          </div>}
                      </div>
                    </div>
                  </>}
              </div>

              {/* Time */}
              <div className="text-sm text-muted-foreground mb-3">
                {meeting.isToday ? 'Today' : meeting.date} • {meeting.time} - {meeting.endTime}
              </div>

              {/* Location/Meeting Link and Details button in same line */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    {meeting.location.type === 'online' ? <button className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors">
                        <Video className="h-4 w-4" />
                        <span>Join {meeting.location.name}</span>
                      </button> : <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{meeting.location.address}</span>
                      </div>}
                  </div>
                  
                  {/* Recurring info for recurring tab */}
                  {meeting.status === 'recurring' && meeting.recurringSchedule && <div className="relative">
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors" onMouseEnter={() => setShowRecurringHover(meeting.id)} onMouseLeave={() => setShowRecurringHover(null)} onClick={e => e.stopPropagation()}>
                        Every {meeting.recurringSchedule.interval} days for {meeting.recurringSchedule.totalMeetings} occurrences
                      </button>
                      
                      {showRecurringHover === meeting.id && <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-64 p-3">
                          <div className="space-y-1">
                            {meeting.recurringSchedule.meetings.map((recurringMeeting, index) => <div key={index} className={`text-sm ${recurringMeeting.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {recurringMeeting.time} - {recurringMeeting.date}
                              </div>)}
                          </div>
                        </div>}
                    </div>}
                </div>
                
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {showActionButtons && getActionButtons()}
        </div>

        {/* Expanded Details */}
        {isExpanded && isHost && <div className="mt-4 pt-4 border-t border-border animate-fade-in bg-[#f1f5f980] -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">Duration</div>
                  <div className="text-sm text-muted-foreground">{meeting.duration}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Invitee Details</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{meeting.attendees[0]?.name}</span>
                    <span>•</span>
                    <span>{meeting.attendees[0]?.timezone}</span>
                    <span>•</span>
                    <span>{meeting.attendees[0]?.email}</span>
                    <button onClick={() => copyToClipboard(meeting.attendees[0]?.email)} className="ml-1 text-muted-foreground hover:text-foreground">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {meeting.attendees.length > 1 && <div>
                    <div className="text-sm font-medium text-foreground mb-2">Attendees</div>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.slice(1).map((attendee, index) => <div key={index} className="relative">
                          <button className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full hover:bg-secondary/80 hover:shadow-sm transition-all" onClick={() => setShowAttendeeDetails(showAttendeeDetails === `${meeting.id}-${index}` ? null : `${meeting.id}-${index}`)}>
                            {attendee.name.split(' ')[0]}
                          </button>
                          {showAttendeeDetails === `${meeting.id}-${index}` && <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-64">
                              <div className="p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-foreground">{attendee.email}</span>
                                  <button onClick={() => copyToClipboard(attendee.email)} className="ml-1 text-muted-foreground hover:text-foreground">
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-foreground">{attendee.timezone}</span>
                                </div>
                              </div>
                            </div>}
                        </div>)}
                    </div>
                  </div>}

                {meeting.additionalNotes && <div>
                    <div className="text-sm font-medium text-foreground mb-2">Additional Notes</div>
                    <div className="text-sm text-muted-foreground">{meeting.additionalNotes}</div>
                  </div>}
              </div>

              {/* Action Buttons for Expanded View */}
              {showExpandedActions && <div className="flex flex-col items-end space-y-2">
                  <Button variant="outline" size="default" className="w-40" onClick={e => {
              e.stopPropagation();
              setSelectedMeeting(meeting);
              setShowMeetingNotes(true);
            }}>
                    Your Notes
                  </Button>
                  {meeting.isToday && isCurrentTime(meeting.time) && <Button variant="outline" size="default" className="w-40" style={{
              backgroundColor: '#007ee5',
              color: 'white'
            }} onClick={e => {
              e.stopPropagation();
              handleMarkNoShow(meeting);
            }}>
                      Mark as No-Show
                    </Button>}
                </div>}
            </div>
          </div>}
      </div>;
  };
  useEffect(() => {
    setHeaderMeta({
      title: 'Bookings',
      description: 'View and manage all your scheduled appointments.'
    });
  }, [setHeaderMeta]);
  return <TooltipProvider>
      <div className="px-8 pt-0 pb-6 space-y-4 w-full max-w-full">
        {/* Overlay for popups */}
        {(showMeetingNotes || showCancelConfirm || showCancelSelection || showNoShow || showEditLocation || showAddGuests) && <div className="fixed inset-0 bg-black/50 z-40" />}

        {/* Header with Tabs and Action Buttons */}
        <div className="flex items-center justify-between">
          {/* Tabs - with underline hover effect */}
          <div className="flex border-b border-border">
            {[{
              value: 'upcoming',
              label: 'Upcoming'
            }, {
              value: 'unconfirmed',
              label: 'Unconfirmed'
            }, {
              value: 'recurring',
              label: 'Recurring'
            }, {
              value: 'past',
              label: 'Past'
            }, {
              value: 'canceled',
              label: 'Canceled'
            }].map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-6 py-4 text-sm font-medium transition-colors relative hover:before:content-[''] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:w-full hover:before:h-0.5 hover:before:bg-gray-300 ${activeTab === tab.value ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export All</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg transition-all duration-300 ease-in-out animate-fade-in">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">Attendee: {filteredAttendee}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-60 overflow-auto scrollbar-hide" align="start">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All</span>
                    <Checkbox checked={filteredAttendee === 'All'} onCheckedChange={() => setFilteredAttendee('All')} />
                  </div>
                  {getAllAttendees().map((attendee, index) => <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{attendee}</span>
                      <Checkbox checked={filteredAttendee === attendee} onCheckedChange={() => setFilteredAttendee(attendee)} />
                    </div>)}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">Host: {filteredHost}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-60 overflow-auto scrollbar-hide" align="start">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All Users</span>
                    <Checkbox checked={filteredHost === 'All'} onCheckedChange={() => setFilteredHost('All')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">You</span>
                    <Checkbox checked={filteredHost === 'You'} onCheckedChange={() => setFilteredHost('You')} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">Event Type: {filteredEventType}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-60 overflow-auto scrollbar-hide" align="start">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All event types</span>
                    <Checkbox checked={filteredEventType === 'All'} onCheckedChange={() => setFilteredEventType('All')} />
                  </div>
                  <hr />
                  <div>
                    <p className="text-sm font-medium mb-2">Personal</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">15 Min Meeting</span>
                      <Checkbox />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">Teams: {filteredTeam}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-60 overflow-auto scrollbar-hide" align="start">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All</span>
                    <Checkbox checked={filteredTeam === 'All'} onCheckedChange={() => setFilteredTeam('All')} />
                  </div>
                  {teamNames.map((team, index) => <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{team}</span>
                      <Checkbox checked={filteredTeam === team} onCheckedChange={() => setFilteredTeam(team)} />
                    </div>)}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange?.from ? dateRange.to ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}` : dateRange.from.toLocaleDateString() : "Pick a date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="range" selected={dateRange} onSelect={setDateRange} className="rounded-md border pointer-events-auto" />
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" onClick={() => {
          setFilteredAttendee('All');
          setFilteredHost('All');
          setFilteredEventType('All');
          setFilteredTeam('All');
          setDateRange(undefined);
        }}>
              Clear all filters
            </Button>
          </div>}

        {/* Meetings List */}
        <div className="space-y-6">
          {todayMeetings.length > 0 && <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Today</h2>
              <div className="space-y-3">
                {todayMeetings.map(meeting => (
                  <BookingCard
                    key={meeting.id}
                    meeting={meeting}
                    onReschedule={handleReschedule}
                    onCancel={handleCancelEvent}
                    onEditLocation={(m) => {
                      setSelectedMeeting(m);
                      setShowEditLocation(true);
                    }}
                    onAddGuests={(m) => {
                      setSelectedMeeting(m);
                      setShowAddGuests(true);
                    }}
                    onViewNotes={(m) => {
                      setSelectedMeeting(m);
                      setShowMeetingNotes(true);
                    }}
                    onMarkNoShow={handleMarkNoShow}
                    onCopyEmail={() => toast({ description: "Email copied", duration: 2000 })}
                  />
                ))}
              </div>
            </div>}
          
          {otherMeetings.length > 0 && <div className={`space-y-3 ${todayMeetings.length > 0 ? 'mt-6' : ''}`}>
              <div className="space-y-3">
                {otherMeetings.map(meeting => (
                  <BookingCard
                    key={meeting.id}
                    meeting={meeting}
                    onReschedule={handleReschedule}
                    onCancel={handleCancelEvent}
                    onEditLocation={(m) => {
                      setSelectedMeeting(m);
                      setShowEditLocation(true);
                    }}
                    onAddGuests={(m) => {
                      setSelectedMeeting(m);
                      setShowAddGuests(true);
                    }}
                    onViewNotes={(m) => {
                      setSelectedMeeting(m);
                      setShowMeetingNotes(true);
                    }}
                    onMarkNoShow={handleMarkNoShow}
                    onCopyEmail={() => toast({ description: "Email copied", duration: 2000 })}
                  />
                ))}
              </div>
            </div>}

          {todayMeetings.length === 0 && otherMeetings.length === 0 && <div className="text-center py-8 text-muted-foreground">
              No {activeTab} bookings
            </div>}
        </div>

        {/* Add Guests Modal - Updated with new design */}
        {showAddGuests && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Add Guests</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">An email invite will be sent to these guests automatically</span>
                <Tooltip>
                  <TooltipTrigger>
                    
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>An email invite will be sent to these guests automatically</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="space-y-3 mb-6">
                {guestEmails.map((email, index) => <div key={index} className="flex items-center gap-2">
                    <input type="email" placeholder="guest@example.com" value={email} onChange={e => updateGuestEmail(index, e.target.value)} className="flex-1 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {guestEmails.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeGuestEmail(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>}
                  </div>)}
                
                <Button variant="ghost" onClick={addGuestEmail} className="w-full justify-start text-muted-foreground hover:bg-muted">
                  <Plus className="h-4 w-4 mr-2" />
                  Add More
                </Button>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
              setShowAddGuests(false);
              setGuestEmails(['']);
            }}>
                  Cancel
                </Button>
                <Button onClick={() => {
              setShowAddGuests(false);
              setGuestEmails(['']);
              toast({
                description: "Guests added successfully",
                duration: 2000
              });
            }}>
                  Add Guests
                </Button>
              </div>
            </div>
          </div>}

        {/* Meeting Notes Modal */}
        {showMeetingNotes && (
          <Dialog open={showMeetingNotes} onOpenChange={setShowMeetingNotes}>
            <DialogContent className="max-w-2xl w-full">
              <DialogHeader>
                <DialogTitle>Your Notes</DialogTitle>
                <DialogDescription>
                  These notes are only visible to you
                </DialogDescription>
              </DialogHeader>

              {/* Toolbar */}
              <div className="mb-6">
                <div className="flex items-center space-x-1 p-3 border border-gray-200 rounded-t-md bg-gray-50">
                  <Button variant="ghost" size="sm"><Bold className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Italic className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Underline className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Strikethrough className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><List className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><ListOrdered className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Undo className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Redo className="h-4 w-4" /></Button>
                </div>

                {/* Textarea */}
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-200 rounded-b-md border-t-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add your meeting notes here..."
                />
              </div>

              {/* Footer Buttons */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowMeetingNotes(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowMeetingNotes(false)}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Cancel Selection Modal - First popup for recurring events - Made bigger */}
        {showCancelSelection && selectedMeeting && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 text-center">Cancel Event</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-gray-900">Select the meetings you want to cancel</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Select All</span>
                    <Checkbox checked={selectedRecurringDates.length === selectedMeeting.recurringSchedule?.meetings.length} onCheckedChange={checked => {
                  if (checked) {
                    setSelectedRecurringDates(selectedMeeting.recurringSchedule?.meetings.map(m => `${m.date} • ${m.time}`) || []);
                  } else {
                    setSelectedRecurringDates([]);
                  }
                }} />
                  </div>
                  {selectedMeeting.recurringSchedule?.meetings.map((meeting, index) => {
                const dateTime = `${meeting.date} • ${meeting.time}`;
                return <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm">{dateTime}</span>
                        <Checkbox checked={selectedRecurringDates.includes(dateTime)} onCheckedChange={checked => {
                    if (checked) {
                      setSelectedRecurringDates([...selectedRecurringDates, dateTime]);
                    } else {
                      setSelectedRecurringDates(selectedRecurringDates.filter(d => d !== dateTime));
                    }
                  }} />
                      </div>;
              })}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
              setShowCancelSelection(false);
              setSelectedMeeting(null);
              setSelectedRecurringDates([]);
            }}>
                  Nevermind
                </Button>
                <Button onClick={() => {
              setShowCancelSelection(false);
              setShowCancelConfirm(true);
            }} disabled={selectedRecurringDates.length === 0}>
                  Continue
                </Button>
              </div>
            </div>
          </div>}

        {/* Cancel Event Modal - Updated with red cross icon and clickable names */}
        {showCancelConfirm && selectedMeeting && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
              <div className="flex items-center mx-[160px]">
                
                <h2 className="text-xl font-semibold text-gray-900 text-center px-0 py-[12px]">Cancel Event</h2>
              </div>
              
              
              {selectedMeeting.status === 'recurring' && selectedRecurringDates.length > 0 ? <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">Event:</span>
                    <span className="text-gray-900">{selectedMeeting.eventType}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">When:</span>
                    <div className="text-gray-900">
                      {selectedRecurringDates.map((date, index) => <div key={index}>{date}</div>)}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">Where:</span>
                    <span className="text-gray-900">{selectedMeeting.location.name}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">With:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedMeeting.attendees.map((attendee, index) => <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <button className="text-foreground hover:text-foreground hover:underline" onClick={() => copyToClipboard(attendee.email)}>
                              {attendee.name}
                              {index < selectedMeeting.attendees.length - 1 && ','}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy email</p>
                          </TooltipContent>
                        </Tooltip>)}
                    </div>
                  </div>
                  {selectedMeeting.additionalNotes && (
                    <div className="flex gap-3">
                      <span className="font-medium text-gray-600 min-w-16">Additional notes:</span>
                      <span className="text-gray-900">{selectedMeeting.additionalNotes}</span>
                    </div>
                  )}
                </div> : <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg my-0">
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">Event:</span>
                    <span className="text-gray-900">{selectedMeeting.eventType}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">When:</span>
                    <span className="text-gray-900">{selectedMeeting.date} {selectedMeeting.time} - {selectedMeeting.endTime}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">Where:</span>
                    <span className="text-gray-900">{selectedMeeting.location.name}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-medium text-gray-600 min-w-16">With:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedMeeting.attendees.map((attendee, index) => <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <button className="text-foreground hover:text-foreground hover:underline" onClick={() => copyToClipboard(attendee.email)}>
                              {attendee.name}
                              {index < selectedMeeting.attendees.length - 1 && ','}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy email</p>
                          </TooltipContent>
                        </Tooltip>)}
                    </div>
                  </div>
                  {selectedMeeting.additionalNotes && (
                    <div className="flex gap-3">
                      <span className="font-medium text-gray-600 min-w-16">Additional notes:</span>
                      <span className="text-gray-900">{selectedMeeting.additionalNotes}</span>
                    </div>
                  )}
                </div>}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-gray-900">Reason for cancellation (optional)</label>
                <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full h-24 p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Why are you cancelling?" />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => {
              setShowCancelConfirm(false);
              setSelectedMeeting(null);
              setCancelReason('');
              setSelectedRecurringDates([]);
            }}>
                  Nevermind
                </Button>
                <Button variant="destructive" onClick={() => {
              setShowCancelConfirm(false);
              setSelectedMeeting(null);
              setCancelReason('');
              setSelectedRecurringDates([]);
              toast({
                description: "Event cancelled successfully.",
                duration: 3000
              });
            }}>
                  Cancel Event
                </Button>
              </div>
            </div>
          </div>}

        {/* No Show Modal */}
        {showNoShow && selectedMeeting && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Mark as No-Show</h2>
              <p className="text-sm text-gray-600 mb-6">Select attendees to mark as no-show</p>
              
              <div className="space-y-4 mb-6">
                {selectedMeeting.attendees.map((attendee, index) => <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {attendee.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{attendee.name}</span>
                    </div>
                    <Checkbox />
                  </div>)}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowNoShow(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNoShow(false)}>
                  Mark as No-Show
                </Button>
              </div>
            </div>
          </div>}

        {/* Edit Location Modal - Updated with comprehensive dropdown */}
        {showEditLocation && selectedMeeting && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-semibold mb-2">Edit Location</h2>
              <p className="text-sm text-gray-600 mb-6">
                Current Location: {selectedMeeting.location.logo} {selectedMeeting.location.name}
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Meeting Location</label>
                <select className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="google-meet">📹 Google Meet</option>
                  <option value="zoom">📹 Zoom</option>
                  <option value="teams">📹 Microsoft Teams</option>
                  <option value="webex">📹 Cisco Webex</option>
                  <option value="gotomeeting">📹 GoToMeeting</option>
                  <option value="jitsi">📹 Jitsi Meet</option>
                  <option value="around">📹 Around</option>
                  <option value="riverside">📹 Riverside.fm</option>
                  <option value="whereby">📹 Whereby</option>
                  <option value="in-person">📍 In-person meeting</option>
                  <option value="phone">📞 Phone call</option>
                  <option value="custom">🔗 Custom link</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowEditLocation(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowEditLocation(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </TooltipProvider>;
}
