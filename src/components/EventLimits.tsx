import React, { useState } from 'react';
import { Switch } from './ui/switch';
import { CustomSelect } from './ui/custom-select';
import { Calendar, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
export const EventLimits = () => {
  const [settings, setSettings] = useState({
    // New Before Event Settings
    beforeEventBufferTime: 'no-buffer',
    beforeMinimumNoticeValue: '2',
    beforeMinimumNoticeUnit: 'hours',
    // New After Event Settings  
    afterEventBufferTime: 'no-buffer',
    timeSlotIntervals: 'default',
    // Toggle states for revealing sub-options
    limitBookingFrequency: false,
    showFirstSlotOnly: false,
    limitTotalDuration: false,
    limitFutureBookings: false,
    offsetStartTimes: false,
    // Existing settings
    minimumNotice: false,
    minimumNoticeValue: '120',
    minimumNoticeUnit: 'minutes',
    futureBookingType: 'business_days',
    futureBookingValue: '60',
    futureBookingUnit: 'business_days',
    alwaysAvailable: false,
    dateRangeStart: '',
    dateRangeEnd: '',
    bufferTimeBefore: false,
    bufferTimeBeforeValue: '0',
    bufferTimeAfter: false,
    bufferTimeAfterValue: '0',
    dailyBookingLimit: false,
    dailyBookingLimitValue: '1'
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleToggle = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  const handleValueChange = (setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  const bufferTimeOptions = [{
    value: 'no-buffer',
    label: 'No buffer time'
  }, {
    value: '15',
    label: '15 mins'
  }, {
    value: '20',
    label: '20 mins'
  }];
  const minimumNoticeUnitOptions = [{
    value: 'hours',
    label: 'Hours'
  }, {
    value: 'days',
    label: 'Days'
  }];
  const timeSlotOptions = [{
    value: 'default',
    label: 'Use event length (default)'
  }, {
    value: '15',
    label: '15 mins'
  }, {
    value: '30',
    label: '30 mins'
  }];
  const timeUnitOptions = [{
    value: 'minutes',
    label: 'Minutes'
  }, {
    value: 'hours',
    label: 'Hours'
  }, {
    value: 'days',
    label: 'Days'
  }];
  const businessDayOptions = [{
    value: 'business_days',
    label: 'Business days'
  }, {
    value: 'calendar_days',
    label: 'Calendar days'
  }];
  const [bookingLimits, setBookingLimits] = useState([{ value: 1, unit: 'per-day' }]);
  const allFrequencyOptions = [
    { value: 'per-day', label: 'Per day' },
    { value: 'per-week', label: 'Per week' },
    { value: 'per-month', label: 'Per month' },
    { value: 'per-year', label: 'Per year' }
  ];

  const getAvailableOptions = (currentIndex: number) => {
    const usedUnits = bookingLimits
      .map((limit, index) => index !== currentIndex ? limit.unit : null)
      .filter(Boolean);
    
    return allFrequencyOptions.filter(option => !usedUnits.includes(option.value));
  };

  const addLimit = () => {
    if (bookingLimits.length < 4) {
      const usedUnits = bookingLimits.map(limit => limit.unit);
      const availableOption = allFrequencyOptions.find(option => !usedUnits.includes(option.value));
      
      if (availableOption) {
        const newLimit = { value: 1, unit: availableOption.value };
        const updatedLimits = [...bookingLimits, newLimit];
        
        // Sort limits according to the order defined in allFrequencyOptions
        const sortedLimits = updatedLimits.sort((a, b) => {
          const indexA = allFrequencyOptions.findIndex(option => option.value === a.unit);
          const indexB = allFrequencyOptions.findIndex(option => option.value === b.unit);
          return indexA - indexB;
        });
        
        setBookingLimits(sortedLimits);
      }
    }
  };

  const updateLimit = (index: number, field: string, newValue: string | number) => {
    const updated = [...bookingLimits];
    updated[index][field] = newValue;
    setBookingLimits(updated);
  };

  const deleteLimit = (index: number) => {
    if (bookingLimits.length > 1) {
      const updated = bookingLimits.filter((_, i) => i !== index);
      setBookingLimits(updated);
    }
  };
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const baseTime = dayjs().hour(9).minute(0); // 9:00 AM base time
  const offsetTime = baseTime.add(offsetMinutes, 'minute');

  return <div className="p-0 max-w-none mx-auto space-y-6">
      {/* Before/After Event Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before event section */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-medium text-gray-700 mb-2 text-sm">
            Before event
          </h3>
          
          <div className="space-y-6">
            <div>
              <CustomSelect value={settings.beforeEventBufferTime} onValueChange={value => handleValueChange('beforeEventBufferTime', value)} options={bufferTimeOptions} className="w-full" />
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 text-sm mb-3">Minimum Notice</label>
              <div className="flex items-center space-x-3">
                <input type="number" value={settings.beforeMinimumNoticeValue} onChange={e => handleValueChange('beforeMinimumNoticeValue', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white" style={{
                fontSize: '14px'
              }} />
                <CustomSelect value={settings.beforeMinimumNoticeUnit} onValueChange={value => handleValueChange('beforeMinimumNoticeUnit', value)} options={minimumNoticeUnitOptions} className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* After event section */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-medium text-gray-700 mb-2 text-sm">
            After event
          </h3>
          
          <div className="space-y-6">
            <div>
              <CustomSelect value={settings.afterEventBufferTime} onValueChange={value => handleValueChange('afterEventBufferTime', value)} options={bufferTimeOptions} className="w-full" />
            </div>
            
            <div>
              <label className="block font-medium text-gray-700 text-sm mb-3">Time-slot intervals</label>
              <CustomSelect value={settings.timeSlotIntervals} onValueChange={value => handleValueChange('timeSlotIntervals', value)} options={timeSlotOptions} className="w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Limit booking frequency */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-8">
            <h3 className="font-medium text-gray-700 text-sm mb-2">
              Limit booking frequency
            </h3>
            <p className="text-sm text-gray-600">
              Limit how many times this event can be booked
            </p>
          </div>
          <Switch checked={settings.limitBookingFrequency} onCheckedChange={value => handleToggle('limitBookingFrequency', value)} />
        </div>
        
      {settings.limitBookingFrequency && (
        <div className="border-t border-gray-100 pt-4 space-y-4">
          {bookingLimits.map((limit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                value={limit.value}
                onChange={e => updateLimit(index, 'value', e.target.value)}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                style={{ fontSize: '14px' }}
              />
              <CustomSelect
                value={limit.unit}
                onValueChange={value => updateLimit(index, 'unit', value)}
                options={getAvailableOptions(index)}
                className="w-32"
              />
              {bookingLimits.length > 1 && (
                <button 
                  className="flex items-center px-2 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  onClick={() => deleteLimit(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addLimit}
            hidden={bookingLimits.length >= 4}
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            + Add Limit
          </button>
        </div>
      )}
      </div>

      {/* Only show the first slot of each day as available */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-8">
            <h3 className="font-medium text-gray-700 text-sm mb-2">
              Only show the first slot of each day as available
            </h3>
            <p className="text-sm text-gray-600">
              This will limit your availability for this event type to one slot per day, scheduled at the earliest available time.
            </p>
          </div>
          <Switch checked={settings.showFirstSlotOnly} onCheckedChange={value => handleToggle('showFirstSlotOnly', value)} />
        </div>
      </div>

      {/* Limit total booking duration */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-8">
            <h3 className="font-medium text-gray-700 text-sm mb-2">
              Limit total booking duration
            </h3>
            <p className="text-sm text-gray-600">
              Limit total amount of time that this event can be booked
            </p>
          </div>
          <Switch checked={settings.limitTotalDuration} onCheckedChange={value => handleToggle('limitTotalDuration', value)} />
        </div>
        
        {settings.limitTotalDuration && <div className="border-t border-gray-100 pt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <input type="number" min="1" value="60" className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" style={{
            fontSize: '14px'
          }} />
              <span className="text-sm text-gray-600">Minutes</span>
              <CustomSelect value="per-day" onValueChange={() => {}} options={[{
            value: 'per-day',
            label: 'Per day'
          }, {
            value: 'per-week',
            label: 'Per week'
          }, {
            value: 'per-month',
            label: 'Per month'
          }]} className="w-32" />
            </div>
            
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              + Add Limit
            </button>
          </div>}
      </div>

      {/* Limit future bookings */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-8">
            <h3 className="font-medium text-gray-700 text-sm mb-2">
              Limit future bookings
            </h3>
            <p className="text-sm text-gray-600">
              Limit how far in the future this event can be booked
            </p>
          </div>
          <Switch checked={settings.limitFutureBookings} onCheckedChange={value => handleToggle('limitFutureBookings', value)} />
        </div>
        
        {settings.limitFutureBookings && <div className="border-t border-gray-100 pt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <input type="radio" id="business_days_option" name="futureBookingType" value="business_days" checked={settings.futureBookingType === 'business_days'} onChange={e => handleValueChange('futureBookingType', e.target.value)} />
              <div className="flex items-center space-x-2">
                <input type="number" value={settings.futureBookingValue} onChange={e => handleValueChange('futureBookingValue', e.target.value)} className="w-16 px-2 py-2 border border-border rounded-lg text-sm bg-white" />
                <CustomSelect value={settings.futureBookingUnit} onValueChange={value => handleValueChange('futureBookingUnit', value)} options={businessDayOptions} className="w-40" />
                <span className="text-sm text-gray-600">into the future</span>
              </div>
            </div>
            
            <div className="ml-6">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="always-available-option" checked={settings.alwaysAvailable} onChange={e => handleToggle('alwaysAvailable', e.target.checked)} />
                <label htmlFor="always-available-option" className="text-sm text-gray-600">
                  Always {settings.futureBookingValue} days available
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="radio" id="date_range_option" name="futureBookingType" value="date_range" checked={settings.futureBookingType === 'date_range'} onChange={e => handleValueChange('futureBookingType', e.target.value)} />
              <label htmlFor="date_range_option" className="text-sm text-gray-600">Within a date range</label>
            </div>
            
            {settings.futureBookingType === 'date_range' && <div className="ml-6 flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRange?.from ? dateRange.to ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}` : dateRange.from.toLocaleDateString() : "Pick a date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <CalendarComponent mode="range" selected={dateRange} onSelect={setDateRange} className="rounded-md border border-border mb-2 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              </div>}
          </div>}
      </div>

      {/* Offset start times */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-8">
            <h3 className="font-medium text-gray-700 text-sm mb-2">
              Offset start times
            </h3>
            <p className="text-sm text-gray-600">
              Offset timestamps shown to bookers by a specified number of minutes
            </p>
          </div>
          <Switch checked={settings.offsetStartTimes} onCheckedChange={value => handleToggle('offsetStartTimes', value)} />
        </div>
        
        {settings.offsetStartTimes && (
          <div className="border-t border-gray-100 pt-4 space-y-3 transition-all duration-300">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offset by</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={offsetMinutes}
                  onChange={(e) => setOffsetMinutes(parseInt(e.target.value || '0'))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
                <span className="text-sm text-gray-600">Minutes</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              e.g. this will show time slots to your bookers at{' '}
              {offsetTime.format('h:mm A')} instead of {baseTime.format('h:mm A')}
            </p>
          </div>
        )}
      </div>
    </div>;
};