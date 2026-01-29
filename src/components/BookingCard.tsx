import React, { useState } from 'react';
import { Video, MapPin, Copy, ChevronDown, ChevronUp, MoreHorizontal, X, Globe, Mail, UserPlus, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface Attendee {
  name: string;
  email: string;
  avatar?: string;
  timezone?: string;
}

interface Location {
  type: 'online' | 'physical';
  name: string;
  address?: string;
  logo?: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime: string;
  attendees: Attendee[];
  location: Location;
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

interface BookingCardProps {
  meeting: Meeting;
  onReschedule?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
  onEditLocation?: (meeting: Meeting) => void;
  onAddGuests?: (meeting: Meeting) => void;
  onViewNotes?: (meeting: Meeting) => void;
  onMarkNoShow?: (meeting: Meeting) => void;
  onCopyEmail?: (email: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  meeting,
  onReschedule,
  onCancel,
  onEditLocation,
  onAddGuests,
  onViewNotes,
  onMarkNoShow,
  onCopyEmail,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isHost = meeting.isHost ?? true;
  const isCanceled = meeting.status === 'canceled';
  const isPast = meeting.status === 'past';

  const showActionButtons = !isCanceled && !isPast;

  const getAttendeeDisplay = () => {
    if (meeting.attendees.length === 0) return null;
    if (meeting.attendees.length === 1) {
      return meeting.attendees[0].name;
    }
    return {
      display: meeting.attendees[0].name,
      moreCount: meeting.attendees.length - 1
    };
  };

  const attendeeDisplay = getAttendeeDisplay();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopyEmail?.(text);
  };

  return (
    <div className={`bg-card border border-border rounded-xl transition-all duration-200 ${isHost && !isCanceled ? 'hover:shadow-md cursor-pointer' : ''}`}>
      {/* Main Card Content */}
      <div 
        className="p-5"
        onClick={() => isHost && !isCanceled && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base font-semibold ${isCanceled ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {meeting.title}
              </h3>
              {attendeeDisplay && (
                <>
                  <span className="text-sm text-muted-foreground">with</span>
                  <span className="text-sm font-medium text-foreground">
                    {typeof attendeeDisplay === 'object' ? attendeeDisplay.display : attendeeDisplay}
                  </span>
                  {typeof attendeeDisplay === 'object' && (
                    <span className="text-sm text-muted-foreground">
                      + {attendeeDisplay.moreCount} more
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Date & Time */}
            <p className="text-sm text-muted-foreground mb-3">
              {meeting.isToday ? 'Today' : meeting.date} • {meeting.time} - {meeting.endTime}
            </p>

            {/* Meeting Link */}
            {meeting.location.type === 'online' ? (
              <button 
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Video className="h-4 w-4" />
                <span>Join {meeting.location.name}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{meeting.location.address}</span>
              </div>
            )}

            {/* Recurring Info */}
            {meeting.status === 'recurring' && meeting.recurringSchedule && (
              <p className="text-xs text-muted-foreground mt-2">
                Every {meeting.recurringSchedule.interval} days for {meeting.recurringSchedule.totalMeetings} occurrences
              </p>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {showActionButtons && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm font-normal h-9 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel?.(meeting);
                  }}
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Cancel
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onReschedule?.(meeting)}>
                      <Clock className="h-4 w-4 mr-2" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditLocation?.(meeting)}>
                      <MapPin className="h-4 w-4 mr-2" />
                      Edit location
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddGuests?.(meeting)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add guests
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Details Toggle - aligned right */}
        {isHost && !isCanceled && (
          <div className="flex justify-end mt-3">
            <button
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              <span>Details</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30 px-5 py-4 rounded-b-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-8">
            {/* Details Grid */}
            <div className="flex-1 space-y-4">
              {/* Duration */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Duration</h4>
                <p className="text-sm text-muted-foreground">{meeting.duration || '15 min'}</p>
              </div>

              {/* Invitee Details */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Invitee details</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span>• {meeting.attendees[0]?.name}</span>
                  <span>•</span>
                  <span>{meeting.attendees[0]?.timezone}</span>
                  <span>•</span>
                  <span>{meeting.attendees[0]?.email}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(meeting.attendees[0]?.email || '');
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Copy email</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Guests (if multiple attendees) */}
              {meeting.attendees.length > 1 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Guests</h4>
                  <div className="flex flex-wrap gap-2">
                    {meeting.attendees.slice(1).map((attendee, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full text-sm text-secondary-foreground"
                      >
                        <span>{attendee.name}</span>
                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(attendee.email);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {meeting.additionalNotes && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">Additional Notes</h4>
                  <p className="text-sm text-muted-foreground">{meeting.additionalNotes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-36"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewNotes?.(meeting);
                }}
              >
                Your Notes
              </Button>
              {meeting.isToday && (
                <Button
                  size="sm"
                  className="w-36"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkNoShow?.(meeting);
                  }}
                >
                  Mark as No-Show
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
