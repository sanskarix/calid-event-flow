import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Globe, MapPin, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

// Mock data for user profile and event types
const mockUser = {
  name: "Sanskar Yadav",
  avatar: "/lovable-uploads/d2f2475b-025e-480f-9568-7fd7e37cc0ff.png",
  bio: "Head of Growth @OneHash | Building the craziest tools on the Internet 🚀",
  eventTypes: [
    {
      id: "product-hunt-chats",
      title: "Product Hunt Chats",
      description: "The essence of Product Hunt reflects in communities– Select a time suitable for you, and let's talk products!",
      duration: [15, 30, 45, 60],
      location: "Google Meet",
      timezone: "Asia/Kolkata",
      requiresConfirmation: false
    },
    {
      id: "interviews",
      title: "Interviews",
      description: "Let's chat about how your skills can be an asset for our team. No stress, just good vibes and great questions!",
      duration: [30, 60],
      location: "Google Meet",
      timezone: "Asia/Kolkata",
      requiresConfirmation: true
    },
    {
      id: "product-demo",
      title: "Product Demo",
      description: "Witness innovation in action! Reserve a time for a personalized demo of our next-gen scheduler (THIS SITE)",
      duration: [30, 45],
      location: "Google Meet",
      timezone: "Asia/Kolkata",
      requiresConfirmation: false
    },
    {
      id: "everything-else",
      title: "Everything Else",
      description: "Open Agenda! Let's brainstorm over coffee or talk about your favorite singer. Whatever it is, I'm all ears! 💌",
      duration: [15, 30, 60],
      location: "Google Meet",
      timezone: "Asia/Kolkata",
      requiresConfirmation: false
    },
    {
      id: "recurring-event",
      title: "Recurring Event",
      description: "Testing out the recurring feature",
      duration: [15],
      location: "Google Meet",
      timezone: "Asia/Kolkata",
      recurring: "Repeats up to 12 times",
      requiresConfirmation: false
    }
  ]
};

// Mock available time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

type ViewType = 'monthly' | 'weekly' | 'column';

export default function PublicBooking() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [selectedEventType, setSelectedEventType] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const timeSlots = generateTimeSlots();

  // Generate calendar days for monthly view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd)
  });

  // Generate week days for weekly view
  const weekStart = startOfWeek(currentDate);
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart)
  });

  const handleEventTypeSelect = (eventType: any) => {
    setSelectedEventType(eventType);
    setSelectedDuration(eventType.duration[0]);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (formData: any) => {
    setBookingData({
      ...formData,
      eventType: selectedEventType,
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration
    });
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  // Profile view
  if (!selectedEventType) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <Avatar className="w-24 h-24 mx-auto mb-6">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mb-4">{mockUser.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{mockUser.bio}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockUser.eventTypes.map((eventType) => (
              <Card 
                key={eventType.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/20"
                onClick={() => handleEventTypeSelect(eventType)}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{eventType.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{eventType.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {eventType.duration.map((duration) => (
                      <Badge key={duration} variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {duration}m
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Video className="h-4 w-4" />
                    {eventType.location}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    {eventType.timezone}
                  </div>

                  {eventType.requiresConfirmation && (
                    <Badge variant="outline" className="w-fit">
                      Requires confirmation
                    </Badge>
                  )}

                  {eventType.recurring && (
                    <Badge variant="outline" className="w-fit">
                      {eventType.recurring}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Booking form view
  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side - Event details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{mockUser.name}</h2>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-2">{selectedEventType.title}</h1>
                <p className="text-muted-foreground mb-4">{selectedEventType.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <div className="font-medium">
                      {selectedDate && format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedTime} - {selectedTime && 
                        format(new Date(`2000-01-01 ${selectedTime}`).getTime() + selectedDuration * 60000, 'HH:mm')
                      } ({selectedDuration}m)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4" />
                  {selectedDuration} minutes
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Video className="h-4 w-4" />
                  {selectedEventType.location}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4" />
                  {selectedEventType.timezone}
                </div>
              </div>
            </div>

            {/* Right side - Booking form */}
            <BookingForm 
              onSubmit={handleBookingSubmit} 
              onBack={() => setShowBookingForm(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Confirmation view
  if (showConfirmation) {
    return <BookingConfirmation bookingData={bookingData} />;
  }

  // Calendar view
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Left sidebar - Event details */}
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedEventType(null)}
              className="mb-4 p-0 h-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{mockUser.name}</h2>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">{selectedEventType.title}</h1>
              <p className="text-muted-foreground mb-4">{selectedEventType.description}</p>
            </div>

            {/* Duration selector */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selectedEventType.duration.map((duration: number) => (
                  <Button
                    key={duration}
                    variant={selectedDuration === duration ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDuration(duration)}
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {duration}m
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Video className="h-4 w-4" />
                {selectedEventType.location}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4" />
                {selectedEventType.timezone}
              </div>
            </div>
          </div>

          {/* Right side - Calendar */}
          <div className="space-y-6">
            {/* Calendar header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewType === 'monthly') {
                      setCurrentDate(subMonths(currentDate, 1));
                    } else {
                      setCurrentDate(addDays(currentDate, -7));
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <h3 className="text-lg font-semibold">
                  {viewType === 'monthly' 
                    ? format(currentDate, 'MMMM yyyy')
                    : `${format(weekStart, 'MMM dd')} - ${format(endOfWeek(weekStart), 'MMM dd, yyyy')}`
                  }
                </h3>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewType === 'monthly') {
                      setCurrentDate(addMonths(currentDate, 1));
                    } else {
                      setCurrentDate(addDays(currentDate, 7));
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* View switcher */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewType === 'monthly' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType('monthly')}
                  className="text-xs h-8"
                >
                  Monthly
                </Button>
                <Button
                  variant={viewType === 'weekly' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType('weekly')}
                  className="text-xs h-8"
                >
                  Weekly
                </Button>
                <Button
                  variant={viewType === 'column' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewType('column')}
                  className="text-xs h-8"
                >
                  Column
                </Button>
              </div>
            </div>

            {/* Calendar content */}
            {viewType === 'monthly' && (
              <MonthlyView 
                currentDate={currentDate}
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                onDateSelect={(date) => setSelectedDate(date)}
                onTimeSelect={(date, time) => handleDateTimeSelect(date, time)}
              />
            )}

            {viewType === 'weekly' && (
              <WeeklyView 
                weekDays={weekDays}
                selectedDate={selectedDate}
                onTimeSelect={(date, time) => handleDateTimeSelect(date, time)}
              />
            )}

            {viewType === 'column' && (
              <ColumnView 
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateSelect={(date) => setSelectedDate(date)}
                onTimeSelect={(date, time) => handleDateTimeSelect(date, time)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Monthly Calendar View Component
function MonthlyView({ currentDate, calendarDays, selectedDate, onDateSelect, onTimeSelect }: any) {
  const [selectedDateForTimes, setSelectedDateForTimes] = useState<Date | null>(null);
  const timeSlots = generateTimeSlots();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      {/* Calendar grid */}
      <div className="space-y-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => {
                onDateSelect(day);
                setSelectedDateForTimes(day);
              }}
              className={`
                h-12 flex items-center justify-center text-sm rounded-lg transition-colors
                ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}
                ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground font-semibold' : ''}
                ${selectedDate && isSameDay(day, selectedDate) ? 'bg-accent' : 'hover:bg-muted'}
              `}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots for selected date */}
      {selectedDateForTimes && (
        <div className="space-y-4">
          <h4 className="font-medium">
            {format(selectedDateForTimes, 'EEE dd, MMM')}
          </h4>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="outline"
                size="sm"
                onClick={() => onTimeSelect(selectedDateForTimes, time)}
                className="justify-start"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Weekly Calendar View Component
function WeeklyView({ weekDays, selectedDate, onTimeSelect }: any) {
  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-4">
      {/* Week header */}
      <div className="grid grid-cols-8 gap-4">
        <div></div> {/* Empty corner */}
        {weekDays.map((day: Date) => (
          <div key={day.toISOString()} className="text-center">
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className={`text-lg ${isSameDay(day, new Date()) ? 'font-bold text-primary' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-8 gap-4 max-h-96 overflow-y-auto">
        {timeSlots.slice(0, 20).map((time) => (
          <React.Fragment key={time}>
            <div className="text-sm text-muted-foreground text-right py-2">
              {time}
            </div>
            {weekDays.map((day: Date) => (
              <Button
                key={`${day.toISOString()}-${time}`}
                variant="outline"
                size="sm"
                onClick={() => onTimeSelect(day, time)}
                className="h-8 text-xs"
              >
                {time}
              </Button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Column View Component
function ColumnView({ currentDate, selectedDate, onDateSelect, onTimeSelect }: any) {
  const timeSlots = generateTimeSlots();
  const next6Days = Array.from({ length: 6 }, (_, i) => addDays(currentDate, i));

  return (
    <div className="grid grid-cols-6 gap-4">
      {next6Days.map((day) => (
        <div key={day.toISOString()} className="space-y-2">
          <div className="text-center">
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className={`text-sm ${isSameDay(day, new Date()) ? 'font-bold text-primary' : ''}`}>
              {format(day, 'MMM dd')}
            </div>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="outline"
                size="sm"
                onClick={() => onTimeSelect(day, time)}
                className="w-full text-xs h-8"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Booking Form Component
function BookingForm({ onSubmit, onBack }: any) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    guests: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Phone Number</label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 border border-r-0 border-border rounded-l-md bg-muted">
                <span className="text-sm">🇮🇳 +91</span>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="flex-1 px-3 py-2 border border-border rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Additional notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Please share anything that will help prepare for our meeting."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <Button variant="outline" type="button" className="w-full mb-4">
              Add guests
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            By proceeding, you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Confirm
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Booking Confirmation Component
function BookingConfirmation({ bookingData }: any) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">This meeting is scheduled</h1>
            <p className="text-muted-foreground">
              We sent an email with a calendar invitation with the details to everyone.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-left">
            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="text-sm font-medium text-muted-foreground">What</div>
              <div className="text-sm">
                {bookingData.eventType.title} between {mockUser.name} and {bookingData.name}
              </div>
            </div>

            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="text-sm font-medium text-muted-foreground">When</div>
              <div className="text-sm">
                {format(bookingData.date, 'EEEE, MMMM dd, yyyy')}<br />
                {bookingData.time} - {format(new Date(`2000-01-01 ${bookingData.time}`).getTime() + bookingData.duration * 60000, 'HH:mm')} (India Standard Time)
              </div>
            </div>

            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="text-sm font-medium text-muted-foreground">Who</div>
              <div className="text-sm">
                <div>{mockUser.name} <Badge className="ml-2">Host</Badge></div>
                <div className="text-muted-foreground">sanskarix@gmail.com</div>
                <div className="mt-2">{bookingData.name}</div>
                <div className="text-muted-foreground">{bookingData.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-[80px_1fr] gap-4">
              <div className="text-sm font-medium text-muted-foreground">Where</div>
              <div className="text-sm">
                {bookingData.eventType.location} <span className="text-muted-foreground">↗</span>
              </div>
            </div>

            {bookingData.notes && (
              <div className="grid grid-cols-[80px_1fr] gap-4">
                <div className="text-sm font-medium text-muted-foreground">Additional notes</div>
                <div className="text-sm">{bookingData.notes}</div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Need to make a change? <span className="underline cursor-pointer">Reschedule</span> or <span className="underline cursor-pointer">Cancel</span>
            </div>

            <div className="text-sm font-medium">Add to calendar</div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">G</Button>
              <Button variant="outline" size="sm">📅</Button>
              <Button variant="outline" size="sm">📱</Button>
              <Button variant="outline" size="sm">🗓️</Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="text-sm text-primary mb-2">Create your own booking link with OneHash Cal ↗</div>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="sanskarix@gmail.com"
                className="flex-1 px-3 py-2 border border-border rounded-l-md text-sm"
              />
              <Button className="rounded-l-none">Try it for free</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}