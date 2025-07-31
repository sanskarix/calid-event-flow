
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  timezone: string;
  schedule: {
    [key: string]: { start: string; end: string; occupied: { start: string; end: string }[] }[];
  };
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'sanskar',
    initials: 'S',
    timezone: 'Asia/Calcutta',
    schedule: {
      'July 23, 2025': [
        { 
          start: '09:00', 
          end: '17:00', 
          occupied: [
            { start: '10:00', end: '11:00' },
            { start: '14:00', end: '15:30' }
          ]
        }
      ]
    }
  },
  {
    id: '2',
    name: 'No username',
    initials: 'N',
    timezone: 'Europe/London',
    schedule: {
      'July 23, 2025': [
        { 
          start: '08:00', 
          end: '16:00', 
          occupied: [
            { start: '09:00', end: '10:00' },
            { start: '13:00', end: '14:00' }
          ]
        }
      ]
    }
  }
];

export const TeamAvailability = () => {
  const [selectedDate, setSelectedDate] = useState('July 23, 2025');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const [timezone, setTimezone] = useState('Asia/Calcutta');

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}00`;
  });

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleMemberSelect = (memberId: string) => {
    setSelectedMember(selectedMember === memberId ? null : memberId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{selectedDate}</span>
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Calcutta">Asia/Calcutta</SelectItem>
              <SelectItem value="Europe/London">Europe/London</SelectItem>
              <SelectItem value="America/New_York">America/New_York</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">Book Members</Button>
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-4">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 pb-2 border-b">
          <div className="col-span-3">
            <span className="text-sm font-medium text-muted-foreground">Member</span>
          </div>
          <div className="col-span-1">
            <span className="text-sm font-medium text-muted-foreground">More</span>
          </div>
          <div className="col-span-1">
            <span className="text-sm font-medium text-muted-foreground">Timezone</span>
          </div>
          <div className="col-span-7">
            {/* Time Headers */}
            <div className="grid grid-cols-24 gap-px">
              {hours.map((hour, index) => (
                <div key={hour} className="text-xs text-muted-foreground text-center">
                  {index % 4 === 0 ? hour.slice(0, 2) : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={`grid grid-cols-12 gap-4 p-2 rounded-lg transition-colors ${
              selectedMember === member.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-muted/50'
            }`}
            onClick={() => handleMemberSelect(member.id)}
          >
            <div className="col-span-3 flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-xs bg-blue-600 text-white">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{member.name}</span>
            </div>
            
            <div className="col-span-1 flex items-center">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Calendar className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="col-span-1 flex items-center">
              <span className="text-xs text-muted-foreground">
                {member.timezone === 'Asia/Calcutta' ? 'GMT +05:30' : 'GMT +01:00'}
              </span>
            </div>
            
            <div className="col-span-7 relative">
              {/* Timeline Background */}
              <div className="h-8 bg-gray-100 rounded relative overflow-hidden">
                {/* Available Time Slots */}
                {member.schedule[selectedDate]?.map((slot, index) => (
                  <div key={index}>
                    {/* Available Time */}
                    <div
                      className="absolute top-0 h-full bg-green-200 rounded"
                      style={{
                        left: `${getTimePosition(slot.start)}%`,
                        width: `${getTimePosition(slot.end) - getTimePosition(slot.start)}%`
                      }}
                    />
                    
                    {/* Occupied Time */}
                    {slot.occupied.map((occupied, occupiedIndex) => (
                      <div
                        key={occupiedIndex}
                        className="absolute top-0 h-full bg-gray-400 rounded"
                        style={{
                          left: `${getTimePosition(occupied.start)}%`,
                          width: `${getTimePosition(occupied.end) - getTimePosition(occupied.start)}%`
                        }}
                      />
                    ))}
                  </div>
                ))}
                
                {/* Hover Indicator */}
                {hoverTime && (
                  <div
                    className="absolute top-0 w-px h-full bg-blue-500 pointer-events-none"
                    style={{ left: `${getTimePosition(hoverTime)}%` }}
                  />
                )}
              </div>
              
              {/* Invisible overlay for hover detection */}
              <div
                className="absolute inset-0 cursor-pointer"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = (x / rect.width) * 100;
                  const totalMinutes = (percentage / 100) * 24 * 60;
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = Math.floor(totalMinutes % 60);
                  setHoverTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                }}
                onMouseLeave={() => setHoverTime(null)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Time Tooltip */}
      {hoverTime && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-sm pointer-events-none z-50">
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
};
