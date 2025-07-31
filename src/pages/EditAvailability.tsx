import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, ChevronDown, Copy, Trash2, Edit3, Info } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { TimeSelector } from '../components/TimeSelector';
import { DateOverrideModal } from '../components/DateOverrideModal';
import { CopyTimesModal } from '../components/CopyTimesModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { Card, CardContent } from '../components/ui/card';
import { useOutletContext } from 'react-router-dom';
import type { HeaderMeta } from '../components/Layout';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isNew?: boolean;
}
interface DaySchedule {
  day: string;
  enabled: boolean;
  timeSlots: TimeSlot[];
}
interface DateOverride {
  id: string;
  date: Date;
  dayName: string;
  dateString: string;
  timeString: string;
  isUnavailable: boolean;
}
export const EditAvailability = () => {
  const navigate = useNavigate();
  const {
    scheduleId
  } = useParams();
  const location = useLocation();
  const [isSetToDefault, setIsSetToDefault] = useState(true);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copySourceDay, setCopySourceDay] = useState('');
  const [editingOverride, setEditingOverride] = useState<DateOverride | null>(null);
  const { setHeaderMeta } = useOutletContext<{ setHeaderMeta: (meta: HeaderMeta) => void }>();
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([{
    id: '1',
    date: new Date(2025, 6, 15),
    dayName: 'Tuesday',
    dateString: 'July 15',
    timeString: '9:00 AM - 5:00 PM',
    isUnavailable: false
  }, {
    id: '2',
    date: new Date(2025, 6, 16),
    dayName: 'Wednesday',
    dateString: 'July 16',
    timeString: 'Unavailable',
    isUnavailable: true
  }]);
  const [weekDays, setWeekDays] = useState<DaySchedule[]>([{
    day: 'Monday',
    enabled: true,
    timeSlots: [{
      id: '1',
      startTime: '09:00',
      endTime: '17:00'
    }]
  }, {
    day: 'Tuesday',
    enabled: true,
    timeSlots: [{
      id: '2',
      startTime: '09:00',
      endTime: '17:00'
    }]
  }, {
    day: 'Wednesday',
    enabled: true,
    timeSlots: [{
      id: '3',
      startTime: '09:00',
      endTime: '17:00'
    }]
  }, {
    day: 'Thursday',
    enabled: true,
    timeSlots: [{
      id: '4',
      startTime: '09:00',
      endTime: '17:00'
    }]
  }, {
    day: 'Friday',
    enabled: true,
    timeSlots: [{
      id: '5',
      startTime: '09:00',
      endTime: '17:00'
    }]
  }, {
    day: 'Saturday',
    enabled: false,
    timeSlots: []
  }, {
    day: 'Sunday',
    enabled: false,
    timeSlots: []
  }]);
  const timezones = [{
    value: 'Asia/Kolkata',
    label: 'Asia/Kolkata (GMT+05:30)'
  }, {
    value: 'America/New_York',
    label: 'America/New_York (GMT-05:00)'
  }, {
    value: 'Europe/London',
    label: 'Europe/London (GMT+00:00)'
  }, {
    value: 'Asia/Tokyo',
    label: 'Asia/Tokyo (GMT+09:00)'
  }, {
    value: 'America/Los_Angeles',
    label: 'America/Los_Angeles (GMT-08:00)'
  }, {
    value: 'Australia/Sydney',
    label: 'Australia/Sydney (GMT+11:00)'
  }, {
    value: 'Europe/Paris',
    label: 'Europe/Paris (GMT+01:00)'
  }, {
    value: 'Asia/Shanghai',
    label: 'Asia/Shanghai (GMT+08:00)'
  }, {
    value: 'America/Chicago',
    label: 'America/Chicago (GMT-06:00)'
  }, {
    value: 'Europe/Berlin',
    label: 'Europe/Berlin (GMT+01:00)'
  }, {
    value: 'Asia/Dubai',
    label: 'Asia/Dubai (GMT+04:00)'
  }, {
    value: 'America/Toronto',
    label: 'America/Toronto (GMT-05:00)'
  }, {
    value: 'Pacific/Auckland',
    label: 'Pacific/Auckland (GMT+13:00)'
  }, {
    value: 'Asia/Singapore',
    label: 'Asia/Singapore (GMT+08:00)'
  }, {
    value: 'Europe/Amsterdam',
    label: 'Europe/Amsterdam (GMT+01:00)'
  }];
  useEffect(() => {
    let title = 'New Schedule';

    if (location.state?.newScheduleName) {
      title = location.state.newScheduleName;
    } else if (scheduleId === 'working-hours') {
      title = 'Working Hours';
    } else if (scheduleId === 'additional-hours') {
      title = 'Additional hours';
    }

    setScheduleTitle(title);

    setHeaderMeta({
      title,
      description: 'Mon - Fri, 9:00 AM - 5:00 PM',
      enabled: isSetToDefault,
      onEnabledChange: setIsSetToDefault,
      onTitleChange: (newTitle: string) => setScheduleTitle(newTitle)
    });
  }, [scheduleId, location.state, setHeaderMeta, isSetToDefault]);

  const handleDayToggle = (dayIndex: number) => {
    const updated = [...weekDays];
    updated[dayIndex].enabled = !updated[dayIndex].enabled;
    if (updated[dayIndex].enabled && updated[dayIndex].timeSlots.length === 0) {
      updated[dayIndex].timeSlots = [{
        id: Date.now().toString(),
        startTime: '09:00',
        endTime: '17:00'
      }];
    }
    setWeekDays(updated);
  };
  const handleAddTimeSlot = (dayIndex: number) => {
    const updated = [...weekDays];
    const newSlot = {
      id: Date.now().toString(),
      startTime: '18:00',
      endTime: '19:00',
      isNew: true
    };
    updated[dayIndex].timeSlots.push(newSlot);
    setWeekDays(updated);
  };
  const handleRemoveTimeSlot = (dayIndex: number, slotId: string) => {
    const updated = [...weekDays];
    updated[dayIndex].timeSlots = updated[dayIndex].timeSlots.filter(slot => slot.id !== slotId);
    setWeekDays(updated);
  };
  const handleTimeSlotChange = (dayIndex: number, slotId: string, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...weekDays];
    const slotIndex = updated[dayIndex].timeSlots.findIndex(slot => slot.id === slotId);
    if (slotIndex !== -1) {
      updated[dayIndex].timeSlots[slotIndex][field] = value;
      setWeekDays(updated);
    }
  };
  const handleCopyTimes = (day: string) => {
    setCopySourceDay(day);
    setIsCopyModalOpen(true);
  };
  const handleCopyTimesToDays = (selectedDays: string[]) => {
    const sourceDay = weekDays.find(d => d.day === copySourceDay);
    if (!sourceDay) return;
    const updated = [...weekDays];
    selectedDays.forEach(targetDay => {
      const targetIndex = updated.findIndex(d => d.day === targetDay);
      if (targetIndex !== -1) {
        updated[targetIndex].timeSlots = sourceDay.timeSlots.map(slot => ({
          ...slot,
          id: Date.now().toString() + Math.random(),
          isNew: false
        }));
        updated[targetIndex].enabled = true;
      }
    });
    setWeekDays(updated);
  };
  const handleSaveTitle = () => {
    setIsEditingTitle(false);
  };
  const handleDeleteOverride = (overrideId: string) => {
    setDateOverrides(prev => prev.filter(override => override.id !== overrideId));
  };
  const handleEditOverride = (override: DateOverride) => {
    setEditingOverride(override);
    setIsOverrideModalOpen(true);
  };
  const handleSaveOverride = (override: any) => {
    if (editingOverride) {
      // Update existing override
      setDateOverrides(prev => prev.map(existing => existing.id === editingOverride.id ? {
        ...existing,
        date: override.date,
        dayName: override.date.toLocaleDateString('en-US', {
          weekday: 'long'
        }),
        dateString: override.date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric'
        }),
        timeString: override.isUnavailable ? 'Unavailable' : override.timeSlots.map((slot: any) => `${slot.startTime} - ${slot.endTime}`).join(', '),
        isUnavailable: override.isUnavailable
      } : existing));
      setEditingOverride(null);
    } else {
      // Add new override
      const newOverride: DateOverride = {
        id: Date.now().toString(),
        date: override.date,
        dayName: override.date.toLocaleDateString('en-US', {
          weekday: 'long'
        }),
        dateString: override.date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric'
        }),
        timeString: override.isUnavailable ? 'Unavailable' : override.timeSlots.map((slot: any) => `${slot.startTime} - ${slot.endTime}`).join(', '),
        isUnavailable: override.isUnavailable
      };
      setDateOverrides(prev => [...prev, newOverride]);
    }
  };
  const handleCloseOverrideModal = () => {
    setIsOverrideModalOpen(false);
    setEditingOverride(null);
  };
  return <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="px-8 pt-6 pb-6">
        <div className="max-w-full mx-auto space-y-8">
          {/* Schedule Selector and Timezone - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Schedule Selector - Left Side (2/3 width) */}
            <div className="lg:col-span-2 border border-border rounded-lg p-6 space-y-6">
              
              {weekDays.map((daySchedule, dayIndex) => <div key={dayIndex} className="flex items-start space-x-6">
                  <div className="flex items-center space-x-4 min-w-[140px] flex-shrink-0">
                    <Switch checked={daySchedule.enabled} onCheckedChange={() => handleDayToggle(dayIndex)} />
                    <div className="text-sm font-medium min-w-[80px] my-[9px]">
                      {daySchedule.day}
                    </div>
                  </div>
                  
                  {!daySchedule.enabled ? <div className="text-sm text-muted-foreground pt-2">Unavailable</div> : <div className="flex-1 space-y-3">
                      {daySchedule.timeSlots.map((timeSlot, slotIndex) => <div key={timeSlot.id} className="flex items-center space-x-3">
                          <div className="w-32">
                            <TimeSelector value={timeSlot.startTime} onChange={time => handleTimeSlotChange(dayIndex, timeSlot.id, 'startTime', time)} />
                          </div>
                          <span className="text-muted-foreground">-</span>
                          <div className="w-32">
                            <TimeSelector value={timeSlot.endTime} onChange={time => handleTimeSlotChange(dayIndex, timeSlot.id, 'endTime', time)} />
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleAddTimeSlot(dayIndex)} className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleCopyTimes(daySchedule.day)} className="h-8 w-8">
                            <Copy className="h-4 w-4" />
                          </Button>
                          {timeSlot.isNew && <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTimeSlot(dayIndex, timeSlot.id)} className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>}
                        </div>)}
                    </div>}
                </div>)}
            </div>

            {/* Timezone Section - Right Side (1/3 width) */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-medium min-w-[80px] text-lg ">Timezone</h3>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Overrides Section - Full Width */}
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium min-w-[80px] -bottom-1 ">Date overrides</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded-full transition-colors">
                    <Info className="h-4 w-4 text-muted-foreground mx-0 my-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <p className="text-sm text-muted-foreground">
                    <strong>Date overrides are archived automatically after the date has passed</strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground mx-0 py-0 ">
              Add dates when your availability changes from your daily hours.
            </p>

            {/* Date Override Cards */}
            {dateOverrides.length > 0 && <div className="space-y-4">
                {dateOverrides.map(override => <Card key={override.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            {override.dayName}, {override.dateString}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {override.timeString}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditOverride(override)} className="h-8 w-8">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteOverride(override.id)} className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>}

            <Button variant="outline" onClick={() => setIsOverrideModalOpen(true)} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add an override
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DateOverrideModal isOpen={isOverrideModalOpen} onClose={handleCloseOverrideModal} onSave={handleSaveOverride} editingOverride={editingOverride} />

      <CopyTimesModal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} onCopy={handleCopyTimesToDays} sourceDay={copySourceDay} />
    </div>;
};